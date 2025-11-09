import React, { useState } from 'react';
import { SearchController } from '../controllers/SearchController';

export default function SearchBox({ onSelect }) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!q) return;
    setLoading(true);
    setError('');
    try {
      const res = await SearchController.search(q);
      setLoading(false);
      if (res && res.geometry) {
        onSelect && onSelect({ lat: res.geometry.lat, lng: res.geometry.lng });
        setQ(''); // Clear input on success
        setError('');
      } else {
        setError('Location not found. Try a different search.');
      }
    } catch (err) {
      setLoading(false);
      console.error('SearchBox error:', err);
      if (err.message.includes('API key')) {
        setError('API configuration error. Check console.');
      } else if (err.message.includes('No results')) {
        setError('Location not found. Try: "London" or "Tokyo"');
      } else {
        setError('Search failed. Check your internet connection.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={submit} style={{ display: 'flex', gap: 10 }} aria-label="Search location">
        <input
          aria-label="Search for a city or country"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search location (e.g., Tokyo, Paris)"
          style={{ 
            flex: 1,
            padding: '0.85rem 1.1rem', 
            borderRadius: 10, 
            border: '2px solid rgba(100, 100, 100, 0.6)', 
            background: 'rgba(255, 255, 255, 0.08)', 
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(150, 150, 150, 1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(100, 100, 100, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '0.85rem 1.5rem', 
            borderRadius: 10, 
            background: loading ? '#555' : 'linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2a5f9e 100%)', 
            border: 'none', 
            color: '#fff',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
            transform: loading ? 'none' : 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
            }
          }}
        >
          {loading ? '🔍' : '🚀 Go'}
        </button>
      </form>
      {error && (
        <p style={{ 
          marginTop: 10, 
          padding: '8px 12px',
          background: 'rgba(255, 107, 107, 0.15)',
          border: '1px solid rgba(255, 107, 107, 0.4)',
          borderRadius: 8,
          color: '#ff6b6b', 
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          ⚠️ {error}
        </p>
      )}
      <p style={{ 
        marginTop: 10, 
        color: 'rgba(200, 200, 200, 0.8)', 
        fontSize: '0.8rem',
        fontStyle: 'italic',
        fontWeight: 500
      }}>
        💡 Try: New York, London, Tokyo, Sydney
      </p>
    </div>
  );
}
