import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PortfolioCard from "./PortfolioCard";
import ExpandedPreview from "./ExpandedPreview";

import photographerImg from "@/assets/portfolio-photographer.jpg";
import startupImg from "@/assets/portfolio-startup.jpg";
import weddingImg from "@/assets/portfolio-wedding.jpg";
import personalImg from "@/assets/portfolio-personal.jpg";
import gymImg from "@/assets/portfolio-gym.jpg";
import agencyImg from "@/assets/portfolio-agency.jpg";

const portfolioItems = [
  {
    image: photographerImg,
    title: "Sophia Laurent",
    category: "Photography Portfolio",
  },
  {
    image: startupImg,
    title: "Nexus AI",
    category: "Startup Landing",
  },
  {
    image: weddingImg,
    title: "Eternal Moments",
    category: "Wedding Studio",
  },
  {
    image: personalImg,
    title: "Marcus Chen",
    category: "Personal Brand",
  },
  {
    image: gymImg,
    title: "Iron Peak Fitness",
    category: "Gym Website",
  },
  {
    image: agencyImg,
    title: "Stellar Creative",
    category: "Digital Agency",
  },
];

const Carousel = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 320;
      const newPosition = direction === "left" 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const selectedItem = selectedIndex !== null ? portfolioItems[selectedIndex] : null;

  return (
    <div className="relative w-full">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Navigation buttons */}
      <motion.button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:glow-primary transition-all duration-300"
        onClick={() => scroll("left")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </motion.button>

      <motion.button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-card hover:glow-primary transition-all duration-300"
        onClick={() => scroll("right")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </motion.button>

      {/* Cards container */}
      <div
        ref={containerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar py-8 px-8 md:px-16"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {portfolioItems.map((item, index) => (
          <div key={index} style={{ scrollSnapAlign: "center" }}>
            <PortfolioCard
              {...item}
              index={index}
              isSelected={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>

      {/* Expanded preview modal */}
      {selectedItem && (
        <ExpandedPreview
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          image={selectedItem.image}
          title={selectedItem.title}
          category={selectedItem.category}
          index={selectedIndex!}
        />
      )}
    </div>
  );
};

export default Carousel;
