import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import PortfolioGridCard from "./PortfolioGridCard";
import EmptyPortfolioState from "./EmptyPortfolioState";
import type { PortfolioItem } from "@/components/ArcCard";

interface PortfolioGridProps {
    items: PortfolioItem[];
    isLoading: boolean;
    onItemClick: (item: PortfolioItem, index: number) => void;
    onResetFilters: () => void;
    hasActiveFilters: boolean;
}

const PortfolioGrid = ({
    items,
    isLoading,
    onItemClick,
    onResetFilters,
    hasActiveFilters,
}: PortfolioGridProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="aspect-[4/3] rounded-2xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyPortfolioState onReset={onResetFilters} hasFilters={hasActiveFilters} />;
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.05,
                    },
                },
            }}
        >
            {items.map((item, index) => (
                <PortfolioGridCard
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => onItemClick(item, index)}
                />
            ))}
        </motion.div>
    );
};

export default PortfolioGrid;
