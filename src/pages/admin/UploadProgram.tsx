"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import ProgramPriceTablesSection from "@/components/admin/ProgramPriceTablesSection"; // Updated import
import ProgramTopicsSection from "@/components/admin/ProgramTopicsSection"; // Updated import
import ProgramDetailsForm from "@/components/admin/ProgramDetailsForm"; // New import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { formatDateRangeWithTime, parseDateRangeString } from "@/utils/dateUtils";

interface PriceTier {
  id?: string;
  header_key_col1: string;
  header_key_col2: string;
  participants_key: string;
  price: string;
}

interface Topic {
  id?: string;
  icon_name: string;
  title: string;
  description: string;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const programSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(255, { message: "Title must not exceed 255 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  registrationFee: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  type: z.union([z.literal("kids"), z.literal("private"), z.literal("professional")], {
    errorMap: () => ({ message: "Please select a program type." })
  }),
  iconName: z.string().optional().nullable(),
  
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  startTime: z.string().regex(timeRegex, { message: "Invalid time format (HH:MM)" }).optional().nullable(),
  endTime: z.string().regex(timeRegex, { message: "Invalid time format (HH:MM)" }).optional().nullable(),
}).refine((data) => {
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
}).refine((data) => {
  if (data.startTime && data.endTime && data.startTime > data.endTime && data.startDate?.toDateString() === data.endDate?.toDateString()) {
    return false;
  }
  return true;
}, {
  message: "End time cannot be before start time on the same day.",
  path: ["endTime"],
});

const UploadProgram: React.FC = () => {
  const { id: programId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [priceTables, setPriceTables] = useState<PriceTier[][]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      registrationFee: "",
      price: "",
      type: "kids",
      iconName: "",
    },
  });

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => {
      if (programId) {
        fetchProgramData(programId);
      } else {
        setDataLoading(false);
      }
    },
  });

  const fetchProgramData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();

      if (programError) throw programError;

      if (programData) {
        const { startDate, endDate, startTime, endTime } = parseDateRangeString(programData.schedule);
        form.reset({
          title: programData.title || "",
          description: programData.description || "",
          startDate: startDate,
          endDate: endDate,
          startTime: startTime || "",
          endTime: endTime || "", // Corrected: Changed from 'fendTime' to 'endTime'
          registrationFee: programData.registration_fee || "",
          price: programData.price || "",
          type: programData.type || "kids",
          iconName: programData.icon_name || "",
        });

        const { data: priceTiersData, error: priceTiersError } = await supabase
          .from('program_price_tiers')
          .select('*')
          .eq('program_id', id);
        if (priceTiersError) throw priceTiersError;
        const groupedPriceTiers: { [key: string]: PriceTier[] } = {};
        priceTiersData.forEach(tier => {
          if (!groupedPriceTiers[tier.header_key_col1]) {
            groupedPriceTiers[tier.header_key_col1] = [];
          }
          groupedPriceTiers[tier.header_key_col1].push(tier);
        });
        setPriceTables(Object.values(groupedPriceTiers));

        const { data: topicsData, error: topicsError } = await supabase
          .from('program_topics')
          .select('*')
          .eq('program_id', id);
        if (topicsError) throw topicsError;
        setTopics(topicsData || []);
      }
    } catch (err: any) {
      console.error("Error fetching program data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-programs');
    } finally {
      setDataLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof programSchema>) => {
    const toastId = toast.loading(programId ? t("updating status") : t("uploading status"));

    try {
      if (priceTables.some(table => table.some(row => !row.header_key_col1 || !row.header_key_col2 || !row.participants_key || !row.price))) {
        toast.error(t("price table fields missing"));
        return;
      }
      if (topics.some(topic => !topic.icon_name || !topic.title || !topic.description)) {
        toast.error(t("topic fields missing"));
        return;
      }

      const formattedSchedule = formatDateRangeWithTime(
        values.startDate || undefined,
        values.endDate || undefined,
        values.startTime || undefined,
        values.endTime || undefined
      );

      const programData = {
        title: values.title,
        description: values.description,
        schedule: formattedSchedule || null,
        registration_fee: values.registrationFee || null,
        price: values.price || null,
        type: values.type,
        icon_name: values.iconName || null,
        ...(programId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let currentProgramId = programId;
      let error;

      if (programId) {
        const { error: updateError } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', programId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('programs')
          .insert([programData])
          .select('id')
          .single();
        error = insertError;
        if (data) currentProgramId = data.id;
      }

      if (error) throw error;
      if (!currentProgramId) throw new Error("Program ID not found after save.");

      if (values.startDate) {
        const calendarEventData = {
          title: values.title,
          description: values.description,
          date: values.startDate.toISOString(),
          created_by: session?.user?.id,
          program_id: currentProgramId,
        };

        const { data: existingEvent, error: fetchEventError } = await supabase
          .from('calendar_events')
          .select('id')
          .eq('program_id', currentProgramId)
          .single();

        if (fetchEventError && fetchEventError.code !== 'PGRST116') {
          throw fetchEventError;
        }

        if (existingEvent) {
          const { error: updateEventError } = await supabase
            .from('calendar_events')
            .update(calendarEventData)
            .eq('id', existingEvent.id);
          if (updateEventError) throw updateEventError;
        } else {
          const { error: insertEventError } = await supabase
            .from('calendar_events')
            .insert([calendarEventData]);
          if (insertEventError) throw insertEventError;
        }
      } else {
        await supabase
          .from('calendar_events')
          .delete()
          .eq('program_id', currentProgramId);
      }

      await supabase.from('program_price_tiers').delete().eq('program_id', currentProgramId);
      if (priceTables.length > 0) {
        const allTiersToInsert = priceTables.flat().map(tier => ({
          ...tier,
          program_id: currentProgramId,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: priceTiersError } = await supabase.from('program_price_tiers').insert(allTiersToInsert);
        if (priceTiersError) throw priceTiersError;
      }

      await supabase.from('program_topics').delete().eq('program_id', currentProgramId);
      if (topics.length > 0) {
        const allTopicsToInsert = topics.map(topic => ({
          ...topic,
          program_id: currentProgramId,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: topicsError } = await supabase.from('program_topics').insert(allTopicsToInsert);
        if (topicsError) throw topicsError;
      }

      toast.success(programId ? t("updated successfully") : t("added successfully"), { id: toastId });
      navigate('/admin/manage-programs');

    } catch (err: any) {
      console.error("Error saving program:", err);
      toast.error(t("save failed", { error: err.message }), { id: toastId });
    }
  };

  if (isLoadingAuth || (programId && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">
          {programId ? t('edit program') : t('add program')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {programId ? t('edit program subtitle') : t('add program subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {programId ? t('edit program form') : t('add program form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {programId ? t('edit program form description') : t('add program form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ProgramDetailsForm
                control={form.control}
                watch={form.watch} // Pass form.watch
                setValue={form.setValue} // Pass form.setValue
                programId={programId}
              />
              <ProgramPriceTablesSection
                priceTables={priceTables}
                setPriceTables={setPriceTables}
              />
              <ProgramTopicsSection
                topics={topics}
                setTopics={setTopics}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('uploading status') : (programId ? t('save changes button') : t('submit button'))}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-programs">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadProgram;