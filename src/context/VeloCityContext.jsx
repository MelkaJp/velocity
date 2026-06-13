import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  SUPER_ADMIN: { 
    level: 100, 
    name: 'Super Admin', 
    canReview: true, 
    canBan: true, 
    canAudit: true, 
    canManageAll: true,
    canManageAllAdmins: true,
    canApproveAdminRegistrations: true,
    canAddMunicipalities: true,
    canRevokeAnyAccount: true,
    canViewAllActivities: true,
    canManageStations: true,
    canApproveDriverSignups: true,
  },
  DEVELOPER_ADMIN: { 
    level: 90, 
    name: 'Developer Admin', 
    canReview: true, 
    canBan: true, 
    canAudit: true, 
    canManageAll: true,
    canManageAllAdmins: true,
    canApproveAdminRegistrations: true,
    canAddMunicipalities: true,
    canRevokeAnyAccount: true,
    canViewAllActivities: true,
    canManageStations: true,
    canApproveDriverSignups: true,
  },
  MUNICIPALITY_ADMIN: { 
    level: 80, 
    name: 'Municipality Admin', 
    canReview: true, 
    canBan: true, 
    canAudit: true, 
    canManageStations: true,
    canAddStationAdmins: true,
    canRevokeStationAdmin: true,
    canApproveDriverSignups: true,
    canViewStationActivities: true,
    canViewDriverSignups: true,
  },
  STATION_MANAGER: { 
    level: 60, 
    name: 'Station Manager', 
    canReview: false, 
    canBan: false, 
    canAudit: false, 
    canManageStation: true,
    canAddWorkers: true,
    canViewDrivers: true,
    canVerifyDrivers: true,
    canDispenseFuel: true,
  },
  STATION_WORKER: { 
    level: 40, 
    name: 'Station Worker', 
    canReview: false, 
    canBan: false, 
    canAudit: false, 
    canDispense: true,
    canViewDrivers: true,
    canScanDriverQR: true,
    canVerifyDriverBeforePump: true,
  },
  FLEET_OWNER: { 
    level: 30, 
    name: 'Fleet Owner', 
    canReview: false, 
    canBan: false, 
    canAudit: false, 
    canManageFleet: true,
  },
  DRIVER: { 
    level: 10, 
    name: 'Driver', 
    canReview: false, 
    canBan: false, 
    canAudit: false, 
    canBookFuel: true,
  },
};

const PERMISSIONS = {
  VIEW_ALL_TRANSACTIONS: 'VIEW_ALL_TRANSACTIONS',
  MANAGE_STATIONS: 'MANAGE_STATIONS',
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_ALL_ADMINS: 'MANAGE_ALL_ADMINS',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  APPROVE_REVIEW: 'APPROVE_REVIEW',
  BAN_ACCOUNTS: 'BAN_ACCOUNTS',
  MODIFY_PRICING: 'MODIFY_PRICING',
  VIEW_FINANCIALS: 'VIEW_FINANCIALS',
  ADD_MUNICIPALITIES: 'ADD_MUNICIPALITIES',
  ADD_STATION_ADMINS: 'ADD_STATION_ADMINS',
  ADD_STATION_WORKERS: 'ADD_STATION_WORKERS',
  APPROVE_DRIVER_SIGNUPS: 'APPROVE_DRIVER_SIGNUPS',
  VIEW_ALL_ACTIVITIES: 'VIEW_ALL_ACTIVITIES',
  VIEW_STATION_ACTIVITIES: 'VIEW_STATION_ACTIVITIES',
  VERIFY_DRIVERS: 'VERIFY_DRIVERS',
  SCAN_DRIVER_QR: 'SCAN_DRIVER_QR',
  DISPENSE_FUEL: 'DISPENSE_FUEL',
  GENERATE_QR_CODE: 'GENERATE_QR_CODE',
};

const REQUIRED_CLEARANCE = {
  [PERMISSIONS.VIEW_ALL_TRANSACTIONS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.MANAGE_STATIONS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.MANAGE_USERS]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.MANAGE_ALL_ADMINS]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VIEW_AUDIT_LOGS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.APPROVE_REVIEW]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.BAN_ACCOUNTS]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VIEW_FINANCIALS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.ADD_MUNICIPALITIES]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.ADD_STATION_ADMINS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.ADD_STATION_WORKERS]: [ACCESS_LEVELS.STATION_MANAGER.level, ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.APPROVE_DRIVER_SIGNUPS]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VIEW_ALL_ACTIVITIES]: [ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VIEW_STATION_ACTIVITIES]: [ACCESS_LEVELS.MUNICIPALITY_ADMIN.level, ACCESS_LEVELS.STATION_MANAGER.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
  [PERMISSIONS.VERIFY_DRIVERS]: [ACCESS_LEVELS.STATION_MANAGER.level, ACCESS_LEVELS.STATION_WORKER.level],
  [PERMISSIONS.SCAN_DRIVER_QR]: [ACCESS_LEVELS.STATION_WORKER.level],
  [PERMISSIONS.DISPENSE_FUEL]: [ACCESS_LEVELS.STATION_WORKER.level, ACCESS_LEVELS.STATION_MANAGER.level],
  [PERMISSIONS.GENERATE_QR_CODE]: [ACCESS_LEVELS.STATION_MANAGER.level, ACCESS_LEVELS.STATION_WORKER.level, ACCESS_LEVELS.DEVELOPER_ADMIN.level, ACCESS_LEVELS.SUPER_ADMIN.level],
};

const FUEL_AVAILABILITY = {
  FULL: { value: 100, label: '100% Available', color: '#06D6A0' },
  HALF: { value: 50, label: '50% Available', color: '#FF6B35' },
  LOW: { value: 25, label: '25% Available', color: '#EF476F' },
  NONE: { value: 0, label: 'Not Available', color: '#8D99AE' },
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
  stats: {},
  currentPortal: 'landing',
  apiStatus: 'offline',
  driverLocks: {},
  currency: 'ETB',
  appointments: [],
  notifications: [],
  stationAvailability: {},
  auditLogs: [],
  pendingReviews: [],
  errorLogs: [],
  flaggedAccounts: [],
};

function veloCityReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      return { ...initialState, apiStatus: state.apiStatus, currency: state.currency };
    case 'SET_USER':
      return { ...state, user: action.payload };
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
      
      if (savedUser && savedToken) {
        dispatch({ type: 'LOGIN', payload: { user: JSON.parse(savedUser), token: savedToken } });
      }
      
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;
        
        const statsRes = await fetch('http://localhost:8000/api/public/stats', { headers }).catch(() => null);
        
        const statsData = statsRes ? await statsRes.json() : null;
        if (statsData && statsData.total_users !== undefined) {
          dispatch({ type: 'SET_STATS', payload: statsData });
          dispatch({ type: 'SET_API_STATUS', payload: 'online' });
        } else {
          dispatch({ type: 'SET_API_STATUS', payload: 'offline' });
        }
      } catch (e) {
        console.log('Cannot connect to backend server');
        dispatch({ type: 'SET_API_STATUS', payload: 'offline' });
      }
      
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
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
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
      return { success: false, error: 'Cannot connect to server. Please check your connection and try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Please check your connection.' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return { success: data.success || true, message: data.message || 'Password reset email sent' };
    } catch (error) {
      return { success: true, message: 'If an account exists with this email, a reset link will be sent' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await response.json();
      return { success: data.success, message: data.message || 'Password reset successful' };
    } catch (error) {
      return { success: false, error: 'Failed to reset password' };
    }
  };

  const logout = () => {
    localStorage.removeItem('velocity_user');
    localStorage.removeItem('velocity_token');
    dispatch({ type: 'LOGOUT' });
  };

  const registerVehicle = async (vehicleData, ownerId, token = null) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:8000/api/vehicles/register', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          type: vehicleData.type,
          plate: vehicleData.plate,
          tank_capacity: vehicleData.tank_capacity || vehicleData.tankCapacity,
          owner_name: vehicleData.owner_name,
          phone: vehicleData.phone,
          qr_code: vehicleData.qr_code || '',
          owner_user_id: ownerId || state.user?.id 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'ADD_VEHICLE', payload: data.vehicle });
        return { success: true, vehicle: data.vehicle };
      }
      return { success: false, error: data.detail || 'Failed to register vehicle' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Please check your connection.' };
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
      
      const response = await fetch('http://localhost:8000/api/transactions/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(transactionData),
      });
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'ADD_TRANSACTION', payload: data.transaction });
        return { success: true, transaction: data.transaction };
      }
      return { success: false, error: data.detail || 'Failed to create transaction' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Please check your connection.' };
    }
  };

  const lookupVehicle = async (qrCode) => {
    if (!qrCode) return { success: false, error: 'No QR code provided' };
    try {
      const response = await fetch(`http://localhost:8000/api/vehicles/qr/${encodeURIComponent(qrCode)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const vehicle = await response.json();
      if (vehicle && vehicle.id) {
        return { success: true, vehicle };
      }
      return { success: false, error: vehicle.detail || 'Vehicle not found' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Please check your connection.' };
    }
  };

  const getRecentTransactions = async (stationId, limit = 10) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
      
      const url = `http://localhost:8000/api/transactions${stationId ? `?station_id=${stationId}` : ''}`;
      const response = await fetch(url, { headers });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const sliced = data.slice(0, limit);
        return { success: true, transactions: sliced };
      }
      return { success: false, error: 'Failed to fetch transactions' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Please check your connection.' };
    }
  };

  const getStationStats = async (stationId) => {
    try {
      const response = await fetch('http://localhost:8000/api/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (data && typeof data === 'object') {
        return {
          success: true,
          stats: [
            { label: 'Today', value: data.total_transactions || 0 },
            { label: 'Liters', value: 0 },
            { label: 'Revenue', value: 0 },
          ]
        };
      }
      return { success: false, error: 'Failed to fetch stats' };
    } catch (error) {
      return { success: false, error: 'Cannot connect to server. Please check your connection.' };
    }
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

  const canManageAllAdmins = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.MANAGE_ALL_ADMINS);
  };

  const canAddMunicipalities = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.ADD_MUNICIPALITIES);
  };

  const canAddStationAdmins = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.ADD_STATION_ADMINS);
  };

  const canAddStationWorkers = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.ADD_STATION_WORKERS);
  };

  const canApproveDriverSignups = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.APPROVE_DRIVER_SIGNUPS);
  };

  const canViewAllActivities = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.VIEW_ALL_ACTIVITIES);
  };

  const canViewStationActivities = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.VIEW_STATION_ACTIVITIES);
  };

  const canRevokeAccount = (accountId) => {
    if (!state.user) return false;
    const targetUser = state.flaggedAccounts.find(a => a.id === accountId);
    if (!targetUser) return hasPermission(PERMISSIONS.BAN_ACCOUNTS);
    if (targetUser.role === 'SUPER_ADMIN' || targetUser.role === 'DEVELOPER_ADMIN') {
      return ACCESS_LEVELS[state.user.role?.toUpperCase()]?.level === 100;
    }
    return hasPermission(PERMISSIONS.BAN_ACCOUNTS);
  };

  const canVerifyDriver = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.VERIFY_DRIVERS);
  };

  const canScanDriverQR = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.SCAN_DRIVER_QR);
  };

  const canDispenseFuel = () => {
    if (!state.user) return false;
    return hasPermission(PERMISSIONS.DISPENSE_FUEL);
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

  return (
    <VeloCityContext.Provider value={{ 
      state, 
      dispatch, 
      loading,
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      registerVehicle,
      createTransaction,
      lookupVehicle,
      getRecentTransactions,
      getStationStats,
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
      canManageAllAdmins,
      canAddMunicipalities,
      canAddStationAdmins,
      canAddStationWorkers,
      canApproveDriverSignups,
      canViewAllActivities,
      canViewStationActivities,
      canRevokeAccount,
      canVerifyDriver,
      canScanDriverQR,
      canDispenseFuel,
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