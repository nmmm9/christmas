import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Rudolph the Reindeer (viewed from behind)
const Rudolph = ({ isRunning, onWhip }) => {
  const groupRef = useRef();
  const noseRef = useRef();
  const [headBob, setHeadBob] = useState(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isRunning) {
      // Running animation - bobbing up and down
      setHeadBob(prev => prev + delta * 15);
      groupRef.current.position.y = Math.sin(headBob) * 0.15;
      groupRef.current.rotation.x = Math.sin(headBob * 0.5) * 0.05;
    }

    // Nose glow pulsing
    if (noseRef.current) {
      noseRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -4]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.6, 1.2, 8, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.5, -0.7]} rotation={[0.5, 0, 0]}>
        <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.9, -1.2]}>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>

        {/* Snout */}
        <mesh position={[0, -0.1, -0.35]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#A0522D" roughness={0.8} />
        </mesh>

        {/* Red Nose - Glowing! */}
        <mesh ref={noseRef} position={[0, -0.1, -0.55]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Point light from nose */}
        <pointLight position={[0, -0.1, -0.55]} color="#ff0000" intensity={2} distance={5} />

        {/* Ears */}
        <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.1, 0.25, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.1, 0.25, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Antlers */}
        <group position={[-0.25, 0.4, 0.1]}>
          <mesh rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.03, 0.05, 0.5, 8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          <mesh position={[-0.15, 0.3, 0]} rotation={[0, 0, -0.8]}>
            <cylinderGeometry args={[0.02, 0.03, 0.25, 8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
        </group>
        <group position={[0.25, 0.4, 0.1]}>
          <mesh rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.03, 0.05, 0.5, 8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
          <mesh position={[0.15, 0.3, 0]} rotation={[0, 0, 0.8]}>
            <cylinderGeometry args={[0.02, 0.03, 0.25, 8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
        </group>
      </group>

      {/* Tail */}
      <mesh position={[0, 0.2, 0.8]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>

      {/* Back Legs */}
      <mesh position={[-0.3, -0.7, 0.3]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.3, -0.7, 0.3]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Front Legs */}
      <mesh position={[-0.25, -0.6, -0.5]} rotation={[-0.2, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.25, -0.6, -0.5]} rotation={[-0.2, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Harness */}
      <mesh position={[0, 0.1, -0.2]}>
        <torusGeometry args={[0.65, 0.03, 8, 32]} />
        <meshStandardMaterial color="#8B0000" metalness={0.3} />
      </mesh>

      {/* Bells on harness */}
      <mesh position={[0, -0.5, -0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Reins (고삐)
const Reins = ({ isRunning }) => {
  const leftReinRef = useRef();
  const rightReinRef = useRef();

  useFrame((state) => {
    const wobble = isRunning ? Math.sin(state.clock.elapsedTime * 10) * 0.02 : 0;
    if (leftReinRef.current) {
      leftReinRef.current.rotation.x = wobble;
    }
    if (rightReinRef.current) {
      rightReinRef.current.rotation.x = -wobble;
    }
  });

  const reinCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.5, 1),
      new THREE.Vector3(0, -0.3, 0),
      new THREE.Vector3(0, -0.4, -2),
      new THREE.Vector3(0, 0, -3.5),
    ]);
  }, []);

  return (
    <group>
      {/* Left Rein */}
      <mesh ref={leftReinRef} position={[-0.4, 0, 0]}>
        <tubeGeometry args={[reinCurve, 20, 0.02, 8, false]} />
        <meshStandardMaterial color="#3d2314" />
      </mesh>
      {/* Right Rein */}
      <mesh ref={rightReinRef} position={[0.4, 0, 0]}>
        <tubeGeometry args={[reinCurve, 20, 0.02, 8, false]} />
        <meshStandardMaterial color="#3d2314" />
      </mesh>
    </group>
  );
};

// Santa's hands holding reins
const SantaHands = ({ isWhipping }) => {
  const leftHandRef = useRef();
  const rightHandRef = useRef();

  useEffect(() => {
    if (isWhipping && rightHandRef.current) {
      // Whip animation
      gsap.to(rightHandRef.current.rotation, {
        z: -1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      gsap.to(rightHandRef.current.position, {
        y: 0,
        z: 0.5,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
  }, [isWhipping]);

  return (
    <group position={[0, -1, 0.5]}>
      {/* Left Hand (red glove) */}
      <mesh ref={leftHandRef} position={[-0.5, -0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>
      {/* Right Hand (red glove) */}
      <mesh ref={rightHandRef} position={[0.5, -0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>
      {/* Sleigh edge */}
      <mesh position={[0, -0.5, 0.3]}>
        <boxGeometry args={[2, 0.1, 0.3]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>
      {/* Gold trim */}
      <mesh position={[0, -0.45, 0.35]}>
        <boxGeometry args={[2.1, 0.03, 0.05]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} />
      </mesh>
    </group>
  );
};

// Whip effect
const WhipEffect = ({ isWhipping }) => {
  const whipRef = useRef();

  useEffect(() => {
    if (isWhipping && whipRef.current) {
      whipRef.current.visible = true;
      gsap.fromTo(whipRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.1 }
      );
      gsap.fromTo(whipRef.current.rotation,
        { z: 0.5 },
        { z: -0.5, duration: 0.2, ease: "power2.out" }
      );
      setTimeout(() => {
        if (whipRef.current) whipRef.current.visible = false;
      }, 300);
    }
  }, [isWhipping]);

  const whipCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, -0.5, 0.5),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1.5, 0.5, -1),
      new THREE.Vector3(1, 0.3, -2),
    ]);
  }, []);

  return (
    <mesh ref={whipRef} visible={false}>
      <tubeGeometry args={[whipCurve, 20, 0.02, 8, false]} />
      <meshStandardMaterial color="#3d2314" />
    </mesh>
  );
};

// Flying snow/wind particles
const FlyingSnow = ({ isRunning, speed }) => {
  const particlesRef = useRef();
  const count = 300;

  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = Math.random() * -30;
    }
    return [positions];
  }, []);

  useFrame((state, delta) => {
    if (!particlesRef.current || !isRunning) return;

    const posArray = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 2] += speed * delta * 30;

      // Reset when passed camera
      if (posArray[i * 3 + 2] > 5) {
        posArray[i * 3 + 2] = -30;
        posArray[i * 3] = (Math.random() - 0.5) * 20;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!isRunning) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Main Scene
const Scene = ({ isRunning, isWhipping, speed, tilt }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Tilt effect based on device orientation
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        (tilt.gamma || 0) * 0.01,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (tilt.beta || 0) * 0.005 - 0.1,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Night sky with stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={isRunning ? 2 : 0.5} />

      {/* Moon */}
      <mesh position={[10, 8, -30]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#fffacd" emissive="#fffacd" emissiveIntensity={0.3} />
      </mesh>
      <pointLight position={[10, 8, -30]} intensity={0.5} color="#fffacd" />

      {/* Rudolph */}
      <Rudolph isRunning={isRunning} />

      {/* Reins */}
      <Reins isRunning={isRunning} />

      {/* Santa's hands */}
      <SantaHands isWhipping={isWhipping} />

      {/* Whip effect */}
      <WhipEffect isWhipping={isWhipping} />

      {/* Flying snow when running */}
      <FlyingSnow isRunning={isRunning} speed={speed} />

      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </group>
  );
};

// Main component
const SantaScene = ({ tilt = { beta: 0, gamma: 0 }, isRunning = false, isWhipping = false, speed = 1 }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0.5, 2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(to bottom, #0a0a20, #1a1a40)' }}
      >
        <fog attach="fog" args={['#0a0a20', 10, 50]} />
        <Scene tilt={tilt} isRunning={isRunning} isWhipping={isWhipping} speed={speed} />
      </Canvas>
    </div>
  );
};

export default SantaScene;
