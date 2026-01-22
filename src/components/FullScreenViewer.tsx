import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from "lucide-react";
import type { PortfolioItem } from "./ArcCard";

interface FullScreenViewerProps {
  isOpen: boolean;
  item: PortfolioItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalItems: number;
}

const FullScreenViewer = ({
  isOpen,
  item,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalItems,
}: FullScreenViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset video state when item changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [item?.id]);

  // Auto-play video when modal opens and item is a video
  useEffect(() => {
    if (isOpen && item?.type === "video" && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay might be blocked, user can click to play
      });
    }
  }, [isOpen, item?.type, item?.id]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    if (isOpen) resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, resetControlsTimeout]);

  // Video controls
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    resetControlsTimeout();
  }, [isPlaying, resetControlsTimeout]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(prog);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseMove={resetControlsTimeout}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${item.title}`}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#030303] backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Navigation - Previous */}
          <motion.button
            className="absolute left-4 md:left-8 z-10 p-3 rounded-full glass-card hover:glow-primary transition-all"
            onClick={onPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: showControls ? 1 : 0, x: 0 }}
            aria-label="Previous item"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Navigation - Next */}
          <motion.button
            className="absolute right-4 md:right-8 z-10 p-3 rounded-full glass-card hover:glow-primary transition-all"
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: showControls ? 1 : 0, x: 0 }}
            aria-label="Next item"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-3 rounded-full glass-card hover:glow-primary transition-all"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showControls ? 1 : 0, y: 0 }}
            aria-label="Close viewer"
          >
            <X className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Counter */}
          <motion.div
            className="absolute top-4 left-4 md:top-8 md:left-8 z-10 px-4 py-2 rounded-full glass-card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showControls ? 1 : 0, y: 0 }}
          >
            <span className="text-sm text-foreground font-medium">
              {currentIndex + 1} / {totalItems}
            </span>
          </motion.div>

          {/* Content container */}
          <motion.div
            layoutId={`card-${item.id}`}
            className="relative z-10 w-full max-w-6xl mx-4 md:mx-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Ambient glow - Ultra Premium */}
            <div className="absolute -inset-10 rounded-3xl bg-indigo-500/20 blur-[100px] opacity-40 animate-pulse-glow" />

            {/* Browser frame */}
            <div className="relative browser-frame shadow-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]">
              {/* Browser header */}
              <div className="browser-header border-b border-border/50">
                <div className="flex gap-2">
                  <div className="browser-dot bg-red-500/80" />
                  <div className="browser-dot bg-yellow-500/80" />
                  <div className="browser-dot bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-background/50 text-xs text-muted-foreground">
                    {item.title.toLowerCase().replace(/\s+/g, "-")}.com
                  </div>
                </div>
                {/* View Live Site Button */}
                {item.website_url && (
                  <a
                    href={item.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 text-xs text-indigo-300 font-semibold flex items-center gap-1 transition-all hover:scale-105"
                  >
                    <span>Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Media content */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                {item.type === "image" ? (
                  <motion.img
                    key={item.id}
                    src={item.media}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={item.media}
                      poster={item.poster}
                      className="w-full h-full object-cover object-top"
                      muted={isMuted}
                      loop
                      playsInline
                      autoPlay
                      onTimeUpdate={handleTimeUpdate}
                      onClick={togglePlay}
                    />

                    {/* Video controls overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: !isPlaying || showControls ? 1 : 0 }}
                      onClick={togglePlay}
                    >
                      {!isPlaying && (
                        <motion.div
                          className="p-6 rounded-full bg-background/60 backdrop-blur-sm cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-12 h-12 text-primary fill-primary" />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Video controls bar */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
                    >
                      {/* Progress bar */}
                      <div
                        ref={progressRef}
                        className="w-full h-1 bg-muted rounded-full cursor-pointer mb-3 group"
                        onClick={handleSeek}
                      >
                        <div
                          className="h-full bg-primary rounded-full relative transition-all"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-foreground" />
                            ) : (
                              <Play className="w-5 h-5 text-foreground fill-foreground" />
                            )}
                          </button>
                          <button
                            onClick={toggleMute}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? (
                              <VolumeX className="w-5 h-5 text-foreground" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-foreground" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={handleFullscreen}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          aria-label="Fullscreen"
                        >
                          <Maximize className="w-5 h-5 text-foreground" />
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Footer info */}
              <motion.div
                className="p-4 border-t border-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mt-40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <p className="text-sm text-primary font-medium uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                    {item.title}
                  </h2>
                </div>
                {item.website_url ? (
                  <a
                    href={item.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-glow text-sm px-6 py-2 whitespace-nowrap inline-flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    View Live Site
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    className="btn-outline-glow text-sm px-6 py-2 whitespace-nowrap opacity-50 cursor-not-allowed"
                    disabled
                  >
                    View Live Site
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Dot indicators */}
          <motion.div
            className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showControls ? 1 : 0, y: 0 }}
          >
            {Array.from({ length: totalItems }).map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/50 hover:bg-muted-foreground"
                  }`}
                aria-label={`Go to item ${i + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenViewer;
