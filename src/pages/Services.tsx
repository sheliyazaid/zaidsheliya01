import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import SectionHeading from "../components/SectionHeading";
import GlassCard from "../components/GlassCard";
import { Palette, PenTool, Globe, Code } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Crafting intuitive and beautiful user interfaces that put the user experience first. From wireframes to polished mockups.",
  },
  {
    icon: PenTool,
    title: "Logo Design",
    description: "Creating memorable brand identities that communicate your values and stand out in the market.",
  },
  {
    icon: Globe,
    title: "Website Design",
    description: "Designing modern, responsive websites that look stunning on every device and convert visitors into customers.",
  },
  {
    icon: Code,
    title: "Frontend Development",
    description: "Building fast, interactive web applications with React, TypeScript, and modern frontend technologies.",
  },
];

export default function Services() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Services"
            subtitle="What I can bring to your next project."
          />

          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            {services.map((service, i) => (
              <GlassCard key={service.title} delay={i * 0.15} className="text-center py-10">
                <motion.div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <service.icon size={28} className="text-foreground/70" />
                </motion.div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
