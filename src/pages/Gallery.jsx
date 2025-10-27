import React, { useState, useRef } from "react";
import "/src/pages/Gallery.css";

import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpeg";
import img3 from "../assets/3.jpeg";
import img4 from "../assets/4.jpeg";
import img5 from "../assets/5.jpeg";
import img6 from "../assets/6.jpeg";
import img7 from "../assets/7.jpeg";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showData, setShowData] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const audioRefs = useRef({});

  const images = [
    {
      id: 1,
      src: img1,
      poem: "Where morning light meets murky waters",
      hidden: "720 microplastic fragments per cubic meter",
      // Replace with your own audio files in /assets/audio/
      audio: "https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3",
    },
    {
      id: 2,
      src: img2,
      poem: "Invisible threads woven through the river",
      hidden: "510 polymer fibers drift unseen",
      audio: "https://assets.mixkit.co/active_storage/sfx/2889/2889-preview.mp3",
    },
    {
      id: 3,
      src: img3,
      poem: "Quiet waters hold quiet secrets",
      hidden: "280 particles suspended in stillness",
      audio: "https://assets.mixkit.co/active_storage/sfx/2460/2460-preview.mp3",
    },
    {
      id: 4,
      src: img4,
      poem: "The river remembers what we forget",
      hidden: "1150 fragments of yesterday's choices",
      audio: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
    },
    {
      id: 5,
      src: img5,
      poem: "Between bridges, between worlds",
      hidden: "590 pieces of the city dissolve",
      audio: "https://assets.mixkit.co/active_storage/sfx/2463/2463-preview.mp3",
    },
    {
      id: 6,
      src: img6,
      poem: "Urban flow carries more than water",
      hidden: "840 invisible witnesses",
      audio: "https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3",
    },
    {
      id: 7,
      src: img7,
      poem: "Even beauty bears the weight",
      hidden: "150 particles in paradise",
      audio: "https://assets.mixkit.co/active_storage/sfx/2469/2469-preview.mp3",
    },
  ];

  const handleImageClick = (id) => {
    // Toggle selection
    setSelectedImage(selectedImage === id ? null : id);
    
    // Play audio
    const currentAudio = audioRefs.current[id];
    
    // Stop all other audio
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id.toString() && audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });

    if (currentAudio) {
      if (playingAudio === id) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setPlayingAudio(null);
      } else {
        currentAudio.play();
        setPlayingAudio(id);
      }
    }
  };

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Invisible Rivers</h1>
        <p className="subtitle">
          What the eye cannot see, the river remembers
        </p>
      </header>

      <button
        className="reveal-toggle"
        onClick={() => setShowData(!showData)}
      >
        {showData ? "hide the truth" : "reveal what's hidden"}
      </button>

      <div className="gallery-grid">
        {images.map((img) => (
          <div
            key={img.id}
            className={`gallery-item ${
              selectedImage === img.id ? "active" : ""
            } ${playingAudio === img.id ? "playing" : ""}`}
            onClick={() => handleImageClick(img.id)}
          >
            <div
              className="image-container"
              style={{ backgroundImage: `url(${img.src})` }}
            >
              <div className="image-overlay"></div>
              {playingAudio === img.id && (
                <div className="audio-indicator">♪</div>
              )}
            </div>

            <div className="image-text">
              <p className="poem">{img.poem}</p>
              {showData && selectedImage === img.id && (
                <p className="hidden-data">{img.hidden}</p>
              )}
            </div>

            {/* Hidden audio element */}
            <audio
              ref={(el) => (audioRefs.current[img.id] = el)}
              src={img.audio}
              onEnded={() => setPlayingAudio(null)}
            />
          </div>
        ))}
      </div>

      <footer className="gallery-footer">
        <p>
          Each image holds a story.<br />
          Click to listen.
        </p>
      </footer>
    </div>
  );
}
