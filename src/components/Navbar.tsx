import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { to: "hero", label: "Home" },
  { to: "about", label: "About" },
  { to: "portfolio", label: "Work" },
  { to: "services", label: "Services" },
  { to: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = links.map(l => document.getElementById(l.to));
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActive(links[i].to);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={() => scrollTo("hero")} className="font-heading text-lg font-bold tracking-wider text-foreground">
          ZS<span className="text-muted-foreground">.</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => scrollTo(link.to)}
              className={`relative text-sm tracking-wide transition-colors duration-300 ${
                active === link.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {active === link.to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              {links.map((link) => (
                <button
                  key={link.to}
                  onClick={() => scrollTo(link.to)}
                  className={`text-sm tracking-wide ${
                    active === link.to ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
