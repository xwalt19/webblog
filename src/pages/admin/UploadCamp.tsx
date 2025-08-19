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
import { PlusCircle, MinusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Import 'id' locale
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDateRangeWithTime, parseDateRangeString } from "@/utils/dateUtils"; // Import new date utils
import RichTextEditor from "@/components/RichTextEditor";
import { DateRange } from "react-day-picker"; // Import DateRange type
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CampDayLink {
  id?: string;
  label: string;
  url: string;
  content: string;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const campSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(255, { message: "Title must not exceed 255 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  // dates field will be derived from dateRange, startTime, endTime
  
  // New fields for date range and time
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

const UploadCamp: React.FC = () => {
  const { id: campId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [dayLinks, setDayLinks] = useState<CampDayLink[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const form = useForm<z.infer<typeof campSchema>>({
    resolver: zodResolver(campSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        if (campId) {
          fetchCampData(campId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, campId]);

  const fetchCampData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data: campData, error: campError } = await supabase
        .from('camps')
        .select('*')
        .eq('id', id)
        .single();

      if (campError) throw campError;

      if (campData) {
        const { startDate, endDate, startTime, endTime } = parseDateRangeString(campData.dates);
        form.reset({
          title: campData.title || "",
          description: campData.description || "",
          startDate: startDate,
          endDate: endDate,
          startTime: startTime || "",
          endTime: endTime || "",
        });

        const { data: linksData, error: linksError } = await supabase
          .from('camp_day_links')
          .select('*')
          .eq('camp_id', id)
          .order('label', { ascending: true });

        if (linksError) throw linksError;
        setDayLinks(linksData || []);
      }
    } catch (err: any) {
      console.error("Error fetching camp data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-camps');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddDayLink = () => {
    setDayLinks([...dayLinks, { label: "", url: "", content: "" }]);
  };

  const handleRemoveDayLink = (index: number) => {
    const newDayLinks = dayLinks.filter((_, i) => i !== index);
    setDayLinks(newDayLinks);
  };

  const handleDayLinkChange = (index: number, field: keyof CampDayLink, value: string) => {
    const newDayLinks = [...dayLinks];
    newDayLinks[index] = { ...newDayLinks[index], [field]: value };
    setDayLinks(newDayLinks);
  };

  const onSubmit = async (values: z.infer<typeof campSchema>) => {
    const toastId = toast.loading(campId ? t("updating status") : t("uploading status"));

    try {
      const formattedDates = formatDateRangeWithTime(
        values.startDate || undefined,
        values.endDate || undefined,
        values.startTime || undefined,
        values.endTime || undefined
      );

      const campData = {
        title: values.title,
        dates: formattedDates || null, // Save the formatted string
        description: values.description,
        ...(campId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let currentCampId = campId;
      let error;

      if (campId) {
        const { error: updateError } = await supabase
          .from('camps')
          .update(campData)
          .eq('id', campId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('camps')
          .insert([campData])
          .select('id')
          .single();
        error = insertError;
        if (data) currentCampId = data.id;
      }

      if (error) throw error;
      if (!currentCampId) throw new Error("Camp ID not found after save.");

      await supabase.from('camp_day_links').delete().eq('camp_id', currentCampId);
      if (dayLinks.length > 0) {
        const linksToInsert = dayLinks.map(link => {
          const { id, ...rest } = link;
          const newLink = {
            ...rest,
            camp_id: currentCampId,
            created_by: session?.user?.id,
            created_at: new Date().toISOString(),
          };
          if (id) { 
            (newLink as any).id = id;
          }
          return newLink;
        });
        const { error: linksError } = await supabase.from('camp_day_links').insert(linksToInsert);
        if (linksError) throw linksError;
      }

      toast.success(campId ? t("updated successfully") : t("added successfully"), { id: toastId });
      navigate('/admin/manage-camps');

    } catch (err: any) {
      console.error("Error saving camp:", err);
      toast.error(t("save failed", { error: err.message }), { id: toastId });
    } finally {
      form.formState.isSubmitting = false; // Manually reset submitting state
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">
          {campId ? t('edit camp') : t('add camp')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {campId ? t('edit camp subtitle') : t('add camp subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {campId ? t('edit camp form') : t('add camp form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {campId ? t('edit camp form description') : t('add camp form description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('title label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('title placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates Field (Date Range) */}
              <FormField
                control={form.control}
                name="startDate" // Using startDate for the main field, but it controls the range
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('dates label')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.watch("startDate") ? (
                              form.watch("endDate") && form.watch("endDate")?.getTime() !== form.watch("startDate")?.getTime() ? (
                                <>
                                  {format(form.watch("startDate")!, "PPP", { locale: id })} -{" "}
                                  {format(form.watch("endDate")!, "PPP", { locale: id })}
                                </>
                              ) : (
                                format(form.watch("startDate")!, "PPP", { locale: id })
                              )
                            ) : (
                              <span>{t('pick a date range')}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value || undefined}
                          selected={{ from: form.watch("startDate") || undefined, to: form.watch("endDate") || undefined }}
                          onSelect={(range: DateRange | undefined) => {
                            form.setValue("startDate", range?.from);
                            form.setValue("endDate", range?.to);
                          }}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Range Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('start time label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="HH:MM"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('end time label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="HH:MM"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field (RichTextEditor) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description label')}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        key={campId || "new-camp"}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('description placeholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />
              <h3 className="text-lg font-semibold mb-4">{t('day links')}</h3>
              {dayLinks.map((link, index) => (
                <Card key={index} className="p-4 mb-4 border border-border">
                  <div className="flex justify-end mb-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveDayLink(index)}>
                      <MinusCircle className="h-4 w-4 mr-2" /> {t('remove link button')}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label>{t('link label')}</Label>
                      <Input
                        placeholder={t('link label placeholder')}
                        value={link.label}
                        onChange={(e) => handleDayLinkChange(index, 'label', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>{t('url label')}</Label>
                      <Input
                        placeholder={t('link url placeholder')}
                        value={link.url}
                        onChange={(e) => handleDayLinkChange(index, 'url', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>{t('content label')}</Label>
                      <RichTextEditor
                        key={`day-link-content-${index}-${link.id || 'new'}`}
                        value={link.content}
                        onChange={(value) => handleDayLinkChange(index, 'content', value)}
                        placeholder={t('day link content placeholder')}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddDayLink}>
                <PlusCircle className="h-4 w-4 mr-2" /> {t('add day link button')}
              </Button>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('uploading status') : (campId ? t('save changes button') : t('submit button'))}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-camps">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadCamp;