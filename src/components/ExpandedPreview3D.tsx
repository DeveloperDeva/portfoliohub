import { motion } from "framer-motion";
import { X, Play, ExternalLink } from "lucide-react";

interface ExpandedPreview3DProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  category: string;
  index: number;
  color: string;
}

const ExpandedPreview3D = ({
  isOpen,
  onClose,
  image,
  title,
  category,
  index,
  color,
}: ExpandedPreview3DProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with deep blur */}
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-2xl" />
        
        {/* Ambient color glow */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(ellipse at center, hsl(${color} / 0.15) 0%, transparent 60%)`,
          }}
        />
      </motion.div>

      {/* Expanded preview container */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-6xl pointer-events-auto"
          layoutId={`card-3d-${index}`}
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        >
          {/* Cinematic glow behind */}
          <motion.div
            className="absolute -inset-12 rounded-3xl opacity-50 z-0"
            style={{
              background: `radial-gradient(ellipse at center, hsl(${color} / 0.3) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Browser frame */}
          <div className="relative browser-frame-3d shadow-2xl z-10">
            {/* Browser header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border-b border-border/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/50 border border-border/50">
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {title.toLowerCase().replace(/\s+/g, "-")}.com
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-background/50 transition-colors group"
              >
                <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>

            {/* Website preview with video simulation */}
            <div className="relative aspect-[16/10] overflow-hidden bg-card">
              {/* Static image as base */}
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-top"
              />
              
              {/* Animated scroll simulation */}
              <motion.div
                className="absolute inset-0"
                initial={{ y: 0 }}
                animate={{ y: [0, -100, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto object-cover object-top"
                  style={{ minHeight: "120%" }}
                />
              </motion.div>
              
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none scanlines" />
              
              {/* Play button overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                <motion.div
                  className="p-6 rounded-full glass-card border border-primary/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-primary fill-primary" />
                </motion.div>
              </motion.div>
              
              {/* Depth gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
            </div>

            {/* Footer with info and actions */}
            <motion.div
              className="flex items-center justify-between p-6 border-t border-border/50 bg-card/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <p 
                  className="text-sm font-medium uppercase tracking-wider mb-1"
                  style={{ color: `hsl(${color})` }}
                >
                  {category}
                </p>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  {title}
                </h2>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 hover:bg-primary/10"
                  style={{ borderColor: `hsl(${color})` }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4" style={{ color: `hsl(${color})` }} />
                  <span className="text-sm font-semibold" style={{ color: `hsl(${color})` }}>
                    View Live
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Close hint */}
          <motion.p
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Click outside or press ESC to close
          </motion.p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ExpandedPreview3D;
