import { motion } from "framer-motion";

interface PortfolioCard3DProps {
  image: string;
  title: string;
  category: string;
  color: string;
  index: number;
  angle: number;
  radius: number;
  blur: number;
  opacity: number;
  scale: number;
  brightness: number;
  isCenter: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const PortfolioCard3D = ({
  image,
  title,
  category,
  color,
  index,
  angle,
  radius,
  blur,
  opacity,
  scale,
  brightness,
  isCenter,
  isSelected,
  onClick,
}: PortfolioCard3DProps) => {
  // Calculate 3D position
  const x = Math.sin((angle * Math.PI) / 180) * radius;
  const z = Math.cos((angle * Math.PI) / 180) * radius - radius;
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        transform: `
          translate(-50%, -50%)
          translateX(${x}px)
          translateZ(${z}px)
          rotateY(${angle}deg)
          scale(${scale})
        `,
        filter: `blur(${blur}px) brightness(${brightness})`,
        opacity: isSelected ? 0 : opacity,
        zIndex: isCenter ? 10 : 1,
      }}
      onClick={onClick}
      whileHover={isCenter ? { scale: scale * 1.05 } : undefined}
      layoutId={`card-3d-${index}`}
    >
      {/* Card container */}
      <div className={`relative w-[180px] h-[280px] md:w-[220px] md:h-[340px] lg:w-[260px] lg:h-[400px] rounded-xl overflow-hidden ${
        isCenter ? "ring-2 ring-primary/50" : ""
      }`}>
        {/* Neon rim light for center card */}
        {isCenter && (
          <motion.div
            className="absolute -inset-1 rounded-xl opacity-60 z-0"
            style={{
              background: `linear-gradient(135deg, hsl(${color} / 0.4), hsl(${color} / 0.1))`,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Main card body */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-card">
          {/* Image */}
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Film grain texture on card */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none film-grain-card" />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />
          
          {/* Reflection shine */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(135deg, hsl(210 40% 98% / 0.3) 0%, transparent 50%, transparent 100%)",
            }}
            animate={isCenter ? {
              opacity: [0.2, 0.4, 0.2],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.div
              initial={false}
              animate={{
                opacity: isCenter ? 1 : 0.5,
                y: isCenter ? 0 : 10,
              }}
              transition={{ duration: 0.3 }}
            >
              <p 
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: `hsl(${color})` }}
              >
                {category}
              </p>
              <h3 className="text-sm md:text-base font-display font-semibold text-foreground">
                {title}
              </h3>
            </motion.div>
          </div>
          
          {/* Click to view indicator for center card */}
          {isCenter && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-4 py-2 rounded-full glass-card border border-primary/30">
                <span className="text-xs text-foreground/80 whitespace-nowrap">Click to Preview</span>
              </div>
            </motion.div>
          )}
          
          {/* Border glow */}
          <div className={`absolute inset-0 rounded-xl border transition-all duration-300 ${
            isCenter ? "border-primary/50" : "border-white/5"
          }`} />
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard3D;
