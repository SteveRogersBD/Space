import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SimpleAuthGate from './components/SimpleAuthGate';
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
import EyesOnSolarSystem from './pages/EyesOnSolarSystem';
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

  // Check Auth0 authentication status
  const { isAuthenticated, isLoading: authLoading } = authDisabled 
    ? { isAuthenticated: false, isLoading: false } 
    : useAuth0();

  // Show loading while Auth0 is checking authentication
  if (authLoading) {
    return (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    );
  }

  // If not authenticated, show login gate
  if (!isAuthenticated && !authDisabled) {
    return <SimpleAuthGate onLogin={() => {}} />;
  }

  // For dev mode without Auth0, use simple localStorage check
  const [siteAuth, setSiteAuth] = useState(() => {
    if (!authDisabled) return true; // Auth0 handles authentication
    try {
      const v = localStorage.getItem('ulkAuth');
      return v ? JSON.parse(v).loggedIn : false;
    } catch (e) {
      return false;
    }
  });

  const handleSiteLogin = (user) => {
    try {
      localStorage.setItem('ulkAuth', JSON.stringify({ loggedIn: true, user }));
    } catch (e) {}
    setSiteAuth(true);
  };

  // Dev mode fallback login check
  if (authDisabled && !siteAuth) {
    return <SimpleAuthGate onLogin={handleSiteLogin} />;
  }

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
        <Route path="/eyes-on-solar-system" element={<EyesOnSolarSystem />} />
      </Routes>
    </Router>
  );
}

export default App;

