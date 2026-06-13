import { useVeloCity } from '../context/VeloCityContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, MapPin, Users, Building2, Home, LogOut, User, Activity, Car, Shield, Menu, X, ChevronDown, Settings } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ currentPortal, onPortalChange, user, onLogout }) {
  const { state } = useVeloCity();
  const role = user?.role;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

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

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="nav-container">
          <motion.div
            className="nav-logo"
            onClick={() => onPortalChange('landing')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="logo-icon">
              <Fuel size={24} />
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
              </motion.button>
            ))}
          </div>

          <div className="nav-user" ref={menuRef}>
            <motion.div
              className={`user-info ${userMenuOpen ? 'active' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${roleColors[role]}, ${roleColors[role]}88)` }}>
                <User size={16} />
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
                  <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); onPortalChange('settings'); }}>
                    <Settings size={16} />
                    Settings
                  </button>
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
                    <User size={18} />
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
