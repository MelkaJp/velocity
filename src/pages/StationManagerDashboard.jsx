import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Wallet, 
  Activity,
  Car,
  Truck,
  Bike,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Fuel,
  Gauge
} from 'lucide-react';
import './StationManagerDashboard.css';

export default function StationManagerDashboard() {
  const { state, setStationAvailability, getStationAvailability, FUEL_AVAILABILITY, recordFuelReceived, checkStationCapacity } = useVeloCity();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentAvailability, setCurrentAvailability] = useState('FULL');
  const [fuelReceivedLiters, setFuelReceivedLiters] = useState('');
  
  const stationFuelInfo = checkStationCapacity('ST001');

  const stats = [
    { icon: Car, label: 'Total Transactions', value: '1,234', change: '+12%' },
    { icon: Fuel, label: 'Fuel Dispensed', value: '45,600L', change: '+8%' },
    { icon: Wallet, label: 'Revenue (Today)', value: 'FRW 2.4M', change: '+15%' },
    { icon: Users, label: 'Active Workers', value: '4', change: '0' },
  ];

  const workers = [
    { id: 'W001', name: 'John Mukama', shift: 'Morning', status: 'active', transactions: 45 },
    { id: 'W002', name: 'Marie Uwase', shift: 'Morning', status: 'active', transactions: 38 },
    { id: 'W003', name: 'Claude Nkusi', shift: 'Evening', status: 'off', transactions: 0 },
    { id: 'W004', name: 'Sarah Ingabire', shift: 'Evening', status: 'active', transactions: 22 },
  ];

  const inventory = [
    { type: 'Green (Bajaj)', capacity: 2000, used: 1450, color: '#2EC4B6' },
    { type: 'Blue (Auto)', capacity: 5000, used: 3200, color: '#3A86FF' },
    { type: 'Black (Truck)', capacity: 8000, used: 2100, color: '#8D99AE' },
  ];

  const recentTransactions = [
    { id: 'TX001', plate: 'RAB 123D', type: 'bajaj', liters: 45, amount: 2250, worker: 'John M.', time: '2 min ago' },
    { id: 'TX002', plate: 'RAB 456E', type: 'auto', liters: 120, amount: 6000, worker: 'Marie U.', time: '5 min ago' },
    { id: 'TX003', plate: 'RAB 789F', type: 'truck', liters: 350, amount: 17500, worker: 'John M.', time: '8 min ago' },
    { id: 'TX004', plate: 'RAB 321G', type: 'auto', liters: 90, amount: 4500, worker: 'Sarah I.', time: '12 min ago' },
    { id: 'TX005', plate: 'RAB 654H', type: 'bajaj', liters: 35, amount: 1750, worker: 'Marie U.', time: '15 min ago' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Fuel },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="station-manager-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Station Dashboard</h1>
          <p>Shell Kigali Central • Station ID: ST001</p>
        </div>
        <div className="header-status">
          <span className="status-indicator active">
            <span className="status-dot"></span>
            Station Active
          </span>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <motion.div 
            className="overview-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <span className="stat-change positive">{stat.change}</span>
                </div>
              ))}
            </div>

            <div className="dashboard-panels">
              <div className="panel">
                <div className="panel-header">
                  <h3>Recent Transactions</h3>
                  <button className="btn-link" onClick={() => setActiveTab('transactions')}>View All</button>
                </div>
                <div className="panel-content">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Plate</th>
                        <th>Type</th>
                        <th>Liters</th>
                        <th>Amount</th>
                        <th>Worker</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.slice(0, 5).map(tx => (
                        <tr key={tx.id}>
                          <td>{tx.plate}</td>
                          <td>
                            <span className={`vehicle-type ${tx.type}`}>
                              {tx.type === 'bajaj' && <Bike size={14} />}
                              {tx.type === 'auto' && <Car size={14} />}
                              {tx.type === 'truck' && <Truck size={14} />}
                            </span>
                          </td>
                          <td>{tx.liters}L</td>
                          <td>FRW {tx.amount.toLocaleString()}</td>
                          <td>{tx.worker}</td>
                          <td>{tx.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Inventory Levels</h3>
                  <button className="btn-link" onClick={() => setActiveTab('inventory')}>Manage</button>
                </div>
                <div className="panel-content">
                  {inventory.map((inv, index) => (
                    <div key={index} className="inventory-item">
                      <div className="inventory-header">
                        <span className="inventory-type">{inv.type}</span>
                        <span className="inventory-percent">{Math.round((inv.used / inv.capacity) * 100)}%</span>
                      </div>
                      <div className="inventory-bar">
                        <div 
                          className="inventory-fill" 
                          style={{ 
                            width: `${(inv.used / inv.capacity) * 100}%`,
                            background: inv.color
                          }}
                        ></div>
                      </div>
                      <span className="inventory-text">{inv.used.toLocaleString()} / {inv.capacity.toLocaleString()}L</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Worker Status</h3>
                <button className="btn-link" onClick={() => setActiveTab('workers')}>Manage</button>
              </div>
              <div className="panel-content">
                <div className="workers-grid">
                  {workers.map(worker => (
                    <div key={worker.id} className="worker-card">
                      <div className="worker-avatar">
                        <span>{worker.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="worker-info">
                        <span className="worker-name">{worker.name}</span>
                        <span className="worker-shift">{worker.shift} Shift</span>
                      </div>
                      <span className={`status-badge ${worker.status}`}>
                        {worker.status === 'active' ? 'Active' : 'Off'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div 
            className="transactions-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>All Transactions</h3>
                <div className="header-filters">
                  <input type="text" placeholder="Search by plate..." className="search-input" />
                  <select className="filter-select">
                    <option value="">All Types</option>
                    <option value="bajaj">Bajaj</option>
                    <option value="auto">Automobile</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Plate</th>
                      <th>Type</th>
                      <th>Liters</th>
                      <th>Amount</th>
                      <th>Worker</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map(tx => (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{tx.plate}</td>
                        <td>
                          <span className={`vehicle-type ${tx.type}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td>{tx.liters}L</td>
                        <td>FRW {tx.amount.toLocaleString()}</td>
                        <td>{tx.worker}</td>
                        <td><span className="status-badge verified">verified</span></td>
                        <td>{tx.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'workers' && (
          <motion.div 
            className="workers-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Station Workers</h3>
                <button className="btn-primary" onClick={() => alert('Worker registration form would open here.')}>
                  <Plus size={18} />
                  Add Worker
                </button>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Shift</th>
                      <th>Transactions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(worker => (
                      <tr key={worker.id}>
                        <td>{worker.id}</td>
                        <td>{worker.name}</td>
                        <td>{worker.shift}</td>
                        <td>{worker.transactions}</td>
                        <td>
                          <span className={`status-badge ${worker.status}`}>
                            {worker.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon"><Edit size={16} /></button>
                            <button className="btn-icon danger"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div 
            className="inventory-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Fuel Inventory</h3>
                <button className="btn-primary" onClick={() => {
                  const liters = prompt('Enter fuel liters received:');
                  if (liters) recordFuelReceived('ST001', parseInt(liters));
                }}>
                  <Plus size={18} />
                  Add Fuel
                </button>
              </div>
              <div className="panel-content">
                {inventory.map((inv, index) => (
                  <div key={index} className="inventory-card">
                    <div className="inventory-header">
                      <div className="inventory-type">
                        <Fuel size={24} />
                        <span>{inv.type}</span>
                      </div>
                      <span className={`status-badge ${(inv.used / inv.capacity) > 0.8 ? 'warning' : 'active'}`}>
                        {(inv.used / inv.capacity) > 0.8 ? 'Low Stock' : 'Normal'}
                      </span>
                    </div>
                    <div className="inventory-details">
                      <div className="inventory-stat">
                        <span className="stat-label">Capacity</span>
                        <span className="stat-value">{inv.capacity.toLocaleString()}L</span>
                      </div>
                      <div className="inventory-stat">
                        <span className="stat-label">Used</span>
                        <span className="stat-value">{inv.used.toLocaleString()}L</span>
                      </div>
                      <div className="inventory-stat">
                        <span className="stat-label">Remaining</span>
                        <span className="stat-value">{(inv.capacity - inv.used).toLocaleString()}L</span>
                      </div>
                    </div>
                    <div className="inventory-bar large">
                      <div 
                        className="inventory-fill" 
                        style={{ 
                          width: `${(inv.used / inv.capacity) * 100}%`,
                          background: inv.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            className="settings-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Station Settings</h3>
              </div>
              <div className="panel-content">
                <div className="setting-group">
                  <h4>Station Information</h4>
                  <div className="setting-item">
                    <label>Station Name</label>
                    <input type="text" defaultValue="Shell Kigali Central" />
                  </div>
                  <div className="setting-item">
                    <label>Station ID</label>
                    <input type="text" defaultValue="ST001" disabled />
                  </div>
                  <div className="setting-item">
                    <label>Municipality</label>
                    <select defaultValue="kigali">
                      <option value="kigali">City of Kigali</option>
                      <option value="rubavu">Rubavu District</option>
                    </select>
                  </div>
                </div>
                <div className="setting-group">
                  <h4>Operating Hours</h4>
                  <div className="setting-item">
                    <label>Opening Time</label>
                    <input type="time" defaultValue="06:00" />
                  </div>
                  <div className="setting-item">
                    <label>Closing Time</label>
                    <input type="time" defaultValue="22:00" />
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Fuel Received (Government Branch)</h4>
                  <div className="fuel-received-form">
                    <input 
                      type="number" 
                      placeholder="Enter liters received"
                      value={fuelReceivedLiters}
                      onChange={(e) => setFuelReceivedLiters(e.target.value)}
                    />
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        if (fuelReceivedLiters) {
                          recordFuelReceived('ST001', parseInt(fuelReceivedLiters));
                          setFuelReceivedLiters('');
                        }
                      }}
                    >
                      <Fuel size={18} />
                      Record Delivery
                    </button>
                  </div>
                  <div className="fuel-stats">
                    <div className="fuel-stat">
                      <span className="label">Fuel Received</span>
                      <span className="value">{stationFuelInfo.fuelReceived.toLocaleString()}L</span>
                    </div>
                    <div className="fuel-stat">
                      <span className="label">Fuel Sold</span>
                      <span className="value">{stationFuelInfo.fuelSold.toLocaleString()}L</span>
                    </div>
                    <div className="fuel-stat">
                      <span className="label">Remaining</span>
                      <span className="value remaining">{stationFuelInfo.fuelRemaining.toLocaleString()}L</span>
                    </div>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>Fuel Availability</h4>
                  <p className="setting-hint">Set fuel availability to direct drivers to the right station</p>
                  <div className="availability-selector">
                    {Object.entries(FUEL_AVAILABILITY).map(([key, avail]) => (
                      <button
                        key={key}
                        className={`avail-btn ${currentAvailability === key ? 'active' : ''}`}
                        style={{ 
                          borderColor: currentAvailability === key ? avail.color : 'transparent',
                          background: currentAvailability === key ? `${avail.color}20` : 'transparent'
                        }}
                        onClick={() => {
                          setCurrentAvailability(key);
                          setStationAvailability('ST001', avail);
                        }}
                      >
                        <span className="avail-dot" style={{ background: avail.color }}></span>
                        <span className="avail-label">{avail.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn-primary" onClick={() => alert('Settings saved successfully!')}>Save Changes</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}