import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ArcCarouselNew from "./ArcCarouselNew";

const HeroSection = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <section id="work" className="relative min-h-[100dvh] overflow-hidden bg-[#030303] text-white selection:bg-primary/30">

      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top center stage light */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />

        {/* Ambient bottom glow */}
        <div className="absolute bottom-[-10%] left-0 right-0 h-[40%] bg-gradient-to-t from-background to-transparent opacity-80" />

        {/* Subtle Grain Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-28 pb-6">

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isViewerOpen ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-center mb-3 px-4 z-20 relative mt-8 pointer-events-none"
          style={{ pointerEvents: isViewerOpen ? 'none' : 'auto' }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-2">
            Websites That
            <br />
            Feel Like Apps
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[80px] -z-10 rounded-full opacity-20"
          />
        </motion.div>

        {/* Subheadline & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isViewerOpen ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-8 max-w-xl px-4 text-center"
          style={{ pointerEvents: isViewerOpen ? 'none' : 'auto' }}
        >
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
            Premium experiences for brands that demand attention.
            <br className="hidden sm:block" />
            Immersive, fluid, and unforgettably distinct.
          </p>

          <a
            href="#work"
            className="group relative inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-semibold tracking-tight transition-transform duration-300 hover:scale-105 text-sm"
          >
            <span>View My Work</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          </a>
        </motion.div>

        {/* Portfolio Carousel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
          className="w-full relative z-10 flex-1 flex flex-col justify-end pb-4"
        >
          <ArcCarouselNew onViewerOpenChange={setIsViewerOpen} />
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
