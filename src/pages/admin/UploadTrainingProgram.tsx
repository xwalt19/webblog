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

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const trainingProgramSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(255, { message: "Title must not exceed 255 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  iconName: z.string().optional().nullable(),
  
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

const UploadTrainingProgram: React.FC = () => {
  const { id: programId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [dataLoading, setDataLoading] = useState(true);
  const availableIcons = Object.keys(iconMap);

  const form = useForm<z.infer<typeof trainingProgramSchema>>({
    resolver: zodResolver(trainingProgramSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      iconName: "",
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
        if (programId) {
          fetchProgramData(programId);
        } else {
          setDataLoading(false);
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, programId]);

  const fetchProgramData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const { startDate, endDate, startTime, endTime } = parseDateRangeString(data.dates);
        form.reset({
          title: data.title || "",
          description: data.description || "",
          startDate: startDate,
          endDate: endDate,
          startTime: startTime || "",
          endTime: endTime || "",
          iconName: data.icon_name || "",
        });
      }
    } catch (err: any) {
      console.error("Error fetching training program data:", err);
      toast.error(t("fetch data error", { error: err.message }));
      navigate('/admin/manage-training-programs');
    } finally {
      setDataLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof trainingProgramSchema>) => {
    const toastId = toast.loading(programId ? t("updating status") : t("uploading status"));

    try {
      const formattedDates = formatDateRangeWithTime(
        values.startDate || undefined,
        values.endDate || undefined,
        values.startTime || undefined,
        values.endTime || undefined
      );

      const programData = {
        title: values.title,
        dates: formattedDates || null, // Save the formatted string
        description: values.description,
        icon_name: values.iconName || null,
        ...(programId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let error;
      if (programId) {
        const { error: updateError } = await supabase
          .from('training_programs')
          .update(programData)
          .eq('id', programId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('training_programs')
          .insert([programData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(programId ? t("updated successfully") : t("added successfully"), { id: toastId });
      navigate('/admin/manage-training-programs');

    } catch (err: any) {
      console.error("Error saving training program:", err);
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
          {programId ? t('edit training program') : t('add training program')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {programId ? t('edit training program subtitle') : t('add training program subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {programId ? t('edit training program form') : t('add training program form')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {programId ? t('edit training program form description') : t('add training program form description')}
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
                        key={programId || "new-training-program"}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('description placeholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon Name Field */}
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

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('uploading status') : (programId ? t('save changes button') : t('submit button'))}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-training-programs">
          <Button>{t('back to list button')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadTrainingProgram;