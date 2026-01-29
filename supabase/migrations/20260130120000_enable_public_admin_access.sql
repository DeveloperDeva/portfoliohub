-- Disable RLS on blog_posts for public admin access
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on blog_posts
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;

-- Add public access to blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create new policies allowing public admin access
CREATE POLICY "Allow public to view published blog posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "Allow public to manage blog posts (admin)"
ON public.blog_posts
FOR ALL
USING (true)
WITH CHECK (true);

-- Similarly update portfolio_items for public access
ALTER TABLE public.portfolio_items DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on portfolio_items
DROP POLICY IF EXISTS "Anyone can view published portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can view all portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can insert portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can update portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins can delete portfolio items" ON public.portfolio_items;

-- Add public access to portfolio_items
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create new policies allowing public admin access
CREATE POLICY "Allow public to view published portfolio items"
ON public.portfolio_items
FOR SELECT
USING (status = 'published');

CREATE POLICY "Allow public to manage portfolio items (admin)"
ON public.portfolio_items
FOR ALL
USING (true)
WITH CHECK (true);

-- Update storage policies to allow public access
DROP POLICY IF EXISTS "Admins can upload portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio media" ON storage.objects;

CREATE POLICY "Allow public to upload portfolio media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Allow public to update portfolio media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Allow public to delete portfolio media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-media');
