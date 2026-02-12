import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// Mouse-reactive camera with more dramatic movement
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
    camera.position.x += (mouse.current.x * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Neon ground grid — cyberpunk floor
function NeonGrid() {
  const ref = useRef<THREE.Group>(null);

  const gridLines = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const size = 30;
    const divisions = 30;
    const step = size / divisions;
    const half = size / 2;

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      // Z lines
      lines.push({ start: new THREE.Vector3(pos, 0, -half), end: new THREE.Vector3(pos, 0, half) });
      // X lines
      lines.push({ start: new THREE.Vector3(-half, 0, pos), end: new THREE.Vector3(half, 0, pos) });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <group ref={ref} position={[0, -4, 0]} rotation={[0, 0, 0]}>
      {gridLines.map((line, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([line.start, line.end]);
        return (
          <lineSegments key={i} geometry={geo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.035} />
          </lineSegments>
        );
      })}
      {/* Glow plane beneath grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.008} />
      </mesh>
    </group>
  );
}

// Glowing torus knot — centerpiece
function GlowingTorusKnot() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.15;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.3}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[1.6, 0.05, 256, 32, 2, 3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.15}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  );
}

// DNA Helix structure — tech-bio aesthetic
function DNAHelix() {
  const ref = useRef<THREE.Group>(null);

  const helixPoints = useMemo(() => {
    const points: { pos1: [number, number, number]; pos2: [number, number, number]; connector: boolean }[] = [];
    for (let i = 0; i < 60; i++) {
      const t = i * 0.15;
      const y = i * 0.12 - 3.5;
      const r = 0.8;
      const x1 = Math.cos(t) * r;
      const z1 = Math.sin(t) * r;
      const x2 = Math.cos(t + Math.PI) * r;
      const z2 = Math.sin(t + Math.PI) * r;
      points.push({
        pos1: [x1, y, z1],
        pos2: [x2, y, z2],
        connector: i % 4 === 0,
      });
    }
    return points;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref} position={[6, 0, -5]}>
      {helixPoints.map((p, i) => (
        <group key={i}>
          <mesh position={p.pos1}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
          <mesh position={p.pos2}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
          {p.connector && (
            (() => {
              const geo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(...p.pos1),
                new THREE.Vector3(...p.pos2),
              ]);
              return (
                <lineSegments geometry={geo}>
                  <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
                </lineSegments>
              );
            })()
          )}
        </group>
      ))}
    </group>
  );
}

// Code bracket < > — developer signature
function CodeBracket({ position, scale = 1, speed = 0.1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);

  const bracketShape = useMemo(() => {
    const shape = new THREE.BufferGeometry();
    const vertices = new Float32Array([
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
        <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
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
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.06} />
      </mesh>
    </Float>
  );
}

// Circuit lines — techy grid connections
function CircuitLines() {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const segments: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < 12; i++) {
      const y = (Math.random() - 0.5) * 14;
      const z = -5 - Math.random() * 10;
      const x1 = (Math.random() - 0.5) * 20;
      const x2 = x1 + 2 + Math.random() * 5;
      segments.push({ start: [x1, y, z], end: [x2, y, z] });
      if (Math.random() > 0.4) {
        const vy = y + (Math.random() - 0.5) * 3;
        segments.push({ start: [x2, y, z], end: [x2, vy, z] });
      }
    }
    for (let i = 0; i < 8; i++) {
      const x = (Math.random() - 0.5) * 18;
      const z = -5 - Math.random() * 10;
      const y1 = (Math.random() - 0.5) * 12;
      const y2 = y1 + 1 + Math.random() * 4;
      segments.push({ start: [x, y1, z], end: [x, y2, z] });
    }
    return segments;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.12;
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
            <lineBasicMaterial color="#ffffff" transparent opacity={0.04} />
          </lineSegments>
        );
      })}
      {lines.map((line, i) => (
        <mesh key={`node-${i}`} position={line.end}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

// Terminal cursor blink
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
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

// Central morphing icosahedron — techy
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
          Math.sin(oz * 3 + time * 0.3) * 0.18;
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
        <icosahedronGeometry ref={geoRef} args={[2.2, 5]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.035}
          emissive="#ffffff"
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  );
}

// Floating particles — more count, better distribution
function Particles() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#ffffff" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// Orbit rings with glow
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
      <torusGeometry args={[radius, 0.006, 16, 200]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </mesh>
  );
}

// Binary rain columns
function BinaryRain() {
  const ref = useRef<THREE.Group>(null);
  
  const dots = useMemo(() => {
    const items: [number, number, number][] = [];
    for (let col = 0; col < 8; col++) {
      const x = (col - 4) * 2.5 + (Math.random() - 0.5);
      const z = -8 - Math.random() * 6;
      for (let row = 0; row < 12; row++) {
        if (Math.random() > 0.35) {
          items.push([x, row * 0.5 - 3, z]);
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
          (mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(state.clock.elapsedTime * 2.5 + i * 0.4) * 0.1 + 0.06;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <planeGeometry args={[0.06, 0.06]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

// Floating wireframe octahedrons
function FloatingOctahedron({ position, size = 0.3, speed = 0.15 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 1.3;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[size]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.08} emissive="#ffffff" emissiveIntensity={0.03} />
      </mesh>
    </Float>
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }}>
        <MouseCamera />
        <ambientLight intensity={0.12} />
        <pointLight position={[10, 10, 10]} intensity={0.25} />
        <pointLight position={[-10, -10, -5]} intensity={0.08} color="#ffffff" />
        <pointLight position={[0, 5, 5]} intensity={0.1} color="#ffffff" />
        <Stars radius={80} depth={80} count={2500} factor={1.8} saturation={0} fade speed={0.2} />
        <Particles />
        <CentralSphere />
        <GlowingTorusKnot />
        <NeonGrid />
        <DNAHelix />
        <CircuitLines />
        <BinaryRain />
        <CodeBracket position={[-4, 2, -2]} scale={1.8} speed={0.15} />
        <CodeBracket position={[4, -1.5, -3]} scale={1.4} speed={0.1} />
        <CodeBracket position={[-2, -3, -4]} scale={1} speed={0.12} />
        <TerminalCursor position={[5, 3, -2]} />
        <TerminalCursor position={[-3, -2, -3]} />
        <TerminalCursor position={[2, -4, -4]} />
        <DataCube position={[5, 2.5, -4]} size={0.7} speed={0.08} />
        <DataCube position={[-5, -2, -3]} size={0.5} speed={0.12} />
        <DataCube position={[3, -3.5, -5]} size={0.4} speed={0.15} />
        <DataCube position={[-2, 4, -6]} size={0.55} speed={0.1} />
        <FloatingOctahedron position={[-6, 1, -4]} size={0.4} speed={0.1} />
        <FloatingOctahedron position={[6, -2, -5]} size={0.35} speed={0.13} />
        <FloatingOctahedron position={[0, 4, -7]} size={0.5} speed={0.08} />
        <OrbitRing radius={3.2} speed={0.1} tilt={0.5} opacity={0.05} />
        <OrbitRing radius={4.5} speed={-0.07} tilt={-0.3} opacity={0.03} />
        <OrbitRing radius={5.8} speed={0.05} tilt={0.8} opacity={0.02} />
      </Canvas>
    </div>
  );
}
