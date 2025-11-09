import { useAuth0 } from '@auth0/auth0-react';
import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function Mission() {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', color: '#fff' }}>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/mission">Mission</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      <div className="profile-container">
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff', marginBottom: '2rem' }}>
          Mission Control
        </h1>
        {isAuthenticated ? (
          <div>
            <p>Welcome, {user?.name || 'Astronaut'}!</p>
            <p>Mission control is now accessible. This is a protected route.</p>
          </div>
        ) : (
          <p>Please log in to access mission control.</p>
        )}
      </div>
    </div>
  );
}

