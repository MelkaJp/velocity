import { useState, useEffect } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  MapPin, 
  Fuel, 
  Check, 
  AlertTriangle, 
  Loader,
  Navigation,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import './StationDashboard.css';

const vehicleTypes = {
  bajaj: { id: 'bajaj', value: 'bajaj', label: 'Bajaj (Green)', color: '#2EC4B6', maxTank: 50 },
  automobile: { id: 'automobile', value: 'auto', label: 'Automobile (Blue)', color: '#3A86FF', maxTank: 150 },
  auto: { id: 'auto', value: 'auto', label: 'Automobile (Blue)', color: '#3A86FF', maxTank: 150 },
  truck: { id: 'truck', value: 'truck', label: 'Truck (Black)', color: '#212529', maxTank: 500 },
};

export default function StationDashboard() {
  const { state, createTransaction, lookupVehicle } = useVeloCity();
  const { t } = useTranslation();
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [litersInput, setLitersInput] = useState('');
  const [currentStation, setCurrentStation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('verified');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    if (state.stations.length > 0 && !currentStation) {
      setCurrentStation(state.stations[0]);
    }
  }, [state.stations, currentStation]);

  const handleScan = async () => {
    setScanMode(true);
    const result = await lookupVehicle(scannedCode);
    setScanMode(false);
    if (!result.success) {
      alert('Invalid QR Code - Vehicle not found');
    }
  };

  const handleVerify = async () => {
    if (!scannedCode || !litersInput || !currentStation || processing) return;
    
    const vehicleResult = await lookupVehicle(scannedCode);
    if (!vehicleResult.success) {
      alert('Invalid QR Code - Vehicle not found');
      return;
    }

    setProcessing(true);

    try {
      const result = await createTransaction({
        vehicle_id: vehicleResult.vehicle.id,
        vehicle_plate: vehicleResult.vehicle.plate,
        station_id: currentStation.id,
        station_name: currentStation.name,
        liters: parseFloat(litersInput),
        gps_match: gpsStatus === 'verified',
      });

      setLastTransaction(result.transaction);
      setShowConfirmation(true);
      
      setTimeout(() => {
        setShowConfirmation(false);
        setScannedCode('');
        setLitersInput('');
        setLastTransaction(null);
      }, 4000);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getVehicleFromCode = (code) => {
    return state.vehicles.find(v => v.qr_code === code);
  };

  const scannedVehicle = getVehicleFromCode(scannedCode);
  const localTransactions = state.transactions.filter(tx => tx.station_id === currentStation?.id);
  const todayTotal = localTransactions.reduce((sum, tx) => sum + tx.liters, 0);
  const verifiedCount = localTransactions.filter(tx => tx.status === 'verified').length;
  const flaggedCount = localTransactions.filter(tx => tx.status === 'flagged').length;

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
    <div className="station-dashboard">
      <div className="portal-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Station Dashboard</h1>
          <p>QR scanning, transaction logging, and fuel verification</p>
        </motion.div>
      </div>

      <div className="station-selector">
        <label>Active Station</label>
        <select 
          value={currentStation?.id || ''}
          onChange={(e) => setCurrentStation(state.stations.find(s => s.id === e.target.value))}
          className="station-select"
        >
          {state.stations.map(station => (
            <option key={station.id} value={station.id}>
              {station.name} - {station.location}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-grid">
        <div className="scanner-section">
          <div className="scanner-card">
            <div className="scanner-header">
              <h2>
                <QrCode size={24} />
                QR Scanner
              </h2>
              <div className="gps-indicator" data-status={gpsStatus}>
                <Navigation size={16} />
                <span>{gpsStatus === 'verified' ? 'GPS Verified' : 'GPS Mismatch'}</span>
              </div>
            </div>

            {showConfirmation && lastTransaction ? (
              <motion.div 
                className="confirmation-overlay"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div 
                  className="confirmation-icon" 
                  style={{ 
                    background: lastTransaction.status === 'verified' ? 'rgba(6, 214, 160, 0.2)' : 'rgba(255, 107, 53, 0.2)', 
                    color: lastTransaction.status === 'verified' ? 'var(--success)' : 'var(--warning)' 
                  }}
                >
                  {lastTransaction.status === 'verified' ? <Check size={48} /> : <AlertTriangle size={48} />}
                </div>
                <h3>{lastTransaction.status === 'verified' ? 'Transaction Verified' : 'Transaction Flagged'}</h3>
                <p>{lastTransaction.liters}L at ${lastTransaction.amount}</p>
                {lastTransaction.anomaly && (
                  <span className="anomaly-warning">{lastTransaction.anomaly}</span>
                )}
              </motion.div>
            ) : (
              <>
                <div className={`scanner-view ${scanMode ? 'scanning' : ''}`}>
                  {scanMode ? (
                    <div className="scanning-animation">
                      <Loader size={48} className="spin" />
                      <p>Scanning QR Code...</p>
                    </div>
                  ) : scannedCode ? (
                    <div className="scanned-result">
                      <Check size={32} />
                      <span className="code-display">{scannedCode}</span>
                      {scannedVehicle && (
                        <div className="vehicle-preview">
                          <span className="plate">{scannedVehicle.plate}</span>
                          <span 
                            className="type" 
                            style={{ color: getTypeColor(scannedVehicle.type) }}
                          >
                            {getVehicleLabel(scannedVehicle.type)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="scan-placeholder">
                      <QrCode size={64} />
                      <p>Ready to scan</p>
                    </div>
                  )}
                </div>

                <button className="btn-scan" onClick={handleScan} disabled={scanMode}>
                  <QrCode size={20} />
                  {scanMode ? 'Scanning...' : 'Simulate QR Scan'}
                </button>

                {scannedCode && (
                  <div className="liters-input-section">
                    <label>
                      <Fuel size={18} />
                      Liters Pumped
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        value={litersInput}
                        onChange={(e) => setLitersInput(e.target.value)}
                        placeholder="Enter liters"
                        min="1"
                        max="500"
                      />
                      <span className="unit">L</span>
                    </div>
                    {scannedVehicle && (() => {
                      const vt = vehicleTypes[scannedVehicle.type?.toLowerCase()];
                      return (
                        <div className="capacity-info">
                          <span>Max capacity: {vt?.maxTank || 150}L</span>
                          {litersInput && parseInt(litersInput) > (vt?.maxTank || 150) && (
                            <span className="capacity-warning">
                              <AlertTriangle size={14} />
                              Exceeds tank capacity
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    <button 
                      className="btn-verify"
                      onClick={handleVerify}
                      disabled={!litersInput || processing}
                    >
                      {processing ? <Loader size={18} className="spin" /> : <Shield size={18} />}
                      {processing ? 'Processing...' : 'Verify & Complete'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="stats-section">
          <div className="daily-stats">
            <h3>Today's Summary</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <Fuel size={24} className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{todayTotal}</span>
                  <span className="stat-label">Liters Dispensed</span>
                </div>
              </div>
              <div className="stat-card">
                <Check size={24} className="stat-icon success" />
                <div className="stat-content">
                  <span className="stat-value">{verifiedCount}</span>
                  <span className="stat-label">Verified</span>
                </div>
              </div>
              <div className="stat-card">
                <AlertTriangle size={24} className="stat-icon warning" />
                <div className="stat-content">
                  <span className="stat-value">{flaggedCount}</span>
                  <span className="stat-label">Flagged</span>
                </div>
              </div>
              <div className="stat-card">
                <Zap size={24} className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">${(todayTotal * 50).toLocaleString()}</span>
                  <span className="stat-label">Revenue</span>
                </div>
              </div>
            </div>
          </div>

          {currentStation && (
            <div className="station-info">
              <h3>Station Info</h3>
              <div className="info-row">
                <MapPin size={18} />
                <span>{currentStation.name}</span>
              </div>
              <div className="info-row">
                <Fuel size={18} />
                <span>Inventory: {currentStation.inventory?.toLocaleString() || 0}L</span>
              </div>
              <div className="info-row">
                <Clock size={18} />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          <div className="recent-transactions">
            <h3>Recent Transactions</h3>
            <div className="tx-list">
              {localTransactions.slice(0, 5).map(tx => (
                <div key={tx.id} className={`tx-item ${tx.status}`}>
                  <div className="tx-vehicle">
                    <span className="plate">{tx.vehicle_plate}</span>
                    <span className="type-tag" style={{ color: getTypeColor(tx.vehicle_type) }}>
                      {tx.vehicle_type}
                    </span>
                  </div>
                  <div className="tx-liters">
                    <span>{tx.liters}L</span>
                    <span className={`status ${tx.status}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
              {localTransactions.length === 0 && (
                <p className="no-tx">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}