"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

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
  }).max(500, {
    message: "Description must not be longer than 500 characters.",
  }),
  iconName: z.string().optional(), // Optional as it can be null
});

const UploadRegularEvent: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();

  const [dataLoading, setDataLoading] = useState(true);
  const availableIcons = Object.keys(iconMap);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      schedule: undefined, // Default to undefined for date
      description: "",
      iconName: "",
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
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          name: data.name || "",
          schedule: data.schedule ? new Date(data.schedule) : undefined, // Parse ISO string to Date
          description: data.description || "",
          iconName: data.icon_name || "",
        });
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
      const eventData = {
        name: values.name,
        schedule: values.schedule.toISOString(), // Convert Date to ISO string
        description: values.description,
        icon_name: values.iconName || null,
        ...(eventId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let error;
      if (eventId) {
        const { error: updateError } = await supabase
          .from('regular_events')
          .update(eventData)
          .eq('id', eventId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('regular_events')
          .insert([eventData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(eventId ? t("updated successfully") : t("added successfully"), { id: toastId });
      navigate('/admin/manage-regular-events');

    } catch (err: any) {
      console.error("Error saving regular event:", err);
      toast.error(t("save failed", { error: err.message }), { id: toastId });
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
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
                      <div className="prose dark:prose-invert max-w-none"> {/* Added wrapper with prose classes */}
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          modules={modules}
                          formats={formats}
                          placeholder={t('description placeholder')}
                          className="mt-1 bg-background"
                        />
                      </div>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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