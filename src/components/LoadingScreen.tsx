import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(0); // 0=logo reveal, 1=text, 2=exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setLoading(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
          exit={{
            clipPath: "inset(50% 0% 50% 0%)",
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-foreground/[0.02] blur-[120px]" />

          {/* Line accents */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent origin-center"
          />

          {/* ZS Logo */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-heading text-[clamp(5rem,15vw,10rem)] font-extrabold tracking-[-0.04em] text-foreground leading-none"
              >
                ZS
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-gradient-gold"
                >
                  .
                </motion.span>
              </motion.div>
            </div>

            {/* Orbiting ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              }}
              className="absolute inset-0 -m-6"
            >
              <div className="w-full h-full rounded-full border border-foreground/[0.06]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-foreground/30" />
            </motion.div>
          </div>

          {/* Subtitle */}
          <div className="overflow-hidden mt-6">
            <motion.p
              initial={{ y: "100%" }}
              animate={phase >= 1 ? { y: "0%" } : { y: "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] tracking-[0.4em] text-muted-foreground/50 uppercase font-mono"
            >
              Zaid Sheliya
            </motion.p>
          </div>

          {/* Loading bar */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-px bg-secondary overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}