"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";

interface BlogCategory {
  id: string;
  name: string;
}

const ManageBlogCategories: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BlogCategory | null>(null);
  const [formCategoryName, setFormCategoryName] = useState("");

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => {
      // Data fetching is handled by react-query's enabled option
    },
  });

  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useQuery<BlogCategory[], Error>({
    queryKey: ['blogCategoriesAdmin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticatedAndAuthorized,
  });

  const saveCategoryMutation = useMutation<void, Error, { id?: string; name: string }>({
    mutationFn: async (categoryData) => {
      if (categoryData.id) {
        const { error } = await supabase
          .from('blog_categories')
          .update({ name: categoryData.name })
          .eq('id', categoryData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_categories')
          .insert([{ name: categoryData.name }]);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogCategoriesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] }); // Invalidate public categories too
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] }); // Invalidate blog posts to update category names if needed
      toast.success(variables.id ? t("updated successfully") : t("added successfully"));
      setIsDialogOpen(false);
    },
    onError: (err) => {
      console.error("Error saving category:", err);
      toast.error(t("save failed", { error: err.message }));
    },
  });

  const deleteCategoryMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategoriesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] }); // Invalidate public categories too
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] }); // Invalidate blog posts to update category names if needed
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting category:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  useEffect(() => {
    if (!isAuthenticatedAndAuthorized) {
      return;
    }

    const channel = supabase
      .channel('blog_categories_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_categories' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['blogCategoriesAdmin'] });
          queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
          queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticatedAndAuthorized, queryClient]);

  const handleAddEdit = () => {
    if (!formCategoryName.trim()) {
      toast.error(t("category name required"));
      return;
    }
    saveCategoryMutation.mutate({
      id: currentCategory?.id,
      name: formCategoryName.trim(),
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t("confirm delete category"))) {
      return;
    }
    deleteCategoryMutation.mutate(id);
  };

  const openDialogForAdd = () => {
    setCurrentCategory(null);
    setFormCategoryName("");
    setIsDialogOpen(true);
  };

  const openDialogForEdit = (category: BlogCategory) => {
    setCurrentCategory(category);
    setFormCategoryName(category.name);
    setIsDialogOpen(true);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  if (isCategoriesLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isCategoriesError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: categoriesError?.message })}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('manage blog categories')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage blog categories subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={openDialogForAdd}>
          <PlusCircle className="h-4 w-4 mr-2" /> {t('add new category')}
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('category name')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(category)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(category.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no categories found')}</p>
      )}

      {saveCategoryMutation.isPending || deleteCategoryMutation.isPending ? (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
      ) : null}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentCategory ? t('edit category form') : t('add category form')}</DialogTitle>
            <DialogDescription>
              {currentCategory ? t('edit category form description') : t('add category form description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                {t('category name')}
              </Label>
              <Input
                id="categoryName"
                value={formCategoryName}
                onChange={(e) => setFormCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saveCategoryMutation.isPending}>
              {t('cancel button')}
            </Button>
            <Button onClick={handleAddEdit} disabled={saveCategoryMutation.isPending}>
              {saveCategoryMutation.isPending ? t('uploading status') : (currentCategory ? t('save changes button') : t('submit button'))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center mt-12">
        <Link to="/admin">
          <Button>{t('back to dashboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageBlogCategories;