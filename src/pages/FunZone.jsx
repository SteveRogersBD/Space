import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function FunZone() {
  const openSpaceDefender = () => {
    window.open('/space-defender/index.html', '_blank', 'width=1200,height=800');
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', color: '#fff' }}>
      <nav className="navbar">
        <Link to="/" className="nav-brand">ULKAA</Link>
        <ul className="nav-menu">
          <li><Link to="/live-tracking">Live Tracking</Link></li>
          <li><Link to="/fun-zone">Fun Zone</Link></li>
          <li><Link to="/impact-simulator">Impact Simulator</Link></li>
          <li><Link to="/info">Info-askAI</Link></li>
          <li><Link to="/eyes-on-solar-system">Explore Solar System</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      
      <div className="profile-container">
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff', marginBottom: '2rem', textAlign: 'center' }}>
          🎮 Fun Zone 🚀
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          
          {/* Space Defender Game */}
          <div style={{ 
            background: 'rgba(10, 22, 40, 0.95)', 
            border: '2px solid rgba(0, 212, 255, 0.3)', 
            borderRadius: '15px', 
            padding: '2rem', 
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          onClick={openSpaceDefender}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛸</div>
            <h3 style={{ color: '#00d4ff', marginBottom: '1rem', fontFamily: 'Orbitron, sans-serif' }}>
              Space Defender
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>
              Protect Earth from asteroid invasion! Survive 5 waves of increasing difficulty with power-ups and upgrades.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <span>🎯 Shoot Asteroids</span>
              <span>❤️ 3 Lives</span>
              <span>⚡ Power-ups</span>
            </div>
            <button style={{
              background: 'linear-gradient(135deg, #00ff88, #00ccff)',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 30px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              🚀 PLAY NOW
            </button>
          </div>

          {/* Coming Soon Games */}
          <div style={{ 
            background: 'rgba(40, 40, 40, 0.7)', 
            border: '2px solid rgba(100, 100, 100, 0.3)', 
            borderRadius: '15px', 
            padding: '2rem', 
            textAlign: 'center',
            opacity: '0.6'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌌</div>
            <h3 style={{ color: '#888', marginBottom: '1rem', fontFamily: 'Orbitron, sans-serif' }}>
              Galaxy Explorer
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
              Navigate through space, discover new planets, and collect cosmic resources.
            </p>
            <button style={{
              background: '#555',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 30px',
              color: '#aaa',
              fontWeight: 'bold',
              cursor: 'not-allowed'
            }}>
              Coming Soon
            </button>
          </div>

          <div style={{ 
            background: 'rgba(40, 40, 40, 0.7)', 
            border: '2px solid rgba(100, 100, 100, 0.3)', 
            borderRadius: '15px', 
            padding: '2rem', 
            textAlign: 'center',
            opacity: '0.6'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ color: '#888', marginBottom: '1rem', fontFamily: 'Orbitron, sans-serif' }}>
              Rocket Builder
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
              Design and launch your own rockets. Test different configurations and reach for the stars.
            </p>
            <button style={{
              background: '#555',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 30px',
              color: '#aaa',
              fontWeight: 'bold',
              cursor: 'not-allowed'
            }}>
              Coming Soon
            </button>
          </div>

        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '10px' }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>🎯 Game Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>🏆 High Score Tracking</div>
            <div>⚡ Power-up System</div>
            <div>🌊 Progressive Difficulty</div>
            <div>💾 Save Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}

