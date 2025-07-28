"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name must not be longer than 50 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message must not be longer than 500 characters.",
  }),
});

const ContactForm: React.FC = () => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading(t("contact form.sending email")); // Show loading toast

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values,
      });

      if (error) {
        throw error;
      }

      // Check for application-level errors returned by the edge function
      if (data && data.error) {
        throw new Error(data.error);
      }

      toast.success(t("contact form.email sent success"), { id: toastId });
      form.reset(); // Reset the form after successful submission
    } catch (err: any) {
      console.error("Error sending contact form:", err);
      toast.error(t("contact form.email send error", { error: err.message }), { id: toastId });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact form.name label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("contact form.name placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact form.email label")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("contact form.email placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact form.message label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("contact form.message placeholder")}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t("contact form.submit button")}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;