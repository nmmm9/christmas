import { useState, useEffect, useCallback } from 'react';

// iOS 13+ requires permission request for DeviceMotion
export const useShake = (onShake, threshold = 15) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if permission is already granted (non-iOS or already permitted)
    if (!iOS || typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermissionGranted(true);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          return true;
        }
      } catch (error) {
        console.error('Permission request failed:', error);
        return false;
      }
    } else {
      setPermissionGranted(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = Date.now();
    let shakeDetected = false;
    let consecutiveShakes = 0;

    const handleMotion = (event) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;

      if (timeDiff > 50) { // Check every 50ms
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        const acceleration = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

        if (acceleration > threshold) {
          consecutiveShakes++;
          setShakeCount(prev => prev + 1);

          if (consecutiveShakes >= 3 && !shakeDetected) {
            shakeDetected = true;
            onShake?.();

            // Reset after shake detected
            setTimeout(() => {
              shakeDetected = false;
              consecutiveShakes = 0;
            }, 1000);
          }
        } else {
          consecutiveShakes = Math.max(0, consecutiveShakes - 1);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
        lastTime = currentTime;
      }
    };

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [permissionGranted, onShake, threshold]);

  return {
    permissionGranted,
    requestPermission,
    isIOS,
    shakeCount
  };
};

// Hook for device tilt/orientation
export const useTilt = () => {
  const [tilt, setTilt] = useState({ beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          return true;
        }
      } catch (error) {
        console.error('Orientation permission failed:', error);
        return false;
      }
    } else {
      setPermissionGranted(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    // Check if permission needed
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      const { beta, gamma } = event;
      setTilt({
        beta: beta || 0,   // Front-back tilt (-180 to 180)
        gamma: gamma || 0  // Left-right tilt (-90 to 90)
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  return { tilt, permissionGranted, requestPermission };
};
