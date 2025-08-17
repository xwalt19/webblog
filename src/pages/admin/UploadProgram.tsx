"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import ProgramPriceTables from "@/components/admin/ProgramPriceTables";
import ProgramTopics from "@/components/admin/ProgramTopics";
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
import RichTextEditor from "@/components/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Import 'id' locale
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconMap";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";
import { DateRange } from "react-day-picker"; // Import DateRange type
import { formatDateRangeWithTime, parseDateRangeString } from "@/utils/dateUtils"; // Import new date utils

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
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description must not exceed 1000 characters." }),
  // schedule field will be derived from dateRange, startTime, endTime
  // It's not directly part of the form's controlled fields for validation
  registrationFee: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  type: z.union([z.literal("kids"), z.literal("private"), z.literal("professional")], {
    errorMap: () => ({ message: "Please select a program type." })
  }),
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
          endTime: endTime || "",
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
        schedule: formattedSchedule || null, // Save the formatted string
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

      // Handle calendar event creation/update based on the *start* date of the program
      if (values.startDate) {
        const calendarEventData = {
          title: values.title,
          description: values.description,
          date: values.startDate.toISOString(), // Use start date for calendar event
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
        // If no start date, remove any associated calendar event
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

              {/* Description Field (RichTextEditor) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description label')}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        key={programId || "new-program"}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('description placeholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Field */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('type label')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={t('select type placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["kids", "private", "professional"].map(pType => (
                          <SelectItem key={pType} value={pType}>{t(`${pType} program type`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        {Object.keys(iconMap).map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        {t('selected icon preview')}: {React.createElement(iconMap[field.value], { className: "h-4 w-4" })} {field.value}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Schedule Date Range Field */}
              <FormField
                control={form.control}
                name="startDate" // Using startDate for the main field, but it controls the range
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('schedule date range label')}</FormLabel>
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

              {/* Registration Fee Field */}
              <FormField
                control={form.control}
                name="registrationFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('registration fee label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('registration fee placeholder')}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('price label')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('price placeholder')}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('price hint')}
                    </p>
                  </FormItem>
                )}
              />

              <ProgramPriceTables
                priceTables={priceTables}
                setPriceTables={setPriceTables}
              />

              <ProgramTopics
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