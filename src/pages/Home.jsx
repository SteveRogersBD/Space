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
          <li><Link to="/info">Info-askAI</Link></li>
          <li><Link to="/eyes-on-solar-system">Explore Solar System</Link></li>
        </ul>
        <AuthButtons />
      </nav>

      {/* Hero section: floating text over globe, limited to first viewport */}
      <section className="home-hero" aria-label="Home Hero">
        <div className="home-overlay">
          <h1 className="title">ULKAA</h1>
          <div className="subtitle-container">
            <p className="subtitle">{subtitleText}</p>
          </div>
        </div>
      </section>


      {/* Second section: integrated standalone content */}
      <section className="meteor-standalone-section" aria-label="Meteor Standalone">
        <MeteorStandalone />
      </section>

      {/* Page-specific styles */}
      <style jsx>{`
        .home-hero { position: relative; width: 100%; height: 100vh; z-index: 10; pointer-events: none; }
        .home-overlay { position: absolute; inset: 0; display:flex; flex-direction:column; justify-content:center; align-items:center; pointer-events:none; }

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

