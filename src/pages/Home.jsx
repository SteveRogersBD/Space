import { useEffect, useState } from 'react';
import BasicThreeScene from '../components/BasicThreeScene';
import AuthButtons from '../components/AuthButtons';
import { Link } from 'react-router-dom';
import MeteorStandalone from '../components/MeteorStandalone';

export default function Home() {
  const [subtitleText, setSubtitleText] = useState('');
  const subtitleFullText = "AN INTERACTIVE EXPERIENCE OF THE DOCUMENTARY\nBEYOND EARTH: THE BEGINNING OF NEWSPACE";
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeoutId;

    function typeText() {
      if (isTyping) {
        if (charIndex < subtitleFullText.length) {
          setSubtitleText(subtitleFullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          timeoutId = setTimeout(typeText, 25);
        } else {
          setIsTyping(false);
          timeoutId = setTimeout(typeText, 3000);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1);
          setSubtitleText(subtitleFullText.substring(0, charIndex - 1));
          timeoutId = setTimeout(typeText, 30);
        } else {
          setIsTyping(true);
          timeoutId = setTimeout(typeText, 1000);
        }
      }
    }

    timeoutId = setTimeout(typeText, 1000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [charIndex, isTyping, subtitleFullText]);

  // Override global gradient background with solid black while on Home
  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevAnim = document.body.style.animation;
    document.body.style.background = '#000';
    document.body.style.animation = 'none';
    return () => {
      document.body.style.background = prevBg;
      document.body.style.animation = prevAnim;
    };
  }, []);

  return (
    <>
      <BasicThreeScene />
      <nav className="navbar">
        <Link to="/" className="nav-brand">ULKAA</Link>
        <ul className="nav-menu">
          <li><Link to="/live-tracking">Live Tracking</Link></li>
          <li><Link to="/fun-zone">Fun Zone</Link></li>
          <li><Link to="/impact-simulator">Impact Simulator</Link></li>
          <li><Link to="/info">Info</Link></li>
          <li><Link to="/insights">Insights</Link></li>
          <li><Link to="/astro-strike">Astro Strike</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
        <AuthButtons />
      </nav>

      {/* Sticky hero text that stays during the home section only */}
      <div className="home-overlay">
        <h1 className="title">ULKAA</h1>
        <div className="subtitle-container">
          <p className="subtitle">{subtitleText}</p>
        </div>
      </div>


      {/* Second section: integrated standalone content */}
      <section className="meteor-standalone-section" aria-label="Meteor Standalone">
        <MeteorStandalone />
      </section>

      {/* Page-specific styles */}
      <style jsx>{`
        .home-overlay {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          pointer-events: none; /* allow globe/scroll interactions */
          z-index: 10;
        }

        .meteor-standalone-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: block;
          z-index: 5; /* above the canvas */
          background: #000; /* ensure solid background under iframe */
        }

        /* content handled inside MeteorStandalone */
      `}</style>
    </>
  );
}

