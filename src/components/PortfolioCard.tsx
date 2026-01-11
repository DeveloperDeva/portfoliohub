import { motion } from "framer-motion";

interface PortfolioCardProps {
  image: string;
  title: string;
  category: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const PortfolioCard = ({
  image,
  title,
  category,
  index,
  isSelected,
  onClick,
}: PortfolioCardProps) => {
  return (
    <motion.div
      className="portfolio-card flex-shrink-0 w-[200px] h-[280px] md:w-[240px] md:h-[340px] lg:w-[280px] lg:h-[400px] relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
      layoutId={`card-${index}`}
    >
      {/* Card glow effect on hover */}
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      {/* Main card */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-card">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="portfolio-card-image absolute inset-0 w-full h-full"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
        
        {/* Reflection effect */}
        <div className="card-reflection" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
            {category}
          </p>
          <h3 className="text-sm md:text-base font-display font-semibold text-foreground">
            {title}
          </h3>
        </div>
        
        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/50 transition-colors duration-300" />
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
