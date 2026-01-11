import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Carousel3D from "./Carousel3D";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Deep cinematic ambient glows */}
      <motion.div 
        className="ambient-glow ambient-glow-1"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="ambient-glow ambient-glow-2"
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Additional color accent glows */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsl(270 80% 65% / 0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "80px 80px"
        }}
      />

      {/* Floating glass orbs for depth - more subtle */}
      <motion.div
        className="absolute top-32 left-[8%] w-40 h-40 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.2), transparent 60%)",
          filter: "blur(30px)",
        }}
        animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-48 right-[12%] w-32 h-32 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle at 30% 30%, hsl(var(--secondary) / 0.2), transparent 60%)",
          filter: "blur(25px)",
        }}
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-16 md:pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/20 backdrop-blur-xl">
            <motion.div
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-foreground/80">
              Premium Web Experiences
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-4 px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-tight">
            <span className="text-foreground">Websites That</span>
            <br />
            <motion.span 
              className="gradient-text text-glow inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(var(--glow-primary) / 0.5), 0 0 40px hsl(var(--glow-primary) / 0.3)",
                  "0 0 30px hsl(var(--glow-primary) / 0.6), 0 0 60px hsl(var(--glow-primary) / 0.4)",
                  "0 0 20px hsl(var(--glow-primary) / 0.5), 0 0 40px hsl(var(--glow-primary) / 0.3)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Feel Like Apps
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-muted-foreground text-center max-w-xl mb-8 px-4"
        >
          I craft immersive digital experiences that captivate users and 
          elevate brands. From concept to launch, your vision brought to life.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <motion.button 
            className="btn-hero group flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View My Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button 
            className="btn-outline-glow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's Talk
          </motion.button>
        </motion.div>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-2"
        >
          <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.3em]">
            Selected Works
          </p>
        </motion.div>

        {/* 3D Portfolio Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="w-full flex-1"
        >
          <Carousel3D />
        </motion.div>
      </div>

      {/* Cinematic corner gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-secondary/3 to-transparent pointer-events-none" />
      
      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
