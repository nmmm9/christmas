import React, { useState, useEffect, useCallback, useRef } from 'react';
import MotionPermission from './components/MotionPermission';
import SantaScene from './components/SantaScene';
import FallingLetter from './components/FallingLetter';
import { useShake, useTilt } from './hooks/useShake';
import './styles/app.css';

// Background music
const BG_MUSIC = "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jingle_Bells_%28Kevin_MacLeod%29_-_Kevin_MacLeod.ogg";

function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  // Scene states
  const [isWhipping, setIsWhipping] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const audioRef = useRef(null);
  const whipCountRef = useRef(0);

  // Check iOS permission requirement
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const needsRequest = iOS && typeof DeviceMotionEvent.requestPermission === 'function';
    setNeedsPermission(needsRequest);

    if (!needsRequest) {
      setPermissionGranted(true);
    }
  }, []);

  // Handle shake = whip action
  const handleShake = useCallback(() => {
    if (showLetter) return;

    // Whip animation
    setIsWhipping(true);
    setTimeout(() => setIsWhipping(false), 300);

    whipCountRef.current += 1;
    setShowHint(false);

    // After 2-3 whips, start running
    if (whipCountRef.current >= 2 && !isRunning) {
      setIsRunning(true);

      // Accelerate
      let currentSpeed = 0;
      const accelerate = setInterval(() => {
        currentSpeed += 0.1;
        setSpeed(currentSpeed);

        if (currentSpeed >= 1.5) {
          clearInterval(accelerate);

          // Show letter after running for a bit
          setTimeout(() => {
            setShowLetter(true);

            // Play music
            if (!audioRef.current) {
              audioRef.current = new Audio(BG_MUSIC);
              audioRef.current.volume = 0.3;
              audioRef.current.loop = true;
              audioRef.current.play().catch(e => console.log('Audio:', e));
            }
          }, 1500);
        }
      }, 100);
    }
  }, [isRunning, showLetter]);

  // Shake detection - pass permissionGranted to enable on iOS
  const { shakeCount } = useShake(handleShake, 10, permissionGranted);

  // Tilt detection - pass permissionGranted to enable on iOS
  const { tilt } = useTilt(permissionGranted);

  // Permission granted
  const handlePermissionGranted = () => {
    setPermissionGranted(true);
  };

  // Letter closed - reset for replay
  const handleLetterComplete = () => {
    setShowLetter(false);
    setIsRunning(false);
    setSpeed(0);
    whipCountRef.current = 0;
    setShowHint(true);
  };

  // Show permission screen if needed
  if (needsPermission && !permissionGranted) {
    return <MotionPermission onGranted={handlePermissionGranted} />;
  }

  return (
    <div className="app">
      {/* 3D Santa Scene */}
      <SantaScene
        tilt={tilt}
        isRunning={isRunning}
        isWhipping={isWhipping}
        speed={speed}
      />

      {/* Shake hint */}
      {showHint && !showLetter && (
        <div className="shake-hint santa-hint" onClick={handleShake}>
          <div className="hint-icon">🏇</div>
          <p className="hint-text">흔들어서 출발!</p>
          <p className="hint-sub">폰을 흔들거나 탭하세요</p>
        </div>
      )}

      {/* Running indicator */}
      {isRunning && !showLetter && (
        <div className="running-indicator">
          <p>🦌 달리는 중... 💨</p>
        </div>
      )}

      {/* Falling Letter */}
      <FallingLetter
        isVisible={showLetter}
        onComplete={handleLetterComplete}
      />
    </div>
  );
}

export default App;
