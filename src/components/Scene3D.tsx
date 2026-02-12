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
    camera.position.x += (mouse.current.x * 2 - camera.position.x) * 0.015;
    camera.position.y += (-mouse.current.y * 1.5 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Code bracket < > — developer signature
function CodeBracket({ position, scale = 1, speed = 0.1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);

  const bracketShape = useMemo(() => {
    const shape = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Left bracket <
      0.3, 0.5, 0,
      0, 0, 0,
      0, 0, 0,
      0.3, -0.5, 0,
    ]);
    shape.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return shape;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.3;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <lineSegments geometry={bracketShape}>
        <lineBasicMaterial color="#ffd700" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// Floating wireframe cubes — data blocks
function DataCube({ position, size = 0.4, speed = 0.2 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.7;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#ffd700" wireframe transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

// Circuit lines — techy grid connections
function CircuitLines() {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const segments: { start: [number, number, number]; end: [number, number, number] }[] = [];
    // Horizontal lines
    for (let i = 0; i < 8; i++) {
      const y = (Math.random() - 0.5) * 12;
      const z = -5 - Math.random() * 8;
      const x1 = (Math.random() - 0.5) * 16;
      const x2 = x1 + 2 + Math.random() * 4;
      segments.push({ start: [x1, y, z], end: [x2, y, z] });
      // Add a vertical connector
      if (Math.random() > 0.5) {
        const vy = y + (Math.random() - 0.5) * 2;
        segments.push({ start: [x2, y, z], end: [x2, vy, z] });
      }
    }
    // Vertical lines
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 14;
      const z = -5 - Math.random() * 8;
      const y1 = (Math.random() - 0.5) * 10;
      const y2 = y1 + 1 + Math.random() * 3;
      segments.push({ start: [x, y1, z], end: [x, y2, z] });
    }
    return segments;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {lines.map((line, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...line.start),
          new THREE.Vector3(...line.end),
        ]);
        return (
          <lineSegments key={i} geometry={geo}>
            <lineBasicMaterial color="#ffd700" transparent opacity={0.06} />
          </lineSegments>
        );
      })}
      {/* Circuit nodes (dots at intersections) */}
      {lines.map((line, i) => (
        <mesh key={`node-${i}`} position={line.end}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

// Terminal cursor blink — floating element
function TerminalCursor({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current && !Array.isArray(ref.current.material)) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(state.clock.elapsedTime * 3) > 0 ? 0.3 : 0;
    }
  });

  return (
    <Float speed={0.5} floatIntensity={0.3}>
      <mesh ref={ref} position={position}>
        <planeGeometry args={[0.08, 0.5]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

// Central morphing sphere — kept but more techy
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
          Math.sin(ox * 3 + time * 0.6) *
          Math.cos(oy * 3 + time * 0.4) *
          Math.sin(oz * 3 + time * 0.3) * 0.15;
        positions.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
      }
      positions.needsUpdate = true;
      geoRef.current.computeVertexNormals();
      meshRef.current.rotation.y = time * 0.06;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <icosahedronGeometry ref={geoRef} args={[1.8, 4]} />
        <meshStandardMaterial color="#ffd700" wireframe transparent opacity={0.04} />
      </mesh>
    </Float>
  );
}

// Floating particles
function Particles() {
  const count = 300;
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
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffd700" transparent opacity={0.3} sizeAttenuation />
    </points>
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
      <torusGeometry args={[radius, 0.004, 16, 128]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={opacity} />
    </mesh>
  );
}

// Binary rain columns
function BinaryRain() {
  const ref = useRef<THREE.Group>(null);
  
  const dots = useMemo(() => {
    const items: [number, number, number][] = [];
    for (let col = 0; col < 6; col++) {
      const x = (col - 3) * 2.5 + (Math.random() - 0.5);
      const z = -8 - Math.random() * 5;
      for (let row = 0; row < 8; row++) {
        if (Math.random() > 0.4) {
          items.push([x, row * 0.6 - 2, z]);
        }
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.1 + 0.08;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <planeGeometry args={[0.06, 0.06]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <MouseCamera />
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, -10, -5]} intensity={0.1} color="#ffd700" />
        <Stars radius={60} depth={60} count={1500} factor={1.5} saturation={0} fade speed={0.3} />
        <Particles />
        <CentralSphere />
        <CircuitLines />
        <BinaryRain />
        <CodeBracket position={[-3.5, 1.5, -2]} scale={1.5} speed={0.15} />
        <CodeBracket position={[3.5, -1, -3]} scale={1.2} speed={0.1} />
        <TerminalCursor position={[4, 2.5, -2]} />
        <TerminalCursor position={[-2, -2, -3]} />
        <DataCube position={[4, 2, -4]} size={0.6} speed={0.08} />
        <DataCube position={[-4, -1.5, -3]} size={0.4} speed={0.12} />
        <DataCube position={[2, -3, -5]} size={0.35} speed={0.15} />
        <DataCube position={[-1.5, 3, -6]} size={0.5} speed={0.1} />
        <OrbitRing radius={2.8} speed={0.12} tilt={0.5} opacity={0.04} />
        <OrbitRing radius={4} speed={-0.08} tilt={-0.3} opacity={0.03} />
      </Canvas>
    </div>
  );
}
