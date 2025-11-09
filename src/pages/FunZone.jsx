import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function FunZone() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', color: '#fff' }}>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/fun-zone">Fun Zone</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      <div className="profile-container">
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff', marginBottom: '2rem' }}>
          Fun Zone
        </h1>
        <p>Interactive space games and activities coming soon...</p>
      </div>
    </div>
  );
}

