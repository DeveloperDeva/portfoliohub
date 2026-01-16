import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  X,
  Upload,
  Loader2,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string;
  author_name: string;
  author_avatar: string | null;
  read_time_minutes: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const categories = [
  { value: 'portfolio-tips', label: 'Portfolio Tips' },
  { value: 'photographer-websites', label: 'Photographer Websites' },
  { value: 'ui-ux-insights', label: 'UI/UX Insights' },
  { value: 'success-stories', label: 'Success Stories' },
];

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const AdminBlog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'portfolio-tips',
    author_name: 'PortfolioHub',
    author_avatar: '',
    read_time_minutes: 5,
    is_featured: false,
    is_published: false,
    tags: '',
  });

  // Check for action params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      setIsFormOpen(true);
      setEditingPost(null);
      resetForm();
    }
  }, [searchParams]);

  // Fetch blog posts
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  // Handle edit param
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && blogPosts) {
      const post = blogPosts.find((p) => p.id === editId);
      if (post) {
        setEditingPost(post);
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featured_image: post.featured_image || '',
          category: post.category,
          author_name: post.author_name,
          author_avatar: post.author_avatar || '',
          read_time_minutes: post.read_time_minutes,
          is_featured: post.is_featured,
          is_published: post.is_published,
          tags: post.tags?.join(', ') || '',
        });
        setIsFormOpen(true);
      }
    }
  }, [searchParams, blogPosts]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: result, error } = await supabase
        .from('blog_posts')
        .insert({
          ...data,
          published_at: data.is_published ? new Date().toISOString() : null,
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-count'] });
      toast.success('Blog post created!');
      closeForm();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const updateData = {
        ...data,
        published_at: data.is_published ? (editingPost?.published_at || new Date().toISOString()) : null,
      };
      const { data: result, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Blog post updated!');
      closeForm();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-count'] });
      toast.success('Blog post deleted!');
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: 'portfolio-tips',
      author_name: 'PortfolioHub',
      author_avatar: '',
      read_time_minutes: 5,
      is_featured: false,
      is_published: false,
      tags: '',
    });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
    resetForm();
    setSearchParams({});
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, featured_image: publicUrl }));
      toast.success('Image uploaded!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featured_image: formData.featured_image || null,
      category: formData.category,
      author_name: formData.author_name,
      author_avatar: formData.author_avatar || null,
      read_time_minutes: formData.read_time_minutes,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      tags: formData.tags ? formData.tags.split(',').map((s) => s.trim()) : null,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout title="Blog Management">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Manage your blog posts for SEO and authority building.
        </p>
        <Button onClick={() => { setIsFormOpen(true); setEditingPost(null); resetForm(); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Blog list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : blogPosts && blogPosts.length > 0 ? (
        <div className="space-y-4">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-24 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  {post.is_featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="capitalize">{post.category.replace('-', ' ')}</span>
                  <span>{post.read_time_minutes} min read</span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      post.is_published
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingPost(post);
                    setFormData({
                      title: post.title,
                      slug: post.slug,
                      excerpt: post.excerpt,
                      content: post.content,
                      featured_image: post.featured_image || '',
                      category: post.category,
                      author_name: post.author_name,
                      author_avatar: post.author_avatar || '',
                      read_time_minutes: post.read_time_minutes,
                      is_featured: post.is_featured,
                      is_published: post.is_published,
                      tags: post.tags?.join(', ') || '',
                    });
                    setIsFormOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteId(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No blog posts yet</p>
          <Button className="mt-4" onClick={() => { setIsFormOpen(true); resetForm(); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">
                  {editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="read_time">Read Time (minutes)</Label>
                    <Input
                      id="read_time"
                      type="number"
                      min={1}
                      value={formData.read_time_minutes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, read_time_minutes: parseInt(e.target.value) || 5 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content * (HTML/Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    required
                    className="font-mono text-sm"
                  />
                </div>

                {/* Featured image upload */}
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      value={formData.featured_image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                      placeholder="Enter URL or upload file"
                      className="flex-1"
                    />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        </span>
                      </Button>
                    </label>
                  </div>
                  {formData.featured_image && (
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className="w-full max-w-xs h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, author_name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="portfolio, design, tips"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="is_featured">Featured Post</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving || !formData.title || !formData.slug || !formData.excerpt || !formData.content}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingPost ? (
                      'Update Post'
                    ) : (
                      'Create Post'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlog;
