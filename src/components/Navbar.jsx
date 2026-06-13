import { useVeloCity } from '../context/VeloCityContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, MapPin, Users, Building2, Home, LogOut, User, Activity, Car, Shield, Menu, X, ChevronDown, Settings, Search, Bell, Command, PanelLeft, HelpCircle } from 'lucide-react';
import './Navbar.css';

import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentPortal, onPortalChange, user, onLogout, theme, onThemeToggle, onSidebarToggle, sidebarOpen, notifications, unreadCount, onViewAllNotifications, onOpenSettings }) {
  const { state } = useVeloCity();
  const role = user?.role;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.querySelector('input')?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const portalConfig = {
    developer_admin: [
      { id: 'overview', icon: Activity, label: 'Overview' },
      { id: 'municipalities', icon: Building2, label: 'Municipalities' },
      { id: 'stations', icon: MapPin, label: 'Stations' },
      { id: 'transactions', icon: Fuel, label: 'Transactions' },
      { id: 'audit', icon: Shield, label: 'Audit' },
    ],
    municipality_admin: [
      { id: 'overview', icon: Activity, label: 'Overview' },
      { id: 'stations', icon: MapPin, label: 'Stations' },
      { id: 'transactions', icon: Fuel, label: 'Transactions' },
      { id: 'reports', icon: Activity, label: 'Reports' },
      { id: 'alerts', icon: Shield, label: 'Alerts' },
    ],
    station_manager: [
      { id: 'overview', icon: Activity, label: 'Overview' },
      { id: 'transactions', icon: Fuel, label: 'Transactions' },
      { id: 'workers', icon: Users, label: 'Workers' },
      { id: 'inventory', icon: Fuel, label: 'Inventory' },
      { id: 'settings', icon: Activity, label: 'Settings' },
    ],
    station_worker: [
      { id: 'dispense', icon: Fuel, label: 'Dispense' },
      { id: 'history', icon: Activity, label: 'History' },
    ],
    driver: [
      { id: 'vehicles', icon: Car, label: 'My Vehicles' },
      { id: 'wallet', icon: Fuel, label: 'Wallet' },
    ],
    fleet_owner: [
      { id: 'vehicles', icon: Car, label: 'Vehicles' },
      { id: 'drivers', icon: Users, label: 'Drivers' },
      { id: 'wallet', icon: Fuel, label: 'Wallet' },
      { id: 'reports', icon: Activity, label: 'Reports' },
    ],
  };

  const portals = portalConfig[role] || portalConfig.driver;

  const roleColors = {
    super_admin: '#f472b6',
    developer_admin: '#6366f1',
    municipality_admin: '#3b82f6',
    station_manager: '#10b981',
    station_worker: '#00d4aa',
    fleet_owner: '#f59e0b',
    driver: '#94a3b8'
  };

  const roleLabels = {
    super_admin: 'Super Admin',
    developer_admin: 'Developer Admin',
    municipality_admin: 'Municipality Admin',
    station_manager: 'Station Manager',
    station_worker: 'Station Worker',
    fleet_owner: 'Fleet Owner',
    driver: 'Driver'
  };

  const notifList = notifications || [];
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="nav-container">
          <div className="nav-left">
            <motion.button
              className="sidebar-toggle"
              onClick={onSidebarToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
            >
              <PanelLeft size={20} className={`sidebar-toggle-icon ${sidebarOpen ? '' : 'closed'}`} />
            </motion.button>

            <motion.div
              className="nav-logo"
              onClick={() => onPortalChange('landing')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="logo-icon">
                <Fuel size={22} />
                <div className="logo-glow" />
              </div>
              <span className="logo-text">VeloCity</span>
            </motion.div>

            <div className="nav-portals">
              {portals.map((portal, index) => (
                <motion.button
                  key={portal.id}
                  className={`portal-btn ${currentPortal === portal.id ? 'active' : ''}`}
                  onClick={() => onPortalChange(portal.id)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <portal.icon size={18} />
                  <span>{portal.label}</span>
                  {currentPortal === portal.id && (
                    <motion.div
                      className="portal-active-indicator"
                      layoutId="portalIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="nav-right" ref={menuRef}>
            <div className="nav-search" ref={searchRef}>
              <motion.button
                className={`search-toggle ${searchOpen ? 'open' : ''}`}
                onClick={() => setSearchOpen(!searchOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Search"
              >
                <Search size={18} />
              </motion.button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    className="search-expanded"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search size={16} className="search-expanded-icon" />
                    <input
                      type="text"
                      placeholder="Search vehicles, stations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <kbd className="search-kbd">⌘K</kbd>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="nav-notif" ref={notifRef}>
              <motion.button
                className="notif-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    className="notif-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="notif-header">
                      <span className="notif-title">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="notif-unread-badge">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="notif-list">
                      {notifList.slice(0, 4).map((n) => (
                        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                          <div className={`notif-dot ${!n.read ? 'active' : ''}`} />
                          <div className="notif-content">
                            <p className="notif-text">{n.text}</p>
                            <span className="notif-time">{n.time}</span>
                          </div>
                        </div>
                      ))}
                      {notifList.length === 0 && (
                        <div className="notif-item" style={{ justifyContent: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="notif-footer">
                      <button className="notif-view-all" onClick={onViewAllNotifications}>View All</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle theme={theme} onToggle={onThemeToggle} />

            <motion.div
              className={`user-info ${userMenuOpen ? 'active' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${roleColors[role]}, ${roleColors[role]}88)` }}>
                {initials}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{roleLabels[role] || role}</span>
              </div>
              <ChevronDown size={14} className={`user-chevron ${userMenuOpen ? 'open' : ''}`} />
            </motion.div>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-role">{roleLabels[role] || role}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); onOpenSettings(); }}>
                    <Settings size={16} />
                    Settings
                  </button>
                  <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); }}>
                    <HelpCircle size={16} />
                    Help & Support
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={() => { setUserMenuOpen(false); onLogout(); }}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-user">
                  <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${roleColors[role]}, ${roleColors[role]}88)` }}>
                    {initials}
                  </div>
                  <div>
                    <div className="mobile-user-name">{user?.name}</div>
                    <div className="mobile-user-role">{roleLabels[role] || role}</div>
                  </div>
                </div>
                <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>

              <div className="mobile-search">
                <Search size={16} className="mobile-search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="mobile-search-input"
                />
              </div>

              <div className="mobile-menu-nav">
                <div className="mobile-nav-label">Navigation</div>
                {portals.map((portal) => (
                  <motion.button
                    key={portal.id}
                    className={`mobile-nav-item ${currentPortal === portal.id ? 'active' : ''}`}
                    onClick={() => { onPortalChange(portal.id); setMobileMenuOpen(false); }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <portal.icon size={20} />
                    <span>{portal.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mobile-menu-actions">
                <button className="mobile-action-btn" onClick={() => { setMobileMenuOpen(false); onOpenSettings(); }}>
                  <Settings size={18} />
                  Settings
                </button>
                <button className="mobile-action-btn">
                  <HelpCircle size={18} />
                  Help & Support
                </button>
              </div>

              <div className="mobile-menu-footer">
                <motion.button
                  className="mobile-logout-btn"
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={18} />
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
