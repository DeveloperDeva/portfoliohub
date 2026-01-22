-- RUN THIS IN YOUR SUPABASE/LOVABLE SQL EDITOR
-- This adds the necessary column for the "View Live Site" button functionality.

ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS website_url TEXT;
