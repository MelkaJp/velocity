import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardHoverLift, scaleIn } from '../animations';
import { 
  Users, 
  Truck, 
  TrendingUp, 
  DollarSign, 
  Route, 
  Upload,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import './FleetManager.css';

const costData = [
  { month: 'Jan', cost: 42000 },
  { month: 'Feb', cost: 38000 },
  { month: 'Mar', cost: 45000 },
  { month: 'Apr', cost: 52000 },
];

const fleetDistribution = [
  { name: 'Bajaj', value: 45, color: '#2EC4B6' },
  { name: 'Automobile', value: 35, color: '#3A86FF' },
  { name: 'Trucks', value: 20, color: '#212529' },
];

const weeklyData = [
  { day: 'Mon', liters: 1200 },
  { day: 'Tue', liters: 1450 },
  { day: 'Wed', liters: 1100 },
  { day: 'Thu', liters: 1600 },
  { day: 'Fri', liters: 1800 },
  { day: 'Sat', liters: 900 },
  { day: 'Sun', liters: 750 },
];

export default function FleetManager() {
  const { state, CURRENCY_RATES, calculateWeeklySpend, calculateMonthlySpend, formatCurrency, registerVehicle } = useVeloCity();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFleet, setSelectedFleet] = useState('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const fleetVehicles = state.vehicles.filter(v => v.type === 'truck' || v.type === 'automobile');
  const totalFleetValue = fleetVehicles.reduce((sum, v) => sum + (v.wallet?.balance || 0), 0);
  const avgCostPerVehicle = totalFleetValue / (fleetVehicles.length || 1);
  const activeVehicles = fleetVehicles.filter(v => v.status === 'active').length;
  
  const weeklySpend = calculateWeeklySpend(state.user?.id);
  const monthlySpend = calculateMonthlySpend(state.user?.id);
  const weeklySpendUSD = (weeklySpend / CURRENCY_RATES.ETB).toFixed(0);
  const monthlySpendUSD = (monthlySpend / CURRENCY_RATES.ETB).toFixed(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results = state.vehicles.filter(v => 
      v.owner_id === state.user?.id &&
      (v.plate?.toLowerCase().includes(q) || 
       v.owner_name?.toLowerCase().includes(q) ||
       v.type?.toLowerCase().includes(q))
    );
    setSearchResults(results);
  };

  const addVehicle = async () => {
    const plate = prompt('Enter license plate (e.g., RAB 123D):');
    if (!plate) return;
    const type = prompt('Enter vehicle type (bajaj/auto/truck):', 'auto');
    const capacity = prompt('Enter tank capacity (liters):', '100');
    
    await registerVehicle({
      plate: plate.toUpperCase(),
      type: type.toLowerCase(),
      tankCapacity: parseInt(capacity) || 100,
      owner_name: state.user?.name,
      phone: state.user?.phone || '',
    }, state.user?.id);
  };

  return (
    <div className="fleet-manager">
      <PageHeader
        title="Fleet Manager Portal"
        subtitle="Bulk vehicle management, cost analytics, and subscription controls"
      />

      <div className="portal-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={18} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <Truck size={18} />
          Vehicles
        </button>
        <button 
          className={`tab ${activeTab === 'costs' ? 'active' : ''}`}
          onClick={() => setActiveTab('costs')}
        >
          <DollarSign size={18} />
          Costs
        </button>
        <button 
          className={`tab ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          <Route size={18} />
          Routes
        </button>
      </div>

      <div className="portal-content">
        {activeTab === 'overview' && (
          <motion.div 
            className="overview-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="stats-row">
              <StatCard icon={Users} label="Total Vehicles" value={String(fleetVehicles.length)} color="#8D99AE" delay={0} />
              <StatCard icon={TrendingUp} label="Active" value={String(activeVehicles)} color="#06D6A0" delay={0.06} />
              <StatCard icon={Truck} label="Trucks" value={String(fleetVehicles.filter(v => v.type === 'truck').length)} color="#FF6B35" delay={0.12} />
              <StatCard icon={DollarSign} label="Total Wallet" value={formatCurrency(totalFleetValue)} color="#3A86FF" delay={0.18} />
            </div>

            <motion.div className="cost-summary" variants={staggerContainer(0.1)} initial="hidden" animate="visible">
              <motion.div className="cost-card" variants={fadeUp} {...cardHoverLift}>
                <h4>Weekly Spend</h4>
                <p className="cost-value">{formatCurrency(weeklySpend)}</p>
                <p className="cost-usd">≈ ${weeklySpendUSD}</p>
              </motion.div>
              <motion.div className="cost-card" variants={fadeUp} {...cardHoverLift}>
                <h4>Monthly Spend</h4>
                <p className="cost-value">{formatCurrency(monthlySpend)}</p>
                <p className="cost-usd">≈ ${monthlySpendUSD}</p>
              </motion.div>
            </motion.div>

            <div className="charts-row">
              <div className="chart-card">
                <h3>Weekly Fuel Consumption</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3D4F65" />
                      <XAxis dataKey="day" stroke="#8D99AE" />
                      <YAxis stroke="#8D99AE" />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#1B263B', 
                          border: '1px solid #3D4F65',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="liters" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card pie">
                <h3>Fleet Distribution</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPie>
                      <Pie
                        data={fleetDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {fleetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: '#1B263B', 
                          border: '1px solid #3D4F65',
                          borderRadius: '8px'
                        }} 
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {fleetDistribution.map((item, index) => (
                      <div key={index} className="legend-item">
                        <span className="legend-color" style={{ background: item.color }}></span>
                        <span className="legend-label">{item.name}</span>
                        <span className="legend-value">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="cost-trend">
              <h3>Monthly Cost Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D4F65" />
                    <XAxis dataKey="month" stroke="#8D99AE" />
                    <YAxis stroke="#8D99AE" />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1B263B', 
                        border: '1px solid #3D4F65',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#3A86FF" 
                      strokeWidth={3}
                      dot={{ fill: '#3A86FF', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'vehicles' && (
          <motion.div 
            className="vehicles-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="section-toolbar">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search by plate, name, or type..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="toolbar-actions">
                <Button variant="secondary" onClick={addVehicle}>
                  <Upload size={18} />
                  Add Vehicle
                </Button>
                <Button variant="secondary" onClick={() => toast.success('Fleet data exported as CSV')}>
                  <Download size={18} />
                  Export
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>Search Results ({searchResults.length})</h4>
              </div>
            )}

            <div className="vehicles-table">
              <table>
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Type</th>
                    <th>Tank Capacity</th>
                    <th>Wallet Balance</th>
                    <th>Status</th>
                    <th>Last Refill</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchResults.length > 0 ? searchResults : fleetVehicles).map(vehicle => (
                    <tr key={vehicle.id}>
                      <td className="plate-cell">{vehicle.plate}</td>
                      <td>
                        <span className={`type-badge ${vehicle.type}`}>
                          {vehicle.type}
                        </span>
                      </td>
                      <td>{vehicle.tankCapacity}L</td>
                      <td className="wallet-cell">${vehicle.wallet}</td>
                      <td>
                        <span className={`status ${vehicle.status}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="date-cell">Apr 12, 2026</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {fleetVehicles.length === 0 && (
              <EmptyState icon={Truck} title="No fleet vehicles found" />
            )}
          </motion.div>
        )}

        {activeTab === 'costs' && (
          <motion.div 
            className="costs-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div className="cost-summary" variants={staggerContainer(0.1)} initial="hidden" animate="visible">
              <motion.div className="cost-card" variants={fadeUp} {...cardHoverLift}>
                <DollarSign size={24} />
                <div className="cost-info">
                  <span className="cost-value">${(avgCostPerVehicle * 30).toLocaleString()}</span>
                  <span className="cost-label">Monthly Cost</span>
                </div>
              </motion.div>
              <motion.div className="cost-card" variants={fadeUp} {...cardHoverLift}>
                <TrendingUp size={24} />
                <div className="cost-info">
                  <span className="cost-value">$2.50/L</span>
                  <span className="cost-label">Avg. Fuel Price</span>
                </div>
              </motion.div>
              <motion.div className="cost-card" variants={fadeUp} {...cardHoverLift}>
                <PieChart size={24} />
                <div className="cost-info">
                  <span className="cost-value">{fleetVehicles.length * 8}</span>
                  <span className="cost-label">Avg. Refills/Month</span>
                </div>
              </motion.div>
            </motion.div>

            <div className="cost-breakdown">
              <h3>Cost Breakdown by Vehicle Type</h3>
              <div className="breakdown-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { type: 'Bajaj', cost: 12000 },
                    { type: 'Automobile', cost: 28000 },
                    { type: 'Trucks', cost: 45000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D4F65" />
                    <XAxis dataKey="type" stroke="#8D99AE" />
                    <YAxis stroke="#8D99AE" />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1B263B', 
                        border: '1px solid #3D4F65',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="cost" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'routes' && (
          <motion.div 
            className="routes-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="route-verification">
              <h3>Route Verification (Truck Protocol)</h3>
              <p>Trucks require route verification to prevent unauthorized fuel transfers</p>
              
              <div className="route-list">
                {fleetVehicles.filter(v => v.type === 'truck').map(vehicle => (
                  <div key={vehicle.id} className="route-item">
                    <div className="route-vehicle">
                      <Truck size={20} />
                      <span className="plate">{vehicle.plate}</span>
                    </div>
                    <div className="route-status verified">
                      <Route size={16} />
                      <span>Route Verified</span>
                    </div>
                    <Button variant="outline" onClick={() => toast.success('Route verified for vehicle')}>Verify</Button>
                  </div>
                ))}
                {fleetVehicles.filter(v => v.type === 'truck').length === 0 && (
                  <p className="no-trucks">No trucks in fleet</p>
                )}
              </div>
            </div>

            <div className="subscription-panel">
              <h3>Subscription Management</h3>
              <motion.div className="sub-options" variants={staggerContainer(0.1)} initial="hidden" animate="visible">
                <motion.div className="sub-card active" variants={fadeUp} {...cardHoverLift}>
                  <div className="sub-header">
                    <h4>Premium</h4>
                    <span className="price">$99/mo</span>
                  </div>
                  <ul className="sub-features">
                    <li>Unlimited vehicles</li>
                    <li>Real-time GPS tracking</li>
                    <li>Priority support</li>
                    <li>Advanced analytics</li>
                  </ul>
                  <Button variant="secondary" onClick={() => toast.info('You are on the Premium plan')}>Current Plan</Button>
                </motion.div>
                <motion.div className="sub-card" variants={fadeUp} {...cardHoverLift}>
                  <div className="sub-header">
                    <h4>Basic</h4>
                    <span className="price">$49/mo</span>
                  </div>
                  <ul className="sub-features">
                    <li>Up to 50 vehicles</li>
                    <li>Basic analytics</li>
                    <li>Email support</li>
                  </ul>
                  <Button variant="outline" onClick={() => toast.info('Upgrade dialog would open')}>Upgrade</Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}