import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* 3D spinner */}
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border border-foreground/20 animate-spin-slow" />
              <div
                className="absolute inset-2 rounded-full border-t border-foreground/60"
                style={{ animation: "spin-slow 3s linear infinite reverse" }}
              />
              <div className="absolute inset-4 rounded-full border border-foreground/40 animate-spin-slow" />
            </div>
            <motion.p
              className="font-heading text-sm tracking-[0.3em] text-muted-foreground uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
