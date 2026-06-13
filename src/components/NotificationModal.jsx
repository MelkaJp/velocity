import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Bell, CheckCheck, X, Trash2, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import './NotificationModal.css';

const typeIcons = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  error: X,
};

const typeColors = {
  warning: '#FF6B35',
  info: '#3A86FF',
  success: '#06D6A0',
  error: '#EF476F',
};

export default function NotificationModal({ open, onClose, notifications = [], onMarkRead, onMarkAllRead, onDismiss, onClearAll }) {
  const [filter, setFilter] = useState('all');
  const unread = notifications.filter(n => !n.read).length;

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read)
    : filter === 'read' ? notifications.filter(n => n.read)
    : notifications;

  return (
    <Modal open={open} onClose={onClose} title="Notifications" size="lg">
      <div className="notif-toolbar">
        <div className="notif-filters">
          <button className={`notif-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All ({notifications.length})
          </button>
          <button className={`notif-filter ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            Unread ({unread})
          </button>
          <button className={`notif-filter ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
            Read ({notifications.length - unread})
          </button>
        </div>
        <div className="notif-actions">
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
              <CheckCheck size={16} />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              <Trash2 size={16} />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="notif-list">
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <Bell size={40} />
            <p>No notifications{filter !== 'all' ? ` (${filter})` : ''}</p>
          </div>
        ) : (
          filtered.map((n) => {
            const TypeIcon = typeIcons[n.type] || Bell;
            const color = typeColors[n.type] || 'var(--text-muted)';
            return (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                <div className="notif-icon" style={{ color, background: `${color}14` }}>
                  <TypeIcon size={18} />
                </div>
                <div className="notif-body">
                  <p className="notif-text">{n.text}</p>
                  <span className="notif-time">{n.time}</span>
                </div>
                <div className="notif-item-actions">
                  {!n.read && (
                    <button className="notif-mark-btn" onClick={() => onMarkRead?.(n.id)} title="Mark as read">
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button className="notif-dismiss-btn" onClick={() => onDismiss?.(n.id)} title="Dismiss">
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
