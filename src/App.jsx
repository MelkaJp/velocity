import { useState, useEffect } from 'react';
import { VeloCityProvider, useVeloCity } from './context/VeloCityContext';
import { LanguageProvider } from './context/TranslationContext';
import { ToastProvider } from './components/Toast';
import { PageTransition } from './components/PageTransition';
import BackToTop from './components/BackToTop';
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

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!state.isAuthenticated && state.currentPortal !== 'landing') {
    return <Auth />;
  }

  const renderContent = () => {
    if (!state.isAuthenticated) {
      if (state.currentPage !== 'landing') {
        const PageComponent = INFO_PAGES[state.currentPage];
        if (PageComponent) return <PageComponent />;
      }
      return <Landing />;
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
        return <Landing />;
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

  return (
    <div className="app">
      {state.isAuthenticated && (
        <Navbar 
          currentPortal={state.currentPortal} 
          onPortalChange={handlePortalChange}
          user={state.user}
          onLogout={logout}
        />
      )}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <PageTransition key={state.isAuthenticated ? state.user?.role : state.currentPage}>
            {renderContent()}
          </PageTransition>
        </AnimatePresence>
      </main>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <BackToTop />
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