import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
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

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const featuredPost = posts?.find((p) => p.is_featured);
  const regularPosts = posts?.filter((p) => !p.is_featured);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium uppercase tracking-wider text-sm">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6">
              Insights & Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips, tutorials, and insights to help you create a website that
              stands out and converts visitors into clients.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              All Posts
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                className="px-4 py-2 rounded-full glass-card text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {label}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <Link to={`/blog/${featuredPost.slug}`} className="block group">
                    <div className="glass-card overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="aspect-video lg:aspect-auto">
                          <img
                            src={featuredPost.featured_image || "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800"}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                              Featured
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {categoryLabels[featuredPost.category]}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                            {featuredPost.title}
                          </h2>
                          <p className="text-muted-foreground mb-6">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(featuredPost.published_at || featuredPost.created_at)}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {featuredPost.read_time_minutes} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Regular Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts?.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to={`/blog/${post.slug}`} className="block group h-full">
                      <article className="glass-card overflow-hidden h-full flex flex-col">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featured_image || "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <span className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
                            {categoryLabels[post.category]}
                          </span>
                          <h3 className="text-lg font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.read_time_minutes} min
                            </span>
                            <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg mb-4">
                No blog posts yet. Check back soon!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary font-medium"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Home
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
