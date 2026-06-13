import { useState, useEffect, useCallback } from 'react';
import { VeloCityProvider, useVeloCity } from './context/VeloCityContext';
import { LanguageProvider } from './context/TranslationContext';
import { ToastProvider, useToast } from './components/Toast';
import { PageTransition } from './components/PageTransition';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import FloatingContact from './components/FloatingContact';
import LoadingScreen from './components/LoadingScreen';
import CommandPalette from './components/CommandPalette';
import NotificationModal from './components/NotificationModal';
import SettingsModal from './components/SettingsModal';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Home, Activity, Users, MapPin, Car, Fuel, Shield, Settings } from 'lucide-react';
import DriverPortal from './pages/DriverPortal';
import FleetManager from './pages/FleetManager';
import StationManagerDashboard from './pages/StationManagerDashboard';
import StationWorkerDashboard from './pages/StationWorkerDashboard';
import MunicipalityDashboard from './pages/MunicipalityDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import Auth from './pages/Auth';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Security from './pages/Security';
import Pricing from './pages/Pricing';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import './App.css';

const INFO_PAGES = {
  about: About,
  contact: Contact,
  features: Features,
  security: Security,
  pricing: Pricing,
  careers: Careers,
  privacy: Privacy,
  terms: Terms,
  cookies: Cookies,
};

function VeloCityApp() {
  const { state, dispatch, logout, setPage } = useVeloCity();
  const { toast } = useToast();
  const [scrollPct, setScrollPct] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('velocity_theme') || 'dark');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('velocity_theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.notifications.length === 0) {
      const seed = [
        { id: 'n1', text: 'New station registration pending approval', time: '5m ago', type: 'info', read: false },
        { id: 'n2', text: 'Fuel level alert: Station #042 below 15%', time: '15m ago', type: 'warning', read: false },
        { id: 'n3', text: 'Settlement report for March generated', time: '2h ago', type: 'success', read: true },
        { id: 'n4', text: 'Driver #8712 flagged for unusual activity', time: '4h ago', type: 'warning', read: false },
      ];
      dispatch({ type: 'SET_NOTIFICATIONS', payload: seed });
    }
  }, [state.isAuthenticated, state.notifications.length, dispatch]);

  const handleCmdAction = useCallback((action, payload) => {
    switch (action) {
      case 'help': toast.info('Help & Support is available'); break;
      case 'portal': setPage(payload); break;
      default: break;
    }
  }, [setPage, toast]);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!state.isAuthenticated && state.currentPortal !== 'landing') {
    return <Auth />;
  }

  const renderContent = () => {
    if (!state.isAuthenticated) {
      if (state.currentPage !== 'landing') {
        const PageComponent = INFO_PAGES[state.currentPage];
        if (PageComponent) return <PageComponent />;
      }
      return <Landing theme={theme} onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />;
    }

    const role = state.user?.role;
    switch (role) {
      case 'driver':
        return <DriverPortal />;
      case 'fleet_owner':
        return <FleetManager />;
      case 'station_manager':
        return <StationManagerDashboard />;
      case 'station_worker':
        return <StationWorkerDashboard />;
      case 'municipality_admin':
        return <MunicipalityDashboard />;
      case 'developer_admin':
        return <DeveloperDashboard />;
      default:
        return <Landing theme={theme} onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />;
    }
  };

  const handlePortalChange = (portal) => {
    if (portal === 'logout') {
      logout();
    } else {
      dispatch({ type: 'SET_PORTAL', payload: portal });
      localStorage.setItem('velocity_currentPortal', portal);
    }
  };

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const notifications = state.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications.map(n => n.id === id ? { ...n, read: true } : n) });
  };

  const handleMarkAllRead = () => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications.map(n => ({ ...n, read: true })) });
  };

  const handleDismiss = (id) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications.filter(n => n.id !== id) });
  };

  const handleClearAll = () => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
  };

  const handleCurrencyChange = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
    localStorage.setItem('velocity_currency', currency);
    toast.success(`Currency changed to ${currency}`);
  };

  return (
    <div className="app">
      {state.isAuthenticated && (
        <Navbar 
          currentPortal={state.currentPortal} 
          onPortalChange={handlePortalChange}
          user={state.user}
          onLogout={logout}
          theme={theme}
          onThemeToggle={toggleTheme}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          notifications={notifications}
          unreadCount={unreadCount}
          onViewAllNotifications={() => setNotifModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
        />
      )}
      <AnimatePresence>
        {sidebarOpen && state.isAuthenticated && (
          <motion.aside
            className="app-sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-header">
              <span className="sidebar-title">Navigation</span>
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <nav className="sidebar-nav">
              <a href="#" className="sidebar-item active">
                <Home size={18} /> Dashboard
              </a>
              <a href="#" className="sidebar-item">
                <Activity size={18} /> Analytics
              </a>
              <a href="#" className="sidebar-item">
                <Users size={18} /> Users
              </a>
              <a href="#" className="sidebar-item">
                <MapPin size={18} /> Stations
              </a>
              <a href="#" className="sidebar-item">
                <Car size={18} /> Vehicles
              </a>
              <a href="#" className="sidebar-item">
                <Fuel size={18} /> Transactions
              </a>
              <a href="#" className="sidebar-item">
                <Shield size={18} /> Security
              </a>
              <a href="#" className="sidebar-item">
                <Settings size={18} /> Settings
              </a>
            </nav>
            <div className="sidebar-footer">
              <div className="sidebar-version">v2.4.0</div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <main className="main-content">
        <AnimatePresence mode="wait">
          <PageTransition key={state.isAuthenticated ? state.user?.role : state.currentPage}>
            {renderContent()}
          </PageTransition>
        </AnimatePresence>
      </main>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <BackToTop />
      <FloatingContact />
      <CookieConsent />

      <CommandPalette
        user={state.user}
        onAction={handleCmdAction}
        theme={theme}
        onThemeToggle={toggleTheme}
        onLogout={logout}
      />

      <NotificationModal
        open={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onDismiss={handleDismiss}
        onClearAll={handleClearAll}
      />

      <SettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        user={state.user}
        theme={theme}
        onThemeToggle={toggleTheme}
        currency={state.currency}
        onCurrencyChange={handleCurrencyChange}
      />
    </div>
  );
}

function App() {
  return (
    <VeloCityProvider>
      <LanguageProvider>
        <ToastProvider>
          <VeloCityApp />
        </ToastProvider>
      </LanguageProvider>
    </VeloCityProvider>
  );
}

export default App;