import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  const [launching, setLaunching] = useState(false);

  const handleLogin = async () => {
    if (launching) return;
    setLaunching(true);

    // Play a short rocket launch animation, then redirect to Auth0
    setTimeout(() => {
      loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
    }, 900);
  };

  const handleLogout = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  if (isLoading) {
    return (
      <button className="login-btn" disabled>
        Loading...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <button className="login-btn" onClick={handleLogout} aria-label="Log out">
        Log Out
      </button>
    );
  }

  return (
    <div className="launch-wrapper" aria-hidden={launching ? 'false' : 'true'}>
      <button
        className={`login-btn ${launching ? 'igniting' : ''}`}
        onClick={handleLogin}
        disabled={launching}
        aria-label="Launch (Log in)"
      >
        <span className="btn-icon" aria-hidden="true">🚀</span>
        <span className="btn-text">Launch</span>
      </button>

      {/* Rocket element that animates on launch */}
      <div className={`rocket ${launching ? 'launching' : ''}`} aria-hidden="true">
        <svg width="36" height="72" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2c1.5 0 3 1 4 2.5 1 1.3 2 3.5 2 6 0 4-3 9-9 15S5 35 3 31c-2-4 2-10 6-14C10 10 10.5 2 12 2z" fill="#c7f0ff" opacity="0.95"/>
        </svg>
      </div>
    </div>
  );
}

