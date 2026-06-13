import { useState, useRef, useEffect } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { 
  Scan, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Bike,
  Car,
  Truck,
  Fuel,
  QrCode,
  Camera,
  StopCircle,
  RefreshCw,
  User
} from 'lucide-react';
import './StationWorkerDashboard.css';

export default function StationWorkerDashboard() {
  const { state, createTransaction, isDriverLocked, getLockRemainingTime, convertCurrency, formatCurrency, recordFuelSold, checkStationCapacity, calculateRevenueShare, lookupVehicle, getRecentTransactions, getStationStats } = useVeloCity();
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(false);
  const [scannedVehicle, setScannedVehicle] = useState(null);
  const [driverVerified, setDriverVerified] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pumpCapture, setPumpCapture] = useState(null);
  const [pumpMediaReady, setPumpMediaReady] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Today', value: 0 },
    { label: 'Liters', value: 0 },
    { label: 'Revenue', value: 0 },
  ]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (state.user?.station_id) {
        const txResult = await getRecentTransactions(state.user.station_id, 10);
        if (txResult.success) {
          setRecentScans(txResult.transactions);
        }
        
        const statsResult = await getStationStats(state.user.station_id);
        if (statsResult.success) {
          setStats(statsResult.stats);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user?.station_id]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleScan = async (qrCode) => {
    setScanning(true);
    setError('');
    setScannedVehicle(null);
    setDriverVerified(false);
    
    const result = await lookupVehicle(qrCode);
    if (result.success) {
      setScannedVehicle(result.vehicle);
    } else {
      setError(result.error || 'Vehicle not found');
    }
    setScanning(false);
  };

  const scanQRWithCamera = async () => {
    await startCamera();
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  const verifyDriver = () => {
    if (!scannedVehicle) return;
    
    setDriverVerified(true);
  };

  const capturePumpDisplay = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPumpCapture(reader.result);
          setPumpMediaReady(true);
        };
        reader.readAsDataURL(blob);
      };
      
      mediaRecorder.start();
      
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 10000);
      
    } catch (err) {
      console.error('Pump capture error:', err);
      setPumpCapture(null);
    }
  };

  const confirmFuel = async () => {
    if (!driverVerified || selectedFuel <= 0) {
      setError('Please verify driver first and select fuel amount');
      return;
    }
    
    setProcessing(true);
    
    const pricePerLiter = state.currency === 'ETB' ? 50 : 0.32;
    const revenueShare = calculateRevenueShare(selectedFuel, pricePerLiter);
    
    const transaction = await createTransaction({
      vehicle_id: scannedVehicle.id,
      driver_id: scannedVehicle.driverId,
      station_id: state.user?.station_id || 'ST001',
      worker_id: state.user?.id,
      liters: selectedFuel,
      plate: scannedVehicle.plate,
      type: scannedVehicle.type,
      driver_photo: scannedVehicle.driver_photo,
      pump_capture: pumpCapture,
      pump_capture_verified: pumpMediaReady,
      revenue_distribution: revenueShare.distribution,
      total_amount: revenueShare.baseAmount,
    });
    
    recordFuelSold(state.user?.station_id || 'ST001', selectedFuel, scannedVehicle.user_id || scannedVehicle.driverId);
    
    const newTx = {
      id: transaction.transaction?.id || `TX${Date.now()}`,
      plate: scannedVehicle.plate,
      type: scannedVehicle.type,
      liters: selectedFuel,
      amount: selectedFuel * 50,
      currency: state.currency,
      status: 'verified',
      time: 'Just now'
    };
    
    setRecentScans([newTx, ...recentScans.slice(0, 9)]);
    setScannedVehicle(null);
    setDriverVerified(false);
    setSelectedFuel(0);
    stopCamera();
    setProcessing(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'bajaj': return Bike;
      case 'auto': return Car;
      case 'truck': return Truck;
      default: return Car;
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case 'bajaj': return '#2EC4B6';
      case 'auto': return '#3A86FF';
      case 'truck': return '#8D99AE';
      default: return '#8D99AE';
    }
  };

  const getFuelOptions = (type) => {
    switch (type) {
      case 'bajaj': return [25, 35, 50];
      case 'auto': return [50, 100, 150];
      case 'truck': return [200, 350, 500];
      default: return [50, 100, 150];
    }
  };

  return (
    <div className="station-worker-dashboard">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Fuel Dispensing</h1>
          <p>Worker: {state.user?.name} • Station: {state.user?.station_id || 'N/A'}</p>
        </div>
        <div className="header-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-pill">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="scanner-section">
          <div className="scanner-card">
            <div className="scanner-header">
              <h2>Scan QR & Verify Driver</h2>
              <div className="scanner-status">
                {processing ? (
                  <span className="status processing">
                    <RefreshCw size={16} className="spin" />
                    Processing...
                  </span>
                ) : scanning ? (
                  <span className="status scanning">
                    <span className="scan-pulse"></span>
                    Scanning...
                  </span>
                ) : scannedVehicle ? (
                  <span className="status ready">
                    <CheckCircle size={16} />
                    QR Scanned
                  </span>
                ) : (
                  <span className="status idle">
                    <QrCode size={16} />
                    Ready to Scan
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="scanner-error">
                <AlertTriangle size={16} />
                {error}
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            <div className="scanner-view">
              {scanning ? (
                <motion.div 
                  className="scanning-animation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="scan-animation">
                    <QrCode size={64} className="spin" />
                  </div>
                  <p>Position QR code in the frame</p>
                </motion.div>
              ) : scannedVehicle ? (
                <motion.div 
                  className="scanned-result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="vehicle-badge" style={{ borderColor: getVehicleColor(scannedVehicle.type) }}>
                    {(() => {
                      const Icon = getVehicleIcon(scannedVehicle.type);
                      return <Icon size={48} style={{ color: getVehicleColor(scannedVehicle.type) }} />;
                    })()}
                  </div>
                  <h3>{scannedVehicle.plate}</h3>
                  <span style={{ color: getVehicleColor(scannedVehicle.type) }}>
                    {scannedVehicle.type.toUpperCase()} QR
                  </span>

                  <div className="vehicle-details">
                    <div className="detail-row">
                      <span>Owner</span>
                      <span>{scannedVehicle.owner_name}</span>
                    </div>
                    <div className="detail-row">
                      <span>Tank Capacity</span>
                      <span>{scannedVehicle.tankCapacity}L</span>
                    </div>
                    <div className="detail-row">
                      <span>Wallet</span>
                      <span>{formatCurrency(scannedVehicle.walletBalance)}</span>
                    </div>
                  </div>

                  {scannedVehicle.driver_photo ? (
                    <div className="driver-verification">
                      <h4>Driver Photo (from signup)</h4>
                      <img src={scannedVehicle.driver_photo} alt="Driver" className="driver-photo" />
                      <p className="verify-hint">Verify this matches the driver</p>
                    </div>
                  ) : (
                    <div className="driver-verification">
                      <h4>Driver Photo</h4>
                      <div className="driver-photo-placeholder">
                        <User size={48} />
                        <p>No photo on file</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="driver-details-grid">
                    <div className="detail-row">
                      <span>Driver ID</span>
                      <span>{scannedVehicle.id}</span>
                    </div>
                    <div className="detail-row">
                      <span>Phone</span>
                      <span>{scannedVehicle.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span>Owner Name</span>
                      <span>{scannedVehicle.owner_name}</span>
                    </div>
                  </div>
                  
                  <div className="verification-notice">
                    <AlertTriangle size={16} />
                    <p>MUST verify driver details BEFORE pumping fuel</p>
                  </div>

                  {driverVerified && (
                    <div className="fuel-options">
                      <h4>Select Fuel Amount</h4>
                      <div className="fuel-buttons">
                        {getFuelOptions(scannedVehicle.type).map(amount => (
                          <button 
                            key={amount}
                            className={`fuel-btn ${selectedFuel === amount ? 'active' : ''}`}
                            onClick={() => setSelectedFuel(amount)}
                          >
                            {amount}L
                          </button>
                        ))}
                      </div>
                      {selectedFuel > 0 && (
                        <div className="fuel-total">
                          Total: {formatCurrency(selectedFuel * 50)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="action-buttons">
                    <button className="btn-cancel" onClick={() => { setScannedVehicle(null); setDriverVerified(false); }}>
                      Cancel
                    </button>
                    {!driverVerified ? (
                      <button className="btn-confirm" onClick={verifyDriver}>
                        <CheckCircle size={18} />
                        Verify Driver
                      </button>
                    ) : (
                      <button 
                        className="btn-confirm" 
                        onClick={confirmFuel}
                        disabled={!selectedFuel}
                      >
                        <Fuel size={18} />
                        Dispense Fuel
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="scan-placeholder">
                  <QrCode size={64} />
                  <p>Click Start to scan QR code</p>
                </div>
              )}
            </div>

            {selectedFuel > 0 && !pumpCapture && (
              <button 
                className="btn-capture"
                onClick={capturePumpDisplay}
                disabled={pumpMediaReady}
              >
                <Camera size={20} />
                {pumpMediaReady ? 'Pump Captured' : 'Capture Pump Display'}
              </button>
            )}

            {pumpCapture && (
              <div className="pump-captured">
                <CheckCircle size={16} />
                <span>Pump display captured as evidence</span>
              </div>
            )}

            <button 
              className="btn-scan" 
              onClick={handleScan} 
              disabled={scanning || processing}
            >
              <Scan size={20} />
              {scanning ? 'Scanning...' : 'Start QR Scan'}
            </button>
          </div>
        </div>

        <div className="recent-section">
          <div className="panel">
            <div className="panel-header">
              <h3>Recent Transactions</h3>
            </div>
            <div className="panel-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Type</th>
                    <th>Liters</th>
                    <th>Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map(tx => (
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
                      <td>{tx.currency === 'ETB' ? `ETB ${tx.amount}` : `$${tx.amount}`}</td>
                      <td>{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}