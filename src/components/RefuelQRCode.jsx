import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useVeloCity } from '../context/VeloCityContext';
import { Clock, Fuel, RefreshCw, Download, Shield } from 'lucide-react';
import Button from './Button';
import './RefuelQRCode.css';

export default function RefuelQRCode({ vehicle }) {
  const { generateRefuelQuotaQR, state } = useVeloCity();
  const [activeQR, setActiveQR] = useState(null);
  const [quota, setQuota] = useState(35);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const existing = state.refuelQRCodes.find(q => q.vehicleId === vehicle?.id && q.status === 'active');
    if (existing && new Date(existing.expiresAt) > new Date()) {
      setActiveQR(existing);
    }
  }, [state.refuelQRCodes, vehicle?.id]);

  useEffect(() => {
    if (!activeQR) { setTimeLeft(null); return; }
    const tick = () => {
      const diff = new Date(activeQR.expiresAt) - new Date();
      if (diff <= 0) { setActiveQR(null); setTimeLeft(null); return; }
      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${min}:${sec.toString().padStart(2, '0')}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [activeQR]);

  const handleGenerate = () => {
    const qr = generateRefuelQuotaQR(vehicle?.id || `V${Date.now()}`, null, quota, 60);
    setActiveQR(qr);
  };

  const handleDownload = () => {
    if (!activeQR) return;
    const blob = new Blob([JSON.stringify(activeQR, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `refuel-qr-${activeQR.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFuelOptions = (type) => {
    switch (type) {
      case 'bajaj': return [25, 35, 50];
      case 'auto': return [50, 100, 150];
      case 'truck': return [200, 350, 500];
      default: return [35, 50, 100];
    }
  };

  return (
    <div className="refuel-qr-card">
      <div className="refuel-qr-header">
        <Shield size={20} />
        <h3>Refuel Quota QR</h3>
      </div>

      {activeQR && timeLeft ? (
        <div className="refuel-qr-active">
          <div className="refuel-qr-code">
            <QRCodeSVG value={activeQR.token} size={180} level="M" />
          </div>
          <div className="refuel-qr-info">
            <div className="refuel-qr-stat">
              <Fuel size={16} />
              <span>Quota: <strong>{activeQR.quota}L</strong></span>
            </div>
            <div className="refuel-qr-stat">
              <Clock size={16} />
              <span>Expires in: <strong className={timeLeft < '5:00' ? 'expiring' : ''}>{timeLeft}</strong></span>
            </div>
            <div className="refuel-qr-actions">
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download size={14} /> Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setActiveQR(null); }}>
                <RefreshCw size={14} /> New
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="refuel-qr-form">
          <p className="refuel-qr-desc">Generate a time-limited QR code for this refueling session</p>
          <div className="refuel-quota-select">
            <label>Fuel Quota</label>
            <div className="quota-options">
              {getFuelOptions(vehicle?.type).map(val => (
                <button
                  key={val}
                  className={`quota-btn ${quota === val ? 'active' : ''}`}
                  onClick={() => setQuota(val)}
                >{val}L</button>
              ))}
            </div>
          </div>
          <Button variant="primary" size="sm" fullWidth onClick={handleGenerate}>
            <RefreshCw size={14} /> Generate QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
