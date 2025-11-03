import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '/src/pages/Home.css';

const Home = () => {
  const [isDissolving, setIsDissolving] = useState(false);
  const [showPoem, setShowPoem] = useState(false);
  
  const landingTitleRef = useRef(null);
  const landingPageRef = useRef(null);
  const poemRef = useRef(null);
  const microplasticsRef = useRef(null);
  const cursorRef = useRef(null);

  // Mouse tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize floating microplastics
  useEffect(() => {
    if (!microplasticsRef.current) return;

    const container = microplasticsRef.current;
    
    for (let i = 0; i < 80; i++) {
      const particle = document.createElement('div');
      particle.classList.add('microplastic');
      particle.classList.add(Math.random() > 0.5 ? 'circle' : 'shard');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      container.appendChild(particle);

      gsap.to(particle, {
        y: `+=${Math.random() * 100 + 50}`,
        x: `+=${Math.random() * 50 - 25}`,
        rotation: Math.random() * 360,
        duration: 10 + Math.random() * 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 5,
      });

      particle.addEventListener('mouseenter', () => {
        gsap.to(particle, { scale: 2, opacity: 1, duration: 0.3 });
      });
      particle.addEventListener('mouseleave', () => {
        gsap.to(particle, { scale: 1, opacity: 0.6, duration: 0.3 });
      });
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  const handleTitleHover = () => {
    if (isDissolving) return;
    document.body.setAttribute('data-cursor', 'dissolve');
    setTimeout(startDissolve, 500);
  };

  const handleTitleLeave = () => {
    if (!isDissolving) {
      document.body.removeAttribute('data-cursor');
    }
  };

  const startDissolve = () => {
    if (isDissolving) return;
    setIsDissolving(true);

    const titleRect = landingTitleRef.current.getBoundingClientRect();
    const particleCount = 60;

    // Create dissolving particles
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle dissolving';
        particle.style.left = titleRect.left + Math.random() * titleRect.width + 'px';
        particle.style.top = titleRect.top + Math.random() * titleRect.height + 'px';
        particle.style.width = 3 + Math.random() * 6 + 'px';
        particle.style.height = 3 + Math.random() * 6 + 'px';
        if (Math.random() > 0.6) particle.style.background = '#e8e6e3';
        landingPageRef.current.appendChild(particle);
        setTimeout(() => { if (particle.parentNode) particle.remove(); }, 4000);
      }, i * 50);
    }

    // Fade out title
    setTimeout(() => {
      landingTitleRef.current.style.opacity = '0';
      landingTitleRef.current.style.transform = 'scale(0.8)';
    }, 1000);

    // Fade out subtitle and instruction
    setTimeout(() => {
      landingPageRef.current.style.transition = 'opacity 1s ease-out';
      landingPageRef.current.style.opacity = '0';
    }, 2500);

    // Show poem
    setTimeout(() => {
      setShowPoem(true);
    }, 3500);
  };

  return (
    <div className="microplastics-page">
      <div className="microplastics" ref={microplasticsRef}></div>

      <div id="custom-cursor" ref={cursorRef} aria-hidden="true">
        <div className="cursor-dot"></div>
        <div className="cursor-ring"></div>
      </div>

      {/* Landing Page */}
      <main 
        className="landing-page" 
        ref={landingPageRef}
        style={{ display: showPoem ? 'none' : 'flex' }}
        role="main" 
        aria-label="Site landing page"
      >
        <h1 
          className="landing-title" 
          ref={landingTitleRef}
          style={{ cursor: 'pointer' }}
          onMouseEnter={handleTitleHover}
          onMouseLeave={handleTitleLeave}
        >
          east river - fragements
        </h1>
        <p className="landing-subtitle">tracing invisible microplastics, one particle at a time</p>
        <p className="instruction-text">hover over the title to explore</p>
      </main>

      {/* Poem Page */}
      {showPoem && (
        <div className="poem-page" ref={poemRef}>
          <p className="poem-text">
            <strong className="poem-emphasis">Go outside.</strong> Stand still.<br/>
            Hold the day like a warm cup. Sip the sky.<br/>
            Let time pass the way steam leaves your coffee.<br/>
            Do not blink. Swallow slowly.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;