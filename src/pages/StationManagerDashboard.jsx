import { useState, useEffect } from 'react';
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
  const { state, setStationAvailability, getStationAvailability, FUEL_AVAILABILITY, recordFuelReceived, checkStationCapacity, getStationStats, getRecentTransactions } = useVeloCity();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentAvailability, setCurrentAvailability] = useState('FULL');
  const [fuelReceivedLiters, setFuelReceivedLiters] = useState('');
  const [stats, setStats] = useState([
    { label: 'Transactions', value: 0, icon: Activity, color: '#2EC4B6', change: '+0%' },
    { label: 'Liters Dispensed', value: 0, icon: Fuel, color: '#3A86FF', change: '+0%' },
    { label: 'Revenue', value: 0, icon: Wallet, color: '#FFD166', change: '+0%' },
    { label: 'Active Workers', value: 0, icon: Users, color: '#06D6A0', change: '0' },
  ]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  const stationId = state.user?.station_id || 'ST001';
  const stationFuelInfo = checkStationCapacity(stationId);

  useEffect(() => {
    const fetchData = async () => {
      const token = state.token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const sid = state.user?.station_id;
      if (sid) {
        const statsResult = await getStationStats(sid);
        if (statsResult.success) {
          setStats(statsResult.stats);
        }
        
        const txResult = await getRecentTransactions(sid, 10);
        if (txResult.success) {
          setRecentTransactions(txResult.transactions);
        }
        
        try {
          const stationRes = await fetch(`http://localhost:8000/api/stations/${sid}`, { headers });
          const stationData = await stationRes.json();
          if (stationData) {
            setWorkers(stationData.workers || []);
            if (stationData.inventory) {
              const inv = stationData.inventory;
              const defaultInv = [
                { type: 'Unleaded', capacity: inv, used: inv * 0.4, color: '#2EC4B6' },
              ];
              setInventory(Array.isArray(inv) ? inv : defaultInv);
            }
          }
        } catch (e) {
          console.log('Backend unavailable, using demo data');
          setWorkers([
            { id: 'W1', name: 'John Worker', shift: 'Morning', transactions: 42, status: 'active' },
            { id: 'W2', name: 'Jane Helper', shift: 'Evening', transactions: 38, status: 'active' },
          ]);
          setInventory([
            { type: 'Unleaded', capacity: 15000, used: 6200, color: '#2EC4B6' },
            { type: 'Diesel', capacity: 12000, used: 4800, color: '#3A86FF' },
          ]);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user?.station_id, state.token]);
  
  const station = state.stations.find(s => s.id === stationId) || { name: 'Your Station', id: stationId };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'inventory', label: 'Inventory', icon: Fuel },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="station-manager-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Station Dashboard</h1>
          <p>{station.name} • Station ID: {stationId}</p>
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
                <button className="btn-primary">
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
        
        {activeTab === 'drivers' && (
          <motion.div 
            className="drivers-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Registered Drivers</h3>
                <button className="btn-primary">
                  <Plus size={18} />
                  Add Driver
                </button>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Driver ID</th>
                      <th>Name</th>
                      <th>Vehicle Type</th>
                      <th>Plate Number</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DRV001</td>
                      <td>Bekele Altaye</td>
                      <td><span className="vehicle-type bajaj">Bajaj</span></td>
                      <td>ABC-1234</td>
                      <td>+251 911 111 111</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td><button className="btn-icon">View</button></td>
                    </tr>
                    <tr>
                      <td>DRV002</td>
                      <td>Tadesse Almaz</td>
                      <td><span className="vehicle-type auto">Automobile</span></td>
                      <td>DEF-5678</td>
                      <td>+251 911 222 222</td>
                      <td><span className="status-badge pending">Pending</span></td>
                      <td><button className="btn-icon">Approve</button></td>
                    </tr>
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
                <button className="btn-primary">
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
                    <input type="text" defaultValue={station.name} />
                  </div>
                  <div className="setting-item">
                    <label>Station ID</label>
                    <input type="text" defaultValue={stationId} disabled />
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
                          recordFuelReceived(stationId, parseInt(fuelReceivedLiters));
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
                          setStationAvailability(stationId, avail);
                        }}
                      >
                        <span className="avail-dot" style={{ background: avail.color }}></span>
                        <span className="avail-label">{avail.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}