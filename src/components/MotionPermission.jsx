import React from 'react';
import '../styles/permission.css';

const MotionPermission = ({ onGranted }) => {
  const handleRequestPermission = async () => {
    let motionGranted = true;
    let orientationGranted = true;

    // Request DeviceMotion permission (for shake)
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        motionGranted = result === 'granted';
      } catch (e) {
        motionGranted = false;
      }
    }

    // Request DeviceOrientation permission (for tilt)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        orientationGranted = result === 'granted';
      } catch (e) {
        orientationGranted = false;
      }
    }

    if (motionGranted && orientationGranted) {
      onGranted?.();
    }
  };

  return (
    <div className="permission-overlay">
      <div className="permission-card">
        <div className="permission-icon">
          <div className="santa-sleigh-icon">
            <span className="santa">🎅</span>
            <span className="sleigh">🛷</span>
            <span className="rudolph">🦌</span>
          </div>
        </div>

        <h1 className="permission-title">Merry Christmas</h1>
        <p className="permission-subtitle">🎄 산타의 썰매에 탑승하세요!</p>

        <p className="permission-description">
          폰을 흔들어 루돌프를 출발시키고<br />
          특별한 편지를 받아보세요!
        </p>

        <button
          className="permission-button"
          onClick={handleRequestPermission}
        >
          <span className="button-icon">🦌</span>
          <span className="button-text">출발 준비!</span>
        </button>

        <p className="permission-hint">
          모션 센서 권한이 필요합니다
        </p>
      </div>

      {/* Background snow effect */}
      <div className="bg-snow">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`snowflake sf-${i % 5}`} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}>❄</div>
        ))}
      </div>
    </div>
  );
};

export default MotionPermission;
