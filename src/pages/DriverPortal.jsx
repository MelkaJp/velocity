import { useState, useEffect } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
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
  Loader,
  Save
} from 'lucide-react';
import './DriverPortal.css';

const vehicleTypes = {
  bajaj: { id: 'bajaj', value: 'bajaj', label: 'Bajaj (Green)', icon: Bike, color: '#2EC4B6', maxTank: 50 },
  automobile: { id: 'automobile', value: 'auto', label: 'Automobile (Blue)', icon: Car, color: '#3A86FF', maxTank: 150 },
  auto: { id: 'auto', value: 'auto', label: 'Automobile (Blue)', icon: Car, color: '#3A86FF', maxTank: 150 },
  truck: { id: 'truck', value: 'truck', label: 'Truck (Black)', icon: Truck, color: '#212529', maxTank: 500 },
};

export default function DriverPortal() {
  const { state, registerVehicle } = useVeloCity();
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
        const vt = vehicleTypes[value.toLowerCase()] || vehicleTypes.bajaj;
        updated.tankCapacity = Math.floor(vt.maxTank / 2);
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
      const qrData = {
        id: `DRV${Date.now()}`,
        type: formData.type,
        plate: formData.plate.toUpperCase(),
        tankCapacity: parseInt(formData.tankCapacity),
        owner_name: formData.owner_name,
        phone: formData.phone,
        qrCode: `VELO-${formData.plate.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      setGeneratedQR(qrData);
    } finally {
      setSubmitting(false);
    }
  };
  
  const downloadQRCode = () => {
    if (!generatedQR) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const qrSvg = document.querySelector('.qr-display svg');
    
    if (qrSvg) {
      const svgData = new XMLSerializer().serializeToString(qrSvg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 50, 50, 300, 300);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(generatedQR.plate, 200, 380);
        
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `VELO-${generatedQR.plate}-QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = url;
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
    const vt = vehicleTypes[type.toLowerCase()];
    return vt?.color || '#2EC4B6';
  };

  const getVehicleLabel = (type) => {
    if (!type) return 'Vehicle';
    const vt = vehicleTypes[type.toLowerCase()];
    return vt?.label || 'Vehicle';
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
                    {Object.values(vehicleTypes).filter(vt => vt.id !== 'auto').map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className={`type-btn ${formData.type === type.value ? 'active' : ''}`}
                        style={{ 
                          '--type-color': type.color,
                          borderColor: formData.type === type.value ? type.color : 'transparent'
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      >
                        {(() => { const Icon = type.icon; return <Icon size={20} />; })()}
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
                    max={vehicleTypes[formData.type]?.maxTank || 500}
                    className="form-input"
                  />
                  <span className="input-hint">Max: {vehicleTypes[formData.type]?.maxTank || 500}L for this type</span>
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
                      {vehicleTypes[generatedQR.type]?.label || 'Vehicle'}
                    </span>
                  </div>
                </div>
                <div className="qr-code-text">
                  <span>{generatedQR.qrCode}</span>
                </div>
                <button className="btn-download" onClick={downloadQRCode}>
                  <Download size={18} />
                  Download PNG QR Code
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
            <div className="vehicles-grid">
              {myVehicles.length === 0 ? (
                <div className="empty-state">
                  <Car size={48} />
                  <p>No vehicles registered yet</p>
                  <button onClick={() => setActiveTab('register')}>Register Your First Vehicle</button>
                </div>
              ) : (
                myVehicles.map(vehicle => {
                  const TypeIcon = getTypeIcon(vehicle.type);
                  const typeColor = getTypeColor(vehicle.type);
                  return (
                    <motion.div 
                      key={vehicle.id}
                      className="vehicle-card"
                      whileHover={{ y: -4 }}
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
                          <span className="stat-value">${vehicle.wallet?.balance ?? vehicle.wallet ?? 0}</span>
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
            </div>
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
                    ${myVehicles.reduce((sum, v) => sum + (v.wallet?.balance ?? v.wallet ?? 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="wallet-actions">
                <button className="btn-wallet">
                  <Plus size={18} />
                  Add Funds
                </button>
                <button className="btn-wallet outline">
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
                    <span className="balance">${vehicle.wallet?.balance ?? vehicle.wallet ?? 0}</span>
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
            <div className="transactions-list">
              {myTransactions.length === 0 ? (
                <div className="empty-state">
                  <History size={48} />
                  <p>No transactions yet</p>
                </div>
              ) : (
                myTransactions.map(tx => (
                  <div key={tx.id} className={`transaction-card ${tx.status}`}>
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
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}