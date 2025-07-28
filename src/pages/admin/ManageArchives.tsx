"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Edit, Trash, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArchivePost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null; // Can be null for archives
  category: string | null;
  author: string | null;
  tags: string[] | null;
  pdf_link: string | null;
}

const ManageArchives: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [archives, setArchives] = useState<ArchivePost[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentArchive, setCurrentArchive] = useState<ArchivePost | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formTagsInput, setFormTagsInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('auth.admin access required'));
        navigate('/');
      } else {
        fetchArchives();
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchArchives = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('pdf_link', 'is', null) // Only fetch posts with a PDF link
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setArchives(data || []);
    } catch (err: any) {
      console.error("Error fetching archives:", err);
      setError(t("manage archives.fetch error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    setUploadingFile(true);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      setUploadingFile(false);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    setUploadingFile(false);
    return publicUrlData.publicUrl;
  };

  const handleAddEdit = async () => {
    if (!formTitle || !formExcerpt || !formCategory || !formAuthor) {
      toast.error(t("manage archives.required fields missing"));
      return;
    }

    let newPdfLink = currentArchive?.pdf_link || null;
    if (pdfFile) {
      try {
        newPdfLink = await uploadFile(pdfFile, 'pdfs', 'blog_pdfs');
      } catch (err: any) {
        toast.error(t("manage archives.pdf upload error", { error: err.message }));
        return;
      }
    } else if (!currentArchive && !newPdfLink) {
      toast.error(t("manage archives.pdf file required"));
      return;
    }

    const tagsArray = formTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const archiveData = {
      title: formTitle,
      excerpt: formExcerpt,
      category: formCategory,
      author: formAuthor,
      tags: tagsArray,
      pdf_link: newPdfLink,
      created_at: currentArchive ? currentArchive.created_at : new Date().toISOString(),
      image_url: null, // Archives typically don't have images in this context
      content: null, // Archives typically don't have direct content in this context
    };

    if (currentArchive) {
      // Edit existing archive
      const { error } = await supabase
        .from('blog_posts')
        .update(archiveData)
        .eq('id', currentArchive.id);

      if (error) {
        console.error("Error updating archive:", error);
        toast.error(t("manage archives.update error", { error: error.message }));
      } else {
        toast.success(t("manage archives.archive updated successfully"));
        fetchArchives();
        setIsDialogOpen(false);
      }
    } else {
      // Add new archive
      const { error } = await supabase
        .from('blog_posts')
        .insert([archiveData]);

      if (error) {
        console.error("Error adding archive:", error);
        toast.error(t("manage archives.add error", { error: error.message }));
      } else {
        toast.success(t("manage archives.archive added successfully"));
        fetchArchives();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string, pdfLink: string | null) => {
    if (!window.confirm(t("manage archives.confirm delete"))) {
      return;
    }
    try {
      // Optionally delete the PDF file from storage if it exists
      if (pdfLink) {
        const filePath = pdfLink.split('/storage/v1/object/public/pdfs/')[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage.from('pdfs').remove([filePath]);
          if (storageError) {
            console.warn("Error deleting PDF from storage:", storageError);
            toast.warning(t("manage archives.storage delete warning", { error: storageError.message }));
          }
        }
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success(t("manage archives.archive deleted successfully"));
      fetchArchives();
    } catch (err: any) {
      console.error("Error deleting archive:", err);
      toast.error(t("manage archives.delete error", { error: err.message }));
    }
  };

  const openDialogForAdd = () => {
    setCurrentArchive(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormCategory("");
    setFormAuthor("");
    setFormTagsInput("");
    setPdfFile(null);
    const pdfInput = document.getElementById("pdf-upload-dialog") as HTMLInputElement;
    if (pdfInput) pdfInput.value = "";
    setIsDialogOpen(true);
  };

  const openDialogForEdit = (archive: ArchivePost) => {
    setCurrentArchive(archive);
    setFormTitle(archive.title);
    setFormExcerpt(archive.excerpt || "");
    setFormCategory(archive.category || "");
    setFormAuthor(archive.author || "");
    setFormTagsInput(archive.tags?.join(', ') || "");
    setPdfFile(null); // Clear file input for edit, user must re-upload if changing
    const pdfInput = document.getElementById("pdf-upload-dialog") as HTMLInputElement;
    if (pdfInput) pdfInput.value = "";
    setIsDialogOpen(true);
  };

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    } else {
      setPdfFile(null);
    }
  };

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categories = [
    "Programming", "Technology", "Education", "Data Science", "Cybersecurity", "Mobile Development", "Cloud Computing", "History", "Retro Tech", "Programming History"
  ];

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage archives.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage archives.subtitle')}
        </p>
      </section>

      <div className="flex justify-end mb-6">
        <Button onClick={openDialogForAdd}>{t('manage archives.add new archive')}</Button>
      </div>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('manage archives.loading archives')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : archives.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('manage archives.table title')}</TableHead>
                  <TableHead>{t('manage archives.table category')}</TableHead>
                  <TableHead>{t('manage archives.table date')}</TableHead>
                  <TableHead>{t('manage archives.table pdf link')}</TableHead>
                  <TableHead className="text-right">{t('manage archives.table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archives.map((archive) => (
                  <TableRow key={archive.id}>
                    <TableCell className="font-medium">{archive.title}</TableCell>
                    <TableCell>{archive.category}</TableCell>
                    <TableCell>{formatDisplayDate(archive.created_at)}</TableCell>
                    <TableCell>
                      {archive.pdf_link ? (
                        <a href={archive.pdf_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          <FileText className="h-4 w-4" /> {t('manage archives.view pdf')}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{t('manage archives.no pdf')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(archive)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(archive.id, archive.pdf_link)}>
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
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('manage archives.no archives')}</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentArchive ? t('manage archives.edit archive') : t('manage archives.add archive')}</DialogTitle>
            <DialogDescription>
              {currentArchive ? t('manage archives.edit archive desc') : t('manage archives.add archive desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t('manage archives.form title')}
              </Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="excerpt" className="text-right">
                {t('manage archives.form excerpt')}
              </Label>
              <Textarea
                id="excerpt"
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                className="col-span-3 min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                {t('manage archives.form category')}
              </Label>
              <select
                id="category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="col-span-3 p-2 border rounded-md bg-background text-foreground"
              >
                <option value="">{t('manage archives.select category')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                {t('manage archives.form author')}
              </Label>
              <Input
                id="author"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                {t('manage archives.form tags')}
              </Label>
              <Input
                id="tags"
                value={formTagsInput}
                onChange={(e) => setFormTagsInput(e.target.value)}
                placeholder={t('manage archives.tags placeholder')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pdf-upload-dialog" className="text-right">
                {t('manage archives.form pdf file')}
              </Label>
              <Input
                id="pdf-upload-dialog"
                type="file"
                accept="application/pdf"
                onChange={handlePdfFileChange}
                className="col-span-3"
              />
            </div>
            {currentArchive?.pdf_link && !pdfFile && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1"></span>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {t('manage archives.current pdf')}: <a href={currentArchive.pdf_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{currentArchive.pdf_link.split('/').pop()}</a>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('manage archives.cancel')}
            </Button>
            <Button onClick={handleAddEdit} disabled={uploadingFile}>
              {uploadingFile ? t('uploading') : (currentArchive ? t('manage archives.save changes') : t('manage archives.add archive button'))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageArchives;