import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import SectionHeading from "../components/SectionHeading";
import GlassCard from "../components/GlassCard";
import { ExternalLink } from "lucide-react";

const categories = ["All", "Graphic Design", "Frontend"];

const projects = [
  { title: "Brand Identity System", category: "Graphic Design", description: "Complete brand identity for a luxury fashion label." },
  { title: "Social Media Campaign", category: "Graphic Design", description: "Visual campaign for a tech startup launch." },
  { title: "Editorial Layout", category: "Graphic Design", description: "Magazine-style editorial design with bold typography." },
  { title: "Product Packaging", category: "Graphic Design", description: "Minimalist packaging design for a skincare brand." },
  { title: "Portfolio Website", category: "Frontend", description: "Interactive portfolio built with React and Three.js." },
  { title: "E-Commerce UI", category: "Frontend", description: "Modern e-commerce interface with smooth animations." },
  { title: "Dashboard App", category: "Frontend", description: "Real-time analytics dashboard with data visualization." },
  { title: "Landing Page", category: "Frontend", description: "High-converting SaaS landing page with parallax effects." },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Portfolio"
            subtitle="Selected works showcasing design and development expertise."
          />

          {/* Filter */}
          <div className="flex justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-6 py-2 text-sm tracking-wider transition-all duration-300 ${
                  active === cat
                    ? "glass text-foreground glow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <GlassCard className="group h-full flex flex-col justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                        {project.category}
                      </span>
                      <h3 className="font-heading text-lg font-semibold text-foreground mt-2">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink size={14} />
                      <span className="text-xs tracking-wider">View Project</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
