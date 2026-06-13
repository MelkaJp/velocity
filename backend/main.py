from fastapi import FastAPI, HTTPException, Depends, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import uuid
import json
import os
import math
import hashlib

app = FastAPI(title="VeloCity API", version="3.0.0", description="Complete Fuel Access Ecosystem with Authentication")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "database_v3.json"
SECRET_KEY = "VELOCITY_SECRET_KEY_2026"

def hash_password(password: str) -> str:
    return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()

def load_db():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {
        "users": {},
        "vehicles": {},
        "transactions": {},
        "stations": {},
        "wallets": {},
        "bookings": {},
        "deliveries": {},
        "subscriptions": {},
        "audit_logs": [],
        "reports": {}
    }

def save_db(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

db = load_db()

if not db.get("users"):
    db["users"] = {
        "admin_dev": {
            "id": "admin_dev",
            "username": "developer",
            "email": "developer@velocity.com",
            "password": hash_password("dev123"),
            "role": "developer_admin",
            "name": "System Developer",
            "status": "active",
            "created_at": datetime.now().isoformat()
        },
        "admin_muni": {
            "id": "admin_muni",
            "username": "municipality",
            "email": "municipality@velocity.com",
            "password": hash_password("muni123"),
            "role": "municipality_admin",
            "name": "Municipality Admin",
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
    }

if not db.get("stations"):
    stations = [
        {"id": "ST001", "name": "Central Station", "location": "Downtown", "inventory": 15000, "latitude": 40.7128, "longitude": -74.0060, "status": "active", "manager_id": None},
        {"id": "ST002", "name": "North Express", "location": "North District", "inventory": 12000, "latitude": 40.7589, "longitude": -73.9851, "status": "active", "manager_id": None},
        {"id": "ST003", "name": "East Point", "location": "East Industrial", "inventory": 18000, "latitude": 40.7484, "longitude": -73.9857, "status": "active", "manager_id": None},
        {"id": "ST004", "name": "South Gate", "location": "South Highway", "inventory": 10000, "latitude": 40.6892, "longitude": -74.0445, "status": "active", "manager_id": None},
        {"id": "ST005", "name": "West Terminal", "location": "West End", "inventory": 14000, "latitude": 40.7282, "longitude": -73.7949, "status": "active", "manager_id": None},
    ]
    for station in stations:
        db["stations"][station["id"]] = station
    save_db(db)

time_slots = [
    {"id": "TS1", "start": "06:00", "end": "08:00", "label": "Morning (6-8 AM)", "max_bookings": 50},
    {"id": "TS2", "start": "08:00", "end": "10:00", "label": "Peak (8-10 AM)", "max_bookings": 80},
    {"id": "TS3", "start": "10:00", "end": "12:00", "label": "Midday (10-12 PM)", "max_bookings": 60},
    {"id": "TS4", "start": "12:00", "end": "14:00", "label": "Afternoon (12-2 PM)", "max_bookings": 55},
    {"id": "TS5", "start": "14:00", "end": "16:00", "label": "Late Afternoon (2-4 PM)", "max_bookings": 70},
    {"id": "TS6", "start": "16:00", "end": "18:00", "label": "Evening (4-6 PM)", "max_bookings": 75},
    {"id": "TS7", "start": "18:00", "end": "20:00", "label": "Night (6-8 PM)", "max_bookings": 40},
]

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str
    name: str
    phone: Optional[str] = None

class Vehicle(BaseModel):
    type: str
    plate: str
    tank_capacity: int
    owner_user_id: Optional[str] = None

class Transaction(BaseModel):
    vehicle_id: str
    station_id: str
    liters: float
    worker_id: str

class Booking(BaseModel):
    vehicle_id: str
    station_id: str
    time_slot: str

class Delivery(BaseModel):
    station_id: str
    liters_delivered: float

class WalletTopup(BaseModel):
    vehicle_id: str
    amount: float

class Subscription(BaseModel):
    user_id: str
    plan: str
    vehicles_limit: int
    price_monthly: float

class FuelReport(BaseModel):
    station_id: str
    report_type: str

def generate_qr(vehicle_type: str, plate: str, vehicle_id: str = None) -> str:
    prefix = {"bajaj": "BAJ", "automobile": "AUT", "truck": "TRK"}.get(vehicle_type, "UNK")
    clean = "".join(c for c in plate.upper() if c.isalnum())
    unique_id = vehicle_id[:8] if vehicle_id else uuid.uuid4().hex[:8]
    return f"VELO-{prefix}-{clean}-{unique_id.upper()}"

def create_qr_data(vehicle: dict) -> str:
    qr_data = {
        "id": vehicle.get("id"),
        "plate": vehicle.get("plate"),
        "type": vehicle.get("type"),
        "owner_name": vehicle.get("owner_name"),
        "phone": vehicle.get("phone"),
        "qr_code": vehicle.get("qr_code"),
        "status": vehicle.get("status"),
        "createdAt": vehicle.get("created_at")
    }
    return json.dumps(qr_data)

def check_capacity(vehicle_type: str, liters: float) -> tuple:
    limits = {"bajaj": 50, "automobile": 150, "truck": 500}
    max_liters = limits.get(vehicle_type, 150)
    if liters > max_liters:
        return False, f"Capacity exceeded: max {max_liters}L"
    return True, None

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1-a))

def verify_geofence(station_lat, station_lng, gps_lat, gps_lng, threshold=30):
    if not gps_lat or not gps_lng:
        return True
    return calculate_distance(station_lat, station_lng, gps_lat, gps_lng) <= threshold

def calculate_revenue_split():
    total = sum(tx.get("amount", 0) for tx in db["transactions"].values() if tx.get("status") == "verified")
    return {
        "total_revenue": total,
        "municipality_70": round(total * 0.7, 2),
        "developer_30": round(total * 0.3, 2),
        "integrity_fee_2": round(total * 0.02, 2)
    }

def calculate_ghost_gap(station_id: str) -> dict:
    station = db["stations"].get(station_id)
    if not station:
        return {"ghost_gap": 0, "status": "unknown"}
    deliveries = sum(d.get("liters", 0) for d in db["deliveries"].values() if d.get("station_id") == station_id)
    scans = sum(t.get("liters", 0) for t in db["transactions"].values() if t.get("station_id") == station_id and t.get("status") == "verified")
    if deliveries == 0:
        return {"ghost_gap": 0, "deliveries": deliveries, "scans": scans, "status": "ok"}
    ghost_gap = ((deliveries - scans) / deliveries) * 100
    return {"ghost_gap": round(ghost_gap, 2), "deliveries": deliveries, "scans": scans, "status": "flagged" if ghost_gap > 2 else "ok"}

ROLES = {
    "developer_admin": {"level": 1, "name": "Developer Admin"},
    "municipality_admin": {"level": 2, "name": "Municipality Admin"},
    "station_manager": {"level": 3, "name": "Station Manager"},
    "station_worker": {"level": 4, "name": "Station Worker"},
    "fleet_owner": {"level": 5, "name": "Fleet Owner"},
    "driver": {"level": 6, "name": "Driver"}
}

@app.get("/")
def root():
    return {
        "service": "VeloCity API v3.0",
        "status": "running",
        "auth": "enabled",
        "roles": ROLES
    }

@app.post("/api/auth/login")
def login(credentials: LoginRequest):
    password_hash = hash_password(credentials.password)
    for user in db["users"].values():
        if user["username"] == credentials.username and user["password"] == password_hash:
            token = f"TOKEN_{uuid.uuid4().hex}"
            user["token"] = token
            user["last_login"] = datetime.now().isoformat()
            save_db(db)
            return {
                "success": True,
                "token": token,
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "name": user.get("name", ""),
                    "role": user["role"],
                    "email": user.get("email", ""),
                    "phone": user.get("phone", ""),
                    "station_id": user.get("station_id")
                }
            }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/register")
def register(data: RegisterRequest):
    for user in db["users"].values():
        if user.get("username") == data.username or user.get("email") == data.email:
            raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = f"U{uuid.uuid4().hex[:8].upper()}"
    new_user = {
        "id": user_id,
        "username": data.username,
        "email": data.email,
        "password": hash_password(data.password),
        "role": data.role,
        "name": data.name,
        "phone": data.phone,
        "status": "active",
        "created_at": datetime.now().isoformat()
    }
    
    if data.role in ["station_manager", "station_worker"]:
        new_user["station_id"] = None
        new_user["approved_by"] = None
    
    db["users"][user_id] = new_user
    save_db(db)
    
    token = f"TOKEN_{uuid.uuid4().hex}"
    new_user["token"] = token
    save_db(db)
    
    user_response = new_user.copy()
    user_response.pop("password", None)
    
    return {"success": True, "user": user_response, "token": token, "message": "Registration successful"}

@app.post("/api/auth/logout")
def logout(token: str = Header(None)):
    for user in db["users"].values():
        if user.get("token") == token:
            user.pop("token", None)
            save_db(db)
            return {"success": True, "message": "Logged out"}
    return {"success": True, "message": "No active session"}

@app.post("/api/auth/forgot-password")
def forgot_password(data: dict):
    email = data.get("email", "").lower().strip()
    if not email:
        return {"success": False, "error": "Email is required"}
    
    user_found = None
    for user in db["users"].values():
        if user.get("email", "").lower() == email:
            user_found = user
            break
    
    if user_found:
        reset_token = f"RESET_{uuid.uuid4().hex}"
        user_found["reset_token"] = reset_token
        user_found["reset_expires"] = (datetime.now() + timedelta(hours=1)).isoformat()
        save_db(db)
        return {"success": True, "message": f"Password reset link sent. Use token: {reset_token}"}
    
    return {"success": True, "message": "If an account exists with this email, a reset link will be sent"}

@app.post("/api/auth/reset-password")
def reset_password(data: dict):
    token = data.get("token", "").strip()
    new_password = data.get("new_password", "")
    
    if not token or not new_password:
        return {"success": False, "error": "Token and new password are required"}
    
    for user in db["users"].values():
        if user.get("reset_token") == token:
            expires = user.get("reset_expires")
            if expires and datetime.fromisoformat(expires) < datetime.now():
                return {"success": False, "error": "Reset token has expired"}
            
            user["password"] = hash_password(new_password)
            user.pop("reset_token", None)
            user.pop("reset_expires", None)
            save_db(db)
            return {"success": True, "message": "Password reset successful"}
    
    return {"success": False, "error": "Invalid reset token"}

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")
    
    token = authorization.replace("Bearer ", "")
    for user in db["users"].values():
        if user.get("token") == token:
            return user
    raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/auth/me")
def get_me(user = Depends(get_current_user)):
    return {
        "id": user["id"],
        "username": user["username"],
        "name": user["name"],
        "role": user["role"],
        "email": user.get("email"),
        "phone": user.get("phone"),
        "station_id": user.get("station_id")
    }

@app.get("/api/users")
def list_users(role: Optional[str] = None, user = Depends(get_current_user)):
    if user["role"] not in ["developer_admin", "municipality_admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    users = list(db["users"].values())
    if role:
        users = [u for u in users if u.get("role") == role]
    
    for u in users:
        u.pop("password", None)
        u.pop("token", None)
    return users

@app.post("/api/stations/assign-manager")
def assign_manager(data: dict, user = Depends(get_current_user)):
    if user["role"] not in ["developer_admin", "municipality_admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if data["station_id"] not in db["stations"]:
        raise HTTPException(status_code=404, detail="Station not found")
    
    if data["manager_id"] in db["users"]:
        db["users"][data["manager_id"]]["station_id"] = data["station_id"]
        db["users"][data["manager_id"]]["role"] = "station_manager"
    
    db["stations"][data["station_id"]]["manager_id"] = data["manager_id"]
    save_db(db)
    return {"success": True}

@app.post("/api/stations/assign-worker")
def assign_worker(data: dict, user = Depends(get_current_user)):
    if user["role"] not in ["developer_admin", "municipality_admin", "station_manager"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    station_id = user.get("station_id") or data.get("station_id")
    if data["worker_id"] in db["users"]:
        db["users"][data["worker_id"]]["station_id"] = station_id
        db["users"][data["worker_id"]]["role"] = "station_worker"
    
    save_db(db)
    return {"success": True}

@app.get("/api/timeslots")
def get_timeslots():
    return time_slots

@app.post("/api/vehicles/register")
def register_vehicle(vehicle: Vehicle, user = Depends(get_current_user)):
    if vehicle.type != "truck" and user["role"] not in ["driver", "fleet_owner", "developer_admin", "municipality_admin"]:
        raise HTTPException(status_code=403, detail="Only drivers can register vehicles")
    
    vehicle_id = f"V{uuid.uuid4().hex[:6].upper()}"
    qr_code = generate_qr(vehicle.type, vehicle.plate, vehicle_id)
    
    max_capacity = {"bajaj": 50, "automobile": 150, "truck": 500}
    
    new_vehicle = {
        "id": vehicle_id,
        "user_id": user["id"],
        "type": vehicle.type,
        "plate": vehicle.plate.upper(),
        "tank_capacity": vehicle.tank_capacity,
        "max_capacity": max_capacity.get(vehicle.type, 150),
        "qr_code": qr_code,
        "owner_name": user.get("name", ""),
        "phone": user.get("phone", ""),
        "status": "active",
        "created_at": datetime.now().isoformat()
    }
    
    db["vehicles"][vehicle_id] = new_vehicle
    db["wallets"][vehicle_id] = {"balance": 5000.0, "currency": "USD"}
    save_db(db)
    
    new_vehicle["qr_data"] = create_qr_data(new_vehicle)
    
    return {
        "success": True,
        "vehicle": new_vehicle,
        "wallet": db["wallets"][vehicle_id]
    }

@app.get("/api/vehicles")
def get_vehicles(user = Depends(get_current_user)):
    if user["role"] in ["driver", "fleet_owner"]:
        return [v for v in db["vehicles"].values() if v.get("user_id") == user["id"]]
    elif user["role"] == "station_worker":
        station_id = user.get("station_id")
        return list(db["vehicles"].values())
    elif user["role"] == "station_manager":
        return list(db["vehicles"].values())
    return list(db["vehicles"].values())

@app.get("/api/vehicles/{vehicle_id}")
def get_vehicle(vehicle_id: str, user = Depends(get_current_user)):
    if vehicle_id not in db["vehicles"]:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = db["vehicles"][vehicle_id]
    vehicle["wallet"] = db["wallets"].get(vehicle_id, {"balance": 0})
    return vehicle

@app.get("/api/vehicles/qr/{qr_code}")
def get_vehicle_by_qr(qr_code: str):
    for vehicle in db["vehicles"].values():
        if vehicle.get("qr_code") == qr_code:
            return vehicle
    raise HTTPException(status_code=404, detail="Vehicle not found")

@app.post("/api/transactions/create")
def create_transaction(transaction: Transaction, user = Depends(get_current_user)):
    if user["role"] != "station_worker":
        raise HTTPException(status_code=403, detail="Only station workers can create transactions")
    
    if transaction.vehicle_id not in db["vehicles"]:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    vehicle = db["vehicles"][transaction.vehicle_id]
    station = db["stations"].get(transaction.station_id)
    
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    is_valid, error = check_capacity(vehicle["type"], transaction.liters)
    
    tx_id = f"TX{uuid.uuid4().hex[:8].upper()}"
    amount = transaction.liters * 50.0
    
    wallet = db["wallets"].get(transaction.vehicle_id, {"balance": 0})
    if wallet["balance"] < amount:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")
    
    new_transaction = {
        "id": tx_id,
        "vehicle_id": transaction.vehicle_id,
        "vehicle_plate": vehicle["plate"],
        "vehicle_type": vehicle["type"],
        "station_id": transaction.station_id,
        "station_name": station["name"],
        "worker_id": transaction.worker_id,
        "worker_name": db["users"].get(transaction.worker_id, {}).get("name", "Unknown"),
        "liters": transaction.liters,
        "amount": amount,
        "timestamp": datetime.now().isoformat(),
        "status": "verified" if is_valid else "flagged",
        "gps_match": True,
        "anomaly": error,
        "integrity_fee": round(amount * 0.02, 2)
    }
    
    db["transactions"][tx_id] = new_transaction
    wallet["balance"] -= amount
    db["wallets"][transaction.vehicle_id] = wallet
    
    station["inventory"] -= transaction.liters
    db["stations"][transaction.station_id] = station
    
    save_db(db)
    return {"success": True, "transaction": new_transaction}

@app.get("/api/transactions")
def get_transactions(
    vehicle_id: Optional[str] = None,
    station_id: Optional[str] = None,
    user = Depends(get_current_user)
):
    transactions = list(db["transactions"].values())
    
    if user["role"] in ["driver", "fleet_owner"]:
        vehicles = [v["id"] for v in db["vehicles"].values() if v.get("user_id") == user["id"]]
        transactions = [t for t in transactions if t.get("vehicle_id") in vehicles]
    
    if vehicle_id:
        transactions = [t for t in transactions if t.get("vehicle_id") == vehicle_id]
    if station_id:
        transactions = [t for t in transactions if t.get("station_id") == station_id]
    
    return sorted(transactions, key=lambda x: x.get("timestamp", ""), reverse=True)

@app.get("/api/stations")
def get_stations(user = Depends(get_current_user)):
    result = []
    for station in db["stations"].values():
        gap = calculate_ghost_gap(station["id"])
        manager = db["users"].get(station.get("manager_id", ""), {})
        result.append({
            **station,
            "manager_name": manager.get("name", "Not Assigned"),
            "ghost_gap": gap.get("ghost_gap", 0),
            "status": gap.get("status", "ok")
        })
    return result

@app.get("/api/stations/{station_id}")
def get_station(station_id: str, user = Depends(get_current_user)):
    if station_id not in db["stations"]:
        raise HTTPException(status_code=404, detail="Station not found")
    station = db["stations"][station_id]
    gap = calculate_ghost_gap(station_id)
    
    workers = [u for u in db["users"].values() if u.get("station_id") == station_id and u.get("role") == "station_worker"]
    for w in workers:
        w.pop("password", None)
        w.pop("token", None)
    
    return {**station, "ghost_gap": gap.get("ghost_gap", 0), "workers": workers}

@app.post("/api/bookings/create")
def create_booking(booking: Booking, user = Depends(get_current_user)):
    if booking.vehicle_id not in db["vehicles"]:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    slot_info = next((s for s in time_slots if s["id"] == booking.time_slot), None)
    if not slot_info:
        raise HTTPException(status_code=400, detail="Invalid time slot")
    
    booking_id = f"BK{uuid.uuid4().hex[:6].upper()}"
    new_booking = {
        "id": booking_id,
        "vehicle_id": booking.vehicle_id,
        "station_id": booking.station_id,
        "time_slot": booking.time_slot,
        "time_label": slot_info["label"],
        "status": "confirmed",
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    db["bookings"][booking_id] = new_booking
    save_db(db)
    return {"success": True, "booking": new_booking}

@app.get("/api/bookings")
def get_bookings(user = Depends(get_current_user)):
    if user["role"] in ["driver", "fleet_owner"]:
        return [b for b in db["bookings"].values() if b.get("user_id") == user["id"]]
    elif user["role"] == "station_manager":
        return [b for b in db["bookings"].values() if b.get("station_id") == user.get("station_id")]
    return list(db["bookings"].values())

@app.post("/api/deliveries/log")
def log_delivery(delivery: Delivery, user = Depends(get_current_user)):
    if user["role"] not in ["station_manager", "developer_admin", "municipality_admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    delivery_id = f"DL{uuid.uuid4().hex[:6].upper()}"
    new_delivery = {
        "id": delivery_id,
        "station_id": delivery.station_id,
        "liters_delivered": delivery.liters_delivered,
        "logged_by": user["id"],
        "timestamp": datetime.now().isoformat()
    }
    
    db["deliveries"][delivery_id] = new_delivery
    station = db["stations"][delivery.station_id]
    station["inventory"] += delivery.liters_delivered
    db["stations"][delivery.station_id] = station
    save_db(db)
    return {"success": True, "delivery": new_delivery}

@app.get("/api/deliveries")
def get_deliveries(station_id: Optional[str] = None, user = Depends(get_current_user)):
    deliveries = list(db["deliveries"].values())
    if station_id:
        deliveries = [d for d in deliveries if d.get("station_id") == station_id]
    return deliveries

@app.get("/api/audit/ghostgap")
def get_ghost_gap(station_id: Optional[str] = None, user = Depends(get_current_user)):
    if station_id:
        return calculate_ghost_gap(station_id)
    result = {}
    for sid in db["stations"]:
        result[sid] = calculate_ghost_gap(sid)
    return result

@app.post("/api/subscriptions/create")
def create_subscription(subscription: Subscription, user = Depends(get_current_user)):
    if user["role"] != "developer_admin":
        raise HTTPException(status_code=403, detail="Only developer can create subscriptions")
    
    sub_id = f"SUB{uuid.uuid4().hex[:6].upper()}"
    new_sub = {
        "id": sub_id,
        "user_id": subscription.user_id,
        "plan": subscription.plan,
        "vehicles_limit": subscription.vehicles_limit,
        "price_monthly": subscription.price_monthly,
        "status": "active",
        "created_at": datetime.now().isoformat()
    }
    
    db["subscriptions"][sub_id] = new_sub
    save_db(db)
    return {"success": True, "subscription": new_sub}

@app.get("/api/subscriptions")
def get_subscriptions(user = Depends(get_current_user)):
    if user["role"] == "fleet_owner":
        return [s for s in db["subscriptions"].values() if s.get("user_id") == user["id"]]
    return list(db["subscriptions"].values())

@app.post("/api/wallet/topup")
def topup_wallet(topup: WalletTopup, user = Depends(get_current_user)):
    if topup.vehicle_id not in db["wallets"]:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    wallet = db["wallets"][topup.vehicle_id]
    wallet["balance"] += topup.amount
    db["wallets"][topup.vehicle_id] = wallet
    save_db(db)
    return {"success": True, "wallet": wallet}

@app.get("/api/wallet/{vehicle_id}")
def get_wallet(vehicle_id: str, user = Depends(get_current_user)):
    if vehicle_id not in db["wallets"]:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db["wallets"][vehicle_id]

@app.get("/api/reports/daily")
def daily_report(date: Optional[str] = None, user = Depends(get_current_user)):
    if user["role"] not in ["developer_admin", "municipality_admin", "station_manager"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    target_date = date or datetime.now().strftime("%Y-%m-%d")
    transactions = [t for t in db["transactions"].values() if t.get("timestamp", "").startswith(target_date)]
    
    total_liters = sum(t.get("liters", 0) for t in transactions)
    total_revenue = sum(t.get("amount", 0) for t in transactions)
    verified = sum(1 for t in transactions if t.get("status") == "verified")
    flagged = sum(1 for t in transactions if t.get("status") == "flagged")
    
    by_station = {}
    for t in transactions:
        sid = t.get("station_id")
        if sid not in by_station:
            by_station[sid] = {"liters": 0, "revenue": 0, "transactions": 0}
        by_station[sid]["liters"] += t.get("liters", 0)
        by_station[sid]["revenue"] += t.get("amount", 0)
        by_station[sid]["transactions"] += 1
    
    return {
        "date": target_date,
        "total_liters": total_liters,
        "total_revenue": total_revenue,
        "verified_transactions": verified,
        "flagged_transactions": flagged,
        "by_station": by_station,
        "integrity_fee": sum(t.get("integrity_fee", 0) for t in transactions)
    }

@app.get("/api/reports/weekly")
def weekly_report(user = Depends(get_current_user)):
    if user["role"] not in ["developer_admin", "municipality_admin", "station_manager"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    week_ago = (datetime.now() - timedelta(days=7)).isoformat()
    transactions = [t for t in db["transactions"].values() if t.get("timestamp", "") >= week_ago]
    deliveries = [d for d in db["deliveries"].values() if d.get("timestamp", "") >= week_ago]
    
    total_liters = sum(t.get("liters", 0) for t in transactions)
    total_delivered = sum(d.get("liters_delivered", 0) for d in deliveries)
    total_revenue = sum(t.get("amount", 0) for t in transactions)
    
    station_reports = []
    for station in db["stations"].values():
        st_trans = [t for t in transactions if t.get("station_id") == station["id"]]
        st_del = [d for d in deliveries if d.get("station_id") == station["id"]]
        
        station_reports.append({
            "station_id": station["id"],
            "station_name": station["name"],
            "fuel_in": sum(d.get("liters_delivered", 0) for d in st_del),
            "fuel_out": sum(t.get("liters", 0) for t in st_trans),
            "revenue": sum(t.get("amount", 0) for t in st_trans),
            "transactions": len(st_trans),
            "efficiency": round((sum(t.get("liters", 0) for t in st_trans) / max(sum(d.get("liters_delivered", 0) for d in st_del), 1)) * 100, 2)
        })
    
    return {
        "period": "Last 7 days",
        "total_fuel_in": total_delivered,
        "total_fuel_out": total_liters,
        "total_revenue": total_revenue,
        "stations": station_reports,
        "revenue_split": calculate_revenue_split()
    }

@app.get("/api/reports/revenue")
def revenue_report(user = Depends(get_current_user)):
    if user["role"] not in ["developer_admin", "municipality_admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    split = calculate_revenue_split()
    total = sum(t.get("amount", 0) for t in db["transactions"].values())
    
    by_month = {}
    for t in db["transactions"].values():
        month = t.get("timestamp", "")[:7]
        if month not in by_month:
            by_month[month] = {"total": 0, "municipality": 0, "developer": 0}
        by_month[month]["total"] += t.get("amount", 0)
        by_month[month]["municipality"] += t.get("amount", 0) * 0.7
        by_month[month]["developer"] += t.get("amount", 0) * 0.3
    
    return {
        "total_revenue": total,
        "split": split,
        "by_month": by_month,
        "integrity_fee_total": sum(t.get("integrity_fee", 0) for t in db["transactions"].values())
    }

def _compute_stats():
    users_by_role = {}
    for u in db["users"].values():
        role = u.get("role", "unknown")
        users_by_role[role] = users_by_role.get(role, 0) + 1
    return {
        "total_users": len(db["users"]),
        "users_by_role": users_by_role,
        "total_vehicles": len(db["vehicles"]),
        "total_transactions": len(db["transactions"]),
        "total_stations": len(db["stations"]),
        "active_subscriptions": sum(1 for s in db["subscriptions"].values() if s.get("status") == "active")
    }

@app.get("/api/stats")
def get_stats(user = Depends(get_current_user)):
    return _compute_stats()

@app.get("/api/public/stats")
def get_public_stats():
    return _compute_stats()

@app.post("/api/admin/seed")
def seed_data():
    demo_users = [
        {"username": "station1_mgr", "email": "station1@velocity.com", "password": "pass123", "role": "station_manager", "name": "Station 1 Manager"},
        {"username": "station1_worker", "email": "worker1@velocity.com", "password": "pass123", "role": "station_worker", "name": "Station 1 Worker"},
        {"username": "fleet_owner1", "email": "fleet1@velocity.com", "password": "pass123", "role": "fleet_owner", "name": "Fleet Owner One"},
        {"username": "driver1", "email": "driver1@velocity.com", "password": "pass123", "role": "driver", "name": "Driver One"},
    ]
    
    for u in demo_users:
        uid = f"U{uuid.uuid4().hex[:8].upper()}"
        db["users"][uid] = {
            "id": uid,
            **u,
            "password": hash_password(u["password"]),
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
    
    save_db(db)
    return {"success": True, "message": "Demo data seeded"}

if __name__ == "__main__":
    import uvicorn
    print("VeloCity API v3.0 - Full Authentication System")
    print("Roles: Developer Admin, Municipality Admin, Station Manager, Station Worker, Fleet Owner, Driver")
    uvicorn.run(app, host="0.0.0.0", port=8000)