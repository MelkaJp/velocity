import { useVeloCity } from '../context/VeloCityContext';
import { Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import './StationQueueView.css';

export default function StationQueueView({ stationId, compact }) {
  const { getStationQueue, state } = useVeloCity();
  const queue = getStationQueue(stationId);
  const station = state.stations.find(s => s.id === stationId);
  const waiting = queue.filter(q => q.status === 'waiting');
  const serving = queue.filter(q => q.status === 'serving');

  if (compact) {
    return (
      <div className="queue-mini">
        <Users size={14} />
        <span>{waiting.length} waiting</span>
        {waiting.length > 0 && <span className="queue-mini-est">~{waiting.length * 8}min</span>}
      </div>
    );
  }

  return (
    <div className="queue-view">
      <div className="queue-view-header">
        <Users size={20} />
        <div>
          <h3>Live Queue</h3>
          <p className="queue-station-name">{station?.name || 'Station'}</p>
        </div>
        <div className="queue-stats">
          <div className="queue-stat">
            <span className="queue-stat-value">{waiting.length}</span>
            <span className="queue-stat-label">Waiting</span>
          </div>
          <div className="queue-stat">
            <span className="queue-stat-value">{serving.length}</span>
            <span className="queue-stat-label">Serving</span>
          </div>
        </div>
      </div>

      {waiting.length === 0 && serving.length === 0 ? (
        <div className="queue-empty">
          <Users size={32} />
          <p>No vehicles in queue</p>
        </div>
      ) : (
        <div className="queue-list">
          {serving.map(entry => (
            <div key={entry.id} className="queue-entry serving">
              <div className="queue-entry-pos">
                <span className="pos-badge serving-badge">Now</span>
              </div>
              <div className="queue-entry-info">
                <strong>{entry.vehiclePlate}</strong>
                <span className="queue-entry-type">{entry.vehicleType}</span>
              </div>
              <ArrowRight size={16} className="queue-entry-arrow" />
            </div>
          ))}
          {waiting.slice(0, 10).map(entry => (
            <div key={entry.id} className="queue-entry">
              <div className="queue-entry-pos">
                <span className="pos-badge">#{entry.position}</span>
              </div>
              <div className="queue-entry-info">
                <strong>{entry.vehiclePlate}</strong>
                <span className="queue-entry-type">{entry.vehicleType}</span>
              </div>
              <span className="queue-entry-wait">~{entry.estimatedWaitMinutes}min</span>
            </div>
          ))}
          {waiting.length > 10 && (
            <div className="queue-more">
              <MapPin size={14} /> +{waiting.length - 10} more vehicles
            </div>
          )}
        </div>
      )}
    </div>
  );
}
