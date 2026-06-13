import { useState } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { AlertTriangle, ArrowUpCircle, CheckCircle, Clock, User, MessageSquare } from 'lucide-react';
import Button from './Button';
import './EscalationWorkflow.css';

export default function EscalationWorkflow({ stationId, compact }) {
  const { state, createIncident, escalateIncident, resolveIncident, ESCALATION_LEVELS } = useVeloCity();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('fuel_discrepancy');
  const [description, setDescription] = useState('');

  const incidents = state.incidents?.filter(i => i.stationId === stationId || !stationId) || [];

  const incidentTypes = [
    { value: 'fuel_discrepancy', label: 'Fuel Discrepancy' },
    { value: 'equipment_failure', label: 'Equipment Failure' },
    { value: 'theft_suspicion', label: 'Theft Suspicion' },
    { value: 'customer_dispute', label: 'Customer Dispute' },
    { value: 'safety_hazard', label: 'Safety Hazard' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    createIncident(state.user?.id, state.user?.role, type, description, stationId);
    setDescription('');
    setShowForm(false);
  };

  const getLevelColor = (level) => {
    if (level >= 3) return '#EF476F';
    if (level === 2) return '#FF6B35';
    return '#FFD166';
  };

  if (compact) {
    const unresolved = incidents.filter(i => i.status === 'open');
    return (
      <div className="esc-mini" onClick={() => setShowForm(true)}>
        <AlertTriangle size={14} />
        <span>{unresolved.length} open</span>
      </div>
    );
  }

  return (
    <div className="esc-workflow">
      <div className="esc-header">
        <AlertTriangle size={20} />
        <h3>Incidents & Escalation</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
          + Report Issue
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="esc-form">
          <div className="form-group">
            <label>Issue Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {incidentTypes.map(it => (
                <option key={it.value} value={it.value}>{it.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="esc-form-actions">
            <Button type="submit" variant="primary" size="sm">
              <AlertTriangle size={14} /> Report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="esc-list">
        {incidents.length === 0 ? (
          <div className="esc-empty">
            <CheckCircle size={32} />
            <p>No incidents reported</p>
          </div>
        ) : (
          incidents.map(inc => {
            const canEscalate = inc.status === 'open' && inc.currentLevel < 4;
            const levelConfig = Object.values(ESCALATION_LEVELS).find(l => l.level === inc.currentLevel);
            return (
              <div key={inc.id} className={`esc-item ${inc.status}`}>
                <div className="esc-item-header">
                  <span className="esc-id">#{inc.id.slice(-6)}</span>
                  <span className="esc-type">{inc.type?.replace(/_/g, ' ')}</span>
                  <span className="esc-status" style={{ background: `${getLevelColor(inc.currentLevel)}20`, color: getLevelColor(inc.currentLevel) }}>
                    {inc.status}
                  </span>
                </div>
                <p className="esc-desc">{inc.description}</p>
                <div className="esc-level-bar">
                  <div className="esc-level-track">
                    {[1, 2, 3, 4].map(l => {
                      const lvl = Object.values(ESCALATION_LEVELS).find(el => el.level === l);
                      return (
                        <div key={l} className={`esc-level-dot ${inc.currentLevel >= l ? 'active' : ''} ${inc.status === 'resolved' ? 'resolved' : ''}`}
                          style={{ background: inc.currentLevel >= l ? getLevelColor(l) : undefined }}>
                          <span className="esc-level-label">{lvl?.label.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className="esc-level-arrow">→</span>
                </div>
                <div className="esc-item-actions">
                  {inc.status === 'open' && canEscalate && (
                    <Button variant="ghost" size="sm" onClick={() => escalateIncident(inc.id)}>
                      <ArrowUpCircle size={14} /> Escalate
                    </Button>
                  )}
                  {inc.status === 'open' && inc.currentLevel >= 3 && (
                    <Button variant="primary" size="sm" onClick={() => {
                      const res = prompt('Resolution notes:');
                      if (res) resolveIncident(inc.id, res);
                    }}>
                      <CheckCircle size={14} /> Resolve
                    </Button>
                  )}
                  {inc.history?.length > 1 && (
                    <span className="esc-history-count">
                      <MessageSquare size={12} /> {inc.history.length} updates
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
