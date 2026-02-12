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
    camera.position.x += (mouse.current.x * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── CURLY BRACES { } — the developer's signature ───
function CurlyBrace({ position, scale = 1, speed = 0.1, mirror = false }: { position: [number, number, number]; scale?: number; speed?: number; mirror?: boolean }) {
  const ref = useRef<THREE.Group>(null);

  const braceGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const s = mirror ? -1 : 1;
    // Draw a curly brace shape
    shape.moveTo(0.15 * s, 0.5);
    shape.bezierCurveTo(0.05 * s, 0.5, 0, 0.4, 0, 0.3);
    shape.lineTo(0, 0.1);
    shape.bezierCurveTo(0, 0.05, -0.1 * s, 0.02, -0.15 * s, 0);
    shape.bezierCurveTo(-0.1 * s, -0.02, 0, -0.05, 0, -0.1);
    shape.lineTo(0, -0.3);
    shape.bezierCurveTo(0, -0.4, 0.05 * s, -0.5, 0.15 * s, -0.5);

    const points = shape.getPoints(24);
    const vertices = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      vertices[i * 3] = p.x;
      vertices[i * 3 + 1] = p.y;
      vertices[i * 3 + 2] = 0;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geo;
  }, [mirror]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.4;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
      <group ref={ref} position={position} scale={scale}>
        <lineSegments geometry={braceGeo}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </lineSegments>
      </group>
    </Float>
  );
}

// ─── CODE ANGLE BRACKETS < /> — HTML/JSX signature ───
function AngleBracket({ position, scale = 1, speed = 0.1, type = "open" }: { position: [number, number, number]; scale?: number; speed?: number; type?: "open" | "close" | "self-close" }) {
  const ref = useRef<THREE.Group>(null);

  const bracketShape = useMemo(() => {
    const shape = new THREE.BufferGeometry();
    let vertices: Float32Array;

    if (type === "open") {
      vertices = new Float32Array([
        0.3, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.3, -0.5, 0,
      ]);
    } else if (type === "close") {
      vertices = new Float32Array([
        -0.3, 0.5, 0, 0, 0, 0, 0, 0, 0, -0.3, -0.5, 0,
      ]);
    } else {
      // self-closing < />
      vertices = new Float32Array([
        0.3, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.3, -0.5, 0,
        // slash
        0.15, 0.4, 0, -0.05, -0.4, 0,
        // closing >
        0.45, 0.5, 0, 0.75, 0, 0, 0.75, 0, 0, 0.45, -0.5, 0,
      ]);
    }

    shape.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return shape;
  }, [type]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.3;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <lineSegments geometry={bracketShape}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

// ─── TERMINAL WINDOW — floating code editor frame ───
function TerminalWindow({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={ref} position={position} scale={scale}>
        {/* Window frame */}
        <mesh>
          <planeGeometry args={[2, 1.3]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.015} />
        </mesh>
        {/* Top bar */}
        <mesh position={[0, 0.55, 0.01]}>
          <planeGeometry args={[2, 0.12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
        </mesh>
        {/* Window dots */}
        {[[-0.85, 0.55, 0.02], [-0.78, 0.55, 0.02], [-0.71, 0.55, 0.02]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <circleGeometry args={[0.02, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.12 - i * 0.03} />
          </mesh>
        ))}
        {/* Code lines */}
        {[0.3, 0.12, -0.06, -0.24, -0.42].map((y, i) => (
          <mesh key={`line-${i}`} position={[-0.3 + (i % 2) * 0.15, y, 0.01]}>
            <planeGeometry args={[0.8 - (i % 3) * 0.2, 0.04]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.06 - i * 0.008} />
          </mesh>
        ))}
        {/* Border */}
        {(() => {
          const w = 2, h = 1.3;
          const points = [
            new THREE.Vector3(-w / 2, -h / 2, 0.01),
            new THREE.Vector3(w / 2, -h / 2, 0.01),
            new THREE.Vector3(w / 2, h / 2, 0.01),
            new THREE.Vector3(-w / 2, h / 2, 0.01),
            new THREE.Vector3(-w / 2, -h / 2, 0.01),
          ];
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <lineSegments geometry={geo}>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
            </lineSegments>
          );
        })()}
      </group>
    </Float>
  );
}

// ─── CIRCUIT BOARD — techy grid connections ───
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

// ─── TERMINAL CURSOR BLINK ───
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

// ─── CENTRAL MORPHING WIREFRAME SPHERE ───
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

// ─── FLOATING PARTICLES ───
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

// ─── WIREFRAME DATA CUBES ───
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

// ─── ORBIT RINGS ───
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

// ─── BINARY RAIN — matrix-style falling data ───
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

// ─── NEON GRID FLOOR ───
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
      lines.push({ start: new THREE.Vector3(pos, 0, -half), end: new THREE.Vector3(pos, 0, half) });
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
    <group ref={ref} position={[0, -4, 0]}>
      {gridLines.map((line, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([line.start, line.end]);
        return (
          <lineSegments key={i} geometry={geo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.035} />
          </lineSegments>
        );
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.008} />
      </mesh>
    </group>
  );
}

// ─── FLOATING HASH # — code comment symbol ───
function HashSymbol({ position, scale = 1, speed = 0.1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);

  const hashGeo = useMemo(() => {
    const vertices = new Float32Array([
      // Two vertical lines
      -0.15, 0.4, 0, -0.15, -0.4, 0,
      0.15, 0.4, 0, 0.15, -0.4, 0,
      // Two horizontal lines
      -0.3, 0.15, 0, 0.3, 0.15, 0,
      -0.3, -0.15, 0, 0.3, -0.15, 0,
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={ref} position={position} scale={scale}>
        <lineSegments geometry={hashGeo}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </Float>
  );
}

// ─── SEMICOLON — every dev's friend ───
function Semicolon({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={ref} position={position} scale={scale}>
        {/* Dot */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
        {/* Comma part */}
        <mesh position={[0.01, -0.08, 0]} rotation={[0, 0, -0.3]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0.03, -0.16, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      </group>
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
        <NeonGrid />
        <CircuitLines />
        <BinaryRain />

        {/* Developer symbols — { } < /> # ; */}
        <CurlyBrace position={[-4.5, 2, -2]} scale={2} speed={0.12} />
        <CurlyBrace position={[4.5, 2, -2]} scale={2} speed={0.12} mirror />
        <CurlyBrace position={[-2, -3, -4]} scale={1.3} speed={0.08} />
        <CurlyBrace position={[2.5, -2.5, -5]} scale={1.3} speed={0.1} mirror />

        <AngleBracket position={[-3.5, 1.5, -3]} scale={1.5} speed={0.15} type="open" />
        <AngleBracket position={[3.5, -1, -3]} scale={1.5} speed={0.1} type="close" />
        <AngleBracket position={[0, 3.5, -5]} scale={1.2} speed={0.08} type="self-close" />

        <HashSymbol position={[-5, -1, -4]} scale={1.8} speed={0.1} />
        <HashSymbol position={[5.5, 3, -5]} scale={1.4} speed={0.12} />

        <Semicolon position={[6, 0, -3]} scale={2} />
        <Semicolon position={[-3, 3.5, -4]} scale={1.5} />

        {/* Terminal windows */}
        <TerminalWindow position={[-5, 1.5, -6]} scale={0.8} />
        <TerminalWindow position={[5, -1.5, -7]} scale={0.7} />

        <TerminalCursor position={[5, 3, -2]} />
        <TerminalCursor position={[-3, -2, -3]} />
        <TerminalCursor position={[2, -4, -4]} />

        <DataCube position={[5, 2.5, -4]} size={0.7} speed={0.08} />
        <DataCube position={[-5, -2, -3]} size={0.5} speed={0.12} />
        <DataCube position={[3, -3.5, -5]} size={0.4} speed={0.15} />

        <OrbitRing radius={3.2} speed={0.1} tilt={0.5} opacity={0.05} />
        <OrbitRing radius={4.5} speed={-0.07} tilt={-0.3} opacity={0.03} />
        <OrbitRing radius={5.8} speed={0.05} tilt={0.8} opacity={0.02} />
      </Canvas>
    </div>
  );
}
