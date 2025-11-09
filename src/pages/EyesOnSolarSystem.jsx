import React from 'react';

export default function EyesOnSolarSystem() {
  const nasaSolarSystemUrl = "https://eyes.nasa.gov/apps/solar-system/";

  return (
    <div className="eyes-solar-system-page">
      <div className="iframe-container">
        <iframe
          src={nasaSolarSystemUrl}
          title="NASA's Eyes on the Solar System"
          className="solar-system-iframe"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
      
      <style jsx>{`
        .eyes-solar-system-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          z-index: 1000;
        }
        
        .iframe-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .solar-system-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>
    </div>
  );
}