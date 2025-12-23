import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Snow particles inside the globe
const Snow = ({ count = 200, shakeIntensity = 0 }) => {
  const mesh = useRef();
  const velocities = useRef([]);

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const vels = [];

    for (let i = 0; i < count; i++) {
      // Random position within sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 1.8;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.3;
      positions[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;

      sizes[i] = Math.random() * 0.05 + 0.02;

      vels.push({
        x: (Math.random() - 0.5) * 0.002,
        y: -Math.random() * 0.003 - 0.001,
        z: (Math.random() - 0.5) * 0.002
      });
    }

    velocities.current = vels;
    return [positions, colors, sizes];
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    const posArray = mesh.current.geometry.attributes.position.array;
    const shake = shakeIntensity;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Add shake effect (gentler movement)
      posArray[i3] += velocities.current[i].x + (Math.random() - 0.5) * shake * 0.03;
      posArray[i3 + 1] += velocities.current[i].y;
      posArray[i3 + 2] += velocities.current[i].z + (Math.random() - 0.5) * shake * 0.03;

      // Check bounds (keep inside globe)
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];
      const dist = Math.sqrt(x * x + (y + 0.3) * (y + 0.3) + z * z);

      if (dist > 1.8 || y < -2) {
        // Reset to top
        posArray[i3] = (Math.random() - 0.5) * 2;
        posArray[i3 + 1] = 1.5 + Math.random() * 0.5;
        posArray[i3 + 2] = (Math.random() - 0.5) * 2;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Glass globe sphere
const GlassSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.95}
        roughness={0}
        thickness={0.5}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

// Christmas tree inside globe
const ChristmasTree = () => {
  return (
    <group position={[0, -1, 0]}>
      {/* Tree layers */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.5, 0.8, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.7, 0.9, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.9, 1, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.5, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Star */}
      <mesh position={[0, 1.7, 0]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// Wooden base
const Base = () => {
  return (
    <group position={[0, -2.3, 0]}>
      <mesh>
        <cylinderGeometry args={[1.5, 1.8, 0.6, 32]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} />
      </mesh>
    </group>
  );
};

// Main scene
const Scene = ({ tilt, shakeIntensity }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Apply tilt based on device orientation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (tilt.beta || 0) * 0.005,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        (tilt.gamma || 0) * 0.005,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <GlassSphere />
        <Snow count={150} shakeIntensity={shakeIntensity} />
        <ChristmasTree />
        <Sparkles count={30} scale={3} size={2} speed={0.3} color="#FFD700" />
      </Float>
      <Base />
    </group>
  );
};

// Main component
const SnowGlobe = ({ tilt = { beta: 0, gamma: 0 }, shakeIntensity = 0 }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#87CEEB" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#FFF8DC"
        />
        <Scene tilt={tilt} shakeIntensity={shakeIntensity} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default SnowGlobe;
