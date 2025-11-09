import React from 'react';

export default function MeteorLegend() {
  const meteorTypes = [
    { name: 'Fireball', color: '#ff3300', description: 'Extremely bright meteor' },
    { name: 'Bolide', color: '#ffaa00', description: 'Exploding meteor' },
    { name: 'Sporadic', color: '#00ccff', description: 'Random occurrence' },
    { name: 'Shower', color: '#ff00ff', description: 'Periodic stream' },
    { name: 'Asteroid', color: '#00ff66', description: 'Near-Earth object' },
  ];

  return (
    <div className="meteor-legend">
      <h3 className="legend-title">
        <span className="icon">🌠</span>
        Meteor Types
      </h3>
      <div className="legend-grid">
        {meteorTypes.map((type) => (
          <div key={type.name} className="legend-item">
            <div className="legend-dot-container">
              <div 
                className="legend-dot" 
                style={{ 
                  backgroundColor: type.color
                }}
              />
            </div>
            <div className="legend-text">
              <div className="legend-name">{type.name}</div>
              <div className="legend-desc">{type.description}</div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .meteor-legend {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(100, 100, 100, 0.5);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          max-width: 320px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .legend-title {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(100, 100, 100, 0.3);
        }

        .icon {
          font-size: 1.3rem;
        }

        .legend-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .legend-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(150, 150, 150, 0.4);
          transform: translateX(4px);
        }

        .legend-dot-container {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .legend-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .legend-text {
          flex: 1;
          min-width: 0;
        }

        .legend-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }

        .legend-desc {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .meteor-legend {
            top: 10px;
            left: 10px;
            max-width: 280px;
            padding: 16px;
          }

          .legend-title {
            font-size: 1rem;
          }

          .legend-dot-container {
            width: 28px;
            height: 28px;
          }

          .legend-dot {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
}
