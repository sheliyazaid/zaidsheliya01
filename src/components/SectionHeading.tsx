import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-20 text-center"
    >
      <span className="text-[10px] tracking-[0.3em] text-muted-foreground/40 uppercase font-mono mb-4 block">
        // {title.toLowerCase()}
      </span>
      <h2 className="font-heading text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-muted-foreground/60 max-w-lg mx-auto text-base leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-8 h-px w-12 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </motion.div>
  );
}