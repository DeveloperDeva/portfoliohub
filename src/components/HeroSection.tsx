import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Carousel from "./Carousel";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background glows */}
      <div className="ambient-glow ambient-glow-1 animate-pulse-glow" />
      <div className="ambient-glow ambient-glow-2 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Floating glass panels for depth */}
      <motion.div
        className="absolute top-20 left-[10%] w-32 h-32 glass-card rounded-2xl opacity-30"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-[15%] w-24 h-24 glass-card rounded-xl opacity-20"
        animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 left-[20%] w-20 h-20 glass-card rounded-lg opacity-25"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 pb-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">
              Premium Web Experiences
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-6 px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight">
            <span className="text-foreground">Websites That</span>
            <br />
            <span className="gradient-text text-glow">Feel Like Apps</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-10 px-4"
        >
          I craft immersive digital experiences that captivate users and 
          elevate brands. From concept to launch, your vision brought to life.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <button className="btn-hero group flex items-center gap-2">
            View My Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="btn-outline-glow">
            Let's Talk
          </button>
        </motion.div>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-4"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            Selected Works
          </p>
        </motion.div>

        {/* Portfolio Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full"
        >
          <Carousel />
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/5 to-transparent" />
    </section>
  );
};

export default HeroSection;
