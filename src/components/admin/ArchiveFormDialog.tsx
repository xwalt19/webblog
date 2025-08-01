"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import MultiSelectTags from "@/components/MultiSelectTags";
import { useTranslation } from "react-i18next";
// import { cleanTagForStorage } from "@/utils/i18nUtils"; // Removed unused import
import { toast } from "sonner"; // Import toast

interface ArchivePostFormData {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  tags: string[];
  pdfFile: File | null;
  createdAt: Date | undefined;
  initialPdfLink: string | null;
}

interface ArchiveFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ArchivePostFormData | null; // Data untuk mode edit
  onSave: (data: Omit<ArchivePostFormData, 'initialPdfLink'>) => Promise<void>;
  allPossibleTags: string[];
  MAX_PDF_SIZE_BYTES: number;
}

const ArchiveFormDialog: React.FC<ArchiveFormDialogProps> = ({
  isOpen,
  onOpenChange,
  initialData,
  onSave,
  allPossibleTags,
  MAX_PDF_SIZE_BYTES,
}) => {
  const { t } = useTranslation();

  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formCreatedAt, setFormCreatedAt] = useState<Date | undefined>(undefined);
  const [uploading, setUploading] = useState(false); // State untuk tombol submit

  const categories = [
    "Programming", "Technology", "Education", "Data Science", "Cybersecurity", "Mobile Development", "Cloud Computing", "History", "Retro Tech", "Programming History"
  ];

  useEffect(() => {
    if (initialData) {
      setFormTitle(initialData.title);
      setFormExcerpt(initialData.excerpt);
      setFormCategory(initialData.category);
      setFormAuthor(initialData.author);
      setSelectedTags(initialData.tags);
      setPdfFile(null); // Clear file input for edit, user must re-upload if changing
      setFormCreatedAt(initialData.createdAt);
    } else {
      // Reset form for new entry
      setFormTitle("");
      setFormExcerpt("");
      setFormCategory("");
      setFormAuthor("");
      setSelectedTags([]);
      setPdfFile(null);
      setFormCreatedAt(new Date()); // Default to current date for new
    }
    setUploading(false); // Reset upload status when dialog opens/changes data
  }, [initialData, isOpen]);

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_PDF_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '20MB' }));
        event.target.value = ''; // Clear the input
        setPdfFile(null);
        return;
      }
      setPdfFile(file);
    } else {
      setPdfFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!formTitle || !formExcerpt || !formCategory || !formAuthor || !formCreatedAt) {
      toast.error(t("required fields missing"));
      return;
    }

    if (!initialData?.initialPdfLink && !pdfFile) {
      toast.error(t("required fields missing")); // PDF file is required for new archives
      return;
    }

    setUploading(true);
    try {
      await onSave({
        id: initialData?.id,
        title: formTitle,
        excerpt: formExcerpt,
        category: formCategory,
        author: formAuthor,
        tags: selectedTags,
        pdfFile: pdfFile,
        createdAt: formCreatedAt,
      });
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      // Error handled by onSave in parent, just ensure loading state is reset
      console.error("Error in ArchiveFormDialog handleSubmit:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? t('edit archive form') : t('add archive form')}</DialogTitle>
          <DialogDescription>
            {initialData ? t('edit archive form description') : t('add archive form description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {t('title label')}
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
              {t('excerpt label')}
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
              {t('category label')}
            </Label>
            <select
              id="category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="col-span-3 p-2 border rounded-md bg-background text-foreground"
            >
              <option value="">{t('select category placeholder')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              {t('author label')}
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
              {t('tags label')}
            </Label>
            <div className="col-span-3">
              <MultiSelectTags
                initialTags={selectedTags}
                onTagsChange={setSelectedTags}
                allAvailableTags={allPossibleTags}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="created_at" className="text-right">
              {t('created at label')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !formCreatedAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formCreatedAt ? format(formCreatedAt, "PPP HH:mm") : <span>{t('pick date and time')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formCreatedAt}
                  onSelect={setFormCreatedAt}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <Label htmlFor="time-input" className="sr-only">{t('time')}</Label>
                  <Input
                    id="time-input"
                    type="time"
                    value={formCreatedAt ? format(formCreatedAt, "HH:mm") : ""}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      if (formCreatedAt) {
                        const newDate = new Date(formCreatedAt);
                        newDate.setHours(hours, minutes);
                        setFormCreatedAt(newDate);
                      } else {
                        const newDate = new Date();
                        newDate.setHours(hours, minutes);
                        setFormCreatedAt(newDate);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pdf-upload-dialog" className="text-right">
              {t('pdf file label')}
            </Label>
            <Input
              id="pdf-upload-dialog"
              type="file"
              accept="application/pdf"
              onChange={handlePdfFileChange}
              className="col-span-3"
            />
          </div>
          {initialData?.initialPdfLink && !pdfFile && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="col-span-1"></span>
              <p className="col-span-3 text-sm text-muted-foreground">
                {t('current pdf')}: <a href={initialData.initialPdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialData.initialPdfLink.split('/').pop()}</a>
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            {t('cancel button')}
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? t('uploading status') : (initialData ? t('save changes button') : t('submit button'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArchiveFormDialog;