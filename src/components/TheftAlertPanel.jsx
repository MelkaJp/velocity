import { useState } from 'react';
import { AlertTriangle, Shield, Clock, MapPin, X } from 'lucide-react';
import { useVeloCity } from '../context/VeloCityContext';
import './TheftAlertPanel.css';

const severityColors = {
  low: { bg: 'rgba(255, 183, 3, 0.1)', color: '#FBBF24' },
  medium: { bg: 'rgba(255, 107, 53, 0.1)', color: '#FF6B35' },
  high: { bg: 'rgba(239, 71, 111, 0.1)', color: '#EF476F' },
  critical: { bg: 'rgba(239, 71, 111, 0.2)', color: '#EF476F' },
};

export default function TheftAlertPanel() {
  const { state, dispatch } = useVeloCity();
  const [filter, setFilter] = useState('all');
  const alerts = state.theftAlerts || [];

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

  const handleDismiss = (id) => {
    dispatch({ type: 'ADD_THEFT_ALERT', payload: state.theftAlerts.filter(a => a.id !== id) });
  };

  return (
    <div className="theft-panel">
      <div className="theft-panel-header">
        <Shield size={20} />
        <h3>Fuel Theft Detection</h3>
        <span className="theft-count">{alerts.length}</span>
        <div className="theft-filters">
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              className={`theft-filter ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="theft-empty">
          <Shield size={32} />
          <p>No suspicious activity detected</p>
        </div>
      ) : (
        <div className="theft-list">
          {filtered.map(alert => {
            const sev = severityColors[alert.severity] || severityColors.medium;
            return (
              <div key={alert.id} className="theft-item" style={{ borderLeftColor: sev.color }}>
                <div className="theft-item-header">
                  <AlertTriangle size={16} style={{ color: sev.color }} />
                  <span className="theft-pattern">{alert.pattern?.replace(/_/g, ' ')}</span>
                  <span className="theft-severity" style={{ background: sev.bg, color: sev.color }}>{alert.severity}</span>
                </div>
                <p className="theft-msg">{alert.message}</p>
                <div className="theft-meta">
                  <Clock size={12} />
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
