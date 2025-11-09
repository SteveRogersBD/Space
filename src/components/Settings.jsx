import React, { useState } from 'react';
import { StateManager } from '../store/StateManager';

export default function Settings() {
  const [state, setState] = useState(StateManager.getState().ui);

  const toggleDarkMode = () => {
    const newVal = !state.darkMode;
    setState({ ...state, darkMode: newVal });
    StateManager.setState({ ui: { ...state, darkMode: newVal } });
  };

  const toggleAmbientMode = () => {
    const newVal = !state.ambientMode;
    setState({ ...state, ambientMode: newVal });
    StateManager.setState({ ui: { ...state, ambientMode: newVal } });
  };

  const setQuality = (level) => {
    setState({ ...state, particleDensity: level });
    StateManager.setState({ ui: { ...state, particleDensity: level } });
  };

  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#00d4ff', fontSize: '0.9rem' }}>Settings</h4>
      
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={state.darkMode} onChange={toggleDarkMode} />
        <span>Dark Mode</span>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={state.ambientMode} onChange={toggleAmbientMode} />
        <span>Ambient Mode</span>
      </label>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#cfefff' }}>
          Particle Quality
        </label>
        <select 
          value={state.particleDensity} 
          onChange={(e) => setQuality(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}
