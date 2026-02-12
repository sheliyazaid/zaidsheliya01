import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Smooth mouse-reactive camera
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
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.015;
    camera.position.y += (-mouse.current.y * 1 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── MORPHING WIREFRAME SPHERE — the hero centerpiece ───
function HeroSphere() {
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
          Math.sin(ox * 2.5 + time * 0.5) *
          Math.cos(oy * 2.5 + time * 0.35) *
          Math.sin(oz * 2.5 + time * 0.25) * 0.2;
        positions.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
      }
      positions.needsUpdate = true;
      geoRef.current.computeVertexNormals();
      meshRef.current.rotation.y = time * 0.04;
      meshRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
    }
  });

  return (
    <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.15}>
      <mesh ref={meshRef}>
        <icosahedronGeometry ref={geoRef} args={[2.8, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.045}
          emissive="#ffffff"
          emissiveIntensity={0.03}
        />
      </mesh>
    </Float>
  );
}

// ─── ORBIT RINGS — clean, elegant ───
function OrbitRing({ radius, speed, tilt, opacity }: { radius: number; speed: number; tilt: number; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = tilt;
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.003, 16, 256]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </mesh>
  );
}

// ─── FLOATING PARTICLES — clean dust ───
function Particles() {
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ─── GRID FLOOR — subtle perspective ───
function GridFloor() {
  return (
    <group position={[0, -3.5, 0]}>
      <gridHelper
        args={[40, 60, "#ffffff", "#ffffff"]}
        material-transparent
        material-opacity={0.018}
      />
    </group>
  );
}

// ─── FLOATING GEOMETRIC ACCENTS ───
function GeometricAccent({ position, size = 0.3, speed = 0.1 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.7;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.4}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[size]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.06} />
      </mesh>
    </Float>
  );
}

// ─── CONNECTION LINES — subtle network feel ───
function ConnectionLines() {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const segments: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < 8; i++) {
      const y = (Math.random() - 0.5) * 10;
      const z = -4 - Math.random() * 8;
      const x1 = (Math.random() - 0.5) * 16;
      const x2 = x1 + 1.5 + Math.random() * 4;
      segments.push({ start: new THREE.Vector3(x1, y, z), end: new THREE.Vector3(x2, y, z) });
    }
    return segments;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.08;
    }
  });

  return (
    <group ref={ref}>
      {lines.map((line, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([line.start, line.end]);
        return (
          <lineSegments key={i} geometry={geo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.025} />
          </lineSegments>
        );
      })}
      {lines.map((line, i) => (
        <mesh key={`n-${i}`} position={[line.end.x, line.end.y, line.end.z]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <MouseCamera />
        <ambientLight intensity={0.08} />
        <pointLight position={[8, 8, 8]} intensity={0.15} />
        <pointLight position={[-8, -8, -5]} intensity={0.06} color="#ffffff" />
        <Stars radius={100} depth={80} count={1800} factor={1.5} saturation={0} fade speed={0.15} />
        
        <Particles />
        <HeroSphere />
        <GridFloor />
        <ConnectionLines />
        
        <GeometricAccent position={[-5, 2, -4]} size={0.35} speed={0.08} />
        <GeometricAccent position={[5, -1.5, -5]} size={0.25} speed={0.1} />
        <GeometricAccent position={[3, 3, -6]} size={0.3} speed={0.06} />
        <GeometricAccent position={[-4, -2.5, -5]} size={0.2} speed={0.12} />
        
        <OrbitRing radius={3.5} speed={0.06} tilt={0.6} opacity={0.04} />
        <OrbitRing radius={5} speed={-0.04} tilt={-0.4} opacity={0.025} />
      </Canvas>
    </div>
  );
}
