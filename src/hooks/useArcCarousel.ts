import { useState, useRef, useCallback, useEffect } from "react";

interface UseArcCarouselOptions {
  itemCount: number;
  itemWidth: number;
  arcRadius: number;
  friction?: number;
}

export const useArcCarousel = ({
  itemCount,
  itemWidth,
  arcRadius,
  friction = 0.92,
}: UseArcCarouselOptions) => {
  const [scrollX, setScrollX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);

  const totalWidth = (itemCount - 1) * itemWidth;
  const maxScroll = totalWidth / 2;
  const minScroll = -totalWidth / 2;

  // Clamp scroll position
  const clamp = useCallback((value: number) => {
    return Math.max(minScroll, Math.min(maxScroll, value));
  }, [minScroll, maxScroll]);

  // Momentum animation
  const animateMomentum = useCallback(() => {
    if (Math.abs(velocityRef.current) > 0.5) {
      setScrollX((prev) => {
        const next = clamp(prev + velocityRef.current);
        velocityRef.current *= friction;
        return next;
      });
      animationRef.current = requestAnimationFrame(animateMomentum);
    } else {
      velocityRef.current = 0;
    }
  }, [clamp, friction]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    scrollStartRef.current = scrollX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  }, [scrollX]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartXRef.current;
    const newVelocity = e.clientX - lastXRef.current;
    velocityRef.current = newVelocity;
    lastXRef.current = e.clientX;
    
    setScrollX(clamp(scrollStartRef.current + deltaX));
  }, [isDragging, clamp]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    animationRef.current = requestAnimationFrame(animateMomentum);
  }, [isDragging, animateMomentum]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    scrollStartRef.current = scrollX;
    lastXRef.current = e.touches[0].clientX;
    velocityRef.current = 0;
  }, [scrollX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    const newVelocity = e.touches[0].clientX - lastXRef.current;
    velocityRef.current = newVelocity;
    lastXRef.current = e.touches[0].clientX;
    
    setScrollX(clamp(scrollStartRef.current + deltaX));
  }, [isDragging, clamp]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    animationRef.current = requestAnimationFrame(animateMomentum);
  }, [isDragging, animateMomentum]);

  // Wheel handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Use deltaX for horizontal scroll, fallback to deltaY for non-trackpad
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    velocityRef.current = -delta * 0.5;
    animationRef.current = requestAnimationFrame(animateMomentum);
  }, [animateMomentum]);

  // Keyboard navigation
  const scrollToIndex = useCallback((index: number) => {
    const centerIndex = (itemCount - 1) / 2;
    const targetScroll = (centerIndex - index) * itemWidth;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Animate to position
    const startScroll = scrollX;
    const distance = targetScroll - startScroll;
    const duration = 300;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      setScrollX(startScroll + distance * eased);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [itemCount, itemWidth, scrollX]);

  // Calculate card transform based on position
  const getCardTransform = useCallback((index: number) => {
    const centerIndex = (itemCount - 1) / 2;
    const offset = (index - centerIndex) * itemWidth - scrollX;
    
    // Normalize offset for arc calculation (reduce effect for visibility)
    const normalizedOffset = offset / (arcRadius * 2);
    const rotateY = normalizedOffset * 35; // Max 35 degree rotation
    const translateZ = -Math.abs(normalizedOffset) * 150; // Smaller depth
    const scale = 1 - Math.abs(normalizedOffset) * 0.1;
    const opacity = 1 - Math.abs(normalizedOffset) * 0.25;
    const zIndex = Math.round(100 - Math.abs(normalizedOffset) * 10);
    
    return {
      transform: `translateX(${offset}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${Math.max(0.75, scale)})`,
      opacity: Math.max(0.4, opacity),
      zIndex,
    };
  }, [itemCount, itemWidth, arcRadius, scrollX]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    scrollX,
    isDragging,
    containerRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onWheel: handleWheel,
    },
    getCardTransform,
    scrollToIndex,
  };
};
