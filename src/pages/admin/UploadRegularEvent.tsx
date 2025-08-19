"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { iconMap } from "@/utils/iconMap";
import { cn } from "@/lib/utils";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RichTextEditor from "@/components/RichTextEditor";
import RegularEventRundownSection from "@/components/admin/RegularEventRundownSection"; // New import
import RegularEventFAQSection from "@/components/admin/RegularEventFAQSection"; // New import
import ResponsiveImage from "@/components/ResponsiveImage"; // New import

interface RundownItem {
  id?: string;
  time: string;
  session_title: string;
  speaker: string;
  order_index: number;
}

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  order_index: number;
}

const MAX_BANNER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Define Zod schema for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(100, {
    message: "Name must not be longer than 100 characters.",
  }),
  schedule: z.date({
    required_error: "Schedule date and time are required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  iconName: z.string().optional().nullable(),
  quota: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().int().min(0, { message: "Quota must be a non-negative integer." }).nullable().optional()
  ),
  registrationLink: z.string().url({ message: "Must be a valid URL." }).nullable().optional().or(z.literal('')),
});

const UploadRegularEvent: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();

  const [dataLoading, setDataLoading] = useState(true);
  const availableIcons = Object.keys(iconMap);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [initialBannerImageUrl, setInitialBannerImageUrl] = useState<string | null>(null);
  const [rundowns, setRundowns] = useState<RundownItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      schedule: undefined, // Default to undefined for date
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
        form.reset({
          name: data.name || "",
          schedule: data.schedule ? new Date(data.schedule) : undefined, // Parse ISO string to Date
          description: data.description || "",
          iconName: data.icon_name || "",
          quota: data.quota,
          registrationLink: data.registration_link || "",
        });
        setInitialBannerImageUrl(data.banner_image_url || null);
        setRundowns(data.regular_event_rundowns.sort((a, b) => a.order_index - b.order_index) || []);
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

  const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_BANNER_IMAGE_SIZE_BYTES) {
        toast.error(t('file size too large', { max: '5MB' }));
        event.target.value = ''; // Clear the input
        setBannerImageFile(null);
        return;
      }
      setBannerImageFile(file);
    } else {
      setBannerImageFile(null);
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

      const eventData = {
        name: values.name,
        schedule: values.schedule.toISOString(), // Convert Date to ISO string
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

      // Save Rundowns
      await supabase.from('regular_event_rundowns').delete().eq('event_id', currentEventId);
      if (rundowns.length > 0) {
        const rundownsToInsert = rundowns.map((r, idx) => ({
          ...r,
          event_id: currentEventId,
          order_index: idx,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: rundownsError } = await supabase.from('regular_event_rundowns').insert(rundownsToInsert);
        if (rundownsError) throw rundownsError;
      }

      // Save FAQs
      await supabase.from('regular_event_faqs').delete().eq('event_id', currentEventId);
      if (faqs.length > 0) {
        const faqsToInsert = faqs.map((f, idx) => ({
          ...f,
          event_id: currentEventId,
          order_index: idx,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: faqsError } = await supabase.from('regular_event_faqs').insert(faqsToInsert);
        if (faqsError) throw faqsError;
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('schedule label')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP HH:mm") : <span>{t('pick date and time')}</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Label htmlFor="time-input" className="sr-only">{t('time')}</Label>
                          <Input
                            id="time-input"
                            type="time"
                            value={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              if (field.value) {
                                const newDate = new Date(field.value);
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                              } else {
                                const newDate = new Date();
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                              }
                            }}
                            className="w-full"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description label')}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        key={eventId || "new-event"} // Pass key prop
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('description placeholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('icon label')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={t('select icon placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        {React.createElement(iconMap[field.value], { className: "h-4 w-4" })} {field.value}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label htmlFor="banner-image-upload">{t('banner image label')}</Label>
                <Input
                  id="banner-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="mt-1"
                />
                {bannerImageFile ? (
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('selected image')}: {bannerImageFile.name}
                  </p>
                ) : initialBannerImageUrl && (
                  <div className="mt-2">
                    <ResponsiveImage 
                      src={initialBannerImageUrl} 
                      alt={t('current banner image')} 
                      containerClassName="w-32 h-20 rounded-md" 
                      className="object-cover" 
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('current image')}: <a href={initialBannerImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialBannerImageUrl.split('/').pop()}</a>
                    </p>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="quota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quota label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('quota placeholder')}
                        {...field}
                        value={field.value === null ? "" : field.value} // Handle null for empty input
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? null : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('quota hint')}
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('registration link label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={t('registration link placeholder')}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('registration link hint')}
                    </p>
                  </FormItem>
                )}
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