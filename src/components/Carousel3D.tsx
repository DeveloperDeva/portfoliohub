import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioCard3D from "./PortfolioCard3D";
import ExpandedPreview3D from "./ExpandedPreview3D";

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
    color: "187 100% 60%",
  },
  {
    image: startupImg,
    title: "Nexus AI",
    category: "Startup Landing",
    color: "270 80% 65%",
  },
  {
    image: weddingImg,
    title: "Eternal Moments",
    category: "Wedding Studio",
    color: "340 80% 65%",
  },
  {
    image: personalImg,
    title: "Marcus Chen",
    category: "Personal Brand",
    color: "45 100% 60%",
  },
  {
    image: gymImg,
    title: "Iron Peak Fitness",
    category: "Gym Website",
    color: "142 70% 50%",
  },
  {
    image: agencyImg,
    title: "Stellar Creative",
    category: "Digital Agency",
    color: "210 100% 60%",
  },
];

const Carousel3D = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const itemCount = portfolioItems.length;
  const anglePerItem = 360 / itemCount;
  
  // Auto-rotation
  useEffect(() => {
    if (selectedIndex !== null || isHovering || isPaused) return;
    
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.15);
    }, 16);
    
    return () => clearInterval(interval);
  }, [selectedIndex, isHovering, isPaused]);
  
  // Get the index of the center card
  const getCenterIndex = useCallback(() => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const centerAngle = normalizedRotation;
    let closestIndex = 0;
    let minDiff = 360;
    
    for (let i = 0; i < itemCount; i++) {
      const itemAngle = (i * anglePerItem) % 360;
      let diff = Math.abs(centerAngle - itemAngle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [rotation, itemCount, anglePerItem]);
  
  const centerIndex = getCenterIndex();
  
  const handleCardClick = (index: number) => {
    if (index === centerIndex) {
      setSelectedIndex(index);
      setIsPaused(true);
    } else {
      // Rotate to bring this card to center
      const targetAngle = index * anglePerItem;
      const currentAngle = rotation % 360;
      let diff = targetAngle - currentAngle;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      setRotation(rotation + diff);
    }
  };
  
  const handleClose = () => {
    setSelectedIndex(null);
    setTimeout(() => setIsPaused(false), 500);
  };
  
  const selectedItem = selectedIndex !== null ? portfolioItems[selectedIndex] : null;

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] perspective-1200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Film grain overlay */}
      <div className="film-grain" />
      
      {/* Cinematic vignette */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
      </div>
      
      {/* 3D Carousel container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${-rotation}deg)`,
          }}
          animate={{
            rotateY: -rotation,
          }}
          transition={{
            type: "tween",
            duration: 0.016,
            ease: "linear",
          }}
        >
          {portfolioItems.map((item, index) => {
            const angle = index * anglePerItem;
            const radius = 400; // Distance from center
            
            // Calculate this card's position relative to center
            const relativeAngle = ((angle - (rotation % 360) + 540) % 360) - 180;
            const normalizedAngle = Math.abs(relativeAngle);
            
            // Depth and blur based on position
            const isCenter = normalizedAngle < anglePerItem / 2;
            const depthFactor = Math.cos((relativeAngle * Math.PI) / 180);
            const blur = isCenter ? 0 : Math.min(8, normalizedAngle / 15);
            const opacity = isCenter ? 1 : Math.max(0.3, 1 - normalizedAngle / 120);
            const scale = isCenter ? 1.1 : 0.85 + depthFactor * 0.1;
            const brightness = isCenter ? 1.1 : 0.6 + depthFactor * 0.2;
            
            return (
              <PortfolioCard3D
                key={index}
                {...item}
                index={index}
                angle={angle}
                radius={radius}
                blur={blur}
                opacity={opacity}
                scale={scale}
                brightness={brightness}
                isCenter={isCenter}
                isSelected={selectedIndex === index}
                onClick={() => handleCardClick(index)}
              />
            );
          })}
        </motion.div>
      </div>
      
      {/* Center focus indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex gap-2">
          {portfolioItems.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === centerIndex 
                  ? "bg-primary w-6" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => {
                const targetAngle = index * anglePerItem;
                const currentAngle = rotation % 360;
                let diff = targetAngle - currentAngle;
                if (diff > 180) diff -= 360;
                if (diff < -180) diff += 360;
                setRotation(rotation + diff);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Expanded preview */}
      <AnimatePresence>
        {selectedItem && (
          <ExpandedPreview3D
            isOpen={selectedIndex !== null}
            onClose={handleClose}
            image={selectedItem.image}
            title={selectedItem.title}
            category={selectedItem.category}
            index={selectedIndex!}
            color={selectedItem.color}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carousel3D;
