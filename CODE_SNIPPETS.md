# Auth0 Integration Code Snippets

This document contains the key code snippets for the Auth0 integration in the Antarikhs Space Landing Page.

## 1. src/index.jsx - Auth0Provider Setup

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId) {
  console.error('Missing Auth0 configuration. Please check your .env.local file.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: 'openid profile email offline_access',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
```

## 2. src/App.jsx - Routing with Protected Routes

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Mission from './pages/Mission';
import LiveTracking from './pages/LiveTracking';
import FunZone from './pages/FunZone';
import ImpactSimulator from './pages/ImpactSimulator';
import Info from './pages/Info';
import Insights from './pages/Insights';
import AstroStrike from './pages/AstroStrike';

function App() {
  const { isLoading, error } = useAuth0();

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
  const ProtectedDashboard = withAuthenticationRequired(Dashboard, {
    onRedirecting: () => (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    ),
  });

  const ProtectedMission = withAuthenticationRequired(Mission, {
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
      </Routes>
    </Router>
  );
}

export default App;
```

## 3. src/components/AuthButtons.jsx - Login/Logout Buttons

```jsx
import { useAuth0 } from '@auth0/auth0-react';

export default function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <button className="login-btn" disabled>
        Loading...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <button
        className="login-btn"
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
      >
        Log Out
      </button>
    );
  }

  return (
    <button
      className="login-btn"
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup',
          },
        })
      }
    >
      Log In
    </button>
  );
}
```

## 4. src/components/Profile.jsx - User Profile Display

```jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: 'openid profile email offline_access',
            },
          });
          setToken(accessToken);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.picture || 'https://via.placeholder.com/100'}
          alt={user.name || 'User'}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{user.name || 'User'}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-detail-item">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        {user.email_verified !== undefined && (
          <div className="profile-detail-item">
            <strong>Email Verified:</strong>
            <span>{user.email_verified ? 'Yes' : 'No'}</span>
          </div>
        )}
        {user.nickname && (
          <div className="profile-detail-item">
            <strong>Nickname:</strong>
            <span>{user.nickname}</span>
          </div>
        )}
        {user.sub && (
          <div className="profile-detail-item">
            <strong>User ID:</strong>
            <span>{user.sub}</span>
          </div>
        )}
        {token && (
          <div className="profile-detail-item">
            <strong>Access Token:</strong>
            <span style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
              {token.substring(0, 50)}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 5. src/components/ProtectedRoute.jsx - Route Protection Wrapper

```jsx
import { withAuthenticationRequired } from '@auth0/auth0-react';

export default function ProtectedRoute({ component, ...props }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    ),
    returnTo: window.location.pathname,
  });

  return <Component {...props} />;
}

// Higher-order component wrapper for easier usage
export function withProtectedRoute(Component) {
  return withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Loading...</h2>
        </div>
      </div>
    ),
  });
}
```

## 6. .env.local - Environment Variables

```env
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.krishnaiot.org
```

## 7. vite.config.js - Vite Configuration

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

## 8. Usage Examples

### Using Protected Routes

```jsx
import { withAuthenticationRequired } from '@auth0/auth0-react';

function MyProtectedComponent() {
  return <div>This is a protected component</div>;
}

export default withAuthenticationRequired(MyProtectedComponent, {
  onRedirecting: () => <div>Loading...</div>,
});
```

### Getting Access Token

```jsx
import { useAuth0 } from '@auth0/auth0-react';

function MyComponent() {
  const { getAccessTokenSilently } = useAuth0();

  const callAPI = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email',
        },
      });
      
      // Use token to call your API
      const response = await fetch('https://api.example.com/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  return <button onClick={callAPI}>Call API</button>;
}
```

### Checking Authentication Status

```jsx
import { useAuth0 } from '@auth0/auth0-react';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

## Best Practices

1. **Always check isLoading**: Before accessing user data, check if Auth0 is still loading
2. **Handle errors**: Always wrap Auth0 calls in try-catch blocks
3. **Use environment variables**: Never hardcode Auth0 credentials
4. **Refresh tokens**: Enable `useRefreshTokens` for better UX
5. **Secure storage**: Use `localStorage` or `memory` based on your security requirements
6. **Token scope**: Only request the scopes you need
7. **Audience**: Always specify an audience when calling APIs

## Security Considerations

1. **HTTPS in production**: Always use HTTPS in production
2. **Token storage**: Consider using `memory` storage for higher security
3. **Token expiration**: Handle token expiration gracefully
4. **CSRF protection**: Auth0 handles CSRF protection automatically
5. **XSS protection**: Sanitize user input and use React's built-in XSS protection

