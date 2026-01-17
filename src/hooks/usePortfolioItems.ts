import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PortfolioItem } from "@/components/ArcCard";

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
      const items: PortfolioItem[] = (data || []).map((item) => ({
        id: item.id,
        media: item.media_url,
        type: item.media_type as "image" | "video",
        title: item.title,
        category: item.category,
        poster: item.thumbnail_url || undefined,
        description: item.description || undefined,
      }));

      return items;
    },
  });
};
