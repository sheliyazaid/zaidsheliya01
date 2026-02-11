import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ExternalLink, Send, MessageCircle, Palette, Code, PenTool, Globe, Layout, Figma, Smartphone, Terminal, Github, Linkedin, Mail, Heart, ArrowUp, Instagram, Sparkles, Eye } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/SectionHeading";
import TiltCard from "../components/TiltCard";
import MagneticButton from "../components/MagneticButton";
import ScrollProgress from "../components/ScrollProgress";
import CursorFollower from "../components/CursorFollower";

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
  { icon: Palette, title: "UI/UX Design", description: "Crafting intuitive and beautiful user interfaces that put the user experience first.", accent: "from-purple-500/20 to-blue-500/20" },
  { icon: PenTool, title: "Logo Design", description: "Creating memorable brand identities that communicate your values.", accent: "from-amber-500/20 to-orange-500/20" },
  { icon: Globe, title: "Website Design", description: "Designing modern, responsive websites that convert visitors into customers.", accent: "from-cyan-500/20 to-teal-500/20" },
  { icon: Code, title: "Frontend Development", description: "Building fast, interactive web applications with React & TypeScript.", accent: "from-emerald-500/20 to-green-500/20" },
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
      viewport={{ once: false, amount: 0.3 }}
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
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-foreground/40 to-foreground/70"
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
      viewport={{ once: false, amount: 0.3 }}
      className="text-center group"
    >
      <div className="font-heading text-5xl md:text-6xl font-bold text-foreground transition-all duration-500 group-hover:text-gradient">{value}</div>
      <div className="mt-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase font-mono">{label}</div>
    </motion.div>
  );
}

// ─── MARQUEE ────────────────────────────────────
function InfiniteMarquee() {
  const items = ["DESIGN", "⬡", "DEVELOP", "⬡", "CREATE", "⬡", "INNOVATE", "⬡", "INSPIRE", "⬡"];
  return (
    <div className="overflow-hidden py-8 border-y border-border/50 my-0 relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`text-3xl md:text-5xl font-heading font-bold tracking-wider ${
              item === "⬡" ? "text-muted-foreground/20 text-lg" : "text-foreground/[0.07]"
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
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
  
  // Typing animation
  const roles = ["Graphic Designer", "Frontend Developer", "UI/UX Designer", "Creative Thinker", "Brand Strategist"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentRole.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
        if (charIndex + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setTypedText(currentRole.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex((r) => (r + 1) % roles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  // Parallax for hero — multi-layer depth
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 350]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.8]);
  const aboutScale = useTransform(scrollY, [200, 900], [0.92, 1]);
  const aboutY = useTransform(scrollY, [200, 900], [120, 0]);

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
              start: "top 80%",
              end: "top 30%",
              scrub: 0.8,
              toggleActions: "play reverse play reverse",
            },
            y: 0,
            opacity: 1,
            stagger: 0.1,
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-line").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.5,
            toggleActions: "play reverse play reverse",
          },
          scaleX: 1,
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
    <div ref={mainRef} className="relative">
      <CursorFollower />
      <ScrollProgress />
      
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="orbital-glow w-[500px] h-[500px] bg-foreground/5 -top-40 -right-40" style={{ animation: "pulse-glow 6s ease-in-out infinite" }} />
        <div className="orbital-glow w-[400px] h-[400px] bg-foreground/3 -bottom-20 -left-20" style={{ animation: "pulse-glow 8s ease-in-out 2s infinite" }} />
        
        <Suspense fallback={null}>
          <Scene3D className="z-0" />
        </Suspense>

        <motion.div
          id="hero-content"
          className="relative z-10 text-center px-6 will-change-transform"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 rounded-full border border-border/60 glass px-5 py-2 mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase font-mono">
              Available for work
            </span>
          </motion.div>

          {/* Name — massive and cinematic */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-[clamp(3.5rem,12vw,12rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-foreground"
            >
              ZAID
            </motion.h1>
          </div>
          <div className="overflow-hidden mt-2">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-[clamp(3.5rem,12vw,12rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-gradient"
            >
              SHELIYA
            </motion.h1>
          </div>

          {/* Typing role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/50" />
            <p className="text-sm text-muted-foreground md:text-base tracking-[0.15em] font-mono uppercase">
              <span className="text-foreground/80">{typedText}</span>
              <span className="animate-pulse text-foreground/40">▊</span>
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/50" />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex items-center justify-center gap-5"
          >
            <MagneticButton
              onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative overflow-hidden glass-strong rounded-full px-10 py-4 text-sm font-medium tracking-[0.15em] uppercase text-foreground transition-all duration-500 hover:glow-md"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Eye size={16} />
                View Work
              </span>
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border border-foreground/10 px-10 py-4 text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground transition-all duration-500 hover:border-foreground/30 hover:text-foreground hover:glow-sm"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                Get in Touch
              </span>
            </MagneticButton>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-14 flex items-center justify-center gap-5"
          >
            {[
              { Icon: Github, href: "https://github.com/sheliyazaid" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/zaid-sheliya/" },
              { Icon: Instagram, href: "https://www.instagram.com/zaxd._.shelxya/" },
              { Icon: Mail, href: "mailto:zaidsheliya16@gmail.com" },
            ].map(({ Icon, href }) => (
              <MagneticButton
                key={href}
                onClick={() => window.open(href, "_blank")}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border/40 text-muted-foreground/40 hover:text-foreground hover:border-foreground/20 hover:glow-sm transition-all duration-500"
              >
                <Icon size={16} className="transition-transform duration-300 group-hover:scale-110" />
              </MagneticButton>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 uppercase font-mono">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <ArrowDown size={14} className="text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <InfiniteMarquee />

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <motion.section ref={aboutRef} id="about" className="gsap-section relative z-10 py-32 will-change-transform" style={{ scale: aboutScale, y: aboutY }}>
        <div id="about-inner" className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="About" subtitle="A passionate creative who bridges the gap between design and development." />
          </div>

          <div className="gsap-fade-up max-w-2xl mx-auto text-center mb-24">
            <p className="text-muted-foreground leading-relaxed text-lg">
              I'm <span className="text-foreground font-medium">Zaid Sheliya</span> — a designer who codes and a developer who designs.
              I create digital experiences that are both visually stunning and technically sound.
            </p>
          </div>

          {/* Stats — dramatic */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 gsap-fade-up max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6">
                  <Counter {...stat} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="section-divider mx-auto w-full max-w-5xl mb-20" />

          {/* Highlights — glass pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-24 gsap-fade-up">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="glass-strong gradient-border rounded-2xl px-6 py-4 flex items-center gap-3 group"
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <item.icon size={18} className="text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                </motion.div>
                <span className="text-xs text-muted-foreground tracking-[0.12em] uppercase font-mono group-hover:text-foreground transition-colors duration-300">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto gsap-fade-up">
            <TiltCard delay={0.1} glare>
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 glass">
                    <Palette size={18} className="text-foreground/60" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Design</h3>
                </div>
                {designSkills.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} delay={i * 0.08} />
                ))}
              </div>
            </TiltCard>

            <TiltCard delay={0.2} glare>
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 glass">
                    <Terminal size={18} className="text-foreground/60" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Development</h3>
                </div>
                {devSkills.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} delay={i * 0.08} />
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════ PORTFOLIO ═══════════════════ */}
      <section id="portfolio" className="gsap-section relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="Selected Work" subtitle="Projects that showcase design and development expertise." />
          </div>

          <div className="section-divider mx-auto w-full max-w-6xl mb-14" />

          {/* Filters */}
          <div className="flex justify-center gap-3 mb-14 gsap-fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-7 py-2.5 text-[10px] tracking-[0.2em] uppercase font-mono transition-all duration-500 ${
                  activeFilter === cat
                    ? "glass-strong text-foreground glow-sm gradient-border"
                    : "text-muted-foreground/60 hover:text-foreground border border-transparent hover:border-border/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto gsap-fade-up">
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
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group glass-strong gradient-border rounded-2xl overflow-hidden h-full"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="flex items-center gap-2 text-xs font-mono text-foreground tracking-[0.15em] uppercase glass-strong rounded-full px-5 py-2">
                          <ExternalLink size={12} /> View
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      <span className="text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase font-mono">
                        {project.category}
                      </span>
                      <h3 className="font-heading text-base font-semibold text-foreground mt-2 group-hover:text-gradient transition-all duration-300">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground/70 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
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

          <div className="section-divider mx-auto w-full max-w-4xl mb-20" />

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto gsap-fade-up">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative glass-strong gradient-border rounded-2xl p-8 overflow-hidden"
              >
                {/* Ambient gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />
                
                <div className="relative z-10">
                  <motion.div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 glass"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon size={22} className="text-foreground/60 group-hover:text-foreground transition-colors duration-300" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section id="testimonials" className="gsap-section relative z-10 py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="Wall of Love" subtitle="What clients & collaborators say about working with me." />
          </div>

          <div className="section-divider mx-auto w-full max-w-5xl mb-16" />

          {/* Bento-style testimonial grid */}
          <div className="grid gap-4 md:grid-cols-3 max-w-6xl mx-auto gsap-fade-up auto-rows-auto">
            {[
              {
                name: "Arjun Patel",
                role: "CEO, TechVibe Studios",
                quote: "Zaid turned our vague idea into a brand that people actually recognize. His design sense is on another level — every pixel feels intentional.",
                rating: 5,
                featured: true,
                accent: "from-purple-500/10 to-blue-500/10",
              },
              {
                name: "Sneha Kapoor",
                role: "Founder, Luxe & Co",
                quote: "The attention to detail is insane. Delivered ahead of schedule with quality that exceeded expectations.",
                rating: 5,
                featured: false,
                accent: "from-amber-500/10 to-orange-500/10",
              },
              {
                name: "Rahul Sharma",
                role: "CTO, DevStack",
                quote: "Clean code, modern UI, and he actually understands both design AND development. Rare combo.",
                rating: 5,
                featured: false,
                accent: "from-cyan-500/10 to-teal-500/10",
              },
              {
                name: "Priya Mehta",
                role: "Marketing Head, Bloom Agency",
                quote: "Our conversion rate jumped 40% after Zaid redesigned our landing page. The ROI speaks for itself.",
                rating: 5,
                featured: true,
                accent: "from-emerald-500/10 to-green-500/10",
              },
              {
                name: "Vikram Desai",
                role: "Indie Filmmaker",
                quote: "He made my portfolio feel like a cinematic experience. People think I hired a whole agency.",
                rating: 5,
                featured: false,
                accent: "from-rose-500/10 to-pink-500/10",
              },
              {
                name: "Ananya Iyer",
                role: "Product Designer, Nexus",
                quote: "Zaid's work ethic is unmatched. Fast communication, creative solutions, and zero drama. 10/10 would hire again.",
                rating: 5,
                featured: false,
                accent: "from-violet-500/10 to-indigo-500/10",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group relative glass-strong gradient-border rounded-2xl p-7 overflow-hidden ${
                  t.featured ? "md:row-span-2 flex flex-col justify-between" : ""
                }`}
                style={{ perspective: "800px" }}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />

                <div className="relative z-10">
                  {/* Quote icon */}
                  <div className="text-foreground/[0.06] font-heading text-7xl leading-none mb-1 select-none">"</div>

                  <p className={`text-foreground/80 leading-relaxed ${t.featured ? "text-base md:text-lg" : "text-sm"}`}>
                    {t.quote}
                  </p>

                  {/* Stars */}
                  <div className="flex gap-1 mt-5 mb-4">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <motion.span
                        key={si}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: i * 0.08 + si * 0.05 + 0.3 }}
                        className="text-foreground/40 text-xs"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 glass text-foreground/50 font-heading text-xs font-bold">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground/50 font-mono tracking-wide">{t.role}</p>
                    </div>
                  </div>
                </div>

                {/* Corner badge for featured */}
                {t.featured && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="absolute top-4 right-4 text-[8px] tracking-[0.2em] uppercase font-mono text-muted-foreground/30 border border-border/30 rounded-full px-3 py-1"
                  >
                    Featured
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="gsap-section relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="gsap-fade-up">
            <SectionHeading title="Let's Talk" subtitle="Have a project in mind? Let's make it happen." />
          </div>

          <div className="section-divider mx-auto w-full max-w-lg mb-14" />

          <div className="max-w-lg mx-auto gsap-fade-up">
            <div className="glass-strong gradient-border rounded-2xl p-10 relative overflow-hidden noise">
              <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.25em] text-muted-foreground/70 uppercase font-mono">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border/40 bg-secondary/30 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/20 focus:glow-sm transition-all font-mono"
                    placeholder="your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.25em] text-muted-foreground/70 uppercase font-mono">Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-border/40 bg-secondary/30 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/20 focus:glow-sm transition-all font-mono"
                    placeholder="your phone"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.25em] text-muted-foreground/70 uppercase font-mono">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-border/40 bg-secondary/30 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/20 focus:glow-sm transition-all resize-none font-mono"
                    placeholder="tell me about your project..."
                  />
                </div>
                <MagneticButton
                  type="submit"
                  className="w-full glass-strong gradient-border rounded-xl py-4 text-sm font-medium tracking-[0.15em] uppercase text-foreground flex items-center justify-center gap-3 hover:glow-md transition-all duration-500"
                >
                  <Send size={14} />
                  Send via WhatsApp
                </MagneticButton>
              </form>
              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground/40 relative z-10">
                <MessageCircle size={12} />
                <span className="text-[9px] tracking-[0.2em] font-mono uppercase">Opens WhatsApp directly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 border-t border-border/40">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 py-20">
            {/* Brand */}
            <div>
              <p className="font-heading text-3xl font-bold tracking-wider text-foreground mb-4">
                ZS<span className="text-gradient-gold">.</span>
              </p>
              <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xs">
                A creative developer crafting digital experiences that blend stunning design with clean, performant code.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] tracking-[0.25em] text-foreground/80 uppercase font-mono mb-8">Quick Links</h4>
              <div className="space-y-4">
                {["hero", "about", "portfolio", "services", "contact"].map((id) => (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                    className="block text-sm text-muted-foreground/50 hover:text-foreground transition-colors duration-300 capitalize tracking-wide"
                  >
                    {id === "hero" ? "Home" : id}
                  </button>
                ))}
              </div>
            </div>
            {/* Connect */}
            <div>
              <h4 className="text-[10px] tracking-[0.25em] text-foreground/80 uppercase font-mono mb-8">Connect</h4>
              <div className="flex gap-3 mb-6">
                {[
                  { Icon: Github, label: "GitHub", href: "https://github.com/sheliyazaid" },
                  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/zaid-sheliya/" },
                  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/zaxd._.shelxya/" },
                  { Icon: Mail, label: "Email", href: "mailto:zaidsheliya16@gmail.com" },
                ].map(({ Icon, label, href }) => (
                  <MagneticButton
                    key={label}
                    onClick={() => window.open(href, "_blank")}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/30 text-muted-foreground/40 hover:text-foreground hover:border-foreground/20 hover:glow-sm transition-all duration-500"
                  >
                    <Icon size={15} />
                  </MagneticButton>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/40 font-mono tracking-wide">
                zaidsheliya16@gmail.com
              </p>
            </div>
          </div>
          {/* Bottom */}
          <div className="section-divider" />
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-muted-foreground/40 tracking-[0.15em] font-mono">
              © {new Date().getFullYear()} Zaid Sheliya. All rights reserved.
            </p>
            <p className="text-[10px] text-muted-foreground/40 tracking-[0.15em] font-mono flex items-center gap-1.5">
              Designed & Built with <Heart size={10} className="text-foreground/30" /> in India
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
            className="fixed bottom-8 right-8 z-50 glass-strong gradient-border rounded-full p-3.5 text-foreground/60 hover:text-foreground hover:glow-md transition-all duration-500"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
