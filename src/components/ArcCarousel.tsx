import { useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArcCard, { type PortfolioItem } from "./ArcCard";
import FullScreenViewer from "./FullScreenViewer";
import { useArcCarousel } from "@/hooks/useArcCarousel";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";

import photographerImg from "@/assets/portfolio-photographer.jpg";
import startupImg from "@/assets/portfolio-startup.jpg";
import weddingImg from "@/assets/portfolio-wedding.jpg";
import personalImg from "@/assets/portfolio-personal.jpg";
import gymImg from "@/assets/portfolio-gym.jpg";
import agencyImg from "@/assets/portfolio-agency.jpg";

const portfolioItems: PortfolioItem[] = [
  {
    id: "photographer",
    media: photographerImg,
    type: "image",
    title: "Sophia Laurent",
    category: "Photography Portfolio",
  },
  {
    id: "startup",
    media: startupImg,
    type: "image",
    title: "Nexus AI",
    category: "Startup Landing",
  },
  {
    id: "wedding",
    media: weddingImg,
    type: "image",
    title: "Eternal Moments",
    category: "Wedding Studio",
  },
  {
    id: "personal",
    media: personalImg,
    type: "image",
    title: "Marcus Chen",
    category: "Personal Brand",
  },
  {
    id: "gym",
    media: gymImg,
    type: "image",
    title: "Iron Peak Fitness",
    category: "Gym Website",
  },
  {
    id: "agency",
    media: agencyImg,
    type: "image",
    title: "Stellar Creative",
    category: "Digital Agency",
  },
];

const ArcCarousel = () => {
  const itemCount = portfolioItems.length;
  
  // Responsive item width
  const getItemWidth = () => {
    if (typeof window === "undefined") return 280;
    if (window.innerWidth < 640) return 220;
    if (window.innerWidth < 1024) return 260;
    return 300;
  };

  const itemWidth = useMemo(getItemWidth, []);
  const arcRadius = useMemo(() => Math.min(800, window.innerWidth * 0.8), []);

  const {
    isDragging,
    containerRef,
    handlers,
    getCardTransform,
    scrollToIndex,
  } = useArcCarousel({
    itemCount,
    itemWidth,
    arcRadius,
    friction: 0.92,
  });

  const {
    selectedIndex,
    isOpen,
    openPreview,
    closePreview,
    goToNext,
    goToPrev,
  } = usePreviewNavigation({ itemCount });

  // Keyboard navigation for carousel (when preview is closed)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) return; // Preview handles its own keyboard
      if (e.key === "ArrowLeft") {
        scrollToIndex(Math.max(0, Math.floor(itemCount / 2) - 1));
      } else if (e.key === "ArrowRight") {
        scrollToIndex(Math.min(itemCount - 1, Math.floor(itemCount / 2) + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, scrollToIndex, itemCount]);

  // Handle card click
  const handleCardClick = useCallback((index: number) => {
    if (isDragging) return;
    scrollToIndex(index);
    openPreview(index);
  }, [isDragging, scrollToIndex, openPreview]);

  // Nav button handlers
  const handlePrev = useCallback(() => {
    const centerIndex = Math.floor(itemCount / 2);
    scrollToIndex(Math.max(0, centerIndex - 1));
  }, [scrollToIndex, itemCount]);

  const handleNext = useCallback(() => {
    const centerIndex = Math.floor(itemCount / 2);
    scrollToIndex(Math.min(itemCount - 1, centerIndex + 1));
  }, [scrollToIndex, itemCount]);

  const selectedItem = selectedIndex !== null ? portfolioItems[selectedIndex] : null;

  return (
    <div className="relative w-full">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Navigation buttons */}
      <motion.button
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:glow-primary transition-all duration-300"
        onClick={handlePrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </motion.button>

      <motion.button
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:glow-primary transition-all duration-300"
        onClick={handleNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </motion.button>

      {/* Arc container */}
      <div
        ref={containerRef}
        className="relative h-[350px] md:h-[420px] lg:h-[500px] overflow-hidden select-none"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        {...handlers}
        role="region"
        aria-label="Portfolio carousel"
        aria-roledescription="carousel"
      >
        {/* Cards stage */}
        <div 
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {portfolioItems.map((item, index) => {
            const cardStyle = getCardTransform(index);
            return (
              <ArcCard
                key={item.id}
                item={item}
                index={index}
                style={cardStyle}
                isSelected={selectedIndex === index}
                onClick={() => handleCardClick(index)}
              />
            );
          })}
        </div>
      </div>

      {/* Full screen viewer */}
      <FullScreenViewer
        isOpen={isOpen}
        item={selectedItem}
        onClose={closePreview}
        onNext={goToNext}
        onPrev={goToPrev}
        currentIndex={selectedIndex ?? 0}
        totalItems={itemCount}
      />
    </div>
  );
};

export default ArcCarousel;
