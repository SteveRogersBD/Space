import React from 'react';

export default function MeteorStandalone() {
  return (
    <div className="standalone-root">
      {/* Include Bootstrap for progress bar styling */}
      <link rel="stylesheet" href="/meteor-standalone/css/bootstrap.min.css" />

      <main>
        <header>
          <a href="#"><img className="logo" src="/meteor-standalone/images/Saturn-Transparent-Images.png" title="Image by pngarts" alt="logo" /></a>
        </header>
        <div className="box-1">
          <h1>Space</h1>
          <h1 className="outline">Meteors.</h1>
          <p>
            Discover meteors, meteorites, and meteor showers.<br />
            Learn how small space rocks interact with Earth's atmosphere,<br />
            and why they matter for science and planetary defense.
          </p>
          <button><a href="#">Explore</a></button>
        </div>
        <img className="astronaut" src="/meteor-standalone/images/as2.png" title="astronaut by pngwing" alt="astronaut" />
      </main>

      <section className="container-second-main">
        <div className="box-age">
          <h3>Age of the Earth</h3>
          <div className="box-age-process">
            <div style={{ textAlign: 'right' }}>
              <p className="accent">Typical Meteor</p>
              <p className="accent">Atmospheric entry</p>
            </div>
            <div style={{ textAlign: 'left', marginLeft: 20, marginRight: 50 }}>
              <p>Small rock or dust particle</p>
              <p>Heats up and produces a streak of light</p>
            </div>
            <div className="progress" style={{ height: 5, width: '70%' }}>
              <div className="progress-bar" role="progressbar" aria-label="Segment one" style={{ width: '60%', backgroundColor: '#af8650' }} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-1" title="Image by WikiImages - Pixabay">
        <h3>Earth Overshoot Day By the Numbers</h3>
        <div className="box-2">
          <div>
            <h1>500 tons/day</h1>
            <p>Approximate mass of meteoroids that enter Earth's atmosphere every day (mostly dust)</p>
          </div>
          <div>
            <h1>~25</h1>
            <p>Number of major annual meteor showers visible from Earth</p>
          </div>
          <div>
            <h1>Rare</h1>
            <p>Large impact events are rare but can have significant local or global effects</p>
          </div>
          <div>
            <h1>Many</h1>
            <p>Thousands of meteorites have been recovered and studied by scientists</p>
          </div>
        </div>
      </section>

      <section className="container-2" title="image by WikiImages on Pixabay ">
        <div className="box-3">
          <h6>Why study meteors?</h6>
          <h1>Why study meteors?</h1>
          <p>☆ To understand the building blocks of the solar system and how planets formed</p>
          <p>☆ To learn about organic material delivered to early Earth that may have helped start life</p>
          <p>☆ To improve planetary defense by tracking potentially hazardous objects</p>
          <p style={{ marginBottom: 50 }}>☆ To use meteorites as scientific samples from other solar system bodies</p>
        </div>
      </section>

      <section className="container-3" title="image by Gerd Altmann on Pixabay ">
        <div className="card-menu">
          <img className="card-images" src="/meteor-standalone/images/saturn.png" title="image by pngwing" alt="saturn" />
          <div className="card-text">
            <h1>Meteor Types</h1>
            <h5>Stony, Iron, Stony-Iron</h5>
            <p>Meteors come from rocky and metallic bodies. Meteorites recovered on Earth are classified mainly as stony, iron, or stony-iron.</p>
          </div>
          <button className="button-card"><a href="#">See more</a></button>
        </div>
        <div className="card-menu">
          <img className="card-images" src="/meteor-standalone/images/starg.png" title="image by pngitem" alt="stars" />
          <div className="card-text">
            <h1>Meteor Showers</h1>
            <h5>Perseids, Geminids, Leonids</h5>
            <p>Regular meteor showers occur when Earth crosses streams of debris left by comets or asteroids — predictable and great for observation.</p>
          </div>
          <button className="button-card"><a href="#">See more</a></button>
        </div>
        <div className="card-menu">
          <img className="card-images" src="/meteor-standalone/images/moon.jpg" title="image by kindpng" alt="timeline" style={{ filter: 'brightness(80%) grayscale(50%)' }} />
          <div className="card-text">
            <h1>Meteor Impacts</h1>
            <h5>History and effects</h5>
            <p>Impacts range from tiny craters to events that can affect climate. Studying impacts provides insight into planetary history and risks.</p>
          </div>
          <button className="button-card"><a href="#">See more</a></button>
        </div>
      </section>

      <section className="container-4" title="image by Tumisu on Pixabay ">
        <div className="box-4">
          <h6>Notable Meteor Events</h6>
          <h1>Chelyabinsk (2013)</h1>
          <p>
            In 2013 a small asteroid exploded as an airburst over Chelyabinsk, Russia, producing a bright fireball and causing window damage to buildings.
            Events like this highlight the importance of observation and preparedness for near-Earth objects.
          </p>
        </div>
      </section>

      <footer />

      <style jsx>{`
        /* fonts */
        @font-face { font-family: prompt; src: url('/meteor-standalone/fonts/Prompt-Light.ttf'); }
        @font-face { font-family: sansserifbook; src: url('/meteor-standalone/fonts/SansSerifBookFLF.otf'); }

        .standalone-root { background:#000; color:#fff; }

        main {
          background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,1)), url('/meteor-standalone/images/moon-surface-11088_1920.jpg');
          min-height: 100vh;
          background-position: center;
          background-size: cover;
          position: relative;
          padding: 3rem 2rem;
        }
        header{ display:flex; justify-content:space-between; align-items:center; padding: 1rem 1.25rem; max-width:1400px; margin:0 auto; }
        header img.logo{ height:48px; width:auto; margin-right:0.5rem; }
        .box-1{ max-width:1100px; padding:6rem 0 3rem 0; }
        .box-1 h1{ margin:0; font-weight:800; font-size:clamp(2.25rem, 9vw, 6rem); line-height:1; font-family:sansserifbook; }
        .box-1 p{ font-size:clamp(0.9rem,1.9vw,1.125rem); opacity:0.9; margin-top:1rem; font-family:prompt; }
        .box-1 button{ background:transparent; border:0.12em solid white; border-radius:50px; padding:0.5rem 1rem; margin:1.5rem 0; display:inline-flex; gap:0.5rem; align-items:center; }
        .box-1 a{ color:white; text-decoration:none; font-size:1rem; }
        .outline{ color: transparent; -webkit-text-stroke-color: white; -webkit-text-stroke-width: 1px; font-weight: 500; }
        .astronaut{ max-width:35vw; width:100%; filter:brightness(60%) grayscale(50%); position:absolute; top:40%; right:5%; transform:translateY(-40%); animation: float 2s ease-in-out infinite alternate; }
        @keyframes float{ from{ transform: translateY(-40%) translateX(0); } to{ transform: translateY(-36%) translateX(4%); } }

        .container-second-main{ text-align:center; background-color:#000; padding:2rem 1rem; }
        .container-1{ min-height:40vh; padding:4rem 1rem; text-align:center; background-blend-mode:multiply; background-position:center; background-size:cover; background-image: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.7)), url('/meteor-standalone/images/world-g449192a8a_1920.jpg'); }

        .box-2{ display:flex; flex-wrap:wrap; gap:1.5rem; justify-content:center; align-items:center; margin:2rem 0; }
        .box-2 > div{ min-width:180px; flex:1 1 180px; }
        .box-2 h1{ font-size:clamp(1.5rem,4vw,3rem); margin:0; }

        .container-2{ min-height:50vh; padding:4rem 1rem; display:flex; align-items:center; justify-content:flex-start; background-image: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.7)), url('/meteor-standalone/images/astronaut-11080_1920.jpg'); background-size:cover; background-position:center; }
        .box-3{ max-width:700px; padding:1rem; }

        .container-3{ padding:4rem 1rem; display:flex; flex-wrap:wrap; justify-content:center; gap:2rem; text-align:center; background-image: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.6)), url('/meteor-standalone/images/stars-2539245_1920.jpg'); background-size:cover; background-position:center; }

        .card-menu{ padding:2rem; max-width:420px; width:100%; cursor:pointer; background-color: rgba(255,255,255,0.06); border-radius:30px; transition:transform .25s ease, background .25s ease; }
        .card-menu:hover{ transform:translateY(-6px) scale(1.03); }
        .card-images{ display:block; margin:1.5rem auto; max-width:260px; height:auto; }

        .container-4{ padding:4rem 1rem; background-image: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.4)), url('/meteor-standalone/images/moon.jpg'); background-size:cover; background-position:center; }
        .box-4{ max-width:900px; margin:0 auto; padding:1rem; }

        .accent{ color: #af8650; font-family: prompt; }

        footer{ min-height:160px; padding:2rem 1rem; text-align:center; display:flex; justify-content:center; align-items:center; flex-direction:column; background-image: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.5)), url('/meteor-standalone/images/earth-1365995_1920.jpg'); background-size:cover; background-position:center; }

        @media (max-width:768px){
          .box-1{ padding-top:4rem; }
          .astronaut{ right:3%; top:50%; max-width:45vw; }
          .box-1 h1{ font-size:clamp(1.75rem, 12vw, 3.2rem); }
          .box-2{ flex-direction:column; }
          .card-menu{ border-radius:20px; }
        }
      `}</style>
    </div>
  );
}
