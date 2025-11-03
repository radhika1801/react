import React, { useState, useRef } from 'react';
import '/src/pages/MapPage.css';

const MapPage = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.3, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.3, 0.8));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.8, Math.min(4, prev + delta)));
  };

  return (
    <div className="map-page">
      {/* Header */}
      <header className="page-header">
        <h1 className="main-title">The East River Project</h1>
        <p className="main-subtitle">Visualizing Microplastic Pollution Through Data and Design</p>
        <div className="header-divider"></div>
      </header>

      {/* Map Section */}
      <section className="map-section">
        <div 
          className="map-container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div className="zoom-controls">
            <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">+</button>
            <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">−</button>
            <button onClick={handleReset} className="zoom-btn reset-btn" title="Reset">⟲</button>
          </div>
          
          <div className="map-wrapper">
            <img
              ref={imageRef}
              src="/src/assets/map.png"
              alt="Battery Park & East River - Microplastic Research Site"
              className="map-image"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          </div>
          
          <div className="map-caption">
            Battery Park, East River, New York City
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="content-wrapper">
        
        {/* Introduction */}
        <section className="intro-section">
          <div className="intro-content">
            <h2 className="section-heading">The Invisible Crisis</h2>
            <div className="intro-columns">
              <div className="intro-column">
                <p className="intro-text">
                  The Data Awareness Room transforms environmental data into a contemplative digital space. 
                  Inspired by traditional Japanese tea ceremony aesthetics, this project invites visitors to 
                  pause and reflect on the invisible crisis of microplastic pollution in New York City's East River.
                </p>
              </div>
              <div className="intro-column">
                <p className="intro-text">
                  Every morning coffee at Battery Park releases <strong>15,000 microplastic particles</strong> into a single cup. 
                  The East River carries <strong>556,484 particles per square kilometer</strong>—invisible to the naked eye, 
                  yet impossible to ignore once revealed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Points */}
        <section className="data-section">
          <div className="data-grid">
            <div className="data-item">
              <span className="data-number">15,000</span>
              <span className="data-label">Particles per coffee cup</span>
            </div>
            <div className="data-item">
              <span className="data-number">556,484</span>
              <span className="data-label">Particles per km² in East River</span>
            </div>
            <div className="data-item">
              <span className="data-number">165M</span>
              <span className="data-label">Particles in NY Harbor</span>
            </div>
            <div className="data-item">
              <span className="data-number">200+</span>
              <span className="data-label">Years to decompose</span>
            </div>
          </div>
        </section>

        {/* Project Concept */}
        <section className="concept-section">
          <h2 className="section-heading">The Tea Room Concept</h2>
          <div className="concept-content">
            <p className="concept-text">
              The tea room serves as a contemplative interface between data and experience. 
              Like traditional tea ceremonies that encourage mindfulness and observation, 
              our digital space invites users to witness what is typically invisible—the microscopic 
              pollution flowing through urban waterways.
            </p>
            <p className="concept-text">
              Through the metaphor of a Japanese tea room, we create a space where environmental 
              data becomes experiential. The act of drinking tea parallels our unconscious consumption 
              of microplastics, while the peaceful aesthetic contrasts with the unsettling truth it reveals.
            </p>
          </div>
        </section>

        {/* Technical Approach */}
        <section className="tech-section">
          <h2 className="section-heading">Technical Implementation</h2>
          <div className="tech-list">
            <div className="tech-row">
              <div className="tech-title">3D Visualization</div>
              <div className="tech-description">
                React Three Fiber and Three.js enable real-time particle systems that represent microplastic 
                concentrations with scientific accuracy while maintaining visual poetry.
              </div>
            </div>
            <div className="tech-row">
              <div className="tech-title">Data Physicalization</div>
              <div className="tech-description">
                Particle clusters are procedurally generated using mathematical distributions that simulate 
                natural pollution dispersion patterns observed in Battery Park Marina samples.
              </div>
            </div>
            <div className="tech-row">
              <div className="tech-title">Spatial Interaction</div>
              <div className="tech-description">
                Interactive elements reveal layered information through progressive disclosure, 
                preventing cognitive overload while encouraging exploration and discovery.
              </div>
            </div>
            <div className="tech-row">
              <div className="tech-title">Atmospheric Design</div>
              <div className="tech-description">
                Custom lighting, shadows, and materials create an immersive environment that bridges 
                traditional Japanese architecture with contemporary data visualization.
              </div>
            </div>
          </div>
        </section>

        {/* City as System */}
        <section className="system-section">
          <h2 className="section-heading">City as System</h2>
          <div className="system-content">
            <div className="system-block">
              <h3 className="system-title">Material Flows & Urban Metabolism</h3>
              <p className="system-text">
                The East River functions as a metabolic pathway for the city's plastic consumption. 
                Like blood vessels transporting nutrients and waste, the river carries microscopic evidence 
                of human activity coffee cups, takeout containers, synthetic textiles downstream to the harbor.
              </p>
            </div>
            
            <div className="system-block">
              <h3 className="system-title">Feedback Loops</h3>
              <p className="system-text">
                Microplastics demonstrate a closed-loop system: plastic enters water, bioaccumulates in fish, 
                returns to human diet. The visualization illustrates this circular flow, challenging linear 
                assumptions about waste disposal.
              </p>
            </div>
            
            <div className="system-block">
              <h3 className="system-title">Scale & Perception</h3>
              <p className="system-text">
                Urban systems often operate beyond human perception. The project bridges scalar gaps by 
                magnifying the microscopic (1000x visualization) and aggregating the distributed 
                (556,484 particles across space).
              </p>
            </div>
            
            <div className="system-block">
              <h3 className="system-title">Collective Action</h3>
              <p className="system-text">
                Complex systems emerge from simple rules repeated at scale. Individual consumption patterns 
                aggregate into systemic environmental degradation, yet individual choices also create 
                pathways for transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Theoretical Framework */}
        <section className="framework-section">
          <h2 className="section-heading">Theoretical Framework</h2>
          <div className="framework-grid">
            <div className="framework-item">
              <h4>Systems Thinking</h4>
              <p>Understanding cities as interconnected metabolic networks through Urban Metabolism Theory</p>
            </div>
            <div className="framework-item">
              <h4>Actor Network Theory</h4>
              <p>Recognizing microplastics as active agents that reshape ecosystems and food chains</p>
            </div>
            <div className="framework-item">
              <h4>Data Physicalization</h4>
              <p>Materializing abstract statistics into tangible, experiential spatial design</p>
            </div>
            <div className="framework-item">
              <h4>Contemplative Design</h4>
              <p>Japanese 'ma' concept - creating space for reflection and mindful observation</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="action-section">
          <h2 className="section-heading">Pathways to Action</h2>
          <div className="action-content">
            <div className="action-row">
              <div className="action-title">Refuse Single-Use Plastics</div>
              <div className="action-description">
                Decline disposable cups, bottles, and containers whenever possible
              </div>
            </div>
            <div className="action-row">
              <div className="action-title">Choose Reusable Alternatives</div>
              <div className="action-description">
                Bring your own containers prevent 15,000 particles per drink
              </div>
            </div>
            <div className="action-row">
              <div className="action-title">Participate in River Restoration</div>
              <div className="action-description">
                Join Battery Park's regular cleanup and conservation efforts
              </div>
            </div>
            <div className="action-row">
              <div className="action-title">Amplify Awareness</div>
              <div className="action-description">
                Share knowledge individual awareness creates collective change
              </div>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="closing-section">
          <blockquote className="closing-quote">
            <p>
              The water remembers everything we give it. Every choice creates ripples 
              that travel far beyond what we can see.
            </p>
            <cite>— The East River</cite>
          </blockquote>
        </section>

      </div>
    </div>
  );
};

export default MapPage;