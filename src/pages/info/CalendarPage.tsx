"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProCodeCGCalendar from "@/components/ProCodeCGCalendar";
import { useTranslation } from "react-i18next";

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('calendar')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('calendar description')}
        </p>
      </section>

      <ProCodeCGCalendar />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default CalendarPage;