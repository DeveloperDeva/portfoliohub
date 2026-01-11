import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ExpandedPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  category: string;
  index: number;
}

const ExpandedPreview = ({
  isOpen,
  onClose,
  image,
  title,
  category,
  index,
}: ExpandedPreviewProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Expanded card container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-5xl pointer-events-auto"
              layoutId={`card-${index}`}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            >
              {/* Ambient glow */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-60" />
              
              {/* Browser frame */}
              <div className="relative browser-frame shadow-2xl">
                {/* Browser header */}
                <div className="browser-header border-b border-border/50">
                  <div className="flex gap-2">
                    <div className="browser-dot bg-red-500/80" />
                    <div className="browser-dot bg-yellow-500/80" />
                    <div className="browser-dot bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-full bg-background/50 text-xs text-muted-foreground">
                      {title.toLowerCase().replace(/\s+/g, '-')}.com
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-background/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Website preview */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-top"
                  />
                  
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                </div>

                {/* Footer info */}
                <motion.div
                  className="p-6 border-t border-border/50 flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div>
                    <p className="text-sm text-primary font-medium uppercase tracking-wider mb-1">
                      {category}
                    </p>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                      {title}
                    </h2>
                  </div>
                  <button className="btn-outline-glow text-sm px-6 py-2">
                    View Live Site
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPreview;
