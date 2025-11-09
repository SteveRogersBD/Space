import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function AstroStrike() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', color: '#fff' }}>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/astro-strike">Astro Strike</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      <div className="profile-container">
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff', marginBottom: '2rem' }}>
          Astro Strike
        </h1>
        <p>Astro Strike game coming soon...</p>
      </div>
    </div>
  );
}

