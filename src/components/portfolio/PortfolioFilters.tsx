import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PortfolioFiltersProps {
    selectedCategory: string;
    searchQuery: string;
    onCategoryChange: (category: string) => void;
    onSearchChange: (query: string) => void;
    onReset: () => void;
    hasActiveFilters: boolean;
}

const categories = [
    { value: "all", label: "All" },
    { value: "photographer", label: "Photographer" },
    { value: "business", label: "Business" },
    { value: "personal", label: "Personal" },
    { value: "agency", label: "Agency" },
];

const PortfolioFilters = ({
    selectedCategory,
    searchQuery,
    onCategoryChange,
    onSearchChange,
    onReset,
    hasActiveFilters,
}: PortfolioFiltersProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
        >
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <motion.button
                            key={category.value}
                            onClick={() => onCategoryChange(category.value)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.value
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                    : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-foreground"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Filter by ${category.label}`}
                            aria-pressed={selectedCategory === category.value}
                        >
                            {category.label}
                        </motion.button>
                    ))}
                </div>

                {/* Search and Reset */}
                <div className="flex gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4"
                            aria-label="Search portfolio projects"
                        />
                    </div>

                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onReset}
                                aria-label="Clear all filters"
                                className="shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PortfolioFilters;
