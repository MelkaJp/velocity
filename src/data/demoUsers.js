// Demo Login Accounts for Testing All Portals

export const demoUsers = [
  {
    username: 'driver1',
    password: 'driver123',
    role: 'driver',
    name: 'Demo Driver',
    email: 'driver@velocity.com',
    portal: '/app'
  },
  {
    username: 'fleet1',
    password: 'fleet123',
    role: 'fleet_owner',
    name: 'Demo Fleet Owner',
    email: 'fleet@velocity.com',
    portal: '/app'
  },
  {
    username: 'stationmgr',
    password: 'station123',
    role: 'station_manager',
    name: 'Demo Station Manager',
    email: 'station@velocity.com',
    portal: '/app'
  },
  {
    username: 'stationworker',
    password: 'worker123',
    role: 'station_worker',
    name: 'Demo Station Worker',
    email: 'worker@velocity.com',
    portal: '/app'
  },
  {
    username: 'municipality',
    password: 'muni123',
    role: 'municipality_admin',
    name: 'Demo Municipality Admin',
    email: 'muni@velocity.com',
    portal: '/app'
  },
  {
    username: 'developer',
    password: 'dev123',
    role: 'developer_admin',
    name: 'Demo Developer Admin',
    email: 'dev@velocity.com',
    portal: '/app'
  }
];

// Get user by username
export const getDemoUser = (username) => {
  return demoUsers.find(u => u.username === username);
};

// Validate demo credentials
export const validateDemoUser = (username, password) => {
  const user = demoUsers.find(u => u.username === username && u.password === password);
  return user ? { success: true, user } : { success: false, error: 'Invalid credentials' };
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleMap = {
    driver: 'Driver',
    fleet_owner: 'Fleet Owner',
    station_manager: 'Station Manager',
    station_worker: 'Station Worker',
    municipality_admin: 'Municipality Admin',
    developer_admin: 'Developer Admin'
  };
  return roleMap[role] || role;
};

// Demo accounts summary for UI
export const demoAccountsSummary = [
  { role: 'driver', username: 'driver1', password: 'driver123', label: 'Driver' },
  { role: 'fleet_owner', username: 'fleet1', password: 'fleet123', label: 'Fleet Owner' },
  { role: 'station_manager', username: 'stationmgr', password: 'station123', label: 'Station Manager' },
  { role: 'station_worker', username: 'stationworker', password: 'worker123', label: 'Station Worker' },
  { role: 'municipality_admin', username: 'municipality', password: 'muni123', label: 'Municipality Admin' },
  { role: 'developer_admin', username: 'developer', password: 'dev123', label: 'Developer Admin' }
];

export default demoUsers;