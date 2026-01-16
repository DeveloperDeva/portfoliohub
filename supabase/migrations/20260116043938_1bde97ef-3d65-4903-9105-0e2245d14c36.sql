-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('photographer', 'business', 'personal', 'agency')),
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  thumbnail_url TEXT,
  media_url TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on portfolio_items
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for portfolio_items
CREATE POLICY "Anyone can view published portfolio items"
ON public.portfolio_items
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all portfolio items"
ON public.portfolio_items
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert portfolio items"
ON public.portfolio_items
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio items"
ON public.portfolio_items
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio items"
ON public.portfolio_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add tags column to blog_posts if not exists
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update blog_posts RLS to allow admin full access
CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for portfolio_items updated_at
CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for portfolio media
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true);

-- Storage policies for portfolio media
CREATE POLICY "Anyone can view portfolio media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admins can upload portfolio media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));