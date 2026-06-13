import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { sampleVehicles, sampleTransactions, stations, dailyStats } from '../data/sampleData';

// Supabase configuration - set these in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client only if credentials are provided
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const VeloCityContext = createContext();

const CURRENCY_RATES = {
  USD: 1,
  ETB: 156.55,
};

const ACCESS_LEVELS = {
  SUPER_ADMIN: { level: 100, name: 'Super Admin', canReview: true, canBan: true, canAudit: true, canManageAll: true },
  DEVELOPER_ADMIN: { level: 90, name: 'Developer Admin', canReview: true, canBan: true, canAudit: true, canManageAll: true },
  MUNICIPALITY_ADMIN: { level: 80, name: 'Municipality Admin', canReview: true, canBan: true, canAudit: true, canManageStations: true },
  STATION_MANAGER: { level: 60, name: 'Station Manager', canReview: false, canBan: false, canAudit: false, canManageStation: true },
  STATION_WORKER: { level: 40, name: 'Station Worker', canReview: false, canBan: false, canAudit: false, canDispense: true },
  FLEET_OWNER: { level: 30, name: 'Fleet Owner', canReview: false, canBan: false, canAudit: false, canManageFleet: true },
  DRIVER: { level: 10, name: 'Driver', canReview: false, canBan: false, canAudit: false, canBookFuel: true },
};

const PERMISSIONS = {
  VIEW_ALL_TRANSACTIONS: 'VIEW_ALL_TRANSACTIONS',
  MANAGE_STATIONS: 'MANAGE_STATIONS',
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  APPROVE_REVIEW: 'APPROVE_REVIEW',
  BAN_ACCOUNTS: 'BAN_ACCOUNTS',
  MODIFY_PRICING: 'MODIFY_PRICING',
  VIEW_FINANCIALS: 'VIEW_FINANCIALS',
};

const REQUIRED_CLEARANCE = {
  [PERMISSIONS.VIEW_ALL_TRANSACTIONS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.MANAGE_STATIONS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.MANAGE_USERS]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VIEW_AUDIT_LOGS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.APPROVE_REVIEW]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.BAN_ACCOUNTS]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VIEW_FINANCIALS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
};

const FUEL_AVAILABILITY = {
  FULL: { value: 100, label: '100% Available', color: '#06D6A0' },
  HALF: { value: 50, label: '50% Available', color: '#FF6B35' },
  LOW: { value: 25, label: '25% Available', color: '#EF476F' },
  NONE: { value: 0, label: 'Not Available', color: '#8D99AE' },
};

const SUBSCRIPTION_TIERS = {
  basic: { id: 'basic', label: 'Basic', price: 1000, dailyLimit: 50, monthlyLimit: 600, color: '#8D99AE' },
  premium: { id: 'premium', label: 'Premium', price: 2500, dailyLimit: 150, monthlyLimit: 1800, color: '#FFD166' },
  enterprise: { id: 'enterprise', label: 'Enterprise', price: 5000, dailyLimit: 999, monthlyLimit: 9999, color: '#06D6A0' },
};

const ESCALATION_LEVELS = {
  WORKER: { level: 1, role: 'station_worker', label: 'Initial Report' },
  STATION_MANAGER: { level: 2, role: 'station_manager', label: 'Station Review' },
  MUNICIPALITY: { level: 3, role: 'municipality_admin', label: 'Municipality Review' },
  DEVELOPER: { level: 4, role: 'developer_admin', label: 'Developer Resolution' },
};

const THEFT_PATTERNS = {
  RAPID_FILL: { id: 'rapid_fill', label: 'Rapid Re-Fill', thresholdMinutes: 30, severity: 'high' },
  OVER_CAPACITY: { id: 'over_capacity', label: 'Exceeds Tank Capacity', thresholdPercent: 10, severity: 'critical' },
  GEO_SPOOF: { id: 'geo_spoof', label: 'Geographic Impossibility', thresholdKm: 50, severity: 'critical' },
  SAME_QR_MULTI: { id: 'same_qr_multi', label: 'Same QR Multiple Stations', thresholdMinutes: 15, severity: 'high' },
  BLACK_MARKET: { id: 'black_market', label: 'Black Market Resale', thresholdSoldPercent: 110, severity: 'critical' },
};

const ASSOCIATIONS = [
  { id: 'A1', name: 'A1 - Bajaj Association', type: 'bajaj' },
  { id: 'A2', name: 'A2 - Bajaj Association', type: 'bajaj' },
  { id: 'A3', name: 'A3 - Bajaj Association', type: 'bajaj' },
  { id: 'A4', name: 'A4 - Bajaj Association', type: 'bajaj' },
  { id: 'A5', name: 'A5 - Bajaj Association', type: 'bajaj' },
  { id: 'A6', name: 'A6 - Bajaj Association', type: 'bajaj' },
  { id: 'A7', name: 'A7 - Bajaj Association', type: 'bajaj' },
  { id: 'B1', name: 'B1 - Minibus Association', type: 'minibus' },
  { id: 'B2', name: 'B2 - Minibus Association', type: 'minibus' },
  { id: 'B3', name: 'B3 - Minibus Association', type: 'minibus' },
  { id: 'B4', name: 'B4 - Minibus Association', type: 'minibus' },
  { id: 'B5', name: 'B5 - Minibus Association', type: 'minibus' },
  { id: 'B6', name: 'B6 - Minibus Association', type: 'minibus' },
  { id: 'B7', name: 'B7 - Minibus Association', type: 'minibus' },
  { id: 'C1', name: 'C1 - Bus Association', type: 'bus' },
  { id: 'C2', name: 'C2 - Bus Association', type: 'bus' },
  { id: 'C3', name: 'C3 - Bus Association', type: 'bus' },
  { id: 'C4', name: 'C4 - Bus Association', type: 'bus' },
  { id: 'C5', name: 'C5 - Bus Association', type: 'bus' },
  { id: 'C6', name: 'C6 - Bus Association', type: 'bus' },
  { id: 'C7', name: 'C7 - Bus Association', type: 'bus' },
  { id: 'TAXI', name: 'Taxi Association', type: 'taxi' },
  { id: 'PRIVATE', name: 'Private Vehicle', type: 'private' },
];

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  vehicles: [],
  transactions: [],
  stations: [],
  stats: dailyStats,
  currentPage: 'landing',
  currentPortal: 'landing',
  apiStatus: 'demo',
  driverLocks: {},
  currency: 'ETB',
  appointments: [],
  notifications: [],
  stationAvailability: {},
  auditLogs: [],
  pendingReviews: [],
  errorLogs: [],
  flaggedAccounts: [],
  queue: [],
  refuelQRCodes: [],
  incidents: [],
  pendingOffline: [],
  theftAlerts: [],
  subscriptions: [],
  voiceLogs: [],
};

function veloCityReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...initialState, apiStatus: state.apiStatus, currency: state.currency };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_PORTAL':
      return { ...state, currentPortal: action.payload };
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload };
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === action.payload.id ? action.payload : v)
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'SET_STATION_AVAILABILITY':
      return { ...state, stationAvailability: { ...state.stationAvailability, [action.payload.stationId]: action.payload.availability } };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return { ...state, appointments: state.appointments.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'SET_STATION_FUEL':
      return { 
        ...state, 
        stations: state.stations.map(s => 
          s.id === action.payload.stationId 
            ? { ...s, fuelReceived: action.payload.fuelReceived, fuelSold: action.payload.fuelSold || s.fuelSold || 0, lastUpdated: new Date().toISOString() }
            : s
        )
      };
    case 'UPDATE_STATION_FUEL_SOLD':
      return {
        ...state,
        stations: state.stations.map(s =>
          s.id === action.payload.stationId
            ? { ...s, fuelSold: (s.fuelSold || 0) + action.payload.litersSold }
            : s
        )
      };
    case 'ADD_INSPECTION_ALERT':
      return { ...state, inspectionAlerts: [...(state.inspectionAlerts || []), action.payload] };
    case 'ADD_AUDIT_LOG':
      return { ...state, auditLogs: [...state.auditLogs, action.payload] };
    case 'ADD_PENDING_REVIEW':
      return { ...state, pendingReviews: [...state.pendingReviews, action.payload] };
    case 'APPROVE_REVIEW':
      return { ...state, pendingReviews: state.pendingReviews.filter(r => r.id !== action.payload.id) };
    case 'REJECT_REVIEW':
      return { ...state, pendingReviews: state.pendingReviews.filter(r => r.id !== action.payload.id) };
    case 'LOG_ERROR':
      return { ...state, errorLogs: [...state.errorLogs, action.payload] };
    case 'FLAG_ACCOUNT':
      return { ...state, flaggedAccounts: [...state.flaggedAccounts, action.payload] };
    case 'UNFLAG_ACCOUNT':
      return { ...state, flaggedAccounts: state.flaggedAccounts.filter(a => a.id !== action.payload.id) };
    case 'BAN_ACCOUNT':
      return { ...state, flaggedAccounts: state.flaggedAccounts.map(a => a.id === action.payload.id ? { ...a, banned: true, bannedAt: new Date().toISOString() } : a) };
    case 'SET_STATIONS':
      return { ...state, stations: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_API_STATUS':
      return { ...state, apiStatus: action.payload };
    case 'SET_DRIVER_LOCK':
      return { ...state, driverLocks: { ...state.driverLocks, [action.payload.driverId]: action.payload.lockedUntil } };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'ADD_QUEUE_ENTRY':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'UPDATE_QUEUE_ENTRY':
      return { ...state, queue: state.queue.map(q => q.id === action.payload.id ? { ...q, ...action.payload } : q) };
    case 'REMOVE_QUEUE_ENTRY':
      return { ...state, queue: state.queue.filter(q => q.id !== action.payload.id) };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'ADD_REFUEL_QR':
      return { ...state, refuelQRCodes: [...state.refuelQRCodes, action.payload] };
    case 'REMOVE_REFUEL_QR':
      return { ...state, refuelQRCodes: state.refuelQRCodes.filter(q => q.id !== action.payload.id) };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [...state.incidents, action.payload] };
    case 'UPDATE_INCIDENT':
      return { ...state, incidents: state.incidents.map(i => i.id === action.payload.id ? { ...i, ...action.payload } : i) };
    case 'ADD_PENDING_OFFLINE':
      return { ...state, pendingOffline: [...state.pendingOffline, action.payload] };
    case 'CLEAR_PENDING_OFFLINE':
      return { ...state, pendingOffline: [] };
    case 'ADD_THEFT_ALERT':
      return { ...state, theftAlerts: [action.payload, ...(state.theftAlerts || [])] };
    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [...state.subscriptions, action.payload] };
    case 'ADD_VOICE_LOG':
      return { ...state, voiceLogs: [...state.voiceLogs, action.payload] };
    default:
      return state;
  }
}

export function VeloCityProvider({ children }) {
  const [state, dispatch] = useReducer(veloCityReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const savedUser = localStorage.getItem('velocity_user');
      const savedToken = localStorage.getItem('velocity_token');
      const savedCurrency = localStorage.getItem('velocity_currency') || 'USD';
      const savedPage = localStorage.getItem('velocity_currentPage');
      const savedPortal = localStorage.getItem('velocity_currentPortal');
      
      if (savedPage && savedPage !== 'landing') {
        dispatch({ type: 'SET_PAGE', payload: savedPage });
      }
      
      if (savedPortal) {
        dispatch({ type: 'SET_PORTAL', payload: savedPortal });
      }
      
      if (savedUser && savedToken) {
        dispatch({ type: 'LOGIN', payload: { user: JSON.parse(savedUser), token: savedToken } });
      }
      
      // Try to load from Supabase if configured
      if (supabase) {
        try {
          const { data: vehicles } = await supabase.from('vehicles').select('*');
          if (vehicles && vehicles.length > 0) {
            dispatch({ type: 'SET_VEHICLES', payload: vehicles });
          }
          
          const { data: trans } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
          if (trans) {
            dispatch({ type: 'SET_TRANSACTIONS', payload: trans });
          }
          
          const { data: stats } = await supabase.from('stations').select('*');
          if (stats) {
            dispatch({ type: 'SET_STATIONS', payload: stats });
          }
        } catch (e) {
          console.log('Using demo data (Supabase not connected)');
        }
      } else {
        // Use demo data
        dispatch({ type: 'SET_VEHICLES', payload: sampleVehicles });
        dispatch({ type: 'SET_TRANSACTIONS', payload: sampleTransactions });
        dispatch({ type: 'SET_STATIONS', payload: stations });
      }
      
      dispatch({ type: 'SET_STATS', payload: dailyStats });
      dispatch({ type: 'SET_CURRENCY', payload: savedCurrency });
      setLoading(false);
    };
    
    loadData();
  }, []);

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const inUSD = fromCurrency === 'USD' ? amount : amount / CURRENCY_RATES.ETB;
    return toCurrency === 'USD' ? inUSD : inUSD * CURRENCY_RATES.ETB;
  };

  const formatCurrency = (amount, currency = state.currency) => {
    const symbols = { USD: '$', ETB: 'ETB' };
    const converted = currency === 'USD' ? amount : convertCurrency(amount, 'USD', 'ETB');
    return `${symbols[currency]} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const generateQRCode = (vehicle) => {
    const qrData = {
      id: vehicle.id,
      plate: vehicle.plate,
      type: vehicle.type,
      capacity: vehicle.tankCapacity,
      owner: vehicle.owner_name,
      token: `VELO-${vehicle.plate.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    return JSON.stringify(qrData);
  };

  const isDriverLocked = (driverId) => {
    const lockedUntil = state.driverLocks[driverId];
    if (!lockedUntil) return false;
    return new Date(lockedUntil) > new Date();
  };

  const getLockRemainingTime = (driverId) => {
    const lockedUntil = state.driverLocks[driverId];
    if (!lockedUntil) return null;
    const diff = new Date(lockedUntil) - new Date();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const lockDriver = (driverId) => {
    const lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
    localStorage.setItem(`driver_lock_${driverId}`, lockedUntil.toISOString());
    dispatch({ type: 'SET_DRIVER_LOCK', payload: { driverId, lockedUntil: lockedUntil.toISOString() } });
  };

  const unlockDriver = (driverId) => {
    localStorage.removeItem(`driver_lock_${driverId}`);
  };

  const login = async (username, password) => {
    const demoAccounts = {
      'developer': { id: 'admin_dev', username: 'developer', name: 'System Developer', role: 'developer_admin', email: 'developer@velocity.com', accessLevel: ACCESS_LEVELS.DEVELOPER_ADMIN.level },
      'municipality': { id: 'admin_muni', username: 'municipality', name: 'Municipality Admin', role: 'municipality_admin', email: 'municipality@velocity.com', accessLevel: ACCESS_LEVELS.MUNICIPALITY_ADMIN.level },
      'station1_mgr': { id: 'SM001', username: 'station1_mgr', name: 'Station 1 Manager', role: 'station_manager', email: 'station1@velocity.com', accessLevel: ACCESS_LEVELS.STATION_MANAGER.level },
      'station1_worker': { id: 'SW001', username: 'station1_worker', name: 'Station 1 Worker', role: 'station_worker', email: 'worker1@velocity.com', accessLevel: ACCESS_LEVELS.STATION_WORKER.level },
      'fleet_owner1': { id: 'FO001', username: 'fleet_owner1', name: 'Fleet Owner One', role: 'fleet_owner', email: 'fleet1@velocity.com', accessLevel: ACCESS_LEVELS.FLEET_OWNER.level },
      'driver1': { id: 'DR001', username: 'driver1', name: 'Driver One', role: 'driver', email: 'driver1@velocity.com', accessLevel: ACCESS_LEVELS.DRIVER.level },
      'superadmin': { id: 'admin_super', username: 'superadmin', name: 'Super Admin', role: 'super_admin', email: 'super@velocity.com', accessLevel: ACCESS_LEVELS.SUPER_ADMIN.level },
    };

    const demoPasswords = {
      'developer': 'dev123',
      'municipality': 'muni123',
      'station1_mgr': 'pass123',
      'station1_worker': 'pass123',
      'fleet_owner1': 'pass123',
      'driver1': 'pass123',
      'superadmin': 'super123',
    };

    if (demoAccounts[username] && demoPasswords[username] === password) {
      const token = `demo_token_${Date.now()}`;
      localStorage.setItem('velocity_user', JSON.stringify(demoAccounts[username]));
      localStorage.setItem('velocity_token', token);
      dispatch({ type: 'LOGIN', payload: { user: demoAccounts[username], token } });
      return { success: true, user: demoAccounts[username] };
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('velocity_user', JSON.stringify(data.user));
        localStorage.setItem('velocity_token', data.token);
        dispatch({ type: 'LOGIN', payload: data });
        return { success: true, user: data.user };
      }
      return { success: false, error: data.detail || 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Use demo credentials.' };
    }
  };

  const register = async (userData) => {
    const userId = `U${Date.now()}`;
    const newUser = {
      id: userId,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      localStorage.setItem(`velocity_user_${userId}`, JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  };

  const loginAs = (user, token) => {
    const t = token || `demo_token_${Date.now()}`;
    localStorage.setItem('velocity_user', JSON.stringify(user));
    localStorage.setItem('velocity_token', t);
    dispatch({ type: 'LOGIN', payload: { user, token: t } });
  };

  const logout = () => {
    localStorage.removeItem('velocity_user');
    localStorage.removeItem('velocity_token');
    localStorage.removeItem('velocity_currentPage');
    localStorage.removeItem('velocity_currentPortal');
    dispatch({ type: 'LOGOUT' });
  };

  const registerVehicle = async (vehicleData, ownerId) => {
    const vehicleId = `V${Date.now()}`;
    const qrToken = `${vehicleData.plate.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newVehicle = {
      id: vehicleId,
      ...vehicleData,
      owner_id: ownerId || state.user?.id,
      qr_code: qrToken,
      qr_data: generateQRCode({ ...vehicleData, id: vehicleId, owner_name: vehicleData.owner_name }),
      driver_photo: vehicleData.photo || null,
      status: 'active',
      wallet: { balance: 5000, currency: state.currency },
      last_filled: null,
      fill_count: 0,
      createdAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_VEHICLE', payload: newVehicle });
    
    const existingVehicles = JSON.parse(localStorage.getItem('velocity_vehicles') || '[]');
    localStorage.setItem('velocity_vehicles', JSON.stringify([...existingVehicles, newVehicle]));
    
    return { success: true, vehicle: newVehicle };
  };

  const createTransaction = async (transactionData) => {
    const fuelPrice = state.currency === 'USD' ? 50 : convertCurrency(50, 'USD', 'ETB');
    const amount = transactionData.liters * fuelPrice;
    
    const pricePerLiter = state.currency === 'ETB' ? 50 : 0.32;
    const revenueShare = calculateRevenueShare(transactionData.liters, pricePerLiter);
    
    const newTransaction = {
      id: `TX${Date.now()}`,
      ...transactionData,
      amount,
      currency: state.currency,
      price_per_liter: fuelPrice,
      timestamp: new Date().toISOString(),
      status: 'verified',
      driver_photo: transactionData.driver_photo || null,
      pump_capture: transactionData.pump_capture || null,
      pump_capture_verified: transactionData.pump_capture_verified || false,
      station_id: transactionData.station_id,
      worker_id: transactionData.worker_id,
      revenue_distribution: revenueShare.distribution,
      total_amount: revenueShare.baseAmount,
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    if (transactionData.vehicle_id && transactionData.driver_id) {
      lockDriver(transactionData.driver_id);
    }
    
    return { success: true, transaction: newTransaction };
  };

  const searchVehicles = (query, fleetOwnerId) => {
    if (!query) return state.vehicles.filter(v => v.owner_id === fleetOwnerId);
    const q = query.toLowerCase();
    return state.vehicles.filter(v => 
      v.owner_id === fleetOwnerId &&
      (v.plate.toLowerCase().includes(q) || 
       v.owner_name?.toLowerCase().includes(q) ||
       v.type?.toLowerCase().includes(q))
    );
  };

  const setCurrency = (currency) => {
    localStorage.setItem('velocity_currency', currency);
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const setStationAvailability = (stationId, availability) => {
    localStorage.setItem(`station_avail_${stationId}`, availability);
    dispatch({ type: 'SET_STATION_AVAILABILITY', payload: { stationId, availability } });
  };

  const recordFuelReceived = (stationId, liters) => {
    dispatch({ type: 'SET_STATION_FUEL', payload: { stationId, fuelReceived: liters } });
    dispatch({ type: 'SET_STATION_AVAILABILITY', payload: { stationId, availability: FUEL_AVAILABILITY.FULL } });
  };

  const recordFuelSold = (stationId, litersSold, driverId) => {
    dispatch({ type: 'UPDATE_STATION_FUEL_SOLD', payload: { stationId, litersSold } });
    
    const station = state.stations.find(s => s.id === stationId);
    const fuelReceived = station?.fuelReceived || 0;
    const fuelSold = (station?.fuelSold || 0) + litersSold;
    const fuelRemaining = fuelReceived - fuelSold;
    const percentageLeft = fuelReceived > 0 ? (fuelRemaining / fuelReceived) * 100 : 0;
    
    let newAvailability = FUEL_AVAILABILITY.FULL;
    if (percentageLeft <= 0) newAvailability = FUEL_AVAILABILITY.NONE;
    else if (percentageLeft <= 25) newAvailability = FUEL_AVAILABILITY.LOW;
    else if (percentageLeft <= 50) newAvailability = FUEL_AVAILABILITY.HALF;
    
    dispatch({ type: 'SET_STATION_AVAILABILITY', payload: { stationId, availability: newAvailability } });
    
    if (percentageLeft <= 75 && percentageLeft > 50) {
      sendNotification(stationId, `Station ${stationId} fuel at ${percentageLeft.toFixed(0)}% capacity`);
    }
    
    if (percentageLeft < 0 || fuelSold > fuelReceived * 1.1) {
      dispatch({ 
        type: 'ADD_INSPECTION_ALERT', 
        payload: { 
          stationId, 
          type: 'SUSPICIOUS',
          message: `Potential black market: Sold ${fuelSold}L but received only ${fuelReceived}L`,
          timestamp: new Date().toISOString()
        } 
      });
    }
    
    return { fuelRemaining, percentageLeft };
  };

  const checkStationCapacity = (stationId) => {
    const station = state.stations.find(s => s.id === stationId);
    const fuelReceived = station?.fuelReceived || 0;
    const fuelSold = station?.fuelSold || 0;
    const fuelRemaining = fuelReceived - fuelSold;
    const activeAppointments = state.appointments.filter(a => 
      a.stationId === stationId && a.status === 'confirmed'
    ).length;
    
    const estimatedFuelNeeded = activeAppointments * 150;
    const canAcceptMore = fuelRemaining > estimatedFuelNeeded + 500;
    
    return { fuelRemaining, fuelReceived, fuelSold, activeAppointments, canAcceptMore };
  };

  const getStationAvailability = (stationId) => {
    return state.stationAvailability[stationId] || FUEL_AVAILABILITY.FULL;
  };

  const getBestStation = (vehicleType, association) => {
    const availableStations = state.stations.filter(s => {
      const avail = state.stationAvailability[s.id] || FUEL_AVAILABILITY.FULL;
      const capacity = checkStationCapacity(s.id);
      return avail.value > 0 && capacity.canAcceptMore;
    });
    
    if (availableStations.length === 0) return null;
    
    const counts = {};
    availableStations.forEach(s => {
      const apptCount = state.appointments.filter(a => 
        a.stationId === s.id && a.status === 'confirmed'
      ).length;
      counts[s.id] = apptCount;
    });
    
    return availableStations.sort((a, b) => counts[a.id] - counts[b.id])[0];
  };

  const createAppointment = async (data) => {
    const bestStation = getBestStation(data.vehicleType, data.association);
    
    if (!bestStation) {
      return { success: false, error: 'No stations available with sufficient fuel' };
    }
    
    const existingAppointments = state.appointments.filter(a => 
      a.stationId === bestStation.id && a.status === 'confirmed'
    );
    
    const batchTime = Math.floor(existingAppointments.length / 5);
    const batchMinute = (existingAppointments.length % 5) * 10;
    const scheduledDate = new Date();
    scheduledDate.setHours(6 + batchTime, batchMinute, 0, 0);
    
    const appointment = {
      id: `APT${Date.now()}`,
      ...data,
      stationId: bestStation.id,
      stationName: bestStation.name,
      scheduledTime: scheduledDate.toISOString(),
      batchNumber: batchTime + 1,
      positionInBatch: (existingAppointments.length % 5) + 1,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notificationSent: false,
    };
    
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: {
      id: `NOTIF${Date.now()}`,
      type: 'appointment_confirmed',
      appointmentId: appointment.id,
      driverId: data.driverId,
      scheduledTime: appointment.scheduledTime,
      message: `Appointment confirmed! Station: ${bestStation.name}, Batch ${appointment.batchNumber}, Position ${appointment.positionInBatch}. Arrive at your scheduled time.`,
      sentAt: new Date().toISOString(),
      channel: 'sms',
    }});
    
    return { success: true, appointment, bestStation };
  };

  const getAppointments = (driverId) => {
    return state.appointments.filter(a => a.driverId === driverId);
  };

  const hasPermission = (permission) => {
    if (!state.user) return false;
    const required = REQUIRED_CLEARANCE[permission] || [];
    const userLevel = ACCESS_LEVELS[state.user.role?.toUpperCase()]?.level || 0;
    return required.includes(userLevel);
  };

  const logAudit = (action, details) => {
    const log = {
      id: `AUDIT${Date.now()}`,
      action,
      userId: state.user?.id,
      userRole: state.user?.role,
      details,
      ipAddress: 'client-side',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    dispatch({ type: 'ADD_AUDIT_LOG', payload: log });
    
    if (['DISPENSE_FUEL', 'RECORD_FUEL', 'MODIFY_SETTINGS'].includes(action)) {
      dispatch({ 
        type: 'ADD_PENDING_REVIEW', 
        payload: { 
          ...log, 
          reviewDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
        } 
      });
    }
    
    return log;
  };

  const getPendingReviews = () => {
    return state.pendingReviews.filter(r => {
      const deadline = new Date(r.reviewDeadline);
      return deadline > new Date();
    });
  };

  const approveReview = (reviewId) => {
    dispatch({ type: 'APPROVE_REVIEW', payload: { id: reviewId } });
    logAudit('APPROVE_REVIEW', { reviewId });
  };

  const rejectReview = (reviewId) => {
    dispatch({ type: 'REJECT_REVIEW', payload: { id: reviewId } });
    logAudit('REJECT_REVIEW', { reviewId });
  };

  const logError = (errorData) => {
    const error = {
      id: `ERR${Date.now()}`,
      ...errorData,
      userId: state.user?.id,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'LOG_ERROR', payload: error });
    return error;
  };

  const flagAccount = (accountId, reason) => {
    const flag = {
      id: accountId,
      reason,
      flaggedBy: state.user?.id,
      flaggedAt: new Date().toISOString(),
      banned: false,
    };
    dispatch({ type: 'FLAG_ACCOUNT', payload: flag });
    logAudit('FLAG_ACCOUNT', { accountId, reason });
  };

  const unflagAccount = (accountId) => {
    dispatch({ type: 'UNFLAG_ACCOUNT', payload: { id: accountId } });
    logAudit('UNFLAG_ACCOUNT', { accountId });
  };

  const banAccount = (accountId) => {
    dispatch({ type: 'BAN_ACCOUNT', payload: { id: accountId } });
    logAudit('BAN_ACCOUNT', { accountId });
  };

  const isAccountFlagged = (accountId) => {
    return state.flaggedAccounts.some(a => a.id === accountId);
  };

  const calculateWeeklySpend = (fleetOwnerId) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return state.transactions
      .filter(t => 
        t.vehicle?.owner_id === fleetOwnerId && 
        new Date(t.timestamp) > oneWeekAgo
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const calculateMonthlySpend = (fleetOwnerId) => {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return state.transactions
      .filter(t => 
        t.vehicle?.owner_id === fleetOwnerId && 
        new Date(t.timestamp) > oneMonthAgo
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const REVENUE_SHARE = {
  PER_LITER: {
    totalFeePercent: 3,
    breakdown: {
      municipality: 1.5,
      developer: 0.8,
      stationWorker: 0.2,
      stationAdmin: 0.5,
    },
  },
  SUBSCRIPTION: {
    developer: 45,
    ethiotelecom: 25,
    municipality: 30,
  },
};

const calculateRevenueShare = (liters, pricePerLiter) => {
  const baseAmount = liters * pricePerLiter;
  const totalFee = (baseAmount * REVENUE_SHARE.PER_LITER.totalFeePercent) / 100;
  
  return {
    baseAmount,
    totalFee,
    distribution: {
      municipality: (baseAmount * REVENUE_SHARE.PER_LITER.breakdown.municipality) / 100,
      developer: (baseAmount * REVENUE_SHARE.PER_LITER.breakdown.developer) / 100,
      stationWorker: (baseAmount * REVENUE_SHARE.PER_LITER.breakdown.stationWorker) / 100,
      stationAdmin: (baseAmount * REVENUE_SHARE.PER_LITER.breakdown.stationAdmin) / 100,
    },
  };
};

const calculateSubscriptionRevenue = (subscriptionFee) => {
  return {
    developer: (subscriptionFee * REVENUE_SHARE.SUBSCRIPTION.developer) / 100,
    ethiotelecom: (subscriptionFee * REVENUE_SHARE.SUBSCRIPTION.ethiotelecom) / 100,
    municipality: (subscriptionFee * REVENUE_SHARE.SUBSCRIPTION.municipality) / 100,
  };
};

  const setPage = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    localStorage.setItem('velocity_currentPage', page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const sendNotification = async (driverId, message) => {
    const notification = {
      id: `NOTIF${Date.now()}`,
      type: 'general',
      driverId,
      message,
      sentAt: new Date().toISOString(),
      channel: 'sms',
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    return { success: true, notification };
  };

  const generateRefuelQuotaQR = (vehicleId, appointmentId, quota, expiresInMinutes = 60) => {
    const id = `QR${Date.now()}${Math.random().toString(36).substr(2, 4)}`;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
    const qrCode = {
      id,
      vehicleId,
      appointmentId: appointmentId || null,
      quota,
      used: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt,
      token: `REFUEL-${vehicleId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`,
    };
    dispatch({ type: 'ADD_REFUEL_QR', payload: qrCode });
    localStorage.setItem(`refuel_qr_${id}`, JSON.stringify(qrCode));
    return qrCode;
  };

  const addToQueue = (stationId, vehicleId, driverId, vehiclePlate, vehicleType) => {
    const existing = state.queue.filter(q => q.stationId === stationId && q.status === 'waiting');
    const entry = {
      id: `Q${Date.now()}`,
      stationId,
      vehicleId,
      driverId,
      vehiclePlate,
      vehicleType,
      position: existing.length + 1,
      status: 'waiting',
      joinedAt: new Date().toISOString(),
      estimatedWaitMinutes: existing.length * 8,
    };
    dispatch({ type: 'ADD_QUEUE_ENTRY', payload: entry });
    return entry;
  };

  const updateQueueEntry = (id, updates) => {
    dispatch({ type: 'UPDATE_QUEUE_ENTRY', payload: { id, ...updates } });
  };

  const getStationQueue = (stationId) => {
    return state.queue.filter(q => q.stationId === stationId).sort((a, b) => a.position - b.position);
  };

  const detectFuelTheft = (transaction) => {
    const alerts = [];
    const recentTransactions = state.transactions.filter(t =>
      t.vehicle_id === transaction.vehicle_id &&
      new Date(t.timestamp) > new Date(Date.now() - 30 * 60 * 1000)
    );

    if (recentTransactions.length >= 2) {
      const lastFill = recentTransactions[0];
      const minutesBetween = (new Date(transaction.timestamp) - new Date(lastFill.timestamp)) / 60000;
      if (minutesBetween < THEFT_PATTERNS.RAPID_FILL.thresholdMinutes) {
        alerts.push({
          id: `THEFT${Date.now()}`,
          pattern: 'rapid_fill',
          severity: 'high',
          message: `Vehicle ${transaction.vehicle_id} refilled ${recentTransactions.length + 1}x in ${minutesBetween.toFixed(0)}min`,
          transactionId: transaction.id,
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (transaction.qr_code) {
      const multiStation = state.transactions.find(t =>
        t.qr_code === transaction.qr_code &&
        t.station_id !== transaction.station_id &&
        new Date(t.timestamp) > new Date(Date.now() - THEFT_PATTERNS.SAME_QR_MULTI.thresholdMinutes * 60 * 1000)
      );
      if (multiStation) {
        alerts.push({
          id: `THEFT${Date.now() + 1}`,
          pattern: 'same_qr_multi',
          severity: 'high',
          message: `QR ${transaction.qr_code} used at ${transaction.station_id} and ${multiStation.station_id} within minutes`,
          transactionId: transaction.id,
          timestamp: new Date().toISOString(),
        });
      }
    }

    alerts.forEach(alert => dispatch({ type: 'ADD_THEFT_ALERT', payload: alert }));
    return alerts;
  };

  const checkDailyLimit = (vehicleId, liters) => {
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return { allowed: true };
    const sub = state.subscriptions.find(s => s.vehicleId === vehicleId);
    if (!sub) return { allowed: true };
    const tier = SUBSCRIPTION_TIERS[sub.tier];
    if (!tier) return { allowed: true };
    const todayFilled = state.transactions
      .filter(t => t.vehicle_id === vehicleId && new Date(t.timestamp).toDateString() === new Date().toDateString())
      .reduce((sum, t) => sum + (t.liters || 0), 0);
    const wouldExceed = todayFilled + liters > tier.dailyLimit;
    return { allowed: !wouldExceed, todayFilled, dailyLimit: tier.dailyLimit, tier: tier.label };
  };

  const upgradeSubscription = (vehicleId, tierId) => {
    const existing = state.subscriptions.find(s => s.vehicleId === vehicleId);
    if (existing) {
      const updated = { ...existing, tier: tierId, updatedAt: new Date().toISOString() };
      dispatch({ type: 'ADD_SUBSCRIPTION', payload: updated });
    } else {
      const sub = {
        id: `SUB${Date.now()}`,
        vehicleId,
        tier: tierId,
        startDate: new Date().toISOString(),
        status: 'active',
      };
      dispatch({ type: 'ADD_SUBSCRIPTION', payload: sub });
    }
    return { success: true };
  };

  const getSubscription = (vehicleId) => {
    return state.subscriptions.find(s => s.vehicleId === vehicleId) || null;
  };

  const createIncident = (reportedBy, reportedByRole, type, description, stationId) => {
    const incident = {
      id: `INC${Date.now()}`,
      reportedBy,
      reportedByRole,
      type,
      description,
      stationId,
      status: 'open',
      currentLevel: ESCALATION_LEVELS.WORKER.level,
      currentLevelRole: ESCALATION_LEVELS.WORKER.role,
      history: [{
        action: 'created',
        by: reportedBy,
        role: reportedByRole,
        timestamp: new Date().toISOString(),
      }],
      resolution: null,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INCIDENT', payload: incident });
    sendNotification(reportedBy, `Incident #${incident.id} created: ${type} — ${description}`);
    return incident;
  };

  const escalateIncident = (incidentId) => {
    const incident = state.incidents.find(i => i.id === incidentId);
    if (!incident) return { success: false };
    const nextLevel = incident.currentLevel + 1;
    const levelConfig = Object.values(ESCALATION_LEVELS).find(l => l.level === nextLevel);
    if (!levelConfig) {
      return resolveIncident(incidentId, 'Auto-escalated to max level — resolved at developer level');
    }
    const updated = {
      ...incident,
      currentLevel: nextLevel,
      currentLevelRole: levelConfig.role,
      history: [...incident.history, {
        action: 'escalated',
        by: state.user?.id,
        role: state.user?.role,
        toLevel: levelConfig.label,
        timestamp: new Date().toISOString(),
      }],
    };
    dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
    sendNotification(incident.reportedBy, `Incident #${incidentId} escalated to ${levelConfig.label}`);
    return { success: true, incident: updated };
  };

  const resolveIncident = (incidentId, resolution) => {
    const updated = {
      id: incidentId,
      status: 'resolved',
      resolution,
      history: [{
        action: 'resolved',
        by: state.user?.id,
        role: state.user?.role,
        timestamp: new Date().toISOString(),
      }],
    };
    dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
    sendNotification(state.user?.id, `Incident #${incidentId} has been resolved: ${resolution}`);
    return { success: true };
  };

  const addOfflineTransaction = (transaction) => {
    const entry = {
      id: `OFF${Date.now()}`,
      ...transaction,
      queuedAt: new Date().toISOString(),
      synced: false,
    };
    dispatch({ type: 'ADD_PENDING_OFFLINE', payload: entry });
    const existing = JSON.parse(localStorage.getItem('velocity_offline_queue') || '[]');
    localStorage.setItem('velocity_offline_queue', JSON.stringify([...existing, entry]));
    return entry;
  };

  const syncOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem('velocity_offline_queue') || '[]');
    const unsynced = queue.filter(q => !q.synced);
    if (unsynced.length === 0) return { synced: 0 };
    let synced = 0;
    for (const entry of unsynced) {
      try {
        await createTransaction(entry);
        entry.synced = true;
        synced++;
      } catch (e) {
        break;
      }
    }
    localStorage.setItem('velocity_offline_queue', JSON.stringify(queue));
    dispatch({ type: 'CLEAR_PENDING_OFFLINE' });
    return { synced };
  };

  const sendSMS = (to, message) => {
    const sms = {
      id: `SMS${Date.now()}`,
      to,
      message,
      sentAt: new Date().toISOString(),
      channel: 'sms',
      status: 'sent',
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: {
      id: sms.id,
      type: 'info',
      text: `SMS to ${to}: ${message}`,
      time: 'just now',
      read: false,
    }});
    return sms;
  };

  const speakPrompt = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'am' ? 'am-ET' : lang === 'or' ? 'om-ET' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    dispatch({ type: 'ADD_VOICE_LOG', payload: { id: `VOICE${Date.now()}`, text, lang, spokenAt: new Date().toISOString() } });
  };

  return (
    <VeloCityContext.Provider value={{ 
      state, 
      dispatch, 
      loading,
      setPage,
      login,
      register,
      loginAs,
      logout,
      registerVehicle,
      createTransaction,
      convertCurrency,
      formatCurrency,
      generateQRCode,
      isDriverLocked,
      getLockRemainingTime,
      lockDriver,
      unlockDriver,
      searchVehicles,
      CURRENCY_RATES,
      FUEL_AVAILABILITY,
      ASSOCIATIONS,
      currency: state.currency,
      setCurrency,
      setStationAvailability,
      getStationAvailability,
      getBestStation,
      createAppointment,
      getAppointments,
      calculateWeeklySpend,
      calculateMonthlySpend,
      sendNotification,
      recordFuelReceived,
      recordFuelSold,
      checkStationCapacity,
      REVENUE_SHARE,
      calculateRevenueShare,
      calculateSubscriptionRevenue,
      hasPermission,
      ACCESS_LEVELS,
      PERMISSIONS,
      logAudit,
      getPendingReviews,
      approveReview,
      rejectReview,
      logError,
      flagAccount,
      unflagAccount,
      banAccount,
      isAccountFlagged,
      SUBSCRIPTION_TIERS,
      ESCALATION_LEVELS,
      THEFT_PATTERNS,
      generateRefuelQuotaQR,
      addToQueue,
      updateQueueEntry,
      getStationQueue,
      detectFuelTheft,
      checkDailyLimit,
      upgradeSubscription,
      getSubscription,
      createIncident,
      escalateIncident,
      resolveIncident,
      addOfflineTransaction,
      syncOfflineQueue,
      sendSMS,
      speakPrompt,
    }}>
      {children}
    </VeloCityContext.Provider>
  );
}

export function useVeloCity() {
  const context = useContext(VeloCityContext);
  if (!context) {
    throw new Error('useVeloCity must be used within a VeloCityProvider');
  }
  return context;
}