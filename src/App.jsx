import { VeloCityProvider, useVeloCity } from './context/VeloCityContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import DriverPortal from './pages/DriverPortal';
import FleetManager from './pages/FleetManager';
import StationManagerDashboard from './pages/StationManagerDashboard';
import StationWorkerDashboard from './pages/StationWorkerDashboard';
import MunicipalityDashboard from './pages/MunicipalityDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import Auth from './pages/Auth';
import './App.css';

function VeloCityApp() {
  const { state, dispatch, logout } = useVeloCity();

  if (!state.isAuthenticated && state.currentPortal !== 'landing') {
    return <Auth />;
  }

  const renderPortal = () => {
    const role = state.user?.role;
    
    if (!state.isAuthenticated) {
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

  const handlePortalChange = (portal) => {
    if (portal === 'logout') {
      logout();
    } else {
      dispatch({ type: 'SET_PORTAL', payload: portal });
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
        {renderPortal()}
      </main>
    </div>
  );
}

function App() {
  return (
    <VeloCityProvider>
      <VeloCityApp />
    </VeloCityProvider>
  );
}

export default App;