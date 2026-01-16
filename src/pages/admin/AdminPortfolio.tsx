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
  Image as ImageIcon
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

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  media_type: string;
  thumbnail_url: string | null;
  media_url: string;
  description: string | null;
  tech_stack: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const categories = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
  { value: 'agency', label: 'Agency' },
];

const AdminPortfolio = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'photographer',
    media_type: 'image',
    thumbnail_url: '',
    media_url: '',
    description: '',
    tech_stack: '',
    status: 'draft',
  });

  // Check for action params
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'new') {
      setIsFormOpen(true);
      setEditingItem(null);
      resetForm();
    } else if (editId) {
      // Will be handled by query
    }
  }, [searchParams]);

  // Fetch portfolio items
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PortfolioItem[];
    },
  });

  // Handle edit param
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && portfolioItems) {
      const item = portfolioItems.find((p) => p.id === editId);
      if (item) {
        setEditingItem(item);
        setFormData({
          title: item.title,
          category: item.category,
          media_type: item.media_type,
          thumbnail_url: item.thumbnail_url || '',
          media_url: item.media_url,
          description: item.description || '',
          tech_stack: item.tech_stack?.join(', ') || '',
          status: item.status,
        });
        setIsFormOpen(true);
      }
    }
  }, [searchParams, portfolioItems]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('portfolio_items')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-count'] });
      toast.success('Portfolio item created!');
      closeForm();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PortfolioItem> }) => {
      const { data: result, error } = await supabase
        .from('portfolio_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast.success('Portfolio item updated!');
      closeForm();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-count'] });
      toast.success('Portfolio item deleted!');
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'photographer',
      media_type: 'image',
      thumbnail_url: '',
      media_url: '',
      description: '',
      tech_stack: '',
      status: 'draft',
    });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    resetForm();
    setSearchParams({});
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'media_url' | 'thumbnail_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${field === 'thumbnail_url' ? 'thumbnails' : 'media'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
      toast.success('File uploaded!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      category: formData.category,
      media_type: formData.media_type,
      thumbnail_url: formData.thumbnail_url || null,
      media_url: formData.media_url,
      description: formData.description || null,
      tech_stack: formData.tech_stack ? formData.tech_stack.split(',').map((s) => s.trim()) : null,
      status: formData.status,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout title="Portfolio Management">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Manage your portfolio items displayed on the website.
        </p>
        <Button onClick={() => { setIsFormOpen(true); setEditingItem(null); resetForm(); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Portfolio list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : portfolioItems && portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {item.thumbnail_url || item.media_url ? (
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {/* Status badge */}
                <div
                  className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                    item.status === 'published'
                      ? 'bg-green-500/90 text-white'
                      : 'bg-yellow-500/90 text-black'
                  }`}
                >
                  {item.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">{item.category}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingItem(item);
                      setFormData({
                        title: item.title,
                        category: item.category,
                        media_type: item.media_type,
                        thumbnail_url: item.thumbnail_url || '',
                        media_url: item.media_url,
                        description: item.description || '',
                        tech_stack: item.tech_stack?.join(', ') || '',
                        status: item.status,
                      });
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(item.media_url, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No portfolio items yet</p>
          <Button className="mt-4" onClick={() => { setIsFormOpen(true); resetForm(); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Item
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
              className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">
                  {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
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
                    <Label htmlFor="media_type">Media Type *</Label>
                    <Select
                      value={formData.media_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, media_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Media upload */}
                <div className="space-y-2">
                  <Label>Media File *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      value={formData.media_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, media_url: e.target.value }))}
                      placeholder="Enter URL or upload file"
                      className="flex-1"
                    />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleFileUpload(e, 'media_url')}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Thumbnail upload */}
                <div className="space-y-2">
                  <Label>Thumbnail (optional)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                      placeholder="Enter URL or upload file"
                      className="flex-1"
                    />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                  <Input
                    id="tech_stack"
                    value={formData.tech_stack}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tech_stack: e.target.value }))}
                    placeholder="React, TypeScript, Tailwind"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving || !formData.title || !formData.media_url}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingItem ? (
                      'Update Item'
                    ) : (
                      'Create Item'
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
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this portfolio item? This action cannot be undone.
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

export default AdminPortfolio;
