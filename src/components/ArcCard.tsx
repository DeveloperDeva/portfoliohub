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
  description?: string;
  website_url?: string;
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
  const mouseDownRef = useRef<number | null>(null);

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

  // Auto-play video when loaded
  useEffect(() => {
    if (item.type === "video" && videoRef.current && shouldLoad) {
      videoRef.current.play().catch(() => { });
    }
  }, [item.type, shouldLoad]);

  return (
    <motion.div
      layoutId={`card-${item.id}`}
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
        pointerEvents: "auto",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        mouseDownRef.current = e.clientX;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => {
        mouseDownRef.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title} - ${item.category}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Main card - Glass Effect */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl transition-all duration-500">

        {/* Media container */}
        {shouldLoad && (
          <>
            {item.type === "image" ? (
              <img
                src={item.media}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                  } ${isHovered ? "scale-105" : "scale-100"}`}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
              />
            ) : (
              // ... Video logic remains similar ...
              <>
                <video
                  ref={videoRef}
                  src={item.media}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
                    } ${isHovered ? "scale-105" : "scale-100"}`}
                  onLoadedData={() => setIsLoaded(true)}
                />
              </>
            )}
          </>
        )}

        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Shine/Reflection effect */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* Content */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-5 z-20 pointer-events-none"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] text-indigo-300 font-medium uppercase tracking-widest mb-2">
            {item.category}
          </p>
          <h3 className="text-lg font-bold text-white leading-tight">
            {item.title}
          </h3>
        </motion.div>
      </div>
    </motion.div>
  );
});

ArcCard.displayName = "ArcCard";

export default ArcCard;
