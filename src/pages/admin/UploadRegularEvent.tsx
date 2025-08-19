"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import RegularEventDetailsForm from "@/components/admin/RegularEventDetailsForm"; // New import
import RegularEventMediaUpload from "@/components/admin/RegularEventMediaUpload"; // New import
import RegularEventRundownSection from "@/components/admin/RegularEventRundownSection";
import RegularEventFAQSection from "@/components/admin/RegularEventFAQSection";
import { formatDateRangeWithTime, parseDateRangeString } from "@/utils/dateUtils"; // Import date utils

interface RundownItem {
  id?: string;
  time: string;
  session_title: string;
  speaker_name: string; // New
  speaker_role: string; // New
  order_index: number;
}

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  order_index: number;
}

const MAX_BANNER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Define Zod schema for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(100, {
    message: "Name must not be longer than 100 characters.",
  }),
  // Changed from single 'schedule' to date range and time fields
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  startTime: z.string().regex(timeRegex, { message: "Invalid time format (HH:MM)" }).optional().nullable(),
  endTime: z.string().regex(timeRegex, { message: "Invalid time format (HH:MM)" }).optional().nullable(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  iconName: z.string().optional().nullable(),
  quota: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().int().min(0, { message: "Quota must be a non-negative integer." }).nullable().optional()
  ),
  registrationLink: z.string().url({ message: "Must be a valid URL." }).nullable().optional().or(z.literal('')),
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

const UploadRegularEvent: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();

  const [dataLoading, setDataLoading] = useState(true);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [initialBannerImageUrl, setInitialBannerImageUrl] = useState<string | null>(null);
  const [rundowns, setRundowns] = useState<RundownItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      description: "",
      iconName: "",
      quota: null,
      registrationLink: "",
    },
  });

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => {
      if (eventId) {
        fetchEventData(eventId);
      } else {
        setDataLoading(false);
      }
    },
  });

  const fetchEventData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('regular_events')
        .select('*, regular_event_rundowns(*), regular_event_faqs(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const { startDate, endDate, startTime, endTime } = parseDateRangeString(data.schedule);
        form.reset({
          name: data.name || "",
          startDate: startDate,
          endDate: endDate,
          startTime: startTime || "",
          endTime: endTime || "",
          description: data.description || "",
          iconName: data.icon_name || "",
          quota: data.quota,
          registrationLink: data.registration_link || "",
        });
        setInitialBannerImageUrl(data.banner_image_url || null);
        // Map old 'speaker' to new 'speaker_name' and 'speaker_role' if 'speaker' exists and new fields are null
        const mappedRundowns = data.regular_event_rundowns.map((r: any) => ({
          id: r.id,
          time: r.time,
          session_title: r.session_title,
          speaker_name: r.speaker_name || r.speaker || "", // Use new field, fallback to old, then empty
          speaker_role: r.speaker_role || "", // Use new field, fallback to empty
          order_index: r.order_index,
        })).sort((a, b) => a.order_index - b.order_index);
        setRundowns(mappedRundowns || []);
        setFaqs(data.regular_event_faqs.sort((a, b) => a.order_index - b.order_index) || []);
      }
    } catch (err: any) {
      console.error("Error fetching regular event data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-regular-events');
    } finally {
      setDataLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading(eventId ? t("updating status") : t("uploading status"));

    try {
      let currentBannerImageUrl = initialBannerImageUrl;

      // Handle banner image upload/update
      if (bannerImageFile) {
        // Delete old image if exists
        if (initialBannerImageUrl) {
          try {
            const path = initialBannerImageUrl.split('/images/event_banners/')[1];
            if (path) {
              const { error: deleteError } = await supabase.storage.from('images').remove([`event_banners/${path}`]);
              if (deleteError) console.warn("Failed to delete old banner image:", deleteError.message);
            }
          } catch (e) {
            console.warn("Error parsing old banner image URL for deletion:", e);
          }
        }

        // Upload new image
        const fileExtension = bannerImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const filePath = `event_banners/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, bannerImageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        currentBannerImageUrl = publicUrlData.publicUrl;
      } else if (eventId && !bannerImageFile && initialBannerImageUrl) {
        // If editing and image is cleared, delete old image
        try {
          const path = initialBannerImageUrl.split('/images/event_banners/')[1];
          if (path) {
            const { error: deleteError } = await supabase.storage.from('images').remove([`event_banners/${path}`]);
            if (deleteError) console.warn("Failed to delete old banner image:", deleteError.message);
          }
        } catch (e) {
          console.warn("Error parsing old banner image URL for deletion:", e);
        }
        currentBannerImageUrl = null;
      }

      const formattedSchedule = formatDateRangeWithTime(
        values.startDate || undefined,
        values.endDate || undefined,
        values.startTime || undefined,
        values.endTime || undefined
      );

      const eventData = {
        name: values.name,
        schedule: formattedSchedule || null, // Save the formatted string
        description: values.description,
        icon_name: values.iconName || null,
        quota: values.quota || null,
        registration_link: values.registrationLink || null,
        banner_image_url: currentBannerImageUrl,
        ...(eventId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let currentEventId = eventId;
      let error;

      if (eventId) {
        const { error: updateError } = await supabase
          .from('regular_events')
          .update(eventData)
          .eq('id', eventId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('regular_events')
          .insert([eventData])
          .select('id')
          .single();
        error = insertError;
        if (data) currentEventId = data.id;
      }

      if (error) throw error;
      if (!currentEventId) throw new Error("Event ID not found after save.");

      // Prepare rundowns for upsert
      const rundownsToUpsert = rundowns.map((r, idx) => ({
        id: r.id, // Include ID for upsert
        event_id: currentEventId,
        time: r.time,
        session_title: r.session_title,
        speaker_name: r.speaker_name, // Use new field
        speaker_role: r.speaker_role, // Use new field
        order_index: idx,
        created_by: session?.user?.id,
        created_at: new Date().toISOString(),
      }));

      // Prepare FAQs for upsert
      const faqsToUpsert = faqs.map((f, idx) => ({
        id: f.id, // Include ID for upsert
        event_id: currentEventId,
        question: f.question,
        answer: f.answer,
        order_index: idx,
        created_by: session?.user?.id,
        created_at: new Date().toISOString(),
      }));

      // Fetch existing rundown and FAQ IDs to determine what to delete
      const { data: existingRundowns, error: fetchRundownsError } = await supabase
        .from('regular_event_rundowns')
        .select('id')
        .eq('event_id', currentEventId);
      if (fetchRundownsError) throw fetchRundownsError;
      const existingRundownIds = new Set(existingRundowns.map(r => r.id));

      const { data: existingFaqs, error: fetchFaqsError } = await supabase
        .from('regular_event_faqs')
        .select('id')
        .eq('event_id', currentEventId);
      if (fetchFaqsError) throw fetchFaqsError;
      const existingFaqIds = new Set(existingFaqs.map(f => f.id));

      // Determine IDs to delete (those that were in DB but are no longer in the form)
      const rundownIdsToDelete = Array.from(existingRundownIds).filter(id => !rundownsToUpsert.some(r => r.id === id));
      const faqIdsToDelete = Array.from(existingFaqIds).filter(id => !faqsToUpsert.some(f => f.id === id));

      // Perform deletions
      if (rundownIdsToDelete.length > 0) {
        const { error: deleteRundownsError } = await supabase.from('regular_event_rundowns').delete().in('id', rundownIdsToDelete);
        if (deleteRundownsError) throw deleteRundownsError;
      }
      if (faqIdsToDelete.length > 0) {
        const { error: deleteFaqsError } = await supabase.from('regular_event_faqs').delete().in('id', faqIdsToDelete);
        if (deleteFaqsError) throw deleteFaqsError;
      }

      // Perform upserts for remaining/new items
      if (rundownsToUpsert.length > 0) {
        const { error: upsertRundownsError } = await supabase
          .from('regular_event_rundowns')
          .upsert(rundownsToUpsert, { onConflict: 'id' }); // Conflict on 'id' for existing records
        if (upsertRundownsError) throw upsertRundownsError;
      }

      if (faqsToUpsert.length > 0) {
        const { error: upsertFaqsError } = await supabase
          .from('regular_event_faqs')
          .upsert(faqsToUpsert, { onConflict: 'id' }); // Conflict on 'id' for existing records
        if (upsertFaqsError) throw upsertFaqsError;
      }

      toast.success(eventId ? t("updated successfully") : t("added successfully"), { id: toastId });
      navigate('/admin/manage-regular-events');

    } catch (err: any) {
      console.error("Error saving regular event:", err);
      toast.error(t("save failed", { error: err.message }), { id: toastId });
    } finally {
      form.formState.isSubmitting = false; // Manually reset submitting state
    }
  };

  if (isLoadingAuth || (eventId && dataLoading)) {
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
          {eventId ? t('edit regular event') : t('add regular event')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {eventId ? t('edit regular event subtitle') : t('add regular event subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {eventId ? t('edit regular event form') : t('add regular event form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {eventId ? t('edit regular event form description') : t('add regular event form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <RegularEventDetailsForm
                control={form.control}
                watch={form.watch}
                setValue={form.setValue}
                eventId={eventId}
              />
              <RegularEventMediaUpload
                bannerImageFile={bannerImageFile}
                setBannerImageFile={setBannerImageFile}
                initialBannerImageUrl={initialBannerImageUrl}
                MAX_BANNER_IMAGE_SIZE_BYTES={MAX_BANNER_IMAGE_SIZE_BYTES}
              />
              <RegularEventRundownSection rundowns={rundowns} setRundowns={setRundowns} />
              <RegularEventFAQSection faqs={faqs} setFaqs={setFaqs} />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('uploading status') : (eventId ? t('save changes button') : t('submit button'))}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-regular-events">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadRegularEvent;