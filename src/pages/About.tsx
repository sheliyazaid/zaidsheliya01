import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import SectionHeading from "../components/SectionHeading";
import GlassCard from "../components/GlassCard";
import { Palette, Code, Layout, Figma, Globe, Smartphone } from "lucide-react";

const designSkills = [
  { name: "Adobe Photoshop", level: 90 },
  { name: "Adobe Illustrator", level: 85 },
  { name: "Figma", level: 88 },
  { name: "UI/UX Design", level: 82 },
  { name: "Brand Identity", level: 87 },
  { name: "Typography", level: 85 },
];

const devSkills = [
  { name: "HTML5", level: 95 },
  { name: "CSS3 / Tailwind", level: 92 },
  { name: "JavaScript", level: 88 },
  { name: "React.js", level: 85 },
  { name: "TypeScript", level: 80 },
  { name: "Responsive Design", level: 90 },
];

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-foreground/70"
        />
      </div>
    </motion.div>
  );
}

const highlights = [
  { icon: Palette, label: "Creative Design" },
  { icon: Code, label: "Clean Code" },
  { icon: Layout, label: "UI/UX" },
  { icon: Figma, label: "Figma" },
  { icon: Globe, label: "Web Dev" },
  { icon: Smartphone, label: "Responsive" },
];

export default function About() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="About Me"
            subtitle="A passionate creative who bridges the gap between design and development."
          />

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-20"
          >
            <p className="text-muted-foreground leading-relaxed">
              I'm <span className="text-foreground font-medium">Zaid Sheliya</span>, a Graphic Designer and Frontend Developer
              who creates visually stunning and technically sound digital experiences. I believe in the power of
              clean design and efficient code to bring ideas to life.
            </p>
          </motion.div>

          {/* Highlights */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-20">
            {highlights.map((item, i) => (
              <GlassCard key={item.label} delay={i * 0.1} className="flex flex-col items-center gap-3 text-center py-8">
                <item.icon size={24} className="text-foreground/70" />
                <span className="text-xs text-muted-foreground tracking-wider">{item.label}</span>
              </GlassCard>
            ))}
          </div>

          {/* Skills */}
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
            <GlassCard hover={false} className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette size={20} className="text-foreground/70" />
                <h3 className="font-heading text-xl font-semibold text-foreground">Graphic Design</h3>
              </div>
              {designSkills.map((skill, i) => (
                <SkillBar key={skill.name} {...skill} delay={i * 0.1} />
              ))}
            </GlassCard>

            <GlassCard hover={false} className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Code size={20} className="text-foreground/70" />
                <h3 className="font-heading text-xl font-semibold text-foreground">Frontend Development</h3>
              </div>
              {devSkills.map((skill, i) => (
                <SkillBar key={skill.name} {...skill} delay={i * 0.1} />
              ))}
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
