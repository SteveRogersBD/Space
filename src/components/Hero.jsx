import React from 'react';

export default function Hero({ onScrollToGlobe }) {
  return (
    <section className="hero" style={{ 
      padding: '6rem 2rem', 
      textAlign: 'center', 
      color: '#fff',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,20,40,0.85) 100%)'
    }}>
      <h1 style={{ 
        fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
        fontFamily: 'Orbitron, sans-serif', 
        color: '#00d4ff',
        marginBottom: '1rem',
        textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
      }}>
        Live Meteor & NEO Tracker
      </h1>
      <p style={{ 
        marginTop: '1rem', 
        color: '#cfefff',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        maxWidth: '600px',
        margin: '1rem auto'
      }}>
        Interactive real-time 3D globe tracking meteors, fireballs and near-Earth objects with live data from NASA, AMS, and GMN.
      </p>
      <button
        onClick={onScrollToGlobe}
        style={{ 
          marginTop: '2rem', 
          padding: '0.9rem 1.6rem', 
          background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)', 
          color: '#001', 
          borderRadius: 8, 
          border: 'none', 
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 28px rgba(0, 212, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.4)';
        }}
      >
        View Live Globe ↓
      </button>
    </section>
  );
}
