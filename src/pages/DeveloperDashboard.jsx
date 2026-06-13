import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardHoverLift, scaleIn } from '../animations';
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
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: Users, label: 'Total Users', value: '12,847', change: '+234', color: '#3A86FF' },
    { icon: Building2, label: 'Municipalities', value: '42', change: '+3', color: '#06D6A0' },
    { icon: MapPin, label: 'Fuel Stations', value: '156', change: '+12', color: '#FF6B35' },
    { icon: Truck, label: 'Vehicles', value: '28,947', change: '+1,234', color: '#EF476F' },
    { icon: Wallet, label: 'Revenue (MTD)', value: '$9.4M', change: '+12%', color: '#2EC4B6' },
    { icon: Activity, label: 'Transactions', value: '156K', change: '+8%', color: '#8D99AE' },
  ];

  const municipalities = [
    { id: 1, name: 'City of Kigali', stations: 45, vehicles: 8450, revenue: 2450000, status: 'active' },
    { id: 2, name: 'Rubavu District', stations: 23, vehicles: 4200, revenue: 1280000, status: 'active' },
    { id: 3, name: 'Muhanga District', stations: 18, vehicles: 3100, revenue: 980000, status: 'active' },
    { id: 4, name: 'Nyagatare District', stations: 15, vehicles: 2800, revenue: 890000, status: 'pending' },
    { id: 5, name: ' Rusizi District', stations: 12, vehicles: 2100, revenue: 670000, status: 'active' },
  ];

  const systemHealth = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.98%', latency: '45ms' },
    { name: 'Database', status: 'healthy', uptime: '99.99%', latency: '12ms' },
    { name: 'Auth Service', status: 'healthy', uptime: '99.95%', latency: '23ms' },
    { name: 'QR Generator', status: 'warning', uptime: '98.5%', latency: '120ms' },
    { name: 'Payment Gateway', status: 'healthy', uptime: '99.9%', latency: '67ms' },
  ];

  const recentTransactions = [
    { id: 'TX001', vehicle: 'RAB 123D', station: 'Shell Kigali', liters: 45, amount: 2250, status: 'verified', time: '2 min ago' },
    { id: 'TX002', vehicle: 'RAB 456E', station: 'Total Gas', liters: 120, amount: 6000, status: 'verified', time: '5 min ago' },
    { id: 'TX003', vehicle: 'RAB 789F', station: 'BP Station', liters: 35, amount: 1750, status: 'pending', time: '8 min ago' },
    { id: 'TX004', vehicle: 'RAB 321G', station: 'Shell Kigali', liters: 90, amount: 4500, status: 'verified', time: '12 min ago' },
    { id: 'TX005', vehicle: 'RAB 654H', station: 'Total Gas', liters: 60, amount: 3000, status: 'flagged', time: '15 min ago' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
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
            <motion.div className="stats-grid" variants={staggerContainer(0.1)} initial="hidden" animate="visible">
              {stats.map((stat, index) => (
                <motion.div key={index} className="stat-card" variants={fadeUp} {...cardHoverLift}>
                  <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <span className="stat-change positive">{stat.change}</span>
                </motion.div>
              ))}
            </motion.div>

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

        {activeTab === 'municipalities' && (
          <motion.div 
            className="municipalities-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>All Municipalities</h3>
                <Button variant="primary" onClick={() => toast.info('Municipality registration form opened')}>Add Municipality</Button>
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
                  <Button variant="primary" onClick={() => toast.info('Station registration form opened')}>Add Station</Button>
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
                <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible">
                {systemHealth.map((service, index) => (
                  <motion.div key={index} className="service-card" variants={fadeUp} {...cardHoverLift}>
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
                  </motion.div>
                ))}
                </motion.div>
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
                <Button variant="primary" onClick={() => toast.success('System preferences saved successfully!')}>Save Changes</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}