import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Facebook, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categoryLabels: Record<string, string> = {
  "portfolio-tips": "Portfolio Tips",
  "photographer-websites": "Photographer Websites",
  "business-websites": "Business Websites",
  "personal-branding": "Personal Branding",
  "ui-ux-insights": "UI/UX Insights",
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="aspect-video bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Post Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <span className="text-primary font-medium uppercase tracking-wider text-sm">
              {categoryLabels[post.category]}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                {post.author_avatar && (
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{post.author_name}</span>
              </div>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.read_time_minutes} min read
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share:
              </span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </motion.header>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-xl"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 text-center"
          >
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              Want a Website Like This?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let me create a stunning portfolio website that captures your unique
              style and converts visitors into clients.
            </p>
            <Link
              to="/#contact"
              className="btn-hero inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
