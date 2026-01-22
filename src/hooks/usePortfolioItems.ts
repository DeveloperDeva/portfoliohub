import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PortfolioItem } from "@/components/ArcCard";
import { fallbackPortfolioItems } from "@/data/fallbackPortfolioItems";

export const usePortfolioItems = () => {
  return useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform database items to match PortfolioItem interface
      const dbItems: PortfolioItem[] = ((data as any[]) || []).map((item) => ({
        id: item.id,
        media: item.media_url,
        type: item.media_type as "image" | "video",
        title: item.title,
        category: item.category,
        poster: item.thumbnail_url || undefined,
        description: item.description || undefined,
        website_url: item.website_url || undefined,
      }));

      // Return database items if available, otherwise return fallback items
      return dbItems.length > 0 ? dbItems : fallbackPortfolioItems;
    },
  });
};
