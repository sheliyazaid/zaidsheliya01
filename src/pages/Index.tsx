import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ExternalLink, Send, MessageCircle, Palette, Code, PenTool, Globe, Layout, Figma, Smartphone, Terminal, Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/SectionHeading";
import TiltCard from "../components/TiltCard";
import MagneticButton from "../components/MagneticButton";
import ScrollProgress from "../components/ScrollProgress";


// Project images
import imgBrand from "@/assets/project-brand.jpg";
import imgSocial from "@/assets/project-social.jpg";
import imgEditorial from "@/assets/project-editorial.jpg";
import imgPackaging from "@/assets/project-packaging.jpg";
import imgPortfolio from "@/assets/project-portfolio.jpg";
import imgEcommerce from "@/assets/project-ecommerce.jpg";
import imgDashboard from "@/assets/project-dashboard.jpg";
import imgLanding from "@/assets/project-landing.jpg";

gsap.registerPlugin(ScrollTrigger);

const Scene3D = lazy(() => import("../components/Scene3D"));
const ParticleBackground = lazy(() => import("../components/ParticleBackground"));

// ─── DATA ────────────────────────────────────────
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

const highlights = [
  { icon: Palette, label: "Creative Design" },
  { icon: Code, label: "Clean Code" },
  { icon: Layout, label: "UI/UX" },
  { icon: Figma, label: "Figma" },
  { icon: Globe, label: "Web Dev" },
  { icon: Smartphone, label: "Responsive" },
];

const projects = [
  { title: "Brand Identity System", category: "Graphic Design", description: "Complete brand identity for a luxury fashion label.", image: imgBrand },
  { title: "Social Media Campaign", category: "Graphic Design", description: "Visual campaign for a tech startup launch.", image: imgSocial },
  { title: "Editorial Layout", category: "Graphic Design", description: "Magazine-style editorial design with bold typography.", image: imgEditorial },
  { title: "Product Packaging", category: "Graphic Design", description: "Minimalist packaging design for a skincare brand.", image: imgPackaging },
  { title: "Portfolio Website", category: "Frontend", description: "Interactive portfolio built with React and Three.js.", image: imgPortfolio },
  { title: "E-Commerce UI", category: "Frontend", description: "Modern e-commerce interface with smooth animations.", image: imgEcommerce },
  { title: "Dashboard App", category: "Frontend", description: "Real-time analytics dashboard with data visualization.", image: imgDashboard },
  { title: "Landing Page", category: "Frontend", description: "High-converting SaaS landing page with parallax effects.", image: imgLanding },
];

const services = [
  { icon: Palette, title: "UI/UX Design", description: "Crafting intuitive and beautiful user interfaces that put the user experience first." },
  { icon: PenTool, title: "Logo Design", description: "Creating memorable brand identities that communicate your values." },
  { icon: Globe, title: "Website Design", description: "Designing modern, responsive websites that convert visitors into customers." },
  { icon: Code, title: "Frontend Development", description: "Building fast, interactive web applications with React & TypeScript." },
];

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "3+", label: "Years Experience" },
  { value: "30+", label: "Happy Clients" },
  { value: "100%", label: "Dedication" },
];

const categories = ["All", "Graphic Design", "Frontend"];

// ─── SKILL BAR ────────────────────────────────────
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
        <span className="text-foreground font-mono text-xs">{name}</span>
        <span className="text-muted-foreground font-mono text-xs">{level}%</span>
      </div>
      <div className="h-[2px] rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-foreground/60"
        />
      </div>
    </motion.div>
  );
}

// ─── COUNTER ────────────────────────────────────
function Counter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="font-heading text-4xl md:text-5xl font-bold text-foreground">{value}</div>
      <div className="mt-2 text-xs tracking-[0.2em] text-muted-foreground uppercase font-mono">{label}</div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────
const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [showTop, setShowTop] = useState(false);

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  // Parallax for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current && aboutRef.current) {
        gsap.to("#hero-content", {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: -100,
          opacity: 0,
          scale: 0.95,
        });

        gsap.fromTo(
          "#about-inner",
          { y: 80, opacity: 0 },
          {
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
            y: 0,
            opacity: 1,
          }
        );
      }

      gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
        gsap.fromTo(
          section.querySelectorAll(".gsap-fade-up"),
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 35%",
              scrub: 0.5,
            },
            y: 0,
            opacity: 1,
            stagger: 0.1,
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-line").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Zaid, I want to work with you.\n\nName: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/918591811232?text=${text}`, "_blank");
  };

  return (
    <div ref={mainRef}>
      <ScrollProgress />
      
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Suspense fallback={null}>
          <Scene3D className="z-0" />
        </Suspense>

        <motion.div
          id="hero-content"
          className="relative z-10 text-center px-6"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8"
          >
            <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-mono">
              Available for work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-heading text-6xl font-bold tracking-tight text-foreground md:text-8xl lg:text-9xl"
          >
            Zaid
            <br />
            <span className="text-gradient">Sheliya</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl tracking-wide font-light"
          >
            Graphic Designer <span className="text-foreground/30 mx-2">/</span> Frontend Developer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <MagneticButton
              onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="glass rounded-full px-8 py-3 text-sm font-medium tracking-wider text-foreground transition-all duration-300 hover:glow-md"
            >
              View Work
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border border-foreground/20 px-8 py-3 text-sm font-medium tracking-wider text-muted-foreground transition-all duration-300 hover:border-foreground/50 hover:text-foreground"
            >
              Get in Touch
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-12 flex items-center justify-center gap-6"
          >
            {[Github, Linkedin, Mail].map((Icon, i) => (
              <MagneticButton key={i} className="text-muted-foreground/50 hover:text-foreground transition-colors duration-300">
                <Icon size={18} />
              </MagneticButton>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ArrowDown size={20} className="text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section ref={aboutRef} id="about" className="gsap-section relative z-10 py-32">
        <div id="about-inner" className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="About" subtitle="A passionate creative who bridges the gap between design and development." />
          </div>

          <div className="gsap-fade-up max-w-2xl mx-auto text-center mb-20">
            <p className="text-muted-foreground leading-relaxed text-lg">
              I'm <span className="text-foreground font-medium">Zaid Sheliya</span> — a designer who codes and a developer who designs.
              I create digital experiences that are both visually stunning and technically sound.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 gsap-fade-up max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Counter key={stat.label} {...stat} />
            ))}
          </div>

          <div className="gsap-line mx-auto h-px w-full max-w-4xl bg-border mb-16 origin-left" />

          {/* Highlights */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-20 gsap-fade-up">
            {highlights.map((item, i) => (
              <TiltCard key={item.label} delay={i * 0.05}>
                <div className="flex flex-col items-center gap-3 text-center py-4">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <item.icon size={22} className="text-foreground/60" />
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-mono">{item.label}</span>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Skills */}
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto gsap-fade-up">
            <TiltCard delay={0.1} glare>
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <Palette size={18} className="text-foreground/60" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">Design</h3>
                </div>
                {designSkills.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} delay={i * 0.08} />
                ))}
              </div>
            </TiltCard>

            <TiltCard delay={0.2} glare>
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal size={18} className="text-foreground/60" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">Development</h3>
                </div>
                {devSkills.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} delay={i * 0.08} />
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PORTFOLIO ═══════════════════ */}
      <section id="portfolio" className="gsap-section relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="Selected Work" subtitle="Projects that showcase design and development expertise." />
          </div>

          <div className="gsap-line mx-auto h-px w-full max-w-6xl bg-border mb-12 origin-right" />

          <div className="flex justify-center gap-4 mb-12 gsap-fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-6 py-2 text-xs tracking-[0.15em] uppercase font-mono transition-all duration-300 ${
                  activeFilter === cat
                    ? "glass text-foreground glow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto gsap-fade-up">
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
                  <TiltCard className="h-full">
                    <div className="group flex flex-col min-h-[280px]">
                      {/* Project Image */}
                      <div className="relative overflow-hidden rounded-lg mb-4 -mt-2 -mx-2">
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-40 object-cover rounded-lg"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <span className="flex items-center gap-1 text-xs font-mono text-foreground tracking-wider">
                            <ExternalLink size={12} /> View Project
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-mono">
                            {project.category}
                          </span>
                          <h3 className="font-heading text-lg font-semibold text-foreground mt-1">
                            {project.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section id="services" className="gsap-section relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="Services" subtitle="What I bring to your next project." />
          </div>

          <div className="gsap-line mx-auto h-px w-full max-w-4xl bg-border mb-16 origin-left" />

          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto gsap-fade-up">
            {services.map((service, i) => (
              <TiltCard key={service.title} delay={i * 0.1} className="text-center">
                <div className="py-4">
                  <motion.div
                    className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon size={24} className="text-foreground/60" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT (STATIC) ═══════════════════ */}
      <section id="contact" className="gsap-section relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="Let's Talk" subtitle="Have a project in mind? Let's make it happen." />
          </div>

          <div className="gsap-line mx-auto h-px w-full max-w-lg bg-border mb-12 origin-center" />

          <div className="max-w-lg mx-auto gsap-fade-up">
            {/* Static glass card — no tilt */}
            <div className="glass rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-mono">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all font-mono"
                    placeholder="your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-mono">Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all font-mono"
                    placeholder="your phone"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-mono">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all resize-none font-mono"
                    placeholder="tell me about your project..."
                  />
                </div>
                <MagneticButton
                  type="submit"
                  className="w-full glass rounded-lg py-3 text-sm font-medium tracking-wider text-foreground flex items-center justify-center gap-2 hover:glow-md transition-shadow duration-300"
                >
                  <Send size={16} />
                  Send via WhatsApp
                </MagneticButton>
              </form>
              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                <MessageCircle size={14} />
                <span className="text-[10px] tracking-[0.15em] font-mono uppercase">Opens WhatsApp directly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 border-t border-border">
        <div className="container mx-auto px-6">
          {/* Top */}
          <div className="grid md:grid-cols-3 gap-12 py-16">
            {/* Brand */}
            <div>
              <p className="font-heading text-2xl font-bold tracking-wider text-foreground mb-4">
                ZS<span className="text-muted-foreground">.</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A creative developer crafting digital experiences that blend stunning design with clean, performant code.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-xs tracking-[0.2em] text-foreground uppercase font-mono mb-6">Quick Links</h4>
              <div className="space-y-3">
                {["hero", "about", "portfolio", "services", "contact"].map((id) => (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    {id === "hero" ? "Home" : id}
                  </button>
                ))}
              </div>
            </div>
            {/* Connect */}
            <div>
              <h4 className="text-xs tracking-[0.2em] text-foreground uppercase font-mono mb-6">Connect</h4>
              <div className="flex gap-4 mb-6">
                {[
                  { Icon: Github, label: "GitHub" },
                  { Icon: Linkedin, label: "LinkedIn" },
                  { Icon: Mail, label: "Email" },
                ].map(({ Icon, label }) => (
                  <MagneticButton
                    key={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                  >
                    <Icon size={16} />
                  </MagneticButton>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                zaidsheliya@gmail.com
              </p>
            </div>
          </div>
          {/* Bottom */}
          <div className="border-t border-border py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground tracking-wider font-mono">
              © {new Date().getFullYear()} Zaid Sheliya. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground tracking-wider font-mono flex items-center gap-1">
              Designed & Built with <Heart size={12} className="text-foreground/40" /> in India
            </p>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 glass rounded-full p-3 text-foreground hover:glow-md transition-shadow"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
