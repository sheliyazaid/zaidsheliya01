import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ExternalLink, Send, MessageCircle, Palette, Code, PenTool, Globe, Layout, Figma, Smartphone, Terminal, Github, Linkedin, Mail, Heart, ArrowUp, Instagram, Sparkles, Eye, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/SectionHeading";
import TiltCard from "../components/TiltCard";
import MagneticButton from "../components/MagneticButton";
import ScrollProgress from "../components/ScrollProgress";
import CursorFollower from "../components/CursorFollower";

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
  { icon: Palette, title: "UI/UX Design", description: "Crafting intuitive and beautiful user interfaces that put the user experience first.", accent: "from-purple-500/10 to-blue-500/10" },
  { icon: PenTool, title: "Logo Design", description: "Creating memorable brand identities that communicate your values.", accent: "from-amber-500/10 to-orange-500/10" },
  { icon: Globe, title: "Website Design", description: "Designing modern, responsive websites that convert visitors into customers.", accent: "from-cyan-500/10 to-teal-500/10" },
  { icon: Code, title: "Frontend Development", description: "Building fast, interactive web applications with React & TypeScript.", accent: "from-emerald-500/10 to-green-500/10" },
];

const stats = [
  { value: "50+", label: "Projects" },
  { value: "3+", label: "Years" },
  { value: "30+", label: "Clients" },
  { value: "100%", label: "Dedication" },
];

const testimonials = [
  { name: "Arjun Patel", role: "CEO, TechVibe Studios", quote: "Zaid turned our vague idea into a brand that people actually recognize. His design sense is on another level — every pixel feels intentional.", featured: true, accent: "from-purple-500/10 to-blue-500/10" },
  { name: "Sneha Kapoor", role: "Founder, Luxe & Co", quote: "The attention to detail is insane. Delivered ahead of schedule with quality that exceeded expectations.", featured: false, accent: "from-amber-500/10 to-orange-500/10" },
  { name: "Rahul Sharma", role: "CTO, DevStack", quote: "Clean code, modern UI, and he actually understands both design AND development. Rare combo.", featured: false, accent: "from-cyan-500/10 to-teal-500/10" },
  { name: "Priya Mehta", role: "Marketing Head, Bloom Agency", quote: "Our conversion rate jumped 40% after Zaid redesigned our landing page. The ROI speaks for itself.", featured: true, accent: "from-emerald-500/10 to-green-500/10" },
  { name: "Vikram Desai", role: "Indie Filmmaker", quote: "He made my portfolio feel like a cinematic experience. People think I hired a whole agency.", featured: false, accent: "from-rose-500/10 to-pink-500/10" },
  { name: "Ananya Iyer", role: "Product Designer, Nexus", quote: "Zaid's work ethic is unmatched. Fast communication, creative solutions, and zero drama. 10/10 would hire again.", featured: false, accent: "from-violet-500/10 to-indigo-500/10" },
];

const categories = ["All", "Graphic Design", "Frontend"];

// ─── 3D MOUSE TRACKING HOOK ────────────────────
function use3DMouse() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return { smoothX, smoothY };
}

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
          className="h-full rounded-full bg-gradient-to-r from-foreground/30 to-foreground/60"
        />
      </div>
    </motion.div>
  );
}

// ─── COUNTER ────────────────────────────────────
function Counter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      className="text-center group relative"
    >
      <div className="font-heading text-5xl md:text-7xl font-extrabold text-foreground/90 hero-number transition-all duration-500 group-hover:text-gradient">{value}</div>
      <div className="mt-3 text-[9px] tracking-[0.3em] text-muted-foreground/50 uppercase font-mono">{label}</div>
    </motion.div>
  );
}

// ─── MARQUEE ────────────────────────────────────
function InfiniteMarquee() {
  const items = ["DESIGN", "✦", "DEVELOP", "✦", "CREATE", "✦", "INNOVATE", "✦", "INSPIRE", "✦"];
  return (
    <div className="overflow-hidden py-10 border-y border-border/30 relative">
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-16 whitespace-nowrap"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`font-heading font-extrabold tracking-[0.05em] ${
              item === "✦" ? "text-foreground/[0.08] text-xl" : "text-foreground/[0.04] text-5xl md:text-7xl"
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── SPOTLIGHT CARD WRAPPER ────────────────────
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mouse-x", `${x}%`);
    ref.current.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div ref={ref} onMouseMove={handleMouse} className={`spotlight-card ${className}`}>
      {children}
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
  const { smoothX, smoothY } = use3DMouse();
  
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

  // Parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.75]);
  const aboutScale = useTransform(scrollY, [200, 900], [0.9, 1]);
  const aboutY = useTransform(scrollY, [200, 900], [150, 0]);

  // 3D rotations driven by mouse
  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [-1, 1], [-3, 3]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current && aboutRef.current) {
        gsap.to("#hero-content", {
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
          y: -120,
          opacity: 0,
          scale: 0.9,
        });

        gsap.fromTo("#about-inner", { y: 100, opacity: 0 }, {
          scrollTrigger: { trigger: aboutRef.current, start: "top 80%", end: "top 30%", scrub: 1 },
          y: 0, opacity: 1,
        });
      }

      gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
        gsap.fromTo(
          section.querySelectorAll(".gsap-fade-up"),
          { y: 60, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 30%", scrub: 0.8, toggleActions: "play reverse play reverse" },
            y: 0, opacity: 1, stagger: 0.1,
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-line").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scrollTrigger: { trigger: el, start: "top 85%", end: "top 50%", scrub: 0.5, toggleActions: "play reverse play reverse" },
          scaleX: 1, ease: "power3.out",
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

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} id="hero" className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        {/* Aurora ambient */}
        <div className="aurora-glow" />
        
        {/* Ambient glow orbs */}
        <div className="orbital-glow w-[600px] h-[600px] bg-foreground/5 -top-48 -right-48" style={{ animation: "pulse-glow 6s ease-in-out infinite" }} />
        <div className="orbital-glow w-[500px] h-[500px] bg-foreground/3 -bottom-32 -left-32" style={{ animation: "pulse-glow 8s ease-in-out 2s infinite" }} />
        <div className="lens-flare top-1/4 right-1/4" />
        
        <Suspense fallback={null}>
          <Scene3D className="z-0" />
        </Suspense>

        {/* Side decorators */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4"
        >
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
          <span className="text-[8px] tracking-[0.3em] text-muted-foreground/30 uppercase font-mono [writing-mode:vertical-lr] rotate-180">
            Portfolio 2025
          </span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
          {[
            { Icon: Github, href: "https://github.com/sheliyazaid" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/zaid-sheliya/" },
            { Icon: Instagram, href: "https://www.instagram.com/zaxd._.shelxya/" },
            { Icon: Mail, href: "mailto:zaidsheliya16@gmail.com" },
          ].map(({ Icon, href }) => (
            <MagneticButton
              key={href}
              onClick={() => window.open(href, "_blank")}
              className="text-muted-foreground/20 hover:text-foreground transition-all duration-500"
            >
              <Icon size={14} />
            </MagneticButton>
          ))}
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
        </motion.div>

        {/* Main hero — with 3D mouse tilt */}
        <motion.div
          id="hero-content"
          className="relative z-10 text-center px-6 will-change-transform max-w-6xl mx-auto perspective-section"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div style={{ rotateX, rotateY }} className="depth-layer">
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 rounded-full border border-border/40 glass-holo px-5 py-2 mb-12"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9px] tracking-[0.3em] text-muted-foreground/60 uppercase font-mono">
                Available for Freelance
              </span>
            </motion.div>

            {/* Name — the centerpiece with glitch */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
              >
                <span className="font-heading text-[clamp(5rem,18vw,16rem)] font-extrabold leading-[0.8] text-stroke tracking-[-0.05em]">ZS</span>
              </motion.div>

              <div className="overflow-hidden relative">
                <motion.h1
                  initial={{ y: "120%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-[clamp(3rem,10vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-gradient-premium glitch-text"
                  data-text="ZAID"
                >
                  ZAID
                </motion.h1>
              </div>
              <div className="overflow-hidden mt-1">
                <motion.h1
                  initial={{ y: "120%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.65, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-[clamp(3rem,10vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-gradient-premium glitch-text"
                  data-text="SHELIYA"
                >
                  SHELIYA
                </motion.h1>
              </div>
            </div>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-muted-foreground/30" />
              <p className="text-sm text-muted-foreground md:text-base tracking-[0.2em] font-mono uppercase">
                <span className="text-foreground/70">{typedText}</span>
                <span className="animate-pulse text-foreground/30 ml-0.5">▊</span>
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-muted-foreground/30" />
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 flex items-center justify-center gap-5 flex-wrap"
            >
              <MagneticButton
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative overflow-hidden glass-holo animated-gradient-border rounded-full px-12 py-4 text-sm font-medium tracking-[0.15em] uppercase text-foreground transition-all duration-500 hover:glow-md"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <Eye size={15} />
                  View Work
                </span>
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full border border-foreground/8 px-12 py-4 text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground/70 transition-all duration-500 hover:border-foreground/20 hover:text-foreground hover:glow-sm"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles size={15} />
                  Let's Talk
                </span>
              </MagneticButton>
            </motion.div>

            {/* Mobile social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-12 flex items-center justify-center gap-5 lg:hidden"
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
                  className="text-muted-foreground/30 hover:text-foreground transition-all duration-500"
                >
                  <Icon size={16} />
                </MagneticButton>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-0 right-0 z-10 px-6"
        >
          <div className="max-w-4xl mx-auto flex items-end justify-between">
            <div className="hidden md:flex items-center gap-8">
              {stats.slice(0, 2).map((s) => (
                <div key={s.label} className="text-left">
                  <div className="text-lg font-heading font-bold text-foreground/30">{s.value}</div>
                  <div className="text-[8px] tracking-[0.2em] text-muted-foreground/25 uppercase font-mono">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2 mx-auto md:mx-0">
              <span className="text-[8px] tracking-[0.35em] text-muted-foreground/25 uppercase font-mono">Scroll down</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
                <ArrowDown size={12} className="text-muted-foreground/25" />
              </motion.div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {stats.slice(2).map((s) => (
                <div key={s.label} className="text-right">
                  <div className="text-lg font-heading font-bold text-foreground/30">{s.value}</div>
                  <div className="text-[8px] tracking-[0.2em] text-muted-foreground/25 uppercase font-mono">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <InfiniteMarquee />

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <motion.section ref={aboutRef} id="about" className="gsap-section relative z-10 py-32 will-change-transform" style={{ scale: aboutScale, y: aboutY }}>
        {/* Section aurora */}
        <div className="aurora-glow" />
        
        <div id="about-inner" className="container mx-auto px-6 relative z-10">
          <div className="gsap-fade-up">
            <SectionHeading title="About" subtitle="A passionate creative who bridges the gap between design and development." />
          </div>

          <div className="gsap-fade-up max-w-2xl mx-auto text-center mb-24">
            <p className="text-muted-foreground/70 leading-relaxed text-lg">
              I'm <span className="text-foreground font-medium">Zaid Sheliya</span> — a designer who codes and a developer who designs.
              I create digital experiences that are both visually stunning and technically sound.
            </p>
          </div>

          {/* Stats — with 3D perspective */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 gsap-fade-up max-w-5xl mx-auto perspective-section">
            {stats.map((stat, i) => (
              <SpotlightCard key={stat.label} className="rounded-2xl">
                <motion.div
                  className="relative glass-holo gradient-border rounded-2xl p-8 card-3d scan-line"
                  whileHover={{ scale: 1.05, y: -8, rotateX: -3, rotateY: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 40, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: false }}
                  custom={i}
                >
                  <Counter {...stat} />
                </motion.div>
              </SpotlightCard>
            ))}
          </div>

          <div className="section-divider mx-auto w-full max-w-5xl mb-20" />

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-3 mb-24 gsap-fade-up">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.12, y: -6, rotateZ: Math.random() > 0.5 ? 2 : -2 }}
                className="glass-holo gradient-border rounded-full px-5 py-3 flex items-center gap-2.5 group"
              >
                <item.icon size={14} className="text-muted-foreground/50 group-hover:text-foreground transition-colors duration-300" />
                <span className="text-[10px] text-muted-foreground/60 tracking-[0.12em] uppercase font-mono group-hover:text-foreground transition-colors duration-300">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Skills — with 3D depth */}
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto gsap-fade-up perspective-section">
            <TiltCard delay={0.1} glare>
              <div className="space-y-5 relative">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 glass-holo"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Palette size={16} className="text-foreground/50" />
                  </motion.div>
                  <h3 className="font-heading text-base font-semibold text-foreground">Design</h3>
                </div>
                {designSkills.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} delay={i * 0.08} />
                ))}
              </div>
            </TiltCard>

            <TiltCard delay={0.2} glare>
              <div className="space-y-5 relative">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 glass-holo"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Terminal size={16} className="text-foreground/50" />
                  </motion.div>
                  <h3 className="font-heading text-base font-semibold text-foreground">Development</h3>
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
        <div className="aurora-glow" />
        <div className="container mx-auto px-6 relative z-10">
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
                    ? "glass-holo text-foreground glow-sm animated-gradient-border"
                    : "text-muted-foreground/50 hover:text-foreground border border-transparent hover:border-border/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project grid — cinematic 3D cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto gsap-fade-up perspective-section">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 50, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SpotlightCard className="rounded-2xl h-full">
                    <motion.div
                      whileHover={{ y: -12, rotateX: -3, rotateY: 2, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group glass-holo gradient-border rounded-2xl overflow-hidden h-full card-3d"
                    >
                      <div className="relative overflow-hidden">
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-52 object-cover"
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.7 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                          <span className="flex items-center gap-2 text-[10px] font-mono text-foreground tracking-[0.2em] uppercase glass-holo rounded-full px-5 py-2">
                            <ExternalLink size={11} /> View Project
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="text-[8px] tracking-[0.3em] text-muted-foreground/40 uppercase font-mono">
                          {project.category}
                        </span>
                        <h3 className="font-heading text-sm font-semibold text-foreground mt-2 group-hover:text-gradient transition-all duration-300 reveal-line pb-1">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-[11px] text-muted-foreground/50 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </motion.div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section id="services" className="gsap-section relative z-10 py-32">
        <div className="aurora-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="gsap-fade-up">
            <SectionHeading title="Services" subtitle="What I bring to your next project." />
          </div>

          <div className="section-divider mx-auto w-full max-w-4xl mb-20" />

          <div className="grid gap-5 sm:grid-cols-2 max-w-4xl mx-auto gsap-fade-up perspective-section">
            {services.map((service, i) => (
              <SpotlightCard key={service.title} className="rounded-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -10, scale: 1.03, rotateX: -2, rotateY: 2 }}
                  className="group relative glass-holo gradient-border rounded-2xl p-8 overflow-hidden card-3d scan-line"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/30 glass-holo"
                      whileHover={{ rotate: 15, scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <service.icon size={20} className="text-foreground/50 group-hover:text-foreground transition-colors duration-300" />
                    </motion.div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-3 reveal-line pb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/60 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section id="testimonials" className="gsap-section relative z-10 py-32 overflow-hidden">
        <div className="aurora-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="gsap-fade-up">
            <SectionHeading title="Wall of Love" subtitle="What clients & collaborators say about working with me." />
          </div>

          <div className="section-divider mx-auto w-full max-w-5xl mb-16" />

          <div className="grid gap-4 md:grid-cols-3 max-w-6xl mx-auto gsap-fade-up auto-rows-auto perspective-section">
            {testimonials.map((t, i) => (
              <SpotlightCard key={t.name} className={`rounded-2xl ${t.featured ? "md:row-span-2" : ""}`}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 12 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.02, rotateX: -2 }}
                  className={`group relative glass-holo gradient-border rounded-2xl p-7 overflow-hidden h-full card-3d ${
                    t.featured ? "flex flex-col justify-between" : ""
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`} />

                  <div className="relative z-10">
                    <div className="text-foreground/[0.04] font-heading text-7xl leading-none mb-1 select-none">"</div>

                    <p className={`text-foreground/70 leading-relaxed ${t.featured ? "text-base md:text-lg" : "text-sm"}`}>
                      {t.quote}
                    </p>

                    <div className="flex gap-0.5 mt-5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <motion.div
                          key={si}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false }}
                          transition={{ delay: i * 0.07 + si * 0.04 + 0.3 }}
                        >
                          <Star size={11} className="text-foreground/25 fill-foreground/25" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/30 glass-holo text-foreground/40 font-heading text-[10px] font-bold">
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground/80">{t.name}</p>
                        <p className="text-[9px] text-muted-foreground/40 font-mono tracking-wide">{t.role}</p>
                      </div>
                    </div>
                  </div>

                  {t.featured && (
                    <div className="absolute top-4 right-4 text-[7px] tracking-[0.2em] uppercase font-mono text-muted-foreground/20 border border-border/20 rounded-full px-3 py-1">
                      Featured
                    </div>
                  )}
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="gsap-section relative z-10 py-32">
        <div className="aurora-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="gsap-fade-up">
            <SectionHeading title="Let's Talk" subtitle="Have a project in mind? Let's make it happen." />
          </div>

          <div className="section-divider mx-auto w-full max-w-lg mb-14" />

          <div className="max-w-lg mx-auto gsap-fade-up perspective-section">
            <SpotlightCard className="rounded-2xl">
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-holo gradient-border rounded-2xl p-10 relative overflow-hidden noise card-3d scan-line"
              >
                <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase font-mono">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-border/40 bg-secondary/20 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/25 focus:glow-sm transition-all font-mono"
                      placeholder="your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase font-mono">Phone</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-border/40 bg-secondary/20 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/25 focus:glow-sm transition-all font-mono"
                      placeholder="your phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase font-mono">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-border/40 bg-secondary/20 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/25 focus:glow-sm transition-all resize-none font-mono"
                      placeholder="tell me about your project..."
                    />
                  </div>
                  <MagneticButton
                    type="submit"
                    className="w-full glass-holo animated-gradient-border rounded-xl py-4 text-sm font-medium tracking-[0.15em] uppercase text-foreground flex items-center justify-center gap-3 hover:glow-md transition-all duration-500"
                  >
                    <Send size={13} />
                    Send via WhatsApp
                  </MagneticButton>
                </form>
                <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground/60 relative z-10">
                  <MessageCircle size={11} />
                  <span className="text-[8px] tracking-[0.25em] font-mono uppercase">Opens WhatsApp directly</span>
                </div>
              </motion.div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 border-t border-border/20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 py-20">
            <div>
              <p className="font-heading text-3xl font-extrabold tracking-wider text-foreground mb-4">
                ZS<span className="text-gradient-gold">.</span>
              </p>
              <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xs">
                A creative developer crafting digital experiences that blend stunning design with clean, performant code.
              </p>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.3em] text-foreground/60 uppercase font-mono mb-8">Quick Links</h4>
              <div className="space-y-4">
                {["hero", "about", "portfolio", "services", "contact"].map((id) => (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                    className="block text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-300 capitalize tracking-wide reveal-line pb-0.5"
                  >
                    {id === "hero" ? "Home" : id}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[9px] tracking-[0.3em] text-foreground/60 uppercase font-mono mb-8">Connect</h4>
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
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/30 text-muted-foreground/60 hover:text-foreground hover:border-foreground/20 hover:glow-sm transition-all duration-500"
                  >
                    <Icon size={14} />
                  </MagneticButton>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground/60 font-mono tracking-wide">
                zaidsheliya16@gmail.com
              </p>
            </div>
          </div>
          <div className="section-divider" />
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[9px] text-muted-foreground/50 tracking-[0.15em] font-mono">
              © {new Date().getFullYear()} Zaid Sheliya. All rights reserved.
            </p>
            <p className="text-[9px] text-muted-foreground/50 tracking-[0.15em] font-mono flex items-center gap-1.5">
              Designed & Built with <Heart size={9} className="text-foreground/40" /> in India
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
            className="fixed bottom-8 right-8 z-50 glass-holo gradient-border rounded-full p-3.5 text-foreground/50 hover:text-foreground hover:glow-md transition-all duration-500"
          >
            <ArrowUp size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
