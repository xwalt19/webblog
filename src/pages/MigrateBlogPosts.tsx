"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { dummyBlogPosts, dummyArchivePosts } from "@/data/blogPosts";
import i18n from "@/i18n"; // Import i18n instance

const MigrateBlogPosts: React.FC = () => {
  const { t } = useTranslation();
  const [migrationStatus, setMigrationStatus] = useState<string>("idle"); // idle, migrating, success, error
  const [migratedCount, setMigratedCount] = useState<number>(0);
  const [totalToMigrate, setTotalToMigrate] = useState<number>(0);

  const handleMigrate = async () => {
    setMigrationStatus("migrating");
    setMigratedCount(0);

    const allPostsToMigrate = [...dummyBlogPosts, ...dummyArchivePosts];
    setTotalToMigrate(allPostsToMigrate.length);

    let successCount = 0;
    let errorCount = 0;

    for (const post of allPostsToMigrate) {
      try {
        // Cek apakah post sudah ada berdasarkan title untuk mencegah duplikasi
        const translatedTitle = i18n.t(post.titleKey);
        const { data: existingPost, error: fetchError } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('title', translatedTitle)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          throw fetchError;
        }

        if (existingPost) {
          console.log(`Post with title "${translatedTitle}" already exists. Skipping.`);
          successCount++;
          setMigratedCount(prev => prev + 1);
          continue;
        }

        // Translate all keys to their actual string values
        const translatedPost = {
          title: i18n.t(post.titleKey),
          excerpt: i18n.t(post.excerptKey),
          created_at: new Date(post.date).toISOString(),
          image_url: post.image,
          category: i18n.t(post.categoryKey),
          author: i18n.t(post.authorKey),
          tags: post.tagsKeys.map(tagKey => i18n.t(tagKey)), // Translate each tag
          content: post.contentKey ? String(i18n.t(post.contentKey)) : null,
          pdf_link: post.pdfLink,
        };
        
        // Ensure content is wrapped in a single root element if it exists
        if (translatedPost.content) {
          translatedPost.content = `<div>${translatedPost.content}</div>`;
        }

        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert(translatedPost);

        if (insertError) {
          throw insertError;
        }
        successCount++;
        setMigratedCount(prev => prev + 1);
      } catch (err: any) {
        console.error(`Error migrating post "${post.titleKey}":`, err);
        toast.error(t("migration.error migrating post", { title: t(post.titleKey), error: err.message }));
        errorCount++;
      }
    }

    if (errorCount === 0) {
      setMigrationStatus("success");
      toast.success(t("migration.all posts migrated successfully", { count: successCount }));
    } else {
      setMigrationStatus("error");
      toast.error(t("migration.migration completed with errors", { success: successCount, errors: errorCount }));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('migration.blog posts migration title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('migration.blog posts migration subtitle')}
        </p>
      </section>

      <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg text-center">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold mb-2">{t('migration.migrate data')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('migration.click button to migrate')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleMigrate}
            disabled={migrationStatus === "migrating"}
            className="w-full"
          >
            {migrationStatus === "migrating" ? (
              `${t('migration.migrating')} (${migratedCount}/${totalToMigrate})`
            ) : (
              t('migration.start migration')
            )}
          </Button>
          {migrationStatus === "success" && (
            <p className="text-green-600 mt-4 font-medium">{t('migration.migration successful')}</p>
          )}
          {migrationStatus === "error" && (
            <p className="text-red-600 mt-4 font-medium">{t('migration.migration failed')}</p>
          )}
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

export default MigrateBlogPosts;