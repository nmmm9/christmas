import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Rudolph the Reindeer (viewed from behind) - Cute cartoon style
const Rudolph = ({ isRunning, onWhip }) => {
  const groupRef = useRef();
  const noseRef = useRef();
  const leftFrontLegRef = useRef();
  const rightFrontLegRef = useRef();
  const leftBackLegRef = useRef();
  const rightBackLegRef = useRef();
  const headRef = useRef();
  const tailRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    if (isRunning) {
      // Running animation - galloping motion
      const gallop = Math.sin(time * 12);
      const gallop2 = Math.sin(time * 12 + Math.PI);

      // Body bounce
      groupRef.current.position.y = Math.abs(Math.sin(time * 12)) * 0.1;

      // Head bob
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(time * 12) * 0.1;
      }

      // Leg animations - galloping
      if (leftFrontLegRef.current) {
        leftFrontLegRef.current.rotation.x = gallop * 0.6;
      }
      if (rightFrontLegRef.current) {
        rightFrontLegRef.current.rotation.x = gallop2 * 0.6;
      }
      if (leftBackLegRef.current) {
        leftBackLegRef.current.rotation.x = gallop2 * 0.5;
      }
      if (rightBackLegRef.current) {
        rightBackLegRef.current.rotation.x = gallop * 0.5;
      }

      // Tail wag
      if (tailRef.current) {
        tailRef.current.rotation.x = Math.sin(time * 15) * 0.3;
      }
    } else {
      // Idle animation - gentle breathing
      groupRef.current.position.y = Math.sin(time * 2) * 0.02;

      if (tailRef.current) {
        tailRef.current.rotation.x = Math.sin(time * 3) * 0.1;
      }
    }

    // Nose glow pulsing
    if (noseRef.current) {
      noseRef.current.material.emissiveIntensity = 2 + Math.sin(time * 4) * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, -3.5]}>
      {/* Main Body - more rounded and cute */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>
      {/* Body back extension */}
      <mesh position={[0, 0.35, 0.4]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>

      {/* Cream colored belly */}
      <mesh position={[0, 0.05, 0.1]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#DEB887" roughness={0.9} />
      </mesh>

      {/* Neck - slightly curved forward */}
      <mesh position={[0, 0.65, -0.45]} rotation={[0.7, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 16, 16]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 0.95, -0.9]}>
        {/* Main head - oval shaped */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>

        {/* Face/Muzzle - elongated */}
        <mesh position={[0, -0.1, -0.3]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.18, 0.2, 16, 16]} />
          <meshStandardMaterial color="#A0826D" roughness={0.9} />
        </mesh>

        {/* Cream colored chin/mouth area */}
        <mesh position={[0, -0.2, -0.25]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#DEB887" roughness={0.9} />
        </mesh>

        {/* RED GLOWING NOSE - the star feature! */}
        <mesh ref={noseRef} position={[0, -0.12, -0.5]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff3333"
            emissiveIntensity={3}
          />
        </mesh>
        {/* Nose highlight */}
        <mesh position={[0.02, -0.08, -0.52]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#ff6666" emissive="#ff6666" emissiveIntensity={1} />
        </mesh>
        {/* Strong nose glow */}
        <pointLight position={[0, -0.12, -0.5]} color="#ff0000" intensity={3} distance={8} />

        {/* Eyes - cute and expressive */}
        <mesh position={[-0.12, 0.08, -0.25]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.12, 0.08, -0.25]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.14, 0.1, -0.31]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.1, 0.1, -0.31]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>

        {/* Ears - floppy and cute */}
        <mesh position={[-0.28, 0.15, 0.05]} rotation={[0.3, 0.3, -0.6]}>
          <capsuleGeometry args={[0.06, 0.18, 8, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        <mesh position={[0.28, 0.15, 0.05]} rotation={[0.3, -0.3, 0.6]}>
          <capsuleGeometry args={[0.06, 0.18, 8, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        {/* Inner ear (pink) */}
        <mesh position={[-0.3, 0.18, 0.02]} rotation={[0.3, 0.3, -0.6]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 16]} />
          <meshStandardMaterial color="#DEB887" roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 0.18, 0.02]} rotation={[0.3, -0.3, 0.6]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 16]} />
          <meshStandardMaterial color="#DEB887" roughness={0.9} />
        </mesh>

        {/* Antlers - more elaborate and majestic */}
        <group position={[-0.2, 0.35, 0.05]}>
          {/* Main stem */}
          <mesh rotation={[0.2, 0, -0.3]}>
            <cylinderGeometry args={[0.025, 0.04, 0.45, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          {/* Branch 1 */}
          <mesh position={[-0.12, 0.25, 0]} rotation={[0, 0, -0.9]}>
            <cylinderGeometry args={[0.015, 0.025, 0.2, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          {/* Branch 2 */}
          <mesh position={[-0.18, 0.35, 0.05]} rotation={[0.3, 0, -1.1]}>
            <cylinderGeometry args={[0.012, 0.02, 0.15, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          {/* Top branch */}
          <mesh position={[-0.08, 0.4, 0]} rotation={[-0.2, 0, -0.5]}>
            <cylinderGeometry args={[0.01, 0.018, 0.12, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
        </group>
        <group position={[0.2, 0.35, 0.05]}>
          {/* Main stem */}
          <mesh rotation={[0.2, 0, 0.3]}>
            <cylinderGeometry args={[0.025, 0.04, 0.45, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          {/* Branch 1 */}
          <mesh position={[0.12, 0.25, 0]} rotation={[0, 0, 0.9]}>
            <cylinderGeometry args={[0.015, 0.025, 0.2, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          {/* Branch 2 */}
          <mesh position={[0.18, 0.35, 0.05]} rotation={[0.3, 0, 1.1]}>
            <cylinderGeometry args={[0.012, 0.02, 0.15, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          {/* Top branch */}
          <mesh position={[0.08, 0.4, 0]} rotation={[-0.2, 0, 0.5]}>
            <cylinderGeometry args={[0.01, 0.018, 0.12, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Fluffy white tail */}
      <group ref={tailRef} position={[0, 0.45, 0.9]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#F5F5DC" roughness={1} />
        </mesh>
        <mesh position={[0, 0.05, 0.05]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#FFFFF0" roughness={1} />
        </mesh>
      </group>

      {/* Legs with hooves */}
      {/* Front Left Leg */}
      <group ref={leftFrontLegRef} position={[-0.25, -0.2, -0.35]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        {/* Hoof */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.1, 8]} />
          <meshStandardMaterial color="#2F1810" roughness={0.7} />
        </mesh>
      </group>

      {/* Front Right Leg */}
      <group ref={rightFrontLegRef} position={[0.25, -0.2, -0.35]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.1, 8]} />
          <meshStandardMaterial color="#2F1810" roughness={0.7} />
        </mesh>
      </group>

      {/* Back Left Leg */}
      <group ref={leftBackLegRef} position={[-0.3, -0.15, 0.4]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.1, 8]} />
          <meshStandardMaterial color="#2F1810" roughness={0.7} />
        </mesh>
      </group>

      {/* Back Right Leg */}
      <group ref={rightBackLegRef} position={[0.3, -0.15, 0.4]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.45, 8, 16]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.1, 8]} />
          <meshStandardMaterial color="#2F1810" roughness={0.7} />
        </mesh>
      </group>

      {/* Christmas Harness - festive red with gold bells */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.035, 8, 32]} />
        <meshStandardMaterial color="#B22222" roughness={0.5} />
      </mesh>
      {/* Harness strap going to neck */}
      <mesh position={[0, 0.55, -0.25]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.03]} />
        <meshStandardMaterial color="#B22222" roughness={0.5} />
      </mesh>

      {/* Golden Bells */}
      <mesh position={[0, -0.15, 0.05]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.35, 0.1, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.35, 0.1, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Holly decoration on harness */}
      <mesh position={[0, 0.6, -0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-0.05, 0.58, -0.1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

// Reins (고삐)
const Reins = ({ isRunning }) => {
  const leftReinRef = useRef();
  const rightReinRef = useRef();

  useFrame((state) => {
    const wobble = isRunning ? Math.sin(state.clock.elapsedTime * 10) * 0.03 : 0;
    if (leftReinRef.current) {
      leftReinRef.current.rotation.x = wobble;
    }
    if (rightReinRef.current) {
      rightReinRef.current.rotation.x = -wobble;
    }
  });

  const reinCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.8, 0.8),
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(0, -0.5, -1.5),
      new THREE.Vector3(0, 0.2, -3),
    ]);
  }, []);

  return (
    <group>
      {/* Left Rein */}
      <mesh ref={leftReinRef} position={[-0.35, 0, 0]}>
        <tubeGeometry args={[reinCurve, 20, 0.025, 8, false]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      {/* Right Rein */}
      <mesh ref={rightReinRef} position={[0.35, 0, 0]}>
        <tubeGeometry args={[reinCurve, 20, 0.025, 8, false]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
    </group>
  );
};

// Santa's body, arms and hands (visible from first-person view)
const SantaBody = ({ isWhipping }) => {
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useEffect(() => {
    if (isWhipping && rightArmRef.current) {
      // Whip animation - more dramatic!
      gsap.timeline()
        .to(rightArmRef.current.rotation, {
          z: 0.5,
          x: -0.5,
          duration: 0.1,
          ease: "power2.in"
        })
        .to(rightArmRef.current.rotation, {
          z: -1.2,
          x: 0.8,
          duration: 0.15,
          ease: "power4.out"
        })
        .to(rightArmRef.current.rotation, {
          z: -0.25,
          x: 0,
          duration: 0.2,
          ease: "elastic.out(1, 0.5)"
        });
    }
  }, [isWhipping]);

  return (
    <group position={[0, -0.2, 1.6]}>
      {/* Santa's belly/chest - moderately visible */}
      <mesh position={[0, -0.5, 0.4]}>
        <boxGeometry args={[1.8, 0.8, 0.7]} />
        <meshStandardMaterial color="#cc0000" roughness={0.8} />
      </mesh>

      {/* White fur trim */}
      <mesh position={[0, -0.15, 0.45]}>
        <boxGeometry args={[1.9, 0.12, 0.65]} />
        <meshStandardMaterial color="#f5f5f5" roughness={1} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, -0.35, 0.48]}>
        <boxGeometry args={[1.7, 0.14, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, -0.35, 0.8]}>
        <boxGeometry args={[0.22, 0.16, 0.06]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.8, -0.2, 0.1]}>
        {/* Forearm */}
        <mesh rotation={[0.9, 0.1, 0.25]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color="#cc0000" roughness={0.8} />
        </mesh>
        {/* White cuff */}
        <mesh position={[-0.1, -0.4, -0.35]} rotation={[0.9, 0, 0.1]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={1} />
        </mesh>
        {/* Hand (white glove) */}
        <mesh position={[-0.15, -0.55, -0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.8, -0.2, 0.1]}>
        {/* Forearm */}
        <mesh rotation={[0.9, -0.1, -0.25]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color="#cc0000" roughness={0.8} />
        </mesh>
        {/* White cuff */}
        <mesh position={[0.1, -0.4, -0.35]} rotation={[0.9, 0, -0.1]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={1} />
        </mesh>
        {/* Hand (white glove) */}
        <mesh position={[0.15, -0.55, -0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
        </mesh>
      </group>

      {/* Sleigh edge */}
      <mesh position={[0, -0.8, 0.2]}>
        <boxGeometry args={[2.2, 0.12, 0.35]} />
        <meshStandardMaterial color="#8B0000" roughness={0.6} />
      </mesh>
      {/* Gold trim */}
      <mesh position={[0, -0.76, 0.38]}>
        <boxGeometry args={[2.25, 0.06, 0.05]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Whip effect - more visible and dramatic
const WhipEffect = ({ isWhipping }) => {
  const whipRef = useRef();
  const trailRef = useRef();

  useEffect(() => {
    if (isWhipping && whipRef.current) {
      whipRef.current.visible = true;
      if (trailRef.current) trailRef.current.visible = true;

      // Whip crack animation
      gsap.timeline()
        .fromTo(whipRef.current.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1.5, y: 1.5, z: 1.5, duration: 0.08, ease: "power2.out" }
        )
        .to(whipRef.current.rotation, {
          z: -1.2,
          y: 0.3,
          duration: 0.12,
          ease: "power4.out"
        }, 0)
        .to(whipRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.15
        });

      // Trail effect
      if (trailRef.current) {
        gsap.fromTo(trailRef.current.material,
          { opacity: 0.8 },
          { opacity: 0, duration: 0.4 }
        );
      }

      setTimeout(() => {
        if (whipRef.current) whipRef.current.visible = false;
        if (trailRef.current) trailRef.current.visible = false;
      }, 400);
    }
  }, [isWhipping]);

  const whipCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.6, -0.3, 0.8),
      new THREE.Vector3(1.2, 0.2, 0),
      new THREE.Vector3(1.8, 0.5, -1.2),
      new THREE.Vector3(1.2, 0.2, -2.5),
      new THREE.Vector3(0.5, -0.2, -3.2),
    ]);
  }, []);

  return (
    <group>
      {/* Main whip */}
      <mesh ref={whipRef} visible={false}>
        <tubeGeometry args={[whipCurve, 30, 0.035, 8, false]} />
        <meshStandardMaterial color="#5d3a1a" roughness={0.6} />
      </mesh>
      {/* Whip trail/glow effect */}
      <mesh ref={trailRef} visible={false}>
        <tubeGeometry args={[whipCurve, 30, 0.08, 8, false]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.5} />
      </mesh>
    </group>
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
      <SantaBody isWhipping={isWhipping} />

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
