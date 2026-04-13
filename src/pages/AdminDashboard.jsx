import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  MapPin,
  Calendar,
  Download,
  Filter,
  Eye,
  DollarSign,
  Fuel,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import './AdminDashboard.css';

const revenueData = [
  { date: 'Apr 7', revenue: 125000, municipal: 87500, developer: 37500 },
  { date: 'Apr 8', revenue: 142000, municipal: 99400, developer: 42600 },
  { date: 'Apr 9', revenue: 138000, municipal: 96600, developer: 41400 },
  { date: 'Apr 10', revenue: 156000, municipal: 109200, developer: 46800 },
  { date: 'Apr 11', revenue: 168000, municipal: 117600, developer: 50400 },
  { date: 'Apr 12', revenue: 172000, municipal: 120400, developer: 51600 },
  { date: 'Apr 13', revenue: 185000, municipal: 129500, developer: 55500 },
];

const stationPerformance = [
  { id: 'ST001', name: 'Central Station', liters: 12500, efficiency: 94, status: 'optimal' },
  { id: 'ST002', name: 'North Express', liters: 9800, efficiency: 88, status: 'good' },
  { id: 'ST003', name: 'East Point', liters: 14200, efficiency: 96, status: 'optimal' },
  { id: 'ST004', name: 'South Gate', liters: 7800, efficiency: 76, status: 'warning' },
  { id: 'ST005', name: 'West Terminal', liters: 11000, efficiency: 91, status: 'good' },
];

const anomalyLog = [
  { id: 'AN001', type: 'capacity_exceeded', vehicle: 'ABC-1234', station: 'ST003', details: 'Tank capacity 35L exceeded with 45L', timestamp: '2026-04-13T11:45:00', status: 'investigating' },
  { id: 'AN002', type: 'gps_mismatch', vehicle: 'GHI-8765', station: 'ST005', details: 'GPS location 200m from station', timestamp: '2026-04-12T14:00:00', status: 'resolved' },
  { id: 'AN003', type: 'ghost_gap', station: 'ST004', details: 'Ghost gap 3.2% exceeds 2% threshold', timestamp: '2026-04-12T23:59:00', status: 'flagged' },
];

export default function AdminDashboard() {
  const { state } = useVeloCity();
  const [activeTab, setActiveTab] = useState('overview');

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const municipalShare = Math.round(totalRevenue * 0.7);
  const developerShare = Math.round(totalRevenue * 0.3);
  const avgGhostGap = 1.8;
  const anomaliesActive = anomalyLog.filter(a => a.status !== 'resolved').length;

  return (
    <div className="admin-dashboard">
      <div className="portal-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Admin Dashboard</h1>
          <p>System oversight, audit trails, and revenue management</p>
        </motion.div>
      </div>

      <div className="portal-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={18} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          <DollarSign size={18} />
          Revenue
        </button>
        <button 
          className={`tab ${activeTab === 'stations' ? 'active' : ''}`}
          onClick={() => setActiveTab('stations')}
        >
          <MapPin size={18} />
          Stations
        </button>
        <button 
          className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Shield size={18} />
          Audit
        </button>
      </div>

      <div className="portal-content">
        {activeTab === 'overview' && (
          <motion.div 
            className="overview-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="stats-grid-admin">
              <div className="stat-card-admin primary">
                <div className="stat-icon-bg">
                  <DollarSign size={32} />
                </div>
                <div className="stat-details">
                  <span className="stat-value">${totalRevenue.toLocaleString()}</span>
                  <span className="stat-label">Total Revenue (7 days)</span>
                </div>
                <div className="stat-trend up">
                  <TrendingUp size={16} />
                  +12.5%
                </div>
              </div>

              <div className="stat-card-admin">
                <div className="stat-icon-bg green">
                  <Building2 size={32} />
                </div>
                <div className="stat-details">
                  <span className="stat-value">${municipalShare.toLocaleString()}</span>
                  <span className="stat-label">Municipality Share (70%)</span>
                </div>
              </div>

              <div className="stat-card-admin">
                <div className="stat-icon-bg blue">
                  <Activity size={32} />
                </div>
                <div className="stat-details">
                  <span className="stat-value">{state.stats.litersTracked.toLocaleString()}L</span>
                  <span className="stat-label">Total Liters Tracked</span>
                </div>
              </div>

              <div className="stat-card-admin warning">
                <div className="stat-icon-bg warning">
                  <AlertTriangle size={32} />
                </div>
                <div className="stat-details">
                  <span className="stat-value">{anomaliesActive}</span>
                  <span className="stat-label">Active Anomalies</span>
                </div>
                <div className="stat-trend down">
                  -3 from yesterday
                </div>
              </div>
            </div>

            <div className="main-chart">
              <div className="chart-header">
                <h3>Revenue Trend (Last 7 Days)</h3>
                <div className="chart-legend">
                  <span className="legend-item total">Total Revenue</span>
                  <span className="legend-item municipal">Municipality (70%)</span>
                </div>
              </div>
              <div className="chart-container-lg">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D4F65" />
                    <XAxis dataKey="date" stroke="#8D99AE" />
                    <YAxis stroke="#8D99AE" tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1B263B', 
                        border: '1px solid #3D4F65',
                        borderRadius: '8px'
                      }} 
                      formatter={(value) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#2EC4B6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="quick-stats-row">
              <div className="quick-stat">
                <Fuel size={20} />
                <div>
                  <span className="value">{state.stats.stationsActive}</span>
                  <span className="label">Active Stations</span>
                </div>
              </div>
              <div className="quick-stat">
                <CheckCircle size={20} />
                <div>
                  <span className="value">{state.stats.vehiclesRegistered}</span>
                  <span className="label">Registered Vehicles</span>
                </div>
              </div>
              <div className="quick-stat">
                <AlertTriangle size={20} />
                <div>
                  <span className="value">{avgGhostGap}%</span>
                  <span className="label">Avg Ghost Gap</span>
                </div>
              </div>
              <div className="quick-stat">
                <XCircle size={20} />
                <div>
                  <span className="value">98.2%</span>
                  <span className="label">System Integrity</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'revenue' && (
          <motion.div 
            className="revenue-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="revenue-split">
              <h3>70/30 Revenue Split</h3>
              <div className="split-visual">
                <div className="split-bar">
                  <div className="split-municipal" style={{ width: '70%' }}>
                    <span>70%</span>
                  </div>
                  <div className="split-developer" style={{ width: '30%' }}>
                    <span>30%</span>
                  </div>
                </div>
                <div className="split-labels">
                  <span>Municipality Road Fund</span>
                  <span>Developer System Upkeep</span>
                </div>
              </div>
              
              <div className="split-amounts">
                <div className="split-amount municipal">
                  <DollarSign size={24} />
                  <div>
                    <span className="amount">${municipalShare.toLocaleString()}</span>
                    <span className="desc">Municipality (7 days)</span>
                  </div>
                </div>
                <div className="split-amount developer">
                  <DollarSign size={24} />
                  <div>
                    <span className="amount">${developerShare.toLocaleString()}</span>
                    <span className="desc">Developer (7 days)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="revenue-breakdown">
              <h3>Daily Breakdown</h3>
              <div className="breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Revenue</th>
                      <th>Municipality (70%)</th>
                      <th>Developer (30%)</th>
                      <th>2% Integrity Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((day, index) => (
                      <tr key={index}>
                        <td>{day.date}</td>
                        <td className="revenue-cell">${day.revenue.toLocaleString()}</td>
                        <td className="municipal-cell">${day.municipal.toLocaleString()}</td>
                        <td className="developer-cell">${day.developer.toLocaleString()}</td>
                        <td className="fee-cell">${Math.round(day.revenue * 0.02).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td className="revenue-cell">${totalRevenue.toLocaleString()}</td>
                      <td className="municipal-cell">${municipalShare.toLocaleString()}</td>
                      <td className="developer-cell">${developerShare.toLocaleString()}</td>
                      <td className="fee-cell">${Math.round(totalRevenue * 0.02).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="settlement-panel">
              <h3>Automated Settlement</h3>
              <div className="settlement-status">
                <div className="status-item">
                  <CheckCircle size={20} color="var(--success)" />
                  <div>
                    <span className="status-label">Last Settlement</span>
                    <span className="status-value">Apr 13, 2026 00:00</span>
                  </div>
                </div>
                <div className="status-item">
                  <Activity size={20} color="var(--accent-green)" />
                  <div>
                    <span className="status-label">Next Settlement</span>
                    <span className="status-value">Apr 14, 2026 00:00</span>
                  </div>
                </div>
                <button className="btn-settle">
                  <Download size={18} />
                  Generate Report
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stations' && (
          <motion.div 
            className="stations-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="station-map-grid">
              {stationPerformance.map(station => (
                <div key={station.id} className={`station-card ${station.status}`}>
                  <div className="station-header">
                    <h4>{station.name}</h4>
                    <span className={`status-badge ${station.status}`}>
                      {station.status}
                    </span>
                  </div>
                  <div className="station-stats">
                    <div className="station-stat">
                      <span className="value">{station.liters.toLocaleString()}L</span>
                      <span className="label">Dispensed</span>
                    </div>
                    <div className="station-stat">
                      <span className="value">{station.efficiency}%</span>
                      <span className="label">Efficiency</span>
                    </div>
                  </div>
                  <div className="efficiency-bar">
                    <div 
                      className="efficiency-fill" 
                      style={{ 
                        width: `${station.efficiency}%`,
                        background: station.efficiency >= 90 ? 'var(--success)' : station.efficiency >= 80 ? 'var(--accent-blue)' : 'var(--warning)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="inventory-panel">
              <h3>Station Inventory Levels</h3>
              <div className="inventory-bars">
                {state.stations.map(station => {
                  const percentage = (station.inventory / 20000) * 100;
                  return (
                    <div key={station.id} className="inventory-item">
                      <div className="inventory-label">
                        <span className="station-name">{station.name}</span>
                        <span className="inventory-value">{station.inventory.toLocaleString()}L</span>
                      </div>
                      <div className="inventory-bar">
                        <div 
                          className="inventory-fill"
                          style={{ 
                            width: `${percentage}%`,
                            background: percentage > 50 ? 'var(--accent-green)' : percentage > 25 ? 'var(--warning)' : 'var(--danger)'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div 
            className="audit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="anomaly-panel">
              <div className="panel-header">
                <h3>Anomaly Detection Log</h3>
                <div className="panel-actions">
                  <button className="btn-filter">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="btn-export">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              <div className="anomaly-list">
                {anomalyLog.map(anomaly => (
                  <div key={anomaly.id} className={`anomaly-card ${anomaly.status}`}>
                    <div className="anomaly-header">
                      <div className="anomaly-icon">
                        {anomaly.type === 'capacity_exceeded' && <AlertTriangle size={20} />}
                        {anomaly.type === 'gps_mismatch' && <MapPin size={20} />}
                        {anomaly.type === 'ghost_gap' && <Shield size={20} />}
                      </div>
                      <div className="anomaly-type">
                        <span className="type-label">{anomaly.type.replace('_', ' ')}</span>
                        <span className={`status-badge ${anomaly.status}`}>{anomaly.status}</span>
                      </div>
                    </div>
                    <div className="anomaly-details">
                      <p>{anomaly.details}</p>
                      <div className="anomaly-meta">
                        {anomaly.vehicle && <span>Vehicle: {anomaly.vehicle}</span>}
                        {anomaly.station && <span>Station: {anomaly.station}</span>}
                        <span><Calendar size={14} /> {anomaly.timestamp}</span>
                      </div>
                    </div>
                    <div className="anomaly-actions">
                      <button className="btn-investigate">
                        <Eye size={16} />
                        Investigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ghost-gap-panel">
              <h3>Ghost Gap Monitoring</h3>
              <p>Daily inventory reconciliation - stations exceeding 2% threshold are flagged</p>
              
              <div className="ghost-gap-summary">
                <div className="gap-stat">
                  <span className="gap-value">{avgGhostGap}%</span>
                  <span className="gap-label">Average Ghost Gap</span>
                </div>
                <div className="gap-stat">
                  <span className="gap-value">4</span>
                  <span className="gap-label">Stations Flagged Today</span>
                </div>
                <div className="gap-stat">
                  <span className="gap-value">98.2%</span>
                  <span className="gap-label">System Integrity</span>
                </div>
              </div>

              <div className="threshold-demo">
                <div className="threshold-label">
                  <span>0%</span>
                  <span>2% Threshold</span>
                  <span>5%</span>
                </div>
                <div className="threshold-bar">
                  <div className="threshold-fill" style={{ width: `${(avgGhostGap/5)*100}%` }}></div>
                  <div className="threshold-line" style={{ left: '40%' }}></div>
                </div>
              </div>
            </div>

            <div className="audit-trail-panel">
              <h3>Recent Audit Events</h3>
              <div className="audit-timeline">
                <div className="audit-event">
                  <div className="event-dot"></div>
                  <div className="event-content">
                    <span className="event-time">Apr 13, 2026 14:32</span>
                    <p>Station ST004 flagged for 3.2% ghost gap</p>
                  </div>
                </div>
                <div className="audit-event">
                  <div className="event-dot"></div>
                  <div className="event-content">
                    <span className="event-time">Apr 13, 2026 12:15</span>
                    <p>New vehicle ABC-1234 registered (Bajaj)</p>
                  </div>
                </div>
                <div className="audit-event">
                  <div className="event-dot"></div>
                  <div className="event-content">
                    <span className="event-time">Apr 13, 2026 09:45</span>
                    <p>Daily settlement completed - $185,000 distributed</p>
                  </div>
                </div>
                <div className="audit-event">
                  <div className="event-dot"></div>
                  <div className="event-content">
                    <span className="event-time">Apr 12, 2026 23:59</span>
                    <p>Inventory reconciliation completed for all stations</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}