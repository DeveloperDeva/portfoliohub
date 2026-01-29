import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Image, 
  FileText, 
  Plus, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  // Fetch portfolio count
  const { data: portfolioCount, isLoading: portfolioLoading } = useQuery({
    queryKey: ['admin-portfolio-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.error('Error fetching portfolio count:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch blog count
  const { data: blogCount, isLoading: blogLoading } = useQuery({
    queryKey: ['admin-blog-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.error('Error fetching blog count:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch recent items
  const { data: recentPortfolio } = useQuery({
    queryKey: ['admin-recent-portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id, title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) {
        console.error('Error fetching recent portfolio:', error);
        return [];
      }
      return data;
    },
  });

  const { data: recentBlogs } = useQuery({
    queryKey: ['admin-recent-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, created_at, is_published')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) {
        console.error('Error fetching recent blogs:', error);
        return [];
      }
      return data;
    },
  });

  const stats = [
    {
      label: 'Portfolio Items',
      value: portfolioCount,
      loading: portfolioLoading,
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
      href: '/admin/portfolio',
    },
    {
      label: 'Blog Posts',
      value: blogCount,
      loading: blogLoading,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      href: '/admin/blog',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={stat.href}
              className="block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {stat.loading ? (
                    <Skeleton className="h-9 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/admin/portfolio?action=new">
              <Plus className="w-4 h-4 mr-2" />
              Add Portfolio Item
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/blog?action=new">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Portfolio Items</h2>
          </div>
          {recentPortfolio && recentPortfolio.length > 0 ? (
            <ul className="space-y-3">
              {recentPortfolio.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <Link
                    to={`/admin/portfolio?edit=${item.id}`}
                    className="text-sm hover:text-primary transition-colors truncate flex-1"
                  >
                    {item.title}
                  </Link>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No portfolio items yet</p>
          )}
        </motion.div>

        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Blog Posts</h2>
          </div>
          {recentBlogs && recentBlogs.length > 0 ? (
            <ul className="space-y-3">
              {recentBlogs.map((post) => (
                <li key={post.id} className="flex items-center justify-between">
                  <Link
                    to={`/admin/blog?edit=${post.id}`}
                    className="text-sm hover:text-primary transition-colors truncate flex-1"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.is_published
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {post.is_published ? 'published' : 'draft'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No blog posts yet</p>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
