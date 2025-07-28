"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SimpleExternalArticlesDisplay: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{t('external articles title')}</h2>
        <Card className="max-w-2xl mx-auto p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t('external articles placeholder title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t('external articles placeholder desc')}
            </p>
            <Link to="/blog">
              <Button>{t('explore blog')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SimpleExternalArticlesDisplay;