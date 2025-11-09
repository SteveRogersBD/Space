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

