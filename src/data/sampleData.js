export const vehicleTypes = {
  BAJAJ: { 
    id: 'bajaj', 
    label: 'Bajaj / Small Vehicle', 
    color: '#2EC4B6', 
    maxTank: 50,
    description: 'Limited to small-volume, high-frequency refills'
  },
  AUTOMOBILE: { 
    id: 'automobile', 
    label: 'Automobile / Car', 
    color: '#3A86FF', 
    maxTank: 150,
    description: 'Medium-volume, mid-frequency refills'
  },
  TRUCK: { 
    id: 'truck', 
    label: 'Heavy Truck', 
    color: '#212529', 
    maxTank: 500,
    description: 'High-volume, requires Route Verification'
  }
};

export const stations = [
  { id: 'ST001', name: 'Central Station', location: 'Downtown', inventory: 15000, latitude: 40.7128, longitude: -74.0060 },
  { id: 'ST002', name: 'North Express', location: 'North District', inventory: 12000, latitude: 40.7589, longitude: -73.9851 },
  { id: 'ST003', name: 'East Point', location: 'East Industrial', inventory: 18000, latitude: 40.7484, longitude: -73.9857 },
  { id: 'ST004', name: 'South Gate', location: 'South Highway', inventory: 10000, latitude: 40.6892, longitude: -74.0445 },
  { id: 'ST005', name: 'West Terminal', location: 'West End', inventory: 14000, latitude: 40.7282, longitude: -73.7949 },
];

export const sampleVehicles = [
  { id: 'V001', type: 'bajaj', plate: 'ABC1234', tank_capacity: 35, qr_code: 'VELO-BAJ-ABC1234-A1B2C3', status: 'active', wallet: { balance: 1500, currency: 'USD' }, owner_name: 'John Doe', phone: '+1234567890' },
  { id: 'V002', type: 'automobile', plate: 'XYZ5678', tank_capacity: 60, qr_code: 'VELO-AUT-XYZ5678-D4E5F6', status: 'active', wallet: { balance: 3200, currency: 'USD' }, owner_name: 'Jane Smith', phone: '+1234567891' },
  { id: 'V003', type: 'truck', plate: 'TRK9001', tank_capacity: 300, qr_code: 'VELO-TRK-TRK9001-G7H8I9', status: 'active', wallet: { balance: 8500, currency: 'USD' }, owner_name: 'Mike Truck', phone: '+1234567892' },
  { id: 'V004', type: 'bajaj', plate: 'DEF4321', tank_capacity: 30, qr_code: 'VELO-BAJ-DEF4321-J1K2L3', status: 'active', wallet: { balance: 800, currency: 'USD' }, owner_name: 'Bob Bajaj', phone: '+1234567893' },
  { id: 'V005', type: 'automobile', plate: 'GHI8765', tank_capacity: 55, qr_code: 'VELO-AUT-GHI8765-M4N5O6', status: 'blocked', wallet: { balance: 2100, currency: 'USD' }, owner_name: 'Alice Car', phone: '+1234567894' },
];

export const sampleTransactions = [
  { id: 'TX001', vehicle_id: 'V001', vehicle_plate: 'ABC1234', vehicle_type: 'bajaj', station_id: 'ST001', station_name: 'Central Station', liters: 25, amount: 1250, timestamp: '2026-04-13T08:30:00', status: 'verified', gps_match: true },
  { id: 'TX002', vehicle_id: 'V002', vehicle_plate: 'XYZ5678', vehicle_type: 'automobile', station_id: 'ST002', station_name: 'North Express', liters: 45, amount: 2700, timestamp: '2026-04-13T09:15:00', status: 'verified', gps_match: true },
  { id: 'TX003', vehicle_id: 'V003', vehicle_plate: 'TRK9001', vehicle_type: 'truck', station_id: 'ST001', station_name: 'Central Station', liters: 280, amount: 16800, timestamp: '2026-04-13T10:00:00', status: 'verified', gps_match: true },
  { id: 'TX004', vehicle_id: 'V001', vehicle_plate: 'ABC1234', vehicle_type: 'bajaj', station_id: 'ST003', station_name: 'East Point', liters: 30, amount: 1500, timestamp: '2026-04-13T11:45:00', status: 'flagged', gps_match: true, anomaly: 'Capacity exceeded' },
  { id: 'TX005', vehicle_id: 'V004', vehicle_plate: 'DEF4321', vehicle_type: 'bajaj', station_id: 'ST004', station_name: 'South Gate', liters: 20, amount: 1000, timestamp: '2026-04-12T16:30:00', status: 'verified', gps_match: true },
  { id: 'TX006', vehicle_id: 'V005', vehicle_plate: 'GHI8765', vehicle_type: 'automobile', station_id: 'ST005', station_name: 'West Terminal', liters: 50, amount: 3000, timestamp: '2026-04-12T14:00:00', status: 'verified', gps_match: false, anomaly: 'GPS mismatch' },
];

export const dailyStats = {
  vehiclesRegistered: 2847,
  stationsActive: 42,
  litersTracked: 156789,
  revenueGenerated: 9407340,
  anomaliesDetected: 12,
  ghostGap: 1.8,
};

export const timeSlots = [
  { id: 'TS1', start: '06:00', end: '08:00', label: 'Morning (6-8 AM)' },
  { id: 'TS2', start: '08:00', end: '10:00', label: 'Peak (8-10 AM)' },
  { id: 'TS3', start: '10:00', end: '12:00', label: 'Midday (10-12 PM)' },
  { id: 'TS4', start: '12:00', end: '14:00', label: 'Afternoon (12-2 PM)' },
  { id: 'TS5', start: '14:00', end: '16:00', label: 'Late Afternoon (2-4 PM)' },
  { id: 'TS6', start: '16:00', end: '18:00', label: 'Evening (4-6 PM)' },
  { id: 'TS7', start: '18:00', end: '20:00', label: 'Night (6-8 PM)' },
];

export const generateQRCode = (type, plate) => {
  const prefix = type === 'bajaj' ? 'BAJ' : type === 'automobile' ? 'AUT' : 'TRK';
  const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  return `VELO-${prefix}-${cleanPlate}-${Date.now().toString(36).toUpperCase()}`;
};

export const getVehicleTypeColor = (type) => {
  return vehicleTypes[type?.toUpperCase()]?.color || '#2EC4B6';
};