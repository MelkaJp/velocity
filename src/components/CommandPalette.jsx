import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Sun, Moon, LogOut, HelpCircle, LayoutDashboard, Users, Settings, Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './CommandPalette.css';

const defaultActions = [
  { id: 'theme', label: 'Toggle Theme', icon: Sun, action: 'toggleTheme' },
  { id: 'logout', label: 'Sign Out', icon: LogOut, action: 'logout' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, action: 'help' },
];

const portalActions = (role) => {
  const map = {
    developer_admin: [
      { id: 'dev-overview', label: 'Developer Overview', icon: LayoutDashboard, action: 'portal', portal: 'overview' },
      { id: 'dev-muni', label: 'Municipalities', icon: Users, action: 'portal', portal: 'municipalities' },
      { id: 'dev-transactions', label: 'Transactions', icon: Terminal, action: 'portal', portal: 'transactions' },
    ],
    municipality_admin: [
      { id: 'muni-overview', label: 'Municipality Overview', icon: LayoutDashboard, action: 'portal', portal: 'overview' },
      { id: 'muni-stations', label: 'Stations', icon: Users, action: 'portal', portal: 'stations' },
      { id: 'muni-reports', label: 'Reports', icon: Settings, action: 'portal', portal: 'reports' },
    ],
    station_manager: [
      { id: 'stmgr-overview', label: 'Station Overview', icon: LayoutDashboard, action: 'portal', portal: 'overview' },
      { id: 'stmgr-workers', label: 'Workers', icon: Users, action: 'portal', portal: 'workers' },
      { id: 'stmgr-inventory', label: 'Inventory', icon: Settings, action: 'portal', portal: 'inventory' },
    ],
  };
  return map[role] || [];
};

export default function CommandPalette({ user, onAction, theme, onThemeToggle, onLogout, onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const allActions = [
    ...(user ? portalActions(user.role) : []),
    ...defaultActions,
  ];

  const filtered = query.trim()
    ? allActions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    : allActions;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleAction = useCallback((action) => {
    setOpen(false);
    switch (action.action) {
      case 'toggleTheme': onThemeToggle(); break;
      case 'logout': onLogout(); break;
      case 'help': onAction?.('help'); break;
      case 'portal': onAction?.('portal', action.portal); break;
      default: break;
    }
  }, [onAction, onThemeToggle, onLogout]);

  const handleKeyNav = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleAction(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="cmd-palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmd-input-wrap">
              <Search size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search actions..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyNav}
              />
            </div>
            {filtered.length > 0 && (
              <div className="cmd-results">
                {filtered.map((action, i) => (
                  <button
                    key={action.id}
                    className={`cmd-item ${i === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleAction(action)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <action.icon size={16} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="cmd-empty">No results found</div>
            )}
            <div className="cmd-footer">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
