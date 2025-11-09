import React from 'react';

export default function InfoCard({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      width: 320,
      maxHeight: '40vh',
      overflowY: 'auto',
      padding: 16,
      background: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 12,
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(0, 212, 255, 0.15)',
      color: '#fff',
      fontFamily: 'sans-serif',
      fontSize: '0.85rem'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#00d4ff', fontSize: '1rem' }}>{title}</h4>
      <ul style={{ margin: 0, padding: '0 0 0 1.2rem', listStyle: 'disc' }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            {item.label && <strong>{item.label}:</strong>} {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
