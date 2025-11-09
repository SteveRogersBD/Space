import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function Projects() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', color: '#fff' }}>
      <nav className="navbar">
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
        <AuthButtons />
      </nav>

      <div className="profile-container">
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff', marginBottom: '2rem' }}>
          Projects
        </h1>
        <p>Welcome to the Projects gallery. Below is a short list of highlighted projects.</p>

        <section style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px' }}>
            <h3 style={{ color: '#c7f0ff' }}>Orbital Visualizer</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>A visual tool for simulating orbits and close approaches.</p>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px' }}>
            <h3 style={{ color: '#c7f0ff' }}>Impact Simulator</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Interactive meteor impact scenarios with variable parameters.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
