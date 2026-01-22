import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPortfolioStateProps {
    onReset: () => void;
    hasFilters: boolean;
}

const EmptyPortfolioState = ({ onReset, hasFilters }: EmptyPortfolioStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 px-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
            >
                <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </motion.div>

            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                No Projects Found
            </h3>

            <p className="text-muted-foreground text-center max-w-md mb-6">
                {hasFilters
                    ? "We couldn't find any projects matching your filters. Try adjusting your search criteria."
                    : "No portfolio projects available at the moment."}
            </p>

            {hasFilters && (
                <Button onClick={onReset} variant="outline">
                    Clear Filters
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyPortfolioState;
