"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import MultiSelectTags from "@/components/MultiSelectTags";
import { useTranslation } from "react-i18next";
import { cleanTagForStorage } from "@/utils/i18nUtils";
import { Button } from "@/components/ui/button"; // Import Button component
import RichTextEditor from "@/components/RichTextEditor"; // Import RichTextEditor

interface BlogPostFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  excerpt: string;
  setExcerpt: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  formCreatedAt: Date | undefined;
  setFormCreatedAt: (date: Date | undefined) => void;
  allPossibleTags: string[];
  categories: string[]; // New prop for dynamic categories
}

const BlogPostFormFields: React.FC<BlogPostFormFieldsProps> = ({
  title,
  setTitle,
  excerpt,
  setExcerpt,
  content,
  setContent,
  category,
  setCategory,
  author,
  setAuthor,
  selectedTags,
  setSelectedTags,
  formCreatedAt,
  setFormCreatedAt,
  allPossibleTags,
  categories, // Use dynamic categories
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="title">{t('title label')}</Label>
        <Input
          id="title"
          type="text"
          placeholder={t('title placeholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="excerpt">{t('excerpt label')}</Label>
        <Textarea
          id="excerpt"
          placeholder={t('excerpt placeholder')}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 min-h-[80px]"
        />
      </div>
      <div>
        <Label htmlFor="content">{t('content label')}</Label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder={t('content placeholder')}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="category">{t('category label')}</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={t('select category placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="author">{t('author label')}</Label>
        <Input
          id="author"
          type="text"
          placeholder={t('author placeholder')}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="tags">{t('tags label')}</Label>
        <MultiSelectTags
          initialTags={selectedTags}
          onTagsChange={setSelectedTags}
          allAvailableTags={allPossibleTags}
        />
        <p className="text-sm text-muted-foreground mt-1">
          {t('tags hint')}
        </p>
      </div>
      <div>
        <Label htmlFor="created_at">{t('created at label')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
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
    </>
  );
};

export default BlogPostFormFields;