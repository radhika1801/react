import React, { useState, useEffect, useRef } from 'react';

const DataVisualizations = () => {
  const [activeSection, setActiveSection] = useState({});
  const concentrationCanvasRef = useRef(null);
  const waveCanvasRef = useRef(null);

  useEffect(() => {
    const observers = [];
    const elements = document.querySelectorAll('.data-section');
    
    elements.forEach((el, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(prev => ({ ...prev, [index]: true }));
          }
        },
        { threshold: 0.2 }
      );
      
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  // Concentration canvas animation
  useEffect(() => {
    const canvas = concentrationCanvasRef.current;
    if (!canvas || !activeSection[1]) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 200;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.life = Math.random() * 150;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [activeSection[1]]);

  // Wave animation
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas || !activeSection[2]) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let time = 0;

    function drawWave(offset, amplitude, frequency, color, opacity) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x * frequency) + time + offset) * amplitude;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawWave(0, 25, 0.01, '#d4af37', 0.12);
      drawWave(1, 20, 0.012, '#c4a574', 0.15);
      drawWave(2, 18, 0.015, '#b89968', 0.18);

      time += 0.025;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [activeSection[2]]);

  return (
    <div style={styles.container}>
      {/* SECTION 1: Coffee Cup */}
      <section className={`data-section ${activeSection[0] ? 'active' : ''}`} style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>01</span>
            <h2 style={styles.sectionTitle}>Single-Use Plastic Consumption</h2>
            <p style={styles.sectionDescription}>
              Microplastic particles released from disposable coffee cups in Battery Park area
            </p>
          </div>

          <div style={styles.visualizationFrame}>
            <div style={styles.vizGrid2Col}>
              <div style={styles.vizGraphic}>
                <svg viewBox="0 0 200 280" style={styles.cupSvg}>
                  <defs>
                    <linearGradient id="cupGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e8dcc4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#c4b5a0" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b7355" />
                      <stop offset="100%" stopColor="#654321" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <rect x="50" y="40" width="100" height="200" rx="8" 
                        fill="url(#cupGradient)" 
                        stroke="#d4af37" strokeWidth="2" />
                  <ellipse cx="100" cy="40" rx="50" ry="10" 
                           fill="#c4b5a0" stroke="#d4af37" strokeWidth="2" />
                  
                  <ellipse cx="100" cy="80" rx="45" ry="8" 
                           fill="url(#liquidGradient)" opacity="0.9" />
                  <rect x="55" y="80" width="90" height="70" 
                        fill="url(#liquidGradient)" opacity="0.9" />
                  
                  {[...Array(8)].map((_, i) => {
                    const x = 70 + i * 8;
                    return (
                      <ellipse
                        key={`steam-${i}`}
                        cx={x}
                        cy="40"
                        rx="3"
                        ry="6"
                        fill="rgba(212, 175, 55, 0.3)"
                        style={{
                          animation: `riseSteam 3s ease-out ${i * 0.3}s infinite`,
                          transformOrigin: `${x}px 40px`
                        }}
                      />
                    );
                  })}
                  
                  {[...Array(24)].map((_, i) => {
                    const angle = (i / 24) * 360;
                    return (
                      <circle
                        key={i}
                        cx="100"
                        cy="80"
                        r="1.5"
                        fill="#d4af37"
                        filter="url(#glow)"
                        opacity="0.6"
                        style={{
                          animation: `emitParticle 4s ease-out ${i * 0.1}s infinite`,
                          transformOrigin: '100px 80px',
                          '--angle': `${angle}deg`,
                          '--distance': `${60 + (i % 4) * 12}px`
                        }}
                      />
                    );
                  })}
                </svg>
              </div>

              <div style={styles.vizData}>
                <div style={styles.dataMetricLarge}>
                  <div style={styles.metricValue}>15,000</div>
                  <div style={styles.metricLabel}>Particles Released Per Cup</div>
                </div>

                <div style={styles.dataBreakdown}>
                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownBar}>
                      <div style={{
                        ...styles.barInner,
                        width: '100%',
                        background: 'linear-gradient(90deg, #c4a574, #b89968)',
                      }}>
                        <span style={styles.barLabel}>Plastic Cup Coffee</span>
                      </div>
                    </div>
                    <div style={styles.breakdownValue}>15,000</div>
                  </div>

                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownBar}>
                      <div style={{
                        ...styles.barInner,
                        width: '8%',
                        background: 'linear-gradient(90deg, #d4af37, #c4a574)',
                      }}>
                        <span style={styles.barLabel}>Tap Water</span>
                      </div>
                    </div>
                    <div style={styles.breakdownValue}>~100</div>
                  </div>

                  <div style={styles.breakdownItem}>
                    <div style={styles.breakdownBar}>
                      <div style={{
                        ...styles.barInner,
                        width: '0.5%',
                        background: 'linear-gradient(90deg, #7fa37d, #6b8e6a)',
                      }}>
                        <span style={styles.barLabel}>Filtered Water</span>
                      </div>
                    </div>
                    <div style={styles.breakdownValue}>0</div>
                  </div>
                </div>

                <div style={styles.insightBox}>
                  <p style={styles.insightText}>
                    <strong style={styles.insightStrong}>Key Finding:</strong> A single disposable coffee cup releases 15,000 microplastic particles into your beverage—that's 150 times more contamination than unfiltered tap water.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Concentration */}
      <section className={`data-section ${activeSection[1] ? 'active' : ''}`} style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>02</span>
            <h2 style={styles.sectionTitle}>East River Pollution Density</h2>
            <p style={styles.sectionDescription}>
              Measured concentration of microplastic particles in the East River water system
            </p>
          </div>

          <div style={styles.visualizationFrame}>
            <div style={styles.concentrationDisplay}>
              <div style={styles.concentrationCanvasWrapper}>
                <canvas ref={concentrationCanvasRef} style={styles.concentrationCanvas}></canvas>
                <div style={styles.canvasOverlay}>
                  <div style={styles.overlayMetric}>
                    <span style={styles.metricNumber}>556,484</span>
                    <span style={styles.metricUnit}>particles per square kilometer</span>
                  </div>
                </div>
              </div>

              <div style={styles.concentrationDetails}>
                <div style={styles.detailGrid}>
                  <div style={styles.detailCard}>
                    <div style={styles.cardContent}>
                      <div style={styles.cardValue}>556</div>
                      <div style={styles.cardLabel}>Particles Per Square Meter</div>
                    </div>
                  </div>

                  <div style={styles.detailCard}>
                    <div style={styles.cardContent}>
                      <div style={styles.cardValue}>&lt;5mm</div>
                      <div style={styles.cardLabel}>Average Particle Size</div>
                    </div>
                  </div>

                  <div style={styles.detailCard}>
                    <div style={styles.cardContent}>
                      <div style={styles.cardValue}>95%</div>
                      <div style={styles.cardLabel}>Not Visible to Naked Eye</div>
                    </div>
                  </div>

                  <div style={styles.detailCard}>
                    <div style={styles.cardContent}>
                      <div style={styles.cardValue}>1000x</div>
                      <div style={styles.cardLabel}>Magnification Required</div>
                    </div>
                  </div>
                </div>

                <div style={styles.methodologyNote}>
                  <h4 style={styles.methodologyTitle}>Research Methodology</h4>
                  <p style={styles.methodologyText}>
                    Data collected from Battery Park Marina sampling stations using mesh filtration (333 micrometers) and spectroscopic analysis. Measurements represent the average concentration across 12 sampling points collected over a 6-month period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Harbor */}
      <section className={`data-section ${activeSection[2] ? 'active' : ''}`} style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionNumber}>03</span>
            <h2 style={styles.sectionTitle}>New York Harbor Composition</h2>
            <p style={styles.sectionDescription}>
              Complete analysis of particle types found in New York Harbor waters
            </p>
          </div>

          <div style={styles.visualizationFrame}>
            <div style={styles.harborComposition}>
              <div style={styles.compositionChart}>
                <div style={styles.waveVisualization}>
                  <canvas ref={waveCanvasRef} style={styles.waveCanvas}></canvas>
                  <div style={styles.waveOverlay}>
                    <div style={styles.totalParticles}>
                      <div style={styles.particleCount}>165 Million</div>
                      <div style={styles.particleLabel}>Total Particles Detected</div>
                    </div>
                  </div>
                </div>

                <div style={styles.chartLegend}>
                  <div style={styles.legendItem}>
                    <div style={{
                      ...styles.legendColor,
                      background: 'linear-gradient(135deg, #ffd4a3, #d4af37)'
                    }}></div>
                    <div style={styles.legendDetails}>
                      <div style={styles.legendPercentage}>85%</div>
                      <div style={styles.legendLabel}>Microplastics</div>
                      <div style={styles.legendCount}>140.25 million particles</div>
                    </div>
                  </div>

                  <div style={styles.legendItem}>
                    <div style={{
                      ...styles.legendColor,
                      background: 'rgba(42, 63, 95, 0.5)'
                    }}></div>
                    <div style={styles.legendDetails}>
                      <div style={styles.legendPercentage}>15%</div>
                      <div style={styles.legendLabel}>Other Particles</div>
                      <div style={styles.legendCount}>24.75 million particles</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.compositionAnalysis}>
                <h4 style={styles.analysisTitle}>Plastic Polymer Breakdown</h4>
                
                <div style={styles.typeBreakdown}>
                  {[
                    { name: 'Polyethylene (PE)', percent: 35, color: '#d4af37', desc: 'Common in bottles and bags' },
                    { name: 'Polypropylene (PP)', percent: 28, color: '#c4a574', desc: 'Found in food containers' },
                    { name: 'Polystyrene (PS)', percent: 22, color: '#b89968', desc: 'Used in foam products' },
                    { name: 'Other Polymers', percent: 15, color: '#9d8556', desc: 'Mixed plastic types' }
                  ].map((type, i) => (
                    <div key={i} style={styles.typeRow}>
                      <div style={styles.typeNameContainer}>
                        <div style={styles.typeName}>{type.name}</div>
                        <div style={styles.typeDescription}>{type.desc}</div>
                      </div>
                      <div style={styles.typeBarContainer}>
                        <div style={{
                          ...styles.typeBar,
                          width: `${type.percent}%`,
                          background: type.color
                        }}></div>
                      </div>
                      <div style={styles.typePercent}>{type.percent}%</div>
                    </div>
                  ))}
                </div>

                <div style={styles.sourceInfo}>
                  <h5 style={styles.sourceTitle}>Primary Contamination Sources</h5>
                  <p style={styles.sourceText}>
                    Single-use containers account for 42% of microplastic pollution, followed by synthetic textile fibers at 31%, packaging materials at 18%, and industrial discharge at 9%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes emitParticle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: rotate(var(--angle)) translateX(var(--distance)) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes riseSteam {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-35px) scale(0.4);
            opacity: 0;
          }
        }
        
        .data-section {
          opacity: 0;
          transform: translateY(60px);
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .data-section.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(to bottom, #0a0e27, #0f1329)',
    padding: '6rem 0',
    minHeight: '100vh'
  },
  section: {
    marginBottom: '10rem'
  },
  sectionContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 3rem'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem'
  },
  sectionNumber: {
    display: 'inline-block',
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '1rem',
    color: '#d4af37',
    background: 'rgba(212, 175, 55, 0.1)',
    padding: '0.5rem 1.5rem',
    borderRadius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    marginBottom: '1.5rem',
    letterSpacing: '0.2em',
    fontWeight: '600'
  },
  sectionTitle: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    color: '#ffd4a3',
    margin: '0 0 1rem',
    fontWeight: '700',
    letterSpacing: '0.03em'
  },
  sectionDescription: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.1rem',
    color: '#c4b5a0',
    margin: 0,
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6'
  },
  visualizationFrame: {
    background: 'rgba(21, 26, 51, 0.4)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    borderRadius: '12px',
    padding: '3rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  vizGrid2Col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  vizGraphic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cupSvg: {
    width: '100%',
    maxWidth: '300px',
    filter: 'drop-shadow(0 10px 30px rgba(212, 175, 55, 0.2))'
  },
  vizData: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem'
  },
  dataMetricLarge: {
    textAlign: 'center',
    padding: '2rem',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.2)'
  },
  metricValue: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 'clamp(3.5rem, 6vw, 5rem)',
    fontWeight: '900',
    color: '#ffd4a3',
    lineHeight: '1',
    textShadow: '0 0 20px rgba(255, 212, 163, 0.3)'
  },
  metricLabel: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.1rem',
    color: '#c4b5a0',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginTop: '0.5rem'
  },
  dataBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  breakdownItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 90px',
    gap: '1rem',
    alignItems: 'center'
  },
  breakdownBar: {
    height: '50px',
    background: 'rgba(42, 63, 95, 0.2)',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.1)'
  },
  barInner: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  barLabel: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.95rem',
    color: '#fff',
    fontWeight: '600',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
  },
  breakdownValue: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '1.2rem',
    color: '#d4af37',
    fontWeight: '600',
    textAlign: 'right'
  },
  insightBox: {
    padding: '1.5rem',
    background: 'rgba(180, 140, 100, 0.08)',
    borderLeft: '3px solid rgba(180, 140, 100, 0.6)',
    borderRadius: '4px'
  },
  insightText: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#e8dcc4',
    lineHeight: '1.7',
    margin: 0
  },
  insightStrong: {
    color: '#ffd4a3',
    fontWeight: '600'
  },
  concentrationDisplay: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '3rem'
  },
  concentrationCanvasWrapper: {
    position: 'relative',
    height: '400px',
    background: 'linear-gradient(135deg, #0a0d15 0%, #1a3a52 50%, #0a0d15 100%)',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    boxShadow: 'inset 0 0 50px rgba(74, 144, 226, 0.1)'
  },
  concentrationCanvas: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  canvasOverlay: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayMetric: {
    textAlign: 'center',
    background: 'rgba(10, 14, 39, 0.8)',
    padding: '2rem 3rem',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    backdropFilter: 'blur(10px)'
  },
  metricNumber: {
    display: 'block',
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: 'clamp(2.5rem, 4vw, 4rem)',
    color: '#ffd4a3',
    fontWeight: '900',
    lineHeight: '1',
    textShadow: '0 0 20px rgba(255, 212, 163, 0.4)'
  },
  metricUnit: {
    display: 'block',
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#c4b5a0',
    marginTop: '0.5rem',
    letterSpacing: '0.05em'
  },
  concentrationDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  detailCard: {
    background: 'rgba(21, 26, 51, 0.5)',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  cardValue: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '1.8rem',
    color: '#d4af37',
    fontWeight: '700',
    lineHeight: '1'
  },
  cardLabel: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.85rem',
    color: '#c4b5a0',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    lineHeight: '1.4'
  },
  methodologyNote: {
    background: 'rgba(212, 175, 55, 0.05)',
    padding: '1.5rem',
    borderRadius: '6px',
    borderLeft: '3px solid #d4af37'
  },
  methodologyTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#ffd4a3',
    margin: '0 0 0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600'
  },
  methodologyText: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.95rem',
    color: '#c4b5a0',
    lineHeight: '1.7',
    margin: 0
  },
  harborComposition: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '4rem',
    alignItems: 'center'
  },
  compositionChart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem'
  },
  waveVisualization: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    background: 'linear-gradient(180deg, #0a0d15 0%, #1a2332 100%)'
  },
  waveCanvas: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  waveOverlay: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalParticles: {
    textAlign: 'center',
    background: 'rgba(10, 14, 39, 0.85)',
    padding: '1.5rem 2.5rem',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    backdropFilter: 'blur(10px)'
  },
  particleCount: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '3.5rem',
    color: '#ffd4a3',
    fontWeight: '900',
    lineHeight: '1',
    textShadow: '0 0 20px rgba(255, 212, 163, 0.4)'
  },
  particleLabel: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#c4b5a0',
    marginTop: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em'
  },
  chartLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%'
  },
  legendItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(21, 26, 51, 0.3)',
    borderRadius: '6px',
    border: '1px solid rgba(212, 175, 55, 0.1)'
  },
  legendColor: {
    width: '50px',
    height: '50px',
    borderRadius: '6px',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  legendDetails: {
    flex: 1
  },
  legendPercentage: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '1.8rem',
    color: '#ffd4a3',
    fontWeight: '700',
    lineHeight: '1'
  },
  legendLabel: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.95rem',
    color: '#c4b5a0',
    marginTop: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  legendCount: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.9rem',
    color: '#8b7355',
    marginTop: '0.25rem'
  },
  compositionAnalysis: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  analysisTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.2rem',
    color: '#ffd4a3',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
    paddingBottom: '0.75rem',
    fontWeight: '600'
  },
  typeBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  typeRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 60px',
    gap: '1rem',
    alignItems: 'center'
  },
  typeNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  typeName: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.95rem',
    color: '#e8dcc4',
    fontWeight: '600'
  },
  typeDescription: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.8rem',
    color: '#8b7355',
    fontStyle: 'italic'
  },
  typeBarContainer: {
    height: '32px',
    background: 'rgba(42, 63, 95, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.1)'
  },
  typeBar: {
    height: '100%',
    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.08)'
  },
  typePercent: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '1rem',
    color: '#d4af37',
    fontWeight: '600',
    textAlign: 'right'
  },
  sourceInfo: {
    background: 'rgba(212, 175, 55, 0.05)',
    padding: '1.5rem',
    borderRadius: '6px',
    borderLeft: '3px solid #d4af37'
  },
  sourceTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    color: '#ffd4a3',
    margin: '0 0 0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600'
  },
  sourceText: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.95rem',
    color: '#c4b5a0',
    lineHeight: '1.7',
    margin: 0
  }
};

export default DataVisualizations;