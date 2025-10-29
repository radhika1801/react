import React, { useState, useRef } from "react";
import "/src/pages/Gallery.css";

import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpeg";
import img3 from "../assets/3.jpeg";
import img4 from "../assets/4.jpeg";
import img5 from "../assets/5.jpeg";
import img6 from "../assets/6.jpeg";
import img7 from "../assets/7.jpeg";

import img1_back from "../assets/1.1.jpg";
import img2_back from "../assets/2.1.jpg";
import img3_back from "../assets/3.1.jpg";
import img4_back from "../assets/4.1.jpg";
import img5_back from "../assets/5.1.jpg";
import img6_back from "../assets/6.1.jpg";
import img7_back from "../assets/7.1.jpg";

export default function Gallery() {
  const [flippedCards, setFlippedCards] = useState({});
  const [audioPlaying, setAudioPlaying] = useState(null);
  const audioRefs = useRef({});

  const content = [
    { id: 1, src: img1, backSrc: img1_back, title: "go outside. stand still.", verse: "hold the day like a warm cup.", audio: "/src/assets/audio/river1.mp3", size: 1 },
    { id: 2, src: img2, backSrc: img2_back, title: "observe the invisible", verse: "do not blink. swallow slowly.", audio: "/src/assets/audio/river2.mp3", size: 0.9 },
    { id: 3, src: img3, backSrc: img3_back, title: "morning ritual", verse: "your daily cup by the river.", audio: "/src/assets/audio/river3.mp3", size: 1.1 },
    { id: 4, src: img4, backSrc: img4_back, title: "the river speaks", verse: "imagine each fragment as a message.", audio: "/src/assets/audio/river4.mp3", size: 0.85 },
    { id: 5, src: img5, backSrc: img5_back, title: "hold a cup of water", verse: "now imagine it holding you back.", audio: "/src/assets/audio/river5.mp3", size: 1 },
    { id: 6, src: img6, backSrc: img6_back, title: "transformation", verse: "visible pollution breaks into invisible fragments.", audio: "/src/assets/audio/river6.mp3", size: 0.9 },
    { id: 7, src: img7, backSrc: img7_back, title: "look at the East River", verse: "see it looking back at you.", audio: "/src/assets/audio/river7.mp3", size: 1.05 },
  ];

  // Strategically scattered positions with extra spacing
  const positions = [
    { top: "1%", left: "10%", rotation: -10 },
    { top: "8%", left: "45%", rotation: 5 },
    { top: "30%", left: "70%", rotation: 10 },
    { top: "35%", left: "10%", rotation: 8 },
    { top: "40%", left: "40%", rotation: -12 },
    { top: "65%", left: "20%", rotation: 12 },
    { top: "65%", left: "65%", rotation: -8 },
  ];

  const toggleCard = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));

    const audio = audioRefs.current[id];

    Object.keys(audioRefs.current).forEach((key) => {
      const keyAudio = audioRefs.current[key];
      if (keyAudio && parseInt(key) !== id) {
        keyAudio.pause();
        keyAudio.currentTime = 0;
      }
    });

    if (audio) {
      if (audioPlaying === id) {
        audio.pause();
        audio.currentTime = 0;
        setAudioPlaying(null);
      } else {
        audio.play();
        setAudioPlaying(id);
      }
    }
  };

  return (
    <div className="gallery">
      <section className="gallery-hero">
        <h1 className="hero-title">Interactive Archive</h1>
        <p className="hero-subtitle">what the eye cannot see, the river remembers</p>
        <span className="hero-divider"></span>
        <p className="hero-hint">click · listen · reveal</p>
      </section>

      <section className="gallery-container">
        {content.map((item, index) => (
          <article
            key={item.id}
            className={`card ${flippedCards[item.id] ? "flipped" : ""}`}
            style={{
              top: positions[index].top,
              left: positions[index].left,
              transform: `rotate(${positions[index].rotation}deg) scale(${item.size})`
            }}
          >
            <div 
              className="card-number-box"
              style={{ transform: `rotate(${-positions[index].rotation}deg)` }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
            
            <div className="card-inner" onClick={() => toggleCard(item.id)}>
              <div
                className="card-visual card-front"
                style={{ backgroundImage: `url(${item.src})` }}
              >
                {audioPlaying === item.id && <div className="audio-pulse">♪</div>}
              </div>
              <div
                className="card-visual card-back"
                style={{ backgroundImage: `url(${item.backSrc})` }}
              >
                {audioPlaying === item.id && <div className="audio-pulse">♪</div>}
              </div>
            </div>

            {flippedCards[item.id] && (
              <div 
                className="card-text-container"
                style={{ transform: `rotate(${-positions[index].rotation}deg)` }}
              >
                <h3 className="text-title">{item.title}</h3>
                <p className="text-verse">{item.verse}</p>
              </div>
            )}

            <audio
              ref={(el) => (audioRefs.current[item.id] = el)}
              src={item.audio}
              onEnded={() => setAudioPlaying(null)}
            />
          </article>
        ))}
      </section>
    </div>
  );
}