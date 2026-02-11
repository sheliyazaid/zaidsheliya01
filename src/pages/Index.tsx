import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const Scene3D = lazy(() => import("../components/Scene3D"));

const Index = () => {
  return (
    <PageTransition>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={null}>
          <Scene3D className="z-0" />
        </Suspense>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm tracking-[0.3em] text-muted-foreground uppercase mb-6"
          >
            Creative Developer
          </motion.p>

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
            className="mt-6 text-lg text-muted-foreground md:text-xl tracking-wide"
          >
            Graphic Designer & Frontend Developer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link
              to="/portfolio"
              className="glass rounded-full px-8 py-3 text-sm font-medium tracking-wider text-foreground transition-all duration-300 hover:glow-md"
            >
              View Work
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-foreground/20 px-8 py-3 text-sm font-medium tracking-wider text-muted-foreground transition-all duration-300 hover:border-foreground/50 hover:text-foreground"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown size={20} className="text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default Index;
