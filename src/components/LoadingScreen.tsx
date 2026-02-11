import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function SpinningLoader() {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.5;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 1.2;
      torusRef.current.rotation.z = t * 0.8;
    }
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.6;
      icoRef.current.rotation.y = t * 0.9;
      const s = 1 + Math.sin(t * 2) * 0.1;
      icoRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={torusRef}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <torusGeometry args={[1.5, 0.01, 16, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.5} />
      </mesh>
      <pointLight position={[2, 2, 2]} intensity={0.5} />
    </group>
  );
}

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="w-40 h-40">
            <Canvas camera={{ position: [0, 0, 4] }}>
              <ambientLight intensity={0.3} />
              <SpinningLoader />
            </Canvas>
          </div>
          <motion.p
            className="font-heading text-sm tracking-[0.3em] text-muted-foreground uppercase mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
