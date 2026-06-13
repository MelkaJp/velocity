import { useVeloCity } from '../context/VeloCityContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, MapPin, Users, Building2, Home, LogOut, User, Activity, Car, Shield, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar({ currentPortal, onPortalChange, user, onLogout }) {
  const { state } = useVeloCity();
  const { t, language, changeLanguage, languages } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const role = user?.role;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
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

        <div className="nav-user">
          <motion.div 
            className="user-info"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${roleColors[role]}, ${roleColors[role]}88)` }}>
              <User size={16} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{roleLabels[role] || role}</span>
            </div>
          </motion.div>
          
          <motion.button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          
          <motion.div className="lang-selector">
            <motion.button 
              className="lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              whileHover={{ scale: 1.1 }}
            >
              <span className="lang-label">{language.toUpperCase()}</span>
            </motion.button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  className="lang-menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {languages.map(lang => (
                    <button 
                      key={lang.code}
                      className={`lang-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => { changeLanguage(lang.code); setShowLangMenu(false); }}
                    >
                      {lang.native}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.button 
            className="logout-btn" 
            onClick={onLogout} 
            title="Logout"
            whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}