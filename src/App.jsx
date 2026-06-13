import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { VeloCityProvider, useVeloCity } from './context/VeloCityContext';
import { LanguageProvider } from './context/TranslationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Security from './pages/Security';
import Pricing from './pages/Pricing';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import DriverPortal from './pages/DriverPortal';
import FleetManager from './pages/FleetManager';
import StationManagerDashboard from './pages/StationManagerDashboard';
import StationWorkerDashboard from './pages/StationWorkerDashboard';
import MunicipalityDashboard from './pages/MunicipalityDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import Auth from './pages/Auth';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function VeloCityApp() {
  const { state, dispatch, logout } = useVeloCity();
  const { session, profile, signOut } = useAuth();
  
  useEffect(() => {
    if (session && profile && !state.isAuthenticated) {
      dispatch({ type: 'LOGIN', payload: { user: { ...profile, role: profile.role }, token: session.access_token } });
    }
  }, [session, profile, state.isAuthenticated, dispatch]);
  
  const renderPortal = () => {
    const role = profile?.role || state.user?.role;
    
    if (!session && !state.isAuthenticated) {
      return <Landing />;
    }
    
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

  const handlePortalChange = async (portal) => {
    if (portal === 'logout') {
      await signOut();
      logout();
    } else {
      dispatch({ type: 'SET_PORTAL', payload: portal });
    }
  };

  if (!state.isAuthenticated && state.currentPortal !== 'landing' && !session) {
    return <Auth />;
  }

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
        {renderPortal()}
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter basename="/">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path="/security" element={<Security />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/app" element={<VeloCityApp />} />
        <Route path="/admin" element={<VeloCityApp />} />
        <Route path="/dashboard" element={<VeloCityApp />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/:mode" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/signup/:mode" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/forgot-password" element={<Auth initialMode="forgot" />} />
        <Route path="/reset-password" element={<Auth initialMode="reset" />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <VeloCityProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </ThemeProvider>
      </VeloCityProvider>
    </AuthProvider>
  );
}

export default App;