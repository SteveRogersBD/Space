import React from 'react';
import SearchBox from './SearchBox';

export default function ControlPanel({ onSearchSelect }) {
  return (
    <aside style={{ 
      position: 'absolute', 
      right: 20, 
      top: 20, 
      width: 380, 
      padding: 24, 
      background: 'rgba(0, 0, 0, 0.85)', 
      borderRadius: 16, 
      backdropFilter: 'blur(16px)', 
      border: '2px solid rgba(100, 100, 100, 0.5)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      zIndex: 1000
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#ffffff', 
        fontSize: '1.3rem', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🌠</span>
        Live Meteor Tracker
      </h3>
      
      <div style={{ 
        padding: '16px',
        background: 'rgba(60, 60, 60, 0.3)',
        borderRadius: '12px',
        border: '2px solid rgba(100, 100, 100, 0.5)'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 12, 
          fontSize: '1rem', 
          color: '#ffffff', 
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          🔍 Search Location
        </label>
        <SearchBox onSelect={onSearchSelect} />
        <div style={{ 
          marginTop: 10, 
          fontSize: '0.8rem', 
          color: 'rgba(200, 200, 200, 0.9)',
          fontStyle: 'italic'
        }}>
          ⚡ Search any city to track meteors in that area
        </div>
      </div>
    </aside>
  );
}
