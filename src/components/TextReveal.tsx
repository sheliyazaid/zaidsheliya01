import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: delay + i * 0.05, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
