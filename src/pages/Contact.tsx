import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import SectionHeading from "../components/SectionHeading";
import GlassCard from "../components/GlassCard";
import { Send, MessageCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Zaid, I want to work with you.\n\nName: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/918591811232?text=${text}`, "_blank");
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Get in Touch"
            subtitle="Let's create something amazing together."
          />

          <div className="max-w-lg mx-auto">
            <GlassCard hover={false} className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass rounded-lg py-3 text-sm font-medium tracking-wider text-foreground flex items-center justify-center gap-2 hover:glow-md transition-shadow duration-300"
                >
                  <Send size={16} />
                  Send via WhatsApp
                </motion.button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                <MessageCircle size={14} />
                <span className="text-xs tracking-wider">Opens WhatsApp directly</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
