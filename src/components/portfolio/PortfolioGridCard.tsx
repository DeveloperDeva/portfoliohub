import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { PortfolioItem } from "@/components/ArcCard";

interface PortfolioGridCardProps {
    item: PortfolioItem;
    index: number;
    onClick: () => void;
}

const PortfolioGridCard = ({ item, index, onClick }: PortfolioGridCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${item.title} project`}
        >
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/20">
                {/* Thumbnail */}
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    {item.type === "image" ? (
                        <img
                            src={item.poster || item.media}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <>
                            <img
                                src={item.poster || item.media}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-black fill-black ml-1" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                        {item.category}
                    </p>
                    <h3 className="text-xl font-display font-bold mb-2 line-clamp-2">
                        {item.title}
                    </h3>
                    {item.description && (
                        <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/50" />
                </div>
            </div>
        </motion.div>
    );
};

export default PortfolioGridCard;
