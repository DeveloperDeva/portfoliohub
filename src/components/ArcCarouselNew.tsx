import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import FullScreenViewer from "./FullScreenViewer";
import { usePortfolioItems } from "@/hooks/usePortfolioItems";
import { fallbackPortfolioItems } from "@/data/fallbackPortfolioItems";

const ArcCarouselNew = ({ onViewerOpenChange }: { onViewerOpenChange?: (isOpen: boolean) => void }) => {
  const { data: portfolioItems, isLoading, error } = usePortfolioItems();
  // usePortfolioItems now returns fallback items if DB is empty, but we can keep explicitly using fallbackPortfolioItems if we want to be safe or if hook behavior changes
  // Actually the hook ALREADY returns fallback items if db is empty (as per my change in Step 132).
  // So items will likely be populated.
  // But let's check hook implementation.
  // const dbItems = ...; return dbItems.length > 0 ? dbItems : fallbackPortfolioItems;
  // So portfolioItems will be fallbackPortfolioItems if DB is empty.
  // So I don't need to import fallbackPortfolioItems here basically?
  // Wait, if error happens, hook throws.

  // The original code was:
  // const items = portfolioItems && portfolioItems.length > 0 ? portfolioItems : fallbackItems;

  // Now simpler:
  const items = portfolioItems || fallbackPortfolioItems;

  const [centerIndex, setCenterIndex] = useState(Math.floor(items.length / 2));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync internal state with external prop
  useEffect(() => {
    onViewerOpenChange?.(isOpen);
  }, [isOpen, onViewerOpenChange]);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % items.length);
    }, 2000); // Rotate every 2 seconds - faster speed

    return () => clearInterval(interval);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handleCardClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(null);
  }, []);

  const handleNextPreview = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % items.length;
    });
  }, [items.length]);

  const handlePrevPreview = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + items.length) % items.length;
    });
  }, [items.length]);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[220px] h-[310px] rounded-2xl bg-white/10 backdrop-blur-md animate-pulse border border-white/20"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-xl">
          <ImageOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load portfolio items</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-xl">
          <ImageOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No portfolio items found</p>
        </div>
      </div>
    );
  }

  // Calculate card position in arc
  const getCardPosition = (itemIndex: number) => {
    const distance = (itemIndex - centerIndex + items.length) % items.length;
    const adjustedDistance =
      distance > items.length / 2 ? distance - items.length : distance;

    const arcRadius = 500; // Increased radius for wider arc
    const angleSpread = 50; // Increased angle spread for wider horizontal spread

    const angle = adjustedDistance * angleSpread;
    const angleRad = (angle * Math.PI) / 180;

    // Position on arc
    const x = Math.sin(angleRad) * arcRadius;
    const z = Math.cos(angleRad) * arcRadius - arcRadius;

    // Opacity and blur based on distance from center
    const absDistance = Math.abs(adjustedDistance);
    const opacity = Math.max(0.3, 1 - absDistance * 0.2);
    const blur = absDistance * 8;
    const scale = Math.max(0.8, 1 - absDistance * 0.15);

    return {
      x,
      z,
      opacity,
      blur,
      scale,
      isCenter: adjustedDistance === 0,
    };
  };

  return (
    <div className="relative w-full h-full">
      {/* Main carousel container */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center perspective">
        {/* Gradient overlays for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Cards container with 3D perspective */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, index) => {
            const position = getCardPosition(index);

            return (
              <motion.div
                key={item.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  width: "220px",
                  height: "310px",
                  marginLeft: "-110px",
                  marginTop: "-155px",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: position.x,
                  y: position.isCenter ? (isMobile ? -40 : -120) : 0,
                  opacity: position.opacity,
                  scale: position.scale,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                onClick={() => handleCardClick(index)}
              >
                {/* Card */}
                <div
                  className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-2xl group"
                  style={{
                    filter: `blur(${position.blur}px)`,
                  }}
                >
                  {/* Media - Image or Video */}
                  {item.type === "image" ? (
                    <img
                      src={item.media}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.media}
                      poster={item.poster}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  )}

                  {/* Cinematic vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-xs text-indigo-300 font-semibold uppercase tracking-widest mb-2">
                      {item.category}
                    </p>
                    <h3 className="text-lg font-bold leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Center card highlight glow */}
                  {position.isCenter && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]" />
                  )}

                  {/* Hover indicator for non-center cards */}
                  {!position.isCenter && (
                    <div className="absolute inset-0 rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        <motion.button
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous portfolio"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>

        <motion.button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next portfolio"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Preview modal */}
      {selectedItem && (
        <FullScreenViewer
          isOpen={isOpen}
          item={selectedItem}
          onClose={handleClosePreview}
          onNext={handleNextPreview}
          onPrev={handlePrevPreview}
          currentIndex={selectedIndex ?? 0}
          totalItems={items.length}
        />
      )}
    </div>
  );
};

export default ArcCarouselNew;
