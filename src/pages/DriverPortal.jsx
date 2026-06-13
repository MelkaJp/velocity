import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardHoverLift, scaleIn } from '../animations';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import { 
  Plus, 
  Car, 
  Bike, 
  Truck, 
  Wallet, 
  History, 
  MapPin,
  Calendar,
  Download,
  Check,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { vehicleTypes } from '../data/sampleData';
import './DriverPortal.css';

export default function DriverPortal() {
  const { state, registerVehicle } = useVeloCity();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    type: 'bajaj',
    plate: '',
    tankCapacity: 35,
    owner_name: '',
    phone: '',
  });
  const [generatedQR, setGeneratedQR] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') {
        updated.tankCapacity = vehicleTypes[value.toUpperCase()].maxTank / 2;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await registerVehicle({
        type: formData.type,
        plate: formData.plate.toUpperCase(),
        tank_capacity: parseInt(formData.tankCapacity),
        qr_code: '',
        owner_name: formData.owner_name,
        phone: formData.phone,
      });
      
      if (result.success) {
        setGeneratedQR(result.vehicle);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const myVehicles = state.vehicles;
  const myTransactions = state.transactions.filter(tx => 
    myVehicles.some(v => v.id === tx.vehicleId)
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bajaj': return Bike;
      case 'automobile': return Car;
      case 'truck': return Truck;
      default: return Car;
    }
  };

  const getTypeColor = (type) => {
    if (!type) return '#2EC4B6';
    const normalized = type.toLowerCase();
    return vehicleTypes[normalized?.toUpperCase()]?.color || '#2EC4B6';
  };

  const getVehicleLabel = (type) => {
    if (!type) return 'Vehicle';
    const normalized = type.toLowerCase();
    return vehicleTypes[normalized?.toUpperCase()]?.label || 'Vehicle';
  };

  return (
    <div className="driver-portal">
      <div className="portal-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Driver Portal</h1>
          <p>Manage your vehicles, fuel wallet, and transaction history</p>
        </motion.div>
      </div>

      <div className="portal-tabs">
        <button 
          className={`tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          <Plus size={18} />
          Register Vehicle
        </button>
        <button 
          className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <Car size={18} />
          My Vehicles
        </button>
        <button 
          className={`tab ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <Wallet size={18} />
          Fuel Wallet
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} />
          History
        </button>
      </div>

      <div className="portal-content">
        {activeTab === 'register' && (
          <motion.div 
            className="register-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="register-form-container">
              <h2>Register New Vehicle</h2>
              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <div className="type-selector">
                    {Object.entries(vehicleTypes).map(([key, type]) => (
                      <button
                        key={key}
                        type="button"
                        className={`type-btn ${formData.type === type.id ? 'active' : ''}`}
                        style={{ 
                          '--type-color': type.color,
                          borderColor: formData.type === type.id ? type.color : 'transparent'
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                      >
                        {type.id === 'bajaj' && <Bike size={20} />}
                        {type.id === 'automobile' && <Car size={20} />}
                        {type.id === 'truck' && <Truck size={20} />}
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Plate Number</label>
                  <input
                    type="text"
                    name="plate"
                    value={formData.plate}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC-1234"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Tank Capacity (Liters)</label>
                  <input
                    type="number"
                    name="tankCapacity"
                    value={formData.tankCapacity}
                    onChange={handleInputChange}
                    min="10"
                    max={vehicleTypes[formData.type.toUpperCase()].maxTank}
                    className="form-input"
                  />
                  <span className="input-hint">Max: {vehicleTypes[formData.type.toUpperCase()].maxTank}L for this type</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Owner Name</label>
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? <Loader size={18} className="spin" /> : <Check size={18} />}
                  {submitting ? 'Registering...' : 'Generate QR Code'}
                </button>
              </form>
            </div>

            {generatedQR && (
              <motion.div 
                className="qr-result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="qr-success">
                  <Check size={48} />
                  <h3>Vehicle Registered!</h3>
                </div>
                <div 
                  className="qr-display"
                  style={{ borderColor: getTypeColor(generatedQR.type) }}
                >
                  <QRCodeSVG 
                    value={generatedQR.qrCode}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                  <div className="qr-info">
                    <span className="qr-plate">{generatedQR.plate}</span>
                    <span className="qr-type" style={{ color: getTypeColor(generatedQR.type) }}>
                      {vehicleTypes[generatedQR.type.toUpperCase()].label}
                    </span>
                  </div>
                </div>
                <div className="qr-code-text">
                  <span>{generatedQR.qrCode}</span>
                </div>
                <button className="btn-download" onClick={() => {
                  const blob = new Blob([generatedQR.qrCode], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `velo-qr-${generatedQR.plate}.txt`;
                  a.click(); URL.revokeObjectURL(url);
                }}>
                  <Download size={18} />
                  Download QR Code
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'vehicles' && (
          <motion.div 
            className="vehicles-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>My Vehicles</h2>
            <motion.div className="vehicles-grid" variants={staggerContainer(0.1)} initial="hidden" animate="visible">
              {myVehicles.length === 0 ? (
                <motion.div className="empty-state" variants={fadeUp}>
                  <Car size={48} />
                  <p>No vehicles registered yet</p>
                  <button onClick={() => setActiveTab('register')}>Register Your First Vehicle</button>
                </motion.div>
              ) : (
                myVehicles.map(vehicle => {
                  const TypeIcon = getTypeIcon(vehicle.type);
                  const typeColor = getTypeColor(vehicle.type);
                  return (
                    <motion.div 
                      key={vehicle.id}
                      className="vehicle-card"
                      variants={fadeUp}
                      {...cardHoverLift}
                      style={{ borderColor: typeColor }}
                    >
                      <div className="vehicle-header">
                        <div className="vehicle-icon" style={{ background: `${typeColor}20`, color: typeColor }}>
                          <TypeIcon size={24} />
                        </div>
                        <span className={`status-badge ${vehicle.status}`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="vehicle-info">
                        <h3>{vehicle.plate}</h3>
                        <p>{getVehicleLabel(vehicle.type)}</p>
                      </div>
                      <div className="vehicle-stats">
                        <div className="stat">
                          <span className="stat-label">Tank</span>
                          <span className="stat-value">{vehicle.tank_capacity}L</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Wallet</span>
                          <span className="stat-value">${vehicle.wallet}</span>
                        </div>
                      </div>
                      <div className="vehicle-qr">
                        <QRCodeSVG 
                          value={vehicle.qr_code}
                          size={80}
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'wallet' && (
          <motion.div 
            className="wallet-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Fuel Wallet</h2>
            <div className="wallet-overview">
              <div className="wallet-balance">
                <Wallet size={32} />
                <div>
                  <span className="balance-label">Total Balance</span>
                  <span className="balance-value">
                    ${myVehicles.reduce((sum, v) => sum + (v.wallet || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="wallet-actions">
                <button className="btn-wallet" onClick={() => {
                  const amt = prompt('Enter amount to add (USD):');
                  if (amt) toast.success(`Added $${amt} to wallet`);
                }}>
                  <Plus size={18} />
                  Add Funds
                </button>
                <button className="btn-wallet outline" onClick={() => {
                  const amt = prompt('Enter amount to transfer:');
                  if (amt) toast.success(`Transfer of $${amt} initiated`);
                }}>
                  Transfer
                </button>
              </div>
            </div>

            <div className="wallet-vehicles">
              <h3>Vehicle Balances</h3>
              {myVehicles.map(vehicle => (
                <div key={vehicle.id} className="wallet-vehicle-row">
                  <div className="vehicle-ident">
                    {(() => {
                      const TypeIcon = getTypeIcon(vehicle.type);
                      return <TypeIcon size={20} />;
                    })()}
                    <span>{vehicle.plate}</span>
                  </div>
                  <div className="vehicle-balance">
                    <span className="balance">${vehicle.wallet}</span>
                    <button className="btn-add">+</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            className="history-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Transaction History</h2>
            <motion.div className="transactions-list" variants={staggerContainer(0.08)} initial="hidden" animate="visible">
              {myTransactions.length === 0 ? (
                <motion.div className="empty-state" variants={fadeUp}>
                  <History size={48} />
                  <p>No transactions yet</p>
                </motion.div>
              ) : (
                myTransactions.map(tx => (
                  <motion.div key={tx.id} className={`transaction-card ${tx.status}`} variants={fadeUp} {...cardHoverLift}>
                    <div className="tx-main">
                      <div className="tx-icon">
                        <MapPin size={20} />
                      </div>
                      <div className="tx-info">
                        <h4>{tx.vehicle_plate}</h4>
                        <p>{tx.station_name}</p>
                      </div>
                    </div>
                    <div className="tx-details">
                      <div className="tx-amount">
                        <span className="liters">{tx.liters}L</span>
                        <span className="price">${tx.amount}</span>
                      </div>
                      <div className="tx-meta">
                        <span className="tx-time">
                          <Calendar size={14} />
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </span>
                        <span className={`tx-status ${tx.status}`}>
                          {tx.status === 'verified' ? <Check size={14} /> : <AlertTriangle size={14} />}
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}