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
  // Theater Mode Configuration
  // Theater Mode Configuration
  arcRadius = 2000, // Flatter, wider arc
  friction = 0.95,  // Smoother momentum
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

  // No Clamp for Infinite Scroll
  const clamp = useCallback((value: number) => {
    return value; // Infinite!
  }, []);

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
  const isDownRef = useRef(false);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    isDownRef.current = true;
    dragStartXRef.current = e.clientX;
    scrollStartRef.current = scrollX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  }, [scrollX]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDownRef.current) return;

    const currentX = e.clientX;
    const totalDelta = Math.abs(currentX - dragStartXRef.current);

    if (!isDragging && totalDelta > 15) {
      setIsDragging(true);
    }

    if (isDragging || totalDelta > 15) {
      const deltaX = currentX - dragStartXRef.current;
      const newVelocity = currentX - lastXRef.current;
      velocityRef.current = newVelocity;
      lastXRef.current = currentX;

      setScrollX(clamp(scrollStartRef.current + deltaX));
    }
  }, [isDragging, clamp]);

  const handleMouseUp = useCallback(() => {
    isDownRef.current = false;
    if (isDragging) {
      setIsDragging(false);
      animationRef.current = requestAnimationFrame(animateMomentum);
    }
  }, [isDragging, animateMomentum]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    isDownRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    scrollStartRef.current = scrollX;
    lastXRef.current = e.touches[0].clientX;
    velocityRef.current = 0;
  }, [scrollX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDownRef.current) return;

    const currentX = e.touches[0].clientX;
    const totalDelta = Math.abs(currentX - dragStartXRef.current);

    if (!isDragging && totalDelta > 15) {
      setIsDragging(true);
    }

    if (isDragging || totalDelta > 15) {
      const deltaX = currentX - dragStartXRef.current;
      const newVelocity = currentX - lastXRef.current;
      velocityRef.current = newVelocity;
      lastXRef.current = currentX;

      setScrollX(clamp(scrollStartRef.current + deltaX));
    }
  }, [isDragging, clamp]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    isDownRef.current = false;
    if (isDragging) {
      setIsDragging(false);
      animationRef.current = requestAnimationFrame(animateMomentum);
    }
  }, [isDragging, animateMomentum]);

  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (isDragging || isHovered) return;

    let animationId: number;
    const autoScrollSpeed = 0.5; // Pixels per frame

    const animate = () => {
      setScrollX((prev) => prev + autoScrollSpeed);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isDragging, isHovered]);


  // Keyboard navigation & Click scrolling
  const scrollToIndex = useCallback((index: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const totalCircumference = itemCount * itemWidth;
    const rawOffset = (index * itemWidth) - scrollX;

    // Find shortest path to center (0)
    let wrappedOffset = ((rawOffset % totalCircumference) + totalCircumference) % totalCircumference;
    if (wrappedOffset > totalCircumference / 2) {
      wrappedOffset -= totalCircumference;
    }

    // We want to force the item to the center (offset 0).
    // Current Offset is `wrappedOffset`.
    // So we need to ADD `wrappedOffset` to scrollX to move the "camera" to the item.
    // Explanation: NewOffset = ItemPos - NewScrollX => 0 = ItemPos - (ScrollX + shift) 
    // => shift = ItemPos - ScrollX = wrappedOffset.

    // However, since we scroll the CAMERA, if item is at +100, we need to move camera +100.
    const targetScroll = scrollX + wrappedOffset;

    // Animate to position
    const startScroll = scrollX;
    const distance = targetScroll - startScroll;
    const duration = 600; // Slower, smoother move
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);

      setScrollX(startScroll + distance * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [itemCount, itemWidth, scrollX]);

  // Calculate card transform based on position
  const getCardTransform = useCallback((index: number) => {
    const totalCircumference = itemCount * itemWidth;

    // Calculate raw position relative to scroll
    // We offset by (itemCount/2) * itemWidth to center the visual ring 0 at the front
    const rawOffset = (index * itemWidth) - scrollX;

    // Circular Wrapping Logic:
    // 1. Modulo to range [0, total]
    // 2. Shift to range [-total/2, total/2] so items wrap around the back

    let wrappedOffset = ((rawOffset % totalCircumference) + totalCircumference) % totalCircumference;
    if (wrappedOffset > totalCircumference / 2) {
      wrappedOffset -= totalCircumference;
    }

    const offset = wrappedOffset;

    // Normalize offset for arc calculation
    const normalizedOffset = offset / (itemWidth * 2.5); // Spread out the effect

    const absOffset = Math.abs(normalizedOffset);

    // 3D Arc Logic
    const rotateY = normalizedOffset * 25; // Gentler rotation
    const translateZ = -Math.abs(normalizedOffset) * 200; // Deep z-push

    // Cinematic Style Math
    const scale = Math.max(0.8, 1 - absOffset * 0.1); // Subtle shrink
    const opacity = Math.max(0, 1 - absOffset * 0.5); // Fast fade for focus
    const blur = Math.min(10, absOffset * 6); // Blur as it moves away
    const brightness = Math.max(0.4, 1 - absOffset * 0.4); // Dim as it moves away
    const zIndex = Math.round(100 - absOffset * 10);

    // Hide items that are too far back to prevent rendering artifacts/clutter
    const isVisible = absOffset < 4;

    return {
      transform: `translateX(${offset}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
      opacity: isVisible ? opacity : 0,
      filter: `blur(${blur}px) brightness(${brightness})`, // The cinematic touch
      zIndex,
      visibility: (isVisible ? "visible" : "hidden") as "visible" | "hidden",
    };
  }, [itemCount, itemWidth, scrollX]);

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
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => {
        handleMouseUp();
        setIsHovered(false);
      },
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    getCardTransform,
    scrollToIndex,
  };
};
