import React, { useState, useEffect, useCallback, useRef } from 'react';
import PasswordScreen from './components/PasswordScreen';
import MotionPermission from './components/MotionPermission';
import SantaScene from './components/SantaScene';
import FallingLetter from './components/FallingLetter';
import { useShake, useTilt } from './hooks/useShake';
import './styles/app.css';

// Background music - Mariah Carey
const BG_MUSIC = import.meta.env.BASE_URL + "christmas-song.mp3";
// Whip sound effect
const WHIP_SOUND = import.meta.env.BASE_URL + "whip-sound.mp3";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
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
  const [musicStarted, setMusicStarted] = useState(false);

  // Check iOS permission requirement
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const needsRequest = iOS && typeof DeviceMotionEvent.requestPermission === 'function';
    setNeedsPermission(needsRequest);

    if (!needsRequest) {
      setPermissionGranted(true);
    }
  }, []);

  // Start music on first interaction
  const startMusic = useCallback(() => {
    if (!musicStarted && !audioRef.current) {
      audioRef.current = new Audio(BG_MUSIC);
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log('Audio:', e));
      setMusicStarted(true);
    }
  }, [musicStarted]);

  // Try to play music after authentication
  useEffect(() => {
    if (!authenticated) return;

    const tryAutoplay = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(BG_MUSIC);
        audioRef.current.volume = 0.5;
        audioRef.current.loop = true;
        audioRef.current.play()
          .then(() => setMusicStarted(true))
          .catch(() => {
            // Autoplay blocked, will play on first click
            audioRef.current = null;
          });
      }
    };
    tryAutoplay();
  }, [authenticated]);

  // Handle shake = whip action
  const handleShake = useCallback(() => {
    if (showLetter) return;
    if (isRunning) return; // Already running, no more whips needed

    // Play whip sound
    const whipSound = new Audio(WHIP_SOUND);
    whipSound.volume = 0.7;
    whipSound.play().catch(e => console.log('Whip sound:', e));

    // Whip animation
    setIsWhipping(true);
    setTimeout(() => setIsWhipping(false), 300);

    whipCountRef.current += 1;
    setShowHint(false);

    // After 3 whips, start running
    if (whipCountRef.current >= 3 && !isRunning) {
      setIsRunning(true);

      // Accelerate
      let currentSpeed = 0;
      const accelerate = setInterval(() => {
        currentSpeed += 0.1;
        setSpeed(currentSpeed);

        if (currentSpeed >= 1.5) {
          clearInterval(accelerate);

          // Show letter after running for longer (4 seconds)
          setTimeout(() => {
            setShowLetter(true);
          }, 4000);
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

  // Show password screen first
  if (!authenticated) {
    return <PasswordScreen onSuccess={() => setAuthenticated(true)} />;
  }

  // Show permission screen if needed
  if (needsPermission && !permissionGranted) {
    return <MotionPermission onGranted={handlePermissionGranted} />;
  }

  return (
    <div className="app" onClick={startMusic}>
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
          <p className="hint-text">채찍(휴대폰)을 오른손에 들고</p>
          <p className="hint-sub">루돌프를 3번 쳐주세요!</p>
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
