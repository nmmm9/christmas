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
          <div className="snowglobe-icon">
            <div className="globe"></div>
            <div className="base"></div>
            <div className="snow-particle p1"></div>
            <div className="snow-particle p2"></div>
            <div className="snow-particle p3"></div>
          </div>
        </div>

        <h1 className="permission-title">Merry Christmas</h1>
        <p className="permission-subtitle">🎄 특별한 선물이 도착했어요</p>

        <p className="permission-description">
          스노우 글로브를 흔들어<br />
          숨겨진 편지를 확인하세요!
        </p>

        <button
          className="permission-button"
          onClick={handleRequestPermission}
        >
          <span className="button-icon">📱</span>
          <span className="button-text">흔들기 활성화</span>
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
