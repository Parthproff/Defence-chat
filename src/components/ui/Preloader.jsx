import React, { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = ({ onComplete, show = true }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setFadeOut(false);

      // Set timeout for 2.5 seconds
      const timer = setTimeout(() => {
        setFadeOut(true);
        
        // After fade out animation completes
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) {
            onComplete();
          }
        }, 500); // Wait for fade out animation
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-image-container">
          <img 
            src="/govt-logo.png" 
            alt="Aegis Logo" 
            className="preloader-image"
          />
        </div>
        <div className="preloader-text">
          <h2>Welcome To Aegis</h2>
          <h3>security beyond imagination</h3>
        </div>
      </div>
    </div>
  );
};

export default Preloader;