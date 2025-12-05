import React, { useState, useEffect } from 'react';
import ThreeCanvas from "../Three";
import "./PageLoader.css";

export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;   

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(Math.round(newProgress));

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100); 
        
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
        }, 200);
      }
    }, 50); 

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loader-overlay ${isExiting ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <div className="three-wrapper">
          <ThreeCanvas />
        </div>

        <div className="loading-bar">
          <div 
            className="loading-progress" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loading-info">
          <p className="loading-text">
            {progress < 100 ? 'Chargement' : 'Terminé'}
          </p>
          
          <div className="loading-dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>

          <span className="loading-percentage">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}