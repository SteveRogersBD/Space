import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function SimpleAuthGate({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [launching, setLaunching] = useState(false);

  // Match App.jsx pattern: in dev mode window.__DISABLE_AUTH0 is set to allow running without Auth0
  const authDisabled = typeof window !== 'undefined' && window.__DISABLE_AUTH0;
  const { loginWithRedirect, isLoading: authLoading } = authDisabled
    ? { loginWithRedirect: () => {}, isLoading: false }
    : useAuth0();

  // Auto-trigger Auth0 login when the gate is shown and Auth0 is enabled.
  // This mirrors the behavior in AuthButtons.handleLogin (short animation then redirect).
  useEffect(() => {
    if (authDisabled) return;
    // If auth0 is still loading, wait until it's ready
    if (authLoading) return;
    // Start the launch animation and redirect once
    setLaunching(true);
    const t = setTimeout(() => {
      loginWithRedirect({
        authorizationParams: { screen_hint: 'signup' },
      });
    }, 900);

    return () => clearTimeout(t);
  }, [authDisabled, authLoading, loginWithRedirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Minimal validation: require non-empty username and password
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Accept any non-empty credentials for this local gate.
    onLogin(username.trim());
  };

  // If Auth0 is enabled we show a simplified redirecting UI while we trigger login.
  if (!authDisabled) {
    return (
      <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Login required">
        <div style={cardStyle}>
          <h2 style={{ margin: 0, marginBottom: 8, color: '#e9f0ff' }}>Welcome to ULKAA</h2>
          <p style={{ margin: 0, marginBottom: 16, color: 'rgba(233,240,255,0.8)' }}>Redirecting to authentication...</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 72 }}>{/* placeholder for rocket icon */}</div>
            <div>
              <div style={{ color: '#e9f0ff', fontWeight: 700 }}>{launching ? 'Launching...' : 'Preparing...'}</div>
              <div style={{ fontSize: 13, color: 'rgba(233,240,255,0.6)' }}>You will be redirected to sign in.</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="button" style={buttonStyle} onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}>
              Sign in now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dev / auth-disabled fallback: local simple login form
  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Login required">
      <div style={cardStyle}>
        <h2 style={{ margin: 0, marginBottom: 8, color: '#e9f0ff' }}>Welcome to ULKAA</h2>
        <p style={{ margin: 0, marginBottom: 16, color: 'rgba(233,240,255,0.8)' }}>Please log in to continue.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <input
            aria-label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={inputStyle}
          />
          <input
            aria-label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
          />

          {error ? <div style={{ color: '#ff9b9b', fontSize: 13 }}>{error}</div> : null}

          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button type="submit" style={buttonStyle}>Log in</button>
            <button type="button" style={ghostStyle} onClick={() => { setUsername('guest'); setPassword('guest'); onLogin('guest'); }}>Guest</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, rgba(2,6,23,0.6), rgba(2,6,15,0.85))',
  backdropFilter: 'blur(4px)',
  zIndex: 2000,
  padding: '2rem',
};

const cardStyle = {
  width: 420,
  maxWidth: '100%',
  background: 'rgba(6,10,18,0.6)',
  border: '1px solid rgba(0, 224, 255, 0.18)',
  borderRadius: 12,
  padding: '1.25rem',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 224, 255, 0.06) inset',
};

const inputStyle = {
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.06)',
  background: 'rgba(255,255,255,0.02)',
  color: '#e9f0ff',
  outline: 'none',
};

const buttonStyle = {
  background: 'linear-gradient(90deg, rgba(0,224,255,0.18), rgba(138,43,226,0.12))',
  border: '1px solid rgba(0,224,255,0.35)',
  color: '#e9f0ff',
  padding: '0.55rem 1rem',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700,
};

const ghostStyle = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#e9f0ff',
  padding: '0.55rem 1rem',
  borderRadius: 8,
  cursor: 'pointer',
};
