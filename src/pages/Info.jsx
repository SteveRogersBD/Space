import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function Info() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', color: '#fff' }}>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/info">Info</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      <div className="profile-container">
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff', marginBottom: '2rem' }}>
          Information
        </h1>
        <p>Space information and resources coming soon...</p>
      </div>
    </div>
  );
}

