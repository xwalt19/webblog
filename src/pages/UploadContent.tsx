"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const UploadContent: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!title) {
      toast.error(t("upload content.title required"));
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      const filePath = `public/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error(t("upload content.image upload failed", { error: uploadError.message }));
        setLoading(false);
        return;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from('content')
      .insert([{ title, description, image_url: imageUrl }]);

    if (insertError) {
      console.error("Error inserting content:", insertError);
      toast.error(t("upload content.content upload failed", { error: insertError.message }));
    } else {
      toast.success(t("upload content.content uploaded successfully"));
      setTitle("");
      setDescription("");
      setImageFile(null);
      // Clear file input
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('upload content title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('upload content subtitle')}
        </p>
      </section>

      <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">{t('add new content')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('fill form to upload content')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('upload content.title label')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('upload content.title placeholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">{t('upload content.description label')}</Label>
              <Textarea
                id="description"
                placeholder={t('upload content.description placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="image-upload">{t('upload content.image label')}</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
              {imageFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('upload content.selected file')}: {imageFile.name}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('uploading') : t('upload content.submit button')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadContent;