import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Mouse-reactive camera
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
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 1.0 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Orbiting ring
function OrbitRing({ radius = 3, speed = 0.3, tilt = 0 }: { radius?: number; speed?: number; tilt?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = tilt;
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </mesh>
  );
}

// DNA Helix
function DNAHelix() {
  const ref = useRef<THREE.Group>(null);
  const count = 40;

  const spheres = useMemo(() => {
    const items: { pos1: [number, number, number]; pos2: [number, number, number] }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4;
      const y = (i / count) * 8 - 4;
      items.push({
        pos1: [Math.cos(t) * 0.6, y, Math.sin(t) * 0.6],
        pos2: [Math.cos(t + Math.PI) * 0.6, y, Math.sin(t + Math.PI) * 0.6],
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={ref} position={[-4, 0, -5]}>
      {spheres.map((s, i) => (
        <group key={i}>
          <mesh position={s.pos1}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
          <mesh position={s.pos2}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
          {i % 4 === 0 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...s.pos1, ...s.pos2]), 3]}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </line>
          )}
        </group>
      ))}
    </group>
  );
}

// Morphing sphere with noise
function MorphingSphere() {
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
        const noise = Math.sin(ox * 3 + time) * Math.cos(oy * 3 + time * 0.7) * Math.sin(oz * 3 + time * 0.5) * 0.15;
        positions.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
      }
      positions.needsUpdate = true;
      geoRef.current.computeVertexNormals();
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[3.5, 1, -3]}>
        <icosahedronGeometry ref={geoRef} args={[1.2, 4]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[2, 0, -2]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

function FloatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[-3, 1, -3]}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[0, -2, -4]}>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// Grid plane
function GridPlane() {
  return (
    <gridHelper
      args={[30, 30, "#ffffff", "#ffffff"]}
      position={[0, -4, 0]}
      rotation={[0, 0, 0]}
      material-transparent
      material-opacity={0.03}
    />
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <MouseCamera />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.2} color="#ffffff" />
        <Stars radius={50} depth={50} count={1500} factor={2} saturation={0} fade speed={0.5} />
        <Particles />
        <FloatingGeometry />
        <FloatingTorus />
        <FloatingOctahedron />
        <MorphingSphere />
        <DNAHelix />
        <OrbitRing radius={3.5} speed={0.2} tilt={0.5} />
        <OrbitRing radius={4.5} speed={-0.15} tilt={-0.3} />
        <OrbitRing radius={5.5} speed={0.1} tilt={0.8} />
        <GridPlane />
      </Canvas>
    </div>
  );
}
