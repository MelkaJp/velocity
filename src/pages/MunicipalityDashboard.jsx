import { useState, useEffect } from 'react';
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
  const { state, CURRENCY_RATES, formatCurrency, convertCurrency, getStationStats } = useVeloCity();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const inspectionAlerts = state.inspectionAlerts || [];
  const [dateRange, setDateRange] = useState('7d');
  const [stats, setStats] = useState([
    { label: 'Stations', value: '0', icon: MapPin, color: '#2EC4B6', change: '+0' },
    { label: 'Vehicles', value: '0', icon: Car, color: '#3A86FF', change: '+0' },
    { label: 'Revenue', value: '$0', icon: Wallet, color: '#FFD166', change: '+0%' },
    { label: 'Alerts', value: '0', icon: Shield, color: '#EF476F', change: '0' },
  ]);
  const [stations, setStations] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const maxAmount = dailyRevenue.length > 0 ? Math.max(...dailyRevenue.map(d => d.amount)) : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const token = state.token;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const stationsRes = await fetch('http://localhost:8000/api/stations', { headers });
        const stationsData = await stationsRes.json();
        if (Array.isArray(stationsData)) {
          setStations(stationsData);
        }
        
        const txRes = await fetch('http://localhost:8000/api/transactions', { headers });
        const txData = await txRes.json();
        if (Array.isArray(txData)) {
          setRecentTransactions(txData.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to fetch municipality data:', error);
      }
    };
    fetchData();
  }, [state.token]);

  useEffect(() => {
    const demoData = [
      { day: 'Mon', amount: 8500000 },
      { day: 'Tue', amount: 7200000 },
      { day: 'Wed', amount: 9100000 },
      { day: 'Thu', amount: 6800000 },
      { day: 'Fri', amount: 10500000 },
      { day: 'Sat', amount: 11200000 },
      { day: 'Sun', amount: 8900000 },
    ];
    setDailyRevenue(demoData);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'stations', label: 'Stations', icon: MapPin },
    { id: 'stationAdmins', label: 'Station Admins', icon: Users },
    { id: 'driverApprovals', label: 'Driver Approvals', icon: Car },
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
        
        {activeTab === 'stationAdmins' && (
          <motion.div 
            className="station-admins-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Station Administrators</h3>
                <button className="btn-primary">Add Station Admin</button>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Admin ID</th>
                      <th>Name</th>
                      <th>Station</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SA001</td>
                      <td>Meron Tadesse</td>
                      <td>Bole Station</td>
                      <td>meron@bole.et</td>
                      <td>+251 912 345 678</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td><button className="btn-icon">Revoke</button></td>
                    </tr>
                    <tr>
                      <td>SA002</td>
                      <td>Dereje Engda</td>
                      <td>Mexico Station</td>
                      <td>dereje@mexico.et</td>
                      <td>+251 912 345 679</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td><button className="btn-icon">Revoke</button></td>
                    </tr>
                    <tr>
                      <td>SA003</td>
                      <td>Hirut Wolde</td>
                      <td>Kazanchis Station</td>
                      <td>hirut@kazanchis.et</td>
                      <td>+251 912 345 680</td>
                      <td><span className="status-badge suspended">Suspended</span></td>
                      <td><button className="btn-icon">Restore</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'driverApprovals' && (
          <motion.div 
            className="driver-approvals-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel">
              <div className="panel-header">
                <h3>Pending Driver Registrations</h3>
                <span className="pending-count">5 pending</span>
              </div>
              <div className="panel-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Driver Name</th>
                      <th>Vehicle Type</th>
                      <th>Plate Number</th>
                      <th>Phone</th>
                      <th>Requested By</th>
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
                      <td>Bole Station (SA001)</td>
                      <td>
                        <button className="btn-icon approve"><CheckCircle size={16} /></button>
                        <button className="btn-icon reject"><AlertCircle size={16} /></button>
                      </td>
                    </tr>
                    <tr>
                      <td>DRV002</td>
                      <td>Tadesse Almaz</td>
                      <td><span className="vehicle-type auto">Automobile</span></td>
                      <td>DEF-5678</td>
                      <td>+251 911 222 222</td>
                      <td>Mexico Station (SA002)</td>
                      <td>
                        <button className="btn-icon approve"><CheckCircle size={16} /></button>
                        <button className="btn-icon reject"><AlertCircle size={16} /></button>
                      </td>
                    </tr>
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