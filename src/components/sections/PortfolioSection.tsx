import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import FullScreenViewer from "@/components/FullScreenViewer";
import { usePortfolioItems } from "@/hooks/usePortfolioItems";
import { usePortfolioFilters } from "@/hooks/usePortfolioFilters";

const PortfolioSection = () => {
    const { data: items = [], isLoading } = usePortfolioItems();
    const {
        filters,
        filteredItems,
        setCategory,
        setSearchQuery,
        resetFilters,
        hasActiveFilters,
    } = usePortfolioFilters(items);

    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const handleItemClick = (item: any, index: number) => {
        // We need to find the index of the item in the *filtered* list or the *original* list?
        // Usually full screen viewer allows navigating through the current view.
        // So we should pass the filteredItems to the viewer basically, or mapping indices.
        // Let's assume we want to navigate through the filtered items.
        const filteredIndex = filteredItems.findIndex(i => i.id === item.id);
        setSelectedItemIndex(filteredIndex);
        setViewerOpen(true);
    };

    const handleNext = () => {
        setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
    };

    const handlePrev = () => {
        setSelectedItemIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };

    const currentItem = filteredItems[selectedItemIndex];

    return (
        <section id="portfolio" className="py-24 relative overflow-hidden bg-background">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Selected Work
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A curation of premium digital experiences crafted with precision and passion.
                    </p>
                </motion.div>

                {/* Filters */}
                <PortfolioFilters
                    selectedCategory={filters.category}
                    searchQuery={filters.searchQuery}
                    onCategoryChange={setCategory}
                    onSearchChange={setSearchQuery}
                    onReset={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Grid */}
                <PortfolioGrid
                    items={filteredItems}
                    isLoading={isLoading}
                    onItemClick={handleItemClick}
                    onResetFilters={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            </div>

            {/* Full Screen Viewer */}
            <AnimatePresence>
                {viewerOpen && currentItem && (
                    <FullScreenViewer
                        isOpen={viewerOpen}
                        item={currentItem}
                        onClose={() => setViewerOpen(false)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        currentIndex={selectedItemIndex}
                        totalItems={filteredItems.length}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioSection;
