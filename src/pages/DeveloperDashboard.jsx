import { useState, useEffect } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  MapPin, 
  Car, 
  Wallet, 
  Activity,
  Settings,
  Database,
  Shield,
  Globe,
  Truck,
  Bike,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import './DeveloperDashboard.css';

export default function DeveloperDashboard() {
  const { state } = useVeloCity();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '32,458', change: '+12.5%', color: '#06D6A0', icon: Users },
    { label: 'Municipalities', value: '14', change: '+2', color: '#118AB2', icon: Building2 },
    { label: 'Fuel Stations', value: '156', change: '+8', color: '#FF6B35', icon: MapPin },
    { label: 'Registered Vehicles', value: '28,947', change: '+892', color: '#EF476F', icon: Car },
    { label: 'Total Revenue', value: '$2.4M', change: '+18.2%', color: '#FFD166', icon: Wallet },
    { label: 'Transactions', value: '156,234', change: '+2,342', color: '#073B4C', icon: Activity },
  ]);
  const [municipalities, setMunicipalities] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = state.token;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const healthRes = await fetch('http://localhost:8000/', { headers });
        const healthData = await healthRes.json();
        if (healthData) {
          setSystemHealth([
            { name: 'API Server', status: 'healthy', uptime: '99.9%', latency: '12ms' },
            { name: 'Database', status: 'healthy', uptime: '99.8%', latency: '5ms' },
            { name: 'Auth Service', status: 'healthy', uptime: '99.9%', latency: '8ms' },
          ]);
        }
        
        const txRes = await fetch('http://localhost:8000/api/transactions', { headers });
        const txData = await txRes.json();
        if (Array.isArray(txData)) {
          setRecentTransactions(txData.slice(0, 10));
        }
      } catch (error) {
        console.log('Using demo mode - backend unavailable');
      }
    };
    fetchData();
  }, [state.token]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'admins', label: 'Admin Management', icon: Shield },
    { id: 'municipalities', label: 'Municipalities', icon: Building2 },
    { id: 'stations', label: 'All Stations', icon: MapPin },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'system', label: 'System Health', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="developer-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Developer Dashboard</h1>
          <p>System-wide analytics and administration</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-value">{state.stats?.totalVehicles || '28,947'}</span>
            <span className="stat-label">Vehicles</span>
          </div>
          <div className="stat-badge">
            <span className="stat-value">{state.stats?.totalStations || '156'}</span>
            <span className="stat-label">Stations</span>
          </div>
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
            className="overview-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
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
                  <button className="btn-link">View All</button>
                </div>
                <div className="panel-content">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle</th>
                        <th>Station</th>
                        <th>Liters</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map(tx => (
                        <tr key={tx.id}>
                          <td>{tx.id}</td>
                          <td>{tx.vehicle}</td>
                          <td>{tx.station}</td>
                          <td>{tx.liters}L</td>
                          <td>FRW {tx.amount.toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${tx.status}`}>
                              {tx.status === 'verified' && <CheckCircle size={14} />}
                              {tx.status === 'pending' && <Clock size={14} />}
                              {tx.status === 'flagged' && <AlertTriangle size={14} />}
                              {tx.status}
                            </span>
                          </td>
                          <td>{tx.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Municipality Performance</h3>
                </div>
                <div className="panel-content">
                  {municipalities.slice(0, 4).map(muni => (
                    <div key={muni.id} className="muni-card">
                      <div className="muni-info">
                        <span className="muni-name">{muni.name}</span>
                        <span className="muni-stats">{muni.stations} stations • {muni.vehicles.toLocaleString()} vehicles</span>
                      </div>
                      <div className="muni-revenue">
                        <span>FRW {(muni.revenue / 1000000).toFixed(2)}M</span>
                        <span className="muni-status" data-status={muni.status}>{muni.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
)}
        
        {activeTab === 'admins' && (
          <motion.div 
            className="admins-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Admin Accounts</h3>
                <button className="btn-primary">Add New Admin</button>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Admin ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Municipality</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ADM001</td>
                      <td>Alemayehu Tadesse</td>
                      <td><span className="role-badge developer">Developer Admin</span></td>
                      <td>System Wide</td>
                      <td>alemayehu@velocity.et</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>2024-01-15</td>
                      <td><button className="btn-icon">Edit</button></td>
                    </tr>
                    <tr>
                      <td>ADM002</td>
                      <td>Tadesse Bekele</td>
                      <td><span className="role-badge municipality">Municipality Admin</span></td>
                      <td>Addis Ababa</td>
                      <td>tadesse@addisababa.et</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>2024-02-20</td>
                      <td><button className="btn-icon">Edit</button></td>
                    </tr>
                    <tr>
                      <td>ADM003</td>
                      <td>Yohannes Demeke</td>
                      <td><span className="role-badge municipality">Municipality Admin</span></td>
                      <td>Dire Dawa</td>
                      <td>yohannes@direet.et</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>2024-03-10</td>
                      <td><button className="btn-icon">Edit</button></td>
                    </tr>
                    <tr>
                      <td>ADM004</td>
                      <td>Meron Tesfaye</td>
                      <td><span className="role-badge station">Station Manager</span></td>
                      <td>Bole Station</td>
                      <td>meron@bole.et</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>2024-04-05</td>
                      <td><button className="btn-icon">Edit</button></td>
                    </tr>
                    <tr>
                      <td>ADM005</td>
                      <td>Solomon Kebede</td>
                      <td><span className="role-badge station">Station Manager</span></td>
                      <td>Mexico Station</td>
                      <td>solomon@mexico.et</td>
                      <td><span className="status-badge suspended">Suspended</span></td>
                      <td>2024-04-12</td>
                      <td><button className="btn-icon">Edit</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="panel">
              <div className="panel-header">
                <h3>Pending Admin Approvals</h3>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Requested By</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>REQ001</td>
                      <td>Abebe Negash</td>
                      <td><span className="role-badge station">Station Manager</span></td>
                      <td>ADM002</td>
                      <td>2024-05-10</td>
                      <td>
                        <button className="btn-icon approve"><CheckCircle size={16} /></button>
                        <button className="btn-icon reject"><XCircle size={16} /></button>
                      </td>
                    </tr>
                    <tr>
                      <td>REQ002</td>
                      <td>Fatuma Ahmed</td>
                      <td><span className="role-badge municipality">Municipality Admin</span></td>
                      <td>ADM001</td>
                      <td>2024-05-11</td>
                      <td>
                        <button className="btn-icon approve"><CheckCircle size={16} /></button>
                        <button className="btn-icon reject"><XCircle size={16} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'municipalities' && (
          <motion.div 
            className="municipalities-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>All Municipalities</h3>
                <button className="btn-primary">Add Municipality</button>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Stations</th>
                      <th>Vehicles</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {municipalities.map(muni => (
                      <tr key={muni.id}>
                        <td>MUN{String(muni.id).padStart(3, '0')}</td>
                        <td>{muni.name}</td>
                        <td>{muni.stations}</td>
                        <td>{muni.vehicles.toLocaleString()}</td>
                        <td>FRW {muni.revenue.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${muni.status}`}>{muni.status}</span>
                        </td>
                        <td>
                          <button className="btn-icon">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stations' && (
          <motion.div 
            className="stations-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>All Fuel Stations</h3>
                <div className="header-filters">
                  <input type="text" placeholder="Search stations..." className="search-input" />
                  <button className="btn-primary">Add Station</button>
                </div>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Station ID</th>
                      <th>Name</th>
                      <th>Municipality</th>
                      <th>Manager</th>
                      <th>Daily Volume</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.stations?.slice(0, 10).map(station => (
                      <tr key={station.id}>
                        <td>{station.id}</td>
                        <td>{station.name}</td>
                        <td>{station.municipality || 'Kigali'}</td>
                        <td>{station.manager || 'N/A'}</td>
                        <td>{station.dailyVolume || 'N/A'}L</td>
                        <td>
                          <span className="status-badge active">active</span>
                        </td>
                        <td>
                          <button className="btn-icon">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'system' && (
          <motion.div 
            className="system-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>System Health</h3>
              </div>
              <div className="panel-content">
                {systemHealth.map((service, index) => (
                  <div key={index} className="service-card">
                    <div className="service-info">
                      <span className="service-name">{service.name}</span>
                      <span className="service-uptime">Uptime: {service.uptime}</span>
                    </div>
                    <div className="service-metrics">
                      <span className={`status-badge ${service.status}`}>
                        {service.status === 'healthy' && <CheckCircle size={14} />}
                        {service.status === 'warning' && <AlertTriangle size={14} />}
                        {service.status}
                      </span>
                      <span className="service-latency">{service.latency}</span>
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
                <h3>System Settings</h3>
              </div>
              <div className="panel-content">
                <div className="setting-group">
                  <h4>Global Configuration</h4>
                  <div className="setting-item">
                    <label>System Currency</label>
                    <select defaultValue="RWF">
                      <option value="RWF">Rwandan Franc (RWF)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Integrity Fee (%)</label>
                    <input type="number" defaultValue="2" min="0" max="10" step="0.5" />
                  </div>
                  <div className="setting-item">
                    <label>Revenue Split (Station %)</label>
                    <input type="number" defaultValue="70" min="0" max="100" />
                  </div>
                </div>
                <div className="setting-group">
                  <h4>QR Code Settings</h4>
                  <div className="setting-item">
                    <label>Anti-Peel Enabled</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-item">
                    <label>Green QR Max (Liters)</label>
                    <input type="number" defaultValue="50" />
                  </div>
                  <div className="setting-item">
                    <label>Blue QR Max (Liters)</label>
                    <input type="number" defaultValue="150" />
                  </div>
                  <div className="setting-item">
                    <label>Black QR Max (Liters)</label>
                    <input type="number" defaultValue="500" />
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