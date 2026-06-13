import { Fuel } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading Systems...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-bg-orb" />
      <div className="loading-content">
        <div className="loading-logo-wrapper">
          <div className="loading-logo">
            <Fuel size={48} strokeWidth={2.5} className="loading-logo-icon" />
          </div>
          <div className="loading-ping" />
        </div>
        <div className="loading-brand">
          Velo<span className="loading-brand-accent">City</span>
        </div>
        <div className="loading-bar-container">
          <div className="loading-label">{message}</div>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
