import { memo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export interface PortfolioItem {
  id: string;
  media: string;
  type: "image" | "video";
  title: string;
  category: string;
  poster?: string;
}

interface ArcCardProps {
  item: PortfolioItem;
  index: number;
  style: React.CSSProperties;
  isSelected: boolean;
  onClick: () => void;
}

const ArcCard = memo(({
  item,
  index,
  style,
  isSelected,
  onClick,
}: ArcCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load media when in viewport
  const [shouldLoad, setShouldLoad] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Play video preview on hover
  useEffect(() => {
    if (item.type === "video" && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, item.type]);

  return (
    <motion.div
      ref={cardRef}
      className="arc-card absolute cursor-pointer"
      style={{
        ...style,
        left: "50%",
        top: "50%",
        marginLeft: "-140px", // Half of max card width
        marginTop: "-200px", // Half of max card height
        width: "200px",
        height: "280px",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title} - ${item.category}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Card glow effect on hover */}
      <motion.div 
        className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Main card */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-colors">
        {/* Media container */}
        {shouldLoad && (
          <>
            {item.type === "image" ? (
              <img
                src={item.media}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } ${isHovered ? "scale-110" : "scale-100"}`}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
              />
            ) : (
              <>
                {/* Video with poster fallback */}
                <video
                  ref={videoRef}
                  src={item.media}
                  poster={item.poster || undefined}
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  } ${isHovered ? "scale-110" : "scale-100"}`}
                  onLoadedData={() => setIsLoaded(true)}
                />
                {/* Play indicator */}
                <motion.div
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/60 backdrop-blur-sm"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: isHovered ? 0 : 0.7 }}
                >
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </motion.div>
              </>
            )}
          </>
        )}
        
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-60" : "opacity-80"
        }`} />
        
        {/* Reflection effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        
        {/* Content */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4"
          initial={{ y: 8, opacity: 0.8 }}
          animate={{ y: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0.8 }}
        >
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
            {item.category}
          </p>
          <h3 className="text-sm md:text-base font-display font-semibold text-foreground">
            {item.title}
          </h3>
        </motion.div>
      </div>
    </motion.div>
  );
});

ArcCard.displayName = "ArcCard";

export default ArcCard;
