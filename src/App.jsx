import React, { useState, useEffect, useCallback } from 'react';
import MotionPermission from './components/MotionPermission';
import SnowGlobe from './components/SnowGlobe';
import Letter from './components/Letter';
import { useShake, useTilt } from './hooks/useShake';
import './styles/app.css';

// Background music
const BG_MUSIC = "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jingle_Bells_%28Kevin_MacLeod%29_-_Kevin_MacLeod.ogg";

function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Check if iOS requires permission
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const needsRequest = iOS && typeof DeviceMotionEvent.requestPermission === 'function';
    setNeedsPermission(needsRequest);

    if (!needsRequest) {
      setPermissionGranted(true);
    }
  }, []);

  // Play background music
  useEffect(() => {
    if (letterOpen && !audioPlaying) {
      const audio = new Audio(BG_MUSIC);
      audio.volume = 0.3;
      audio.loop = true;
      audio.play().catch(e => console.log('Audio play failed:', e));
      setAudioPlaying(true);
    }
  }, [letterOpen, audioPlaying]);

  // Handle shake event
  const handleShake = useCallback(() => {
    if (!letterOpen) {
      // Trigger intense shake animation
      setShakeIntensity(1);
      setTimeout(() => setShakeIntensity(0), 500);

      // Open letter after short delay
      setTimeout(() => {
        setLetterOpen(true);
        setShowHint(false);
      }, 300);
    }
  }, [letterOpen]);

  // Shake detection hook
  const { shakeCount } = useShake(handleShake, 12);

  // Tilt detection hook
  const { tilt } = useTilt();

  // Update shake intensity based on shake count
  useEffect(() => {
    if (shakeCount > 0 && !letterOpen) {
      setShakeIntensity(0.5);
      const timer = setTimeout(() => setShakeIntensity(0), 200);
      return () => clearTimeout(timer);
    }
  }, [shakeCount, letterOpen]);

  // Permission granted handler
  const handlePermissionGranted = () => {
    setPermissionGranted(true);
  };

  // Close letter
  const handleCloseLetter = () => {
    setLetterOpen(false);
  };

  // Show permission screen if needed
  if (needsPermission && !permissionGranted) {
    return <MotionPermission onGranted={handlePermissionGranted} />;
  }

  return (
    <div className="app">
      {/* Background gradient */}
      <div className="app-background" />

      {/* 3D Snow Globe */}
      <SnowGlobe tilt={tilt} shakeIntensity={shakeIntensity} />

      {/* Shake hint */}
      {showHint && !letterOpen && (
        <div className="shake-hint">
          <div className="hint-icon">📱</div>
          <p className="hint-text">흔들어 주세요!</p>
          <div className="hint-animation">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* Letter popup */}
      <Letter isOpen={letterOpen} onClose={handleCloseLetter} />

    </div>
  );
}

export default App;
