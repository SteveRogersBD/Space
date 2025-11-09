import React, { useState, useEffect } from 'react';
import { LayerManager } from '../controllers/LayerManager';

export default function LayerToggles() {
  const [layers, setLayers] = useState({});

  useEffect(() => {
    // Initialize default layers
    LayerManager.createLayer('meteors', { visible: true });
    LayerManager.createLayer('neos', { visible: true });
    LayerManager.createLayer('gmn', { visible: false });

    // Listen for changes
    const unsub = LayerManager.onChange(() => {
      const newState = {};
      LayerManager.layers.forEach((layer, name) => {
        newState[name] = layer.visible;
      });
      setLayers(newState);
    });

    // Initial state
    const initial = {};
    LayerManager.layers.forEach((layer, name) => {
      initial[name] = layer.visible;
    });
    setLayers(initial);

    return unsub;
  }, []);

  const toggle = (name) => {
    const layer = LayerManager.get(name);
    LayerManager.setVisible(name, !(layer && layer.visible));
  };

  const getButtonStyle = (isActive) => ({
    padding: '0.6rem 0.9rem',
    borderRadius: 6,
    background: isActive ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
    color: isActive ? '#00d4ff' : '#fff',
    border: `1px solid ${isActive ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
    fontWeight: isActive ? 600 : 400
  });

  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }} role="group" aria-label="Layer toggles">
      <button onClick={() => toggle('meteors')} style={getButtonStyle(layers.meteors)}>
        🌠 Meteors
      </button>
      <button onClick={() => toggle('neos')} style={getButtonStyle(layers.neos)}>
        🪨 NEOs
      </button>
      <button onClick={() => toggle('gmn')} style={getButtonStyle(layers.gmn)}>
        📹 GMN Cameras
      </button>
    </div>
  );
}
