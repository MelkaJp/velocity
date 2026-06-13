import { useState, useEffect } from 'react';
import { useVeloCity } from '../context/VeloCityContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import Button from './Button';
import './OfflineSyncBanner.css';

export default function OfflineSyncBanner() {
  const { state, syncOfflineQueue } = useVeloCity();
  const [online, setOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const pending = state.pendingOffline?.filter(q => !q.synced) || [];
  const stored = JSON.parse(localStorage.getItem('velocity_offline_queue') || '[]');
  const totalUnsynced = stored.filter(q => !q.synced).length;

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncOfflineQueue();
    setResult(res);
    setTimeout(() => setResult(null), 4000);
    setSyncing(false);
  };

  if (online && totalUnsynced === 0) return null;

  return (
    <div className={`offline-banner ${online ? 'online' : 'offline'}`}>
      <div className="offline-banner-content">
        {online ? (
          <>
            <Wifi size={16} />
            <span>Back online — {totalUnsynced} pending transaction{totalUnsynced !== 1 ? 's' : ''}</span>
            <Button variant="ghost" size="sm" onClick={handleSync} loading={syncing}>
              <RefreshCw size={14} /> Sync Now
            </Button>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>Offline mode — transactions queued locally</span>
          </>
        )}
        {result && (
          <span className="sync-result">
            <CheckCircle size={14} /> {result.synced} synced
          </span>
        )}
      </div>
    </div>
  );
}
