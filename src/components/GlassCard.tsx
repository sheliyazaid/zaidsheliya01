import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", delay = 0, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -8, scale: 1.02 } : undefined}
      className={`glass rounded-xl p-6 transition-shadow duration-300 ${hover ? "hover:glow-md" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
