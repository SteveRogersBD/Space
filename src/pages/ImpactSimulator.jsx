import React, { useEffect, useRef, useState } from 'react';
import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';

export default function ImpactSimulator() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [diameter, setDiameter] = useState(100);
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  const [material, setMaterial] = useState('3000');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [impactMarker, setImpactMarker] = useState(null);
  const [damageCircles, setDamageCircles] = useState([]);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    createStars();

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const createStars = () => {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    starsContainer.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    `;
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.style.cssText = `
        position: absolute; width: 2px; height: 2px; background: white;
        border-radius: 50%; animation: twinkle 3s infinite;
        left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s; opacity: ${Math.random() * 0.7 + 0.3};
      `;
      starsContainer.appendChild(star);
    }
  };

  const initializeMap = () => {
    if (window.L && mapRef.current) {
      const mapInstance = window.L.map(mapRef.current, {
        center: [40.7128, -74.0060],
        zoom: 11,
        zoomControl: true,
        preferCanvas: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance);

      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        selectLocation(lat, lng, mapInstance);
      });

      setMap(mapInstance);
    }
  };

  const selectLocation = (lat, lng, mapInstance) => {
    setSelectedLocation({ lat, lng });
    setShowResults(false);
    
    // Clear previous markers
    if (impactMarker) {
      mapInstance.removeLayer(impactMarker);
    }
    damageCircles.forEach(circle => mapInstance.removeLayer(circle));
    setDamageCircles([]);
    
    // Add location marker
    const marker = window.L.marker([lat, lng], {
      icon: window.L.divIcon({
        className: 'location-marker',
        html: '📍',
        iconSize: [30, 40],
        iconAnchor: [15, 40]
      })
    }).addTo(mapInstance);
    
    setImpactMarker(marker);
  };

  const calculateImpact = (lat, lng) => {
    const radius = diameter / 2;
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * parseFloat(material);
    const velocityMs = velocity * 1000;
    const kineticEnergy = 0.5 * mass * Math.pow(velocityMs, 2);
    const megatonsTNT = kineticEnergy / 4.184e15;

    const fireballRadius = 0.44 * Math.pow(megatonsTNT, 0.4);
    const craterDiameter = Math.pow(kineticEnergy / 1e15, 0.25) * 1 * Math.sin(angle * Math.PI / 180);
    const shockwaveRadius = 2.2 * Math.pow(megatonsTNT, 0.33);
    const thermalRadius = 1.5 * Math.pow(megatonsTNT, 0.41);
    const affectedArea = Math.PI * Math.pow(shockwaveRadius, 2);
    const casualties = Math.floor(affectedArea * 5000);

    return {
      lat, lng, energy: megatonsTNT, fireballRadius, craterDiameter,
      shockwaveRadius, thermalRadius, casualties
    };
  };

  const launchAsteroid = () => {
    if (!selectedLocation || !map) return;
    
    const { lat, lng } = selectedLocation;
    const data = calculateImpact(lat, lng);
    
    // Clear previous impact
    if (impactMarker) map.removeLayer(impactMarker);
    damageCircles.forEach(circle => map.removeLayer(circle));
    
    // Add impact marker
    const marker = window.L.marker([lat, lng], {
      icon: window.L.divIcon({
        className: 'impact-marker',
        html: '<div style="width:24px;height:24px;background:radial-gradient(circle,#fff 0%,#ff6b6b 50%,#ff0000 100%);border:3px solid #fff;border-radius:50%;box-shadow:0 0 30px rgba(255,107,107,1);animation:pulse 2s infinite;"></div>',
        iconSize: [24, 24]
      })
    }).addTo(map);
    
    // Add damage circles
    const circles = [
      { radius: data.fireballRadius, color: '#ff0000', label: 'Fireball' },
      { radius: data.thermalRadius, color: '#ff6600', label: 'Thermal' },
      { radius: data.shockwaveRadius, color: '#ffaa00', label: 'Shockwave' }
    ];
    
    const newCircles = circles.map(({ radius, color, label }) => {
      const circle = window.L.circle([lat, lng], {
        radius: radius * 1000,
        color: color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 2
      }).addTo(map);
      circle.bindPopup(label);
      return circle;
    });
    
    setImpactMarker(marker);
    setDamageCircles(newCircles);
    setImpactData(data);
    setShowResults(true);
    
    // Fit map to show damage
    const bounds = window.L.latLngBounds([lat, lng]);
    newCircles.forEach(circle => bounds.extend(circle.getBounds()));
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  const quickLaunch = (lat, lng) => {
    if (!map) return;
    selectLocation(lat, lng, map);
    map.setView([lat, lng], 11, { animate: true });
    setTimeout(() => launchAsteroid(), 500);
  };

  const materialNames = { '1000': 'Ice', '3000': 'Rock', '8000': 'Iron' };

  return (
    <>
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .location-marker { font-size: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
        .sidebar { position: fixed; left: 20px; top: 20px; width: 340px; background: rgba(15,15,35,0.95); backdrop-filter: blur(30px); border-radius: 20px; padding: 28px; z-index: 1000; box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 80px rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.2); max-height: calc(100vh - 40px); overflow-y: auto; }
        .info-panel { position: fixed; right: 20px; top: 20px; width: 320px; background: rgba(15,15,35,0.95); backdrop-filter: blur(30px); border-radius: 20px; padding: 28px; z-index: 1000; box-shadow: 0 10px 40px rgba(0,0,0,0.9); border: 1px solid rgba(254,202,87,0.2); transform: translateX(400px); opacity: 0; transition: all 0.5s ease; }
        .info-panel.active { transform: translateX(0); opacity: 1; }
        .control-group { margin-bottom: 20px; }
        .control-label { display: block; color: #ddd; font-size: 0.88em; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .value-display { float: right; color: #ff6b6b; font-weight: 700; font-size: 1.05em; }
        .preset-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .preset-btn { padding: 10px 12px; background: linear-gradient(135deg, #2a2a3e, #1f1f2e); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.88em; cursor: pointer; transition: all 0.3s ease; font-weight: 500; }
        .preset-btn:hover { background: linear-gradient(135deg, #3a3a4e, #2f2f3e); border-color: #ff6b6b; transform: translateY(-2px); }
        .launch-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #ff6b6b, #ff5252); border: none; border-radius: 12px; color: #fff; font-size: 1.15em; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 15px; }
        .launch-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 35px rgba(255,107,107,0.7); }
        .launch-btn:disabled { background: linear-gradient(135deg, #3a3a4e, #2a2a3e); cursor: not-allowed; opacity: 0.6; }
        input[type="range"] { width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(to right, #2a2a3e, #3a3a4e); outline: none; -webkit-appearance: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, #ff6b6b, #ff5252); cursor: pointer; }
        select { width: 100%; padding: 12px 14px; background: linear-gradient(135deg, #2a2a3e, #1f1f2e); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; cursor: pointer; }
        .info-item { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .info-label { color: #999; font-size: 0.82em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 600; }
        .info-value { color: #fff; font-size: 1.35em; font-weight: 700; }
      `}</style>
      
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)' }}></div>
      
      <nav className="navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/impact-simulator">Impact Simulator</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
        <AuthButtons />
      </nav>
      
      <div ref={mapRef} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1, filter: 'brightness(0.9)', cursor: 'crosshair' }}></div>
      
      <div className="sidebar">
        <h1 style={{ fontSize: '2.2em', marginBottom: '8px', background: 'linear-gradient(135deg, #ff6b6b, #feca57, #ff6b6b)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>🌠 Asteroid Launcher</h1>
        <p style={{ color: '#999', fontSize: '0.95em', marginBottom: '20px' }}>Click anywhere on the map to launch</p>
        
        <div style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(254,202,87,0.12))', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', fontSize: '0.92em', color: '#ffaaaa' }}>
          Select your asteroid parameters and click on the map to see the impact!
        </div>
        
        <div className="control-group">
          <label className="control-label">
            Diameter <span className="value-display">{diameter} m</span>
          </label>
          <input type="range" min="1" max="1000" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
          <div className="preset-buttons">
            <button className="preset-btn" onClick={() => setDiameter(10)}>House (10m)</button>
            <button className="preset-btn" onClick={() => setDiameter(50)}>Stadium (50m)</button>
            <button className="preset-btn" onClick={() => setDiameter(100)}>City Block (100m)</button>
            <button className="preset-btn" onClick={() => setDiameter(500)}>Golden Gate (500m)</button>
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">
            Velocity <span className="value-display">{velocity} km/s</span>
          </label>
          <input type="range" min="11" max="70" value={velocity} onChange={(e) => setVelocity(e.target.value)} />
        </div>
        
        <div className="control-group">
          <label className="control-label">
            Impact Angle <span className="value-display">{angle}°</span>
          </label>
          <input type="range" min="15" max="90" value={angle} step="5" onChange={(e) => setAngle(e.target.value)} />
        </div>
        
        <div className="control-group">
          <label className="control-label">Material</label>
          <select value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="1000">Ice (1000 kg/m³)</option>
            <option value="3000">Rock (3000 kg/m³)</option>
            <option value="8000">Iron (8000 kg/m³)</option>
          </select>
        </div>
        
        <button className="launch-btn" onClick={launchAsteroid} disabled={!selectedLocation}>
          🚀 LAUNCH {materialNames[material].toUpperCase()} ASTEROID
        </button>
        
        <div style={{ marginTop: '20px' }}>
          <label className="control-label">Quick Launch Locations</label>
          <div className="preset-buttons">
            <button className="preset-btn" onClick={() => quickLaunch(40.7128, -74.0060)}>🗽 New York</button>
            <button className="preset-btn" onClick={() => quickLaunch(51.5074, -0.1278)}>🏰 London</button>
            <button className="preset-btn" onClick={() => quickLaunch(35.6762, 139.6503)}>🗼 Tokyo</button>
            <button className="preset-btn" onClick={() => quickLaunch(48.8566, 2.3522)}>🗼 Paris</button>
            <button className="preset-btn" onClick={() => quickLaunch(34.0522, -118.2437)}>🌴 LA</button>
            <button className="preset-btn" onClick={() => quickLaunch(-33.8688, 151.2093)}>🦘 Sydney</button>
          </div>
        </div>
      </div>
      
      <div className={`info-panel ${showResults ? 'active' : ''}`}>
        <h2 style={{ marginBottom: '15px', fontSize: '1.3em', background: 'linear-gradient(135deg, #feca57, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>Impact Results</h2>
        {impactData && (
          <>
            <div className="info-item">
              <div className="info-label">Energy Released</div>
              <div className="info-value">
                {impactData.energy < 0.01 ? impactData.energy.toExponential(2) + ' MT' : impactData.energy.toFixed(2) + ' Megatons'}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Fireball Radius</div>
              <div className="info-value">{impactData.fireballRadius.toFixed(2)} km</div>
            </div>
            <div className="info-item">
              <div className="info-label">Crater Diameter</div>
              <div className="info-value">{impactData.craterDiameter.toFixed(0)} m</div>
            </div>
            <div className="info-item">
              <div className="info-label">Shockwave Radius</div>
              <div className="info-value">{impactData.shockwaveRadius.toFixed(2)} km</div>
            </div>
            <div className="info-item">
              <div className="info-label">Casualties (est.)</div>
              <div className="info-value">{impactData.casualties.toLocaleString()}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}