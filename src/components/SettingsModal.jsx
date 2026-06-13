import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Moon, Sun, User, Mail, Globe } from 'lucide-react';
import './SettingsModal.css';

export default function SettingsModal({ open, onClose, user, theme, onThemeToggle, currency, onCurrencyChange }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Settings" size="md">
      <div className="settings-section">
        <h3 className="settings-section-title">
          <User size={16} />
          Profile
        </h3>
        <div className="settings-fields">
          <div className="settings-field">
            <label>Display Name</label>
            <div className="settings-input-wrap">
              <User size={16} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
          </div>
          <div className="settings-field">
            <label>Email</label>
            <div className="settings-input-wrap">
              <Mail size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">
          <Globe size={16} />
          Preferences
        </h3>
        <div className="settings-fields">
          <div className="settings-field">
            <label>Theme</label>
            <div className="settings-toggle-row">
              <span className="settings-toggle-label">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              <button className="settings-theme-btn" onClick={onThemeToggle}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
          <div className="settings-field">
            <label>Currency</label>
            <div className="settings-input-wrap">
              <Globe size={16} />
              <select value={currency} onChange={(e) => onCurrencyChange?.(e.target.value)}>
                <option value="ETB">ETB (Ethiopian Birr)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="RWF">RWF (Rwandan Franc)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Account</h3>
        <div className="settings-account-info">
          <div className="settings-info-row">
            <span>Role</span>
            <span className="settings-role-badge">{user?.role?.replace('_', ' ') || 'N/A'}</span>
          </div>
          <div className="settings-info-row">
            <span>Username</span>
            <span>{user?.username || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <Button variant="primary" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
}
