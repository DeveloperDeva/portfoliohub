import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { PortfolioItem } from "@/components/ArcCard";

export interface PortfolioFilters {
    category: string;
    techStack: string;
    searchQuery: string;
}

export const usePortfolioFilters = (items: PortfolioItem[]) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState<PortfolioFilters>({
        category: searchParams.get("category") || "all",
        techStack: "all",
        searchQuery: "",
    });

    // Sync state with URL params on mount and change
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam && categoryParam !== filters.category) {
            setFilters(prev => ({ ...prev, category: categoryParam }));
        }
    }, [searchParams]);

    // Extract unique tech stacks from all items
    const availableTechStacks = useMemo(() => {
        const techSet = new Set<string>();
        items.forEach((item) => {
            // Assuming tech_stack is stored in description or we need to add it to the interface
            // For now, we'll return empty array since tech_stack isn't in current PortfolioItem interface
        });
        return Array.from(techSet);
    }, [items]);

    // Filter items based on current filters
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // Category filter
            if (filters.category !== "all" && item.category.toLowerCase() !== filters.category.toLowerCase()) {
                return false;
            }

            // Search filter (searches title, description, category)
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const matchesTitle = item.title.toLowerCase().includes(query);
                const matchesDescription = item.description?.toLowerCase().includes(query);
                const matchesCategory = item.category.toLowerCase().includes(query);

                if (!matchesTitle && !matchesDescription && !matchesCategory) {
                    return false;
                }
            }

            return true;
        });
    }, [items, filters]);

    const setCategory = (category: string) => {
        setFilters((prev) => ({ ...prev, category }));

        // Update URL
        setSearchParams(prev => {
            if (category === "all") {
                prev.delete("category");
            } else {
                prev.set("category", category);
            }
            return prev;
        }, { replace: true });
    };

    const setTechStack = (techStack: string) => {
        setFilters((prev) => ({ ...prev, techStack }));
    };

    const setSearchQuery = (searchQuery: string) => {
        setFilters((prev) => ({ ...prev, searchQuery }));
    };

    const resetFilters = () => {
        setFilters({
            category: "all",
            techStack: "all",
            searchQuery: "",
        });
    };

    const hasActiveFilters = filters.category !== "all" || filters.techStack !== "all" || filters.searchQuery !== "";

    return {
        filters,
        filteredItems,
        availableTechStacks,
        setCategory,
        setTechStack,
        setSearchQuery,
        resetFilters,
        hasActiveFilters,
    };
};
