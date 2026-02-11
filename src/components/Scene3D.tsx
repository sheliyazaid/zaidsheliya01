import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Mouse-reactive camera with dramatic parallax
function MouseCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useMemo(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 2 - camera.position.x) * 0.015;
    camera.position.y += (-mouse.current.y * 1.5 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Central morphing sphere — the hero piece
function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.IcosahedronGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  useFrame((state) => {
    if (meshRef.current && geoRef.current) {
      const positions = geoRef.current.attributes.position;
      if (!originalPositions.current) {
        originalPositions.current = new Float32Array(positions.array);
      }
      const orig = originalPositions.current;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.count; i++) {
        const ox = orig[i * 3];
        const oy = orig[i * 3 + 1];
        const oz = orig[i * 3 + 2];
        const noise =
          Math.sin(ox * 2.5 + time * 0.8) *
          Math.cos(oy * 2.5 + time * 0.6) *
          Math.sin(oz * 2.5 + time * 0.4) * 0.2;
        positions.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
      }
      positions.needsUpdate = true;
      geoRef.current.computeVertexNormals();

      meshRef.current.rotation.y = time * 0.08;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry ref={geoRef} args={[2, 5]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </Float>
  );
}

// Orbit rings
function OrbitRing({ radius = 3, speed = 0.3, tilt = 0, opacity = 0.1 }: { radius?: number; speed?: number; tilt?: number; opacity?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = tilt;
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.005, 16, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </mesh>
  );
}

// Floating particles
function Particles() {
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// DNA Helix — side element
function DNAHelix() {
  const ref = useRef<THREE.Group>(null);
  const count = 50;

  const spheres = useMemo(() => {
    const items: { pos1: [number, number, number]; pos2: [number, number, number] }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 5;
      const y = (i / count) * 10 - 5;
      items.push({
        pos1: [Math.cos(t) * 0.5, y, Math.sin(t) * 0.5],
        pos2: [Math.cos(t + Math.PI) * 0.5, y, Math.sin(t + Math.PI) * 0.5],
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref} position={[-5, 0, -6]}>
      {spheres.map((s, i) => (
        <group key={i}>
          <mesh position={s.pos1}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
          <mesh position={s.pos2}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Floating accent shapes
function FloatingAccent({ position, size = 0.6, speed = 0.1 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 1.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[size]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>
    </Float>
  );
}

// Grid plane
function GridPlane() {
  return (
    <gridHelper
      args={[40, 40, "#ffffff", "#ffffff"]}
      position={[0, -5, 0]}
      material-transparent
      material-opacity={0.015}
    />
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <MouseCamera />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.4} />
        <pointLight position={[-10, -10, -5]} intensity={0.15} color="#ffffff" />
        <pointLight position={[0, 5, 5]} intensity={0.1} color="#ffd700" />
        <Stars radius={60} depth={60} count={2000} factor={1.8} saturation={0} fade speed={0.3} />
        <Particles />
        <CentralSphere />
        <DNAHelix />
        <FloatingAccent position={[4, 2, -4]} size={0.8} speed={0.08} />
        <FloatingAccent position={[-3, -2, -3]} size={0.5} speed={0.12} />
        <FloatingAccent position={[2, -3, -5]} size={0.4} speed={0.15} />
        <OrbitRing radius={3} speed={0.15} tilt={0.6} opacity={0.06} />
        <OrbitRing radius={4} speed={-0.1} tilt={-0.4} opacity={0.04} />
        <OrbitRing radius={5.5} speed={0.08} tilt={0.9} opacity={0.03} />
        <GridPlane />
      </Canvas>
    </div>
  );
}