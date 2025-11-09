import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Mission from './pages/Mission';
import LiveTracking from './pages/LiveTracking';
import FunZone from './pages/FunZone';
import ImpactSimulator from './pages/ImpactSimulator';
import Info from './pages/Info';
import Insights from './pages/Insights';
import AstroStrike from './pages/AstroStrike';
import Projects from './pages/Projects';
import { withAuthenticationRequired } from '@auth0/auth0-react';

function App() {
  // Support dev mode without Auth0 configured by falling back to no-op values
  const authDisabled = typeof window !== 'undefined' && window.__DISABLE_AUTH0;
  const { isLoading, error } = authDisabled ? { isLoading: false, error: null } : useAuth0();

  if (isLoading) {
    return (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Authentication Error</h2>
          <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error.message}</p>
        </div>
      </div>
    );
  }

  // Protected route components
  const ProtectedDashboard = (typeof window !== 'undefined' && window.__DISABLE_AUTH0) ? Dashboard : withAuthenticationRequired(Dashboard, {
    onRedirecting: () => (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    ),
  });

  const ProtectedMission = (typeof window !== 'undefined' && window.__DISABLE_AUTH0) ? Mission : withAuthenticationRequired(Mission, {
    onRedirecting: () => (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    ),
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/mission" element={<ProtectedMission />} />
        <Route path="/live-tracking" element={<LiveTracking />} />
        <Route path="/fun-zone" element={<FunZone />} />
        <Route path="/impact-simulator" element={<ImpactSimulator />} />
        <Route path="/info" element={<Info />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/astro-strike" element={<AstroStrike />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;

