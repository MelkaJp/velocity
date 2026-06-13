import { useState, useEffect } from 'react';
import { VeloCityProvider, useVeloCity } from './context/VeloCityContext';
import { LanguageProvider } from './context/TranslationContext';
import { ToastProvider } from './components/Toast';
import { PageTransition } from './components/PageTransition';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import FloatingContact from './components/FloatingContact';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import { AnimatePresence } from 'framer-motion';
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
  const [scrollPct, setScrollPct] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('velocity_theme') || 'dark');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('velocity_theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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