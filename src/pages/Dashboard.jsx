import { useAuth0 } from '@auth0/auth0-react';
import Profile from '../components/Profile';
import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div className="auth0-login-container">
        <div className="auth0-login-box">
          <h2 className="auth0-login-title">Please log in to access the Dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/mission">Mission</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      <Profile />
    </div>
  );
}

