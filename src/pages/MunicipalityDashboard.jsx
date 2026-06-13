import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Wallet, 
  Activity,
  Users,
  Car,
  Truck,
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  Shield
} from 'lucide-react';
import './MunicipalityDashboard.css';

export default function MunicipalityDashboard() {
  const { state, CURRENCY_RATES, formatCurrency, convertCurrency } = useVeloCity();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const inspectionAlerts = state.inspectionAlerts || [];
  const [dateRange, setDateRange] = useState('7d');

  const stats = [
    { icon: MapPin, label: 'Active Stations', value: '42', change: '+3', color: '#06D6A0' },
    { icon: Car, label: 'Registered Vehicles', value: '8,450', change: '+234', color: '#3A86FF' },
    { icon: Wallet, label: 'Revenue (Today)', value: formatCurrency(2400000), valueUSD: `$${(2400000 / CURRENCY_RATES.ETB).toFixed(0)}`, change: '+12%', color: '#FF6B35', dual: true },
    { icon: AlertTriangle, label: 'Inspection Alerts', value: String(inspectionAlerts.length), change: inspectionAlerts.length > 0 ? 'Action Needed' : 'None', color: '#EF476F' },
    { icon: Wallet, label: 'Revenue (Today)', value: 'FRW 2.4M', change: '+12%', color: '#FF6B35' },
    { icon: Activity, label: 'Transactions', value: '1,234', change: '+8%', color: '#EF476F' },
  ];

  const stations = [
    { id: 'ST001', name: 'Shell Kigali Central', volume: 4500, status: 'active', workers: 4 },
    { id: 'ST002', name: 'Total Gas Kigali', volume: 3800, status: 'active', workers: 3 },
    { id: 'ST003', name: 'BP Station Kigali', volume: 3200, status: 'active', workers: 3 },
    { id: 'ST004', name: 'Shell Remera', volume: 2900, status: 'active', workers: 2 },
    { id: 'ST005', name: 'Total Gas Gisimenti', volume: 2100, status: 'maintenance', workers: 2 },
    { id: 'ST006', name: 'Shell Kimironko', volume: 1800, status: 'active', workers: 2 },
  ];

  const recentTransactions = [
    { id: 'TX001', plate: 'RAB 123D', station: 'Shell Kigali', liters: 45, amount: 2250, status: 'verified', time: '2 min ago' },
    { id: 'TX002', plate: 'RAB 456E', station: 'Total Gas', liters: 120, amount: 6000, status: 'verified', time: '5 min ago' },
    { id: 'TX003', plate: 'RAB 789F', station: 'BP Station', liters: 35, amount: 1750, status: 'pending', time: '8 min ago' },
    { id: 'TX004', plate: 'RAB 321G', station: 'Shell Remera', liters: 90, amount: 4500, status: 'verified', time: '12 min ago' },
    { id: 'TX005', plate: 'RAB 654H', station: 'Shell Kigali', liters: 60, amount: 3000, status: 'flagged', time: '15 min ago' },
  ];

  const dailyRevenue = [
    { day: 'Mon', amount: 1850000 },
    { day: 'Tue', amount: 2100000 },
    { day: 'Wed', amount: 1950000 },
    { day: 'Thu', amount: 2300000 },
    { day: 'Fri', amount: 2450000 },
    { day: 'Sat', amount: 2600000 },
    { day: 'Sun', amount: 2400000 },
  ];

  const maxAmount = Math.max(...dailyRevenue.map(d => d.amount));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'stations', label: 'Stations', icon: MapPin },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'alerts', label: 'Inspection Alerts', icon: Shield, badge: inspectionAlerts.length },
  ];

  return (
    <div className="municipality-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Municipality Dashboard</h1>
          <p>City of Kigali Administration</p>
        </div>
        <div className="header-actions">
          <div className="date-filter">
            <button 
              className={`date-btn ${dateRange === '7d' ? 'active' : ''}`}
              onClick={() => setDateRange('7d')}
            >7 Days</button>
            <button 
              className={`date-btn ${dateRange === '30d' ? 'active' : ''}`}
              onClick={() => setDateRange('30d')}
            >30 Days</button>
            <button 
              className={`date-btn ${dateRange === '90d' ? 'active' : ''}`}
              onClick={() => setDateRange('90d')}
            >90 Days</button>
          </div>
          <button className="btn-export">
            <Download size={18} />
            Export
          </button>
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
              <div className="panel revenue-panel">
                <div className="panel-header">
                  <h3>Daily Revenue Trend</h3>
                  <span className="trend-badge positive">
                    <TrendingUp size={14} />
                    +12.5%
                  </span>
                </div>
                <div className="panel-content">
                  <div className="bar-chart">
                    {dailyRevenue.map((day, index) => (
                      <div key={index} className="bar-item">
                        <div 
                          className="bar" 
                          style={{ height: `${(day.amount / maxAmount) * 100}%` }}
                        >
                          <span className="bar-value">{(day.amount / 1000000).toFixed(1)}M</span>
                        </div>
                        <span className="bar-label">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                        <th>Station</th>
                        <th>Liters</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.slice(0, 5).map(tx => (
                        <tr key={tx.id}>
                          <td>{tx.plate}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="panel station-overview">
              <div className="panel-header">
                <h3>Station Performance</h3>
                <button className="btn-link" onClick={() => setActiveTab('stations')}>Manage</button>
              </div>
              <div className="panel-content">
                <div className="station-grid">
                  {stations.slice(0, 6).map(station => (
                    <div key={station.id} className="station-card">
                      <div className="station-header">
                        <span className="station-name">{station.name}</span>
                        <span className={`status-badge ${station.status}`}>{station.status}</span>
                      </div>
                      <div className="station-stats">
                        <div className="station-stat">
                          <span className="stat-value">{station.volume.toLocaleString()}</span>
                          <span className="stat-label">Liters Today</span>
                        </div>
                        <div className="station-stat">
                          <span className="stat-value">{station.workers}</span>
                          <span className="stat-label">Workers</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                <h3>All Stations</h3>
                <button className="btn-primary">Add Station</button>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Daily Volume</th>
                      <th>Workers</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stations.map(station => (
                      <tr key={station.id}>
                        <td>{station.id}</td>
                        <td>{station.name}</td>
                        <td>{station.volume.toLocaleString()}L</td>
                        <td>{station.workers}</td>
                        <td>
                          <span className={`status-badge ${station.status}`}>{station.status}</span>
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
                    <option value="">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Plate</th>
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
                        <td>{tx.plate}</td>
                        <td>{tx.station}</td>
                        <td>{tx.liters}L</td>
                        <td>FRW {tx.amount.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${tx.status}`}>
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
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div 
            className="reports-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Reports</h3>
              </div>
              <div className="panel-content">
                <div className="reports-grid">
                  <div className="report-card">
                    <BarChart3 size={32} />
                    <h4>Revenue Summary</h4>
                    <p>Daily and monthly revenue breakdown by station</p>
                    <button className="btn-secondary">Generate</button>
                  </div>
                  <div className="report-card">
                    <Car size={32} />
                    <h4>Vehicle Registration</h4>
                    <p>New vehicles registered in the period</p>
                    <button className="btn-secondary">Generate</button>
                  </div>
                  <div className="report-card">
                    <Truck size={32} />
                    <h4>Vehicle Type Analysis</h4>
                    <p>Distribution of vehicle types (Green/Blue/Black QR)</p>
                    <button className="btn-secondary">Generate</button>
                  </div>
                  <div className="report-card">
                    <Wallet size={32} />
                    <h4>Settlement Report</h4>
                    <p>70/30 revenue split calculations</p>
<button className="btn-secondary">Generate</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div 
            className="alerts-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Inspection Alerts</h3>
                {inspectionAlerts.length > 0 && (
                  <button className="btn-primary">Dispatch Inspector</button>
                )}
              </div>
              <div className="panel-content">
                {inspectionAlerts.length === 0 ? (
                  <div className="no-alerts">
                    <CheckCircle size={48} />
                    <p>No suspicious activity detected</p>
                  </div>
                ) : (
                  <div className="alerts-list">
                    {inspectionAlerts.map((alert, index) => (
                      <div key={index} className="alert-card">
                        <AlertCircle size={20} />
                        <div className="alert-info">
                          <span className="alert-station">{alert.stationId}</span>
                          <span className="alert-message">{alert.message}</span>
                          <span className="alert-time">{alert.timestamp}</span>
                        </div>
                        <button className="btn-secondary">Inspect</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}