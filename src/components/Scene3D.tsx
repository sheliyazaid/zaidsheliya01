import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// ─── SMOOTH MOUSE CAMERA ───
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

// ─── MORPHING WIREFRAME SPHERE — hero centerpiece ───
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

// ─── ROTATING TORUS KNOT — sleek mathematical shape ───
function GlassTorusKnot() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.08;
      ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={ref} position={[4.5, 1.5, -3]} scale={0.6}>
        <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.04}
          emissive="#ffffff"
          emissiveIntensity={0.02}
        />
      </mesh>
    </Float>
  );
}

// ─── HOLOGRAPHIC CUBE — rotating data cube ───
function HoloCube() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.3;
      innerRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.08} floatIntensity={0.25}>
      <group ref={groupRef} position={[-4.5, -1, -4]}>
        {/* Outer wireframe cube */}
        <mesh>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.05} emissive="#ffffff" emissiveIntensity={0.02} />
        </mesh>
        {/* Inner rotated cube */}
        <mesh ref={innerRef} scale={0.7}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.035} emissive="#ffffff" emissiveIntensity={0.015} />
        </mesh>
        {/* Corner dots */}
        {[[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]].map((pos, i) => (
          <mesh key={i} position={[pos[0] * 0.7, pos[1] * 0.7, pos[2] * 0.7]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// ─── CODE BRACKETS — developer identity ───
function CodeBracket({ position, type = "open", scale = 1 }: { position: [number, number, number]; type?: "open" | "close"; scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    if (type === "open") {
      pts.push(new THREE.Vector3(0.3, 0.8, 0));
      pts.push(new THREE.Vector3(-0.1, 0.4, 0));
      pts.push(new THREE.Vector3(-0.2, 0, 0));
      pts.push(new THREE.Vector3(-0.1, -0.4, 0));
      pts.push(new THREE.Vector3(0.3, -0.8, 0));
    } else {
      pts.push(new THREE.Vector3(-0.3, 0.8, 0));
      pts.push(new THREE.Vector3(0.1, 0.4, 0));
      pts.push(new THREE.Vector3(0.2, 0, 0));
      pts.push(new THREE.Vector3(0.1, -0.4, 0));
      pts.push(new THREE.Vector3(-0.3, -0.8, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [type]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={ref} position={position} scale={scale}>
        <lineSegments geometry={points}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </lineSegments>
      </group>
    </Float>
  );
}

// ─── FLOATING PYRAMID — geometric accent ───
function FloatingPyramid({ position, scale = 0.5, speed = 0.1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.5;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.35}>
      <mesh ref={ref} position={position} scale={scale}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.05} emissive="#ffffff" emissiveIntensity={0.02} />
      </mesh>
    </Float>
  );
}

// ─── ORBIT RINGS ───
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

// ─── PARTICLES ───
function Particles() {
  const count = 400;
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
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// ─── GRID FLOOR ───
function GridFloor() {
  return (
    <group position={[0, -3.5, 0]}>
      <gridHelper args={[40, 60, "#ffffff", "#ffffff"]} material-transparent material-opacity={0.018} />
    </group>
  );
}

// ─── CONNECTION LINES ───
function ConnectionLines() {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const segments: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < 10; i++) {
      const y = (Math.random() - 0.5) * 12;
      const z = -4 - Math.random() * 8;
      const x1 = (Math.random() - 0.5) * 18;
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

// ─── DNA HELIX — subtle tech spiral ───
function DataSpiral() {
  const ref = useRef<THREE.Group>(null);
  const count = 40;

  const nodes = useMemo(() => {
    const arr: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4;
      const y = (i / count) * 6 - 3;
      arr.push({
        a: new THREE.Vector3(Math.cos(t) * 0.6, y, Math.sin(t) * 0.6),
        b: new THREE.Vector3(Math.cos(t + Math.PI) * 0.6, y, Math.sin(t + Math.PI) * 0.6),
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={ref} position={[5.5, 0, -5]} scale={0.8}>
        {nodes.map((node, i) => (
          <group key={i}>
            <mesh position={[node.a.x, node.a.y, node.a.z]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
            <mesh position={[node.b.x, node.b.y, node.b.z]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
            {i % 4 === 0 && (
              <lineSegments geometry={new THREE.BufferGeometry().setFromPoints([node.a, node.b])}>
                <lineBasicMaterial color="#ffffff" transparent opacity={0.03} />
              </lineSegments>
            )}
          </group>
        ))}
      </group>
    </Float>
  );
}

// ─── MAIN EXPORT ───
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
        
        {/* 3D Objects */}
        <GlassTorusKnot />
        <HoloCube />
        <DataSpiral />
        <FloatingPyramid position={[-3, 2.5, -3]} scale={0.4} speed={0.12} />
        <FloatingPyramid position={[3, -2, -5]} scale={0.3} speed={0.08} />
        
        {/* Code brackets */}
        <CodeBracket position={[-6, 1, -4]} type="open" scale={1.2} />
        <CodeBracket position={[6, -0.5, -4]} type="close" scale={1} />
        
        {/* Orbit rings */}
        <OrbitRing radius={3.5} speed={0.06} tilt={0.6} opacity={0.04} />
        <OrbitRing radius={5} speed={-0.04} tilt={-0.4} opacity={0.025} />
        <OrbitRing radius={6.5} speed={0.03} tilt={0.3} opacity={0.015} />
      </Canvas>
    </div>
  );
}
