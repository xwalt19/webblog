"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconMap";
import RichTextEditor from "@/components/RichTextEditor";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

// Define a local schema for type inference, matching the main form schema
const formSchema = z.object({
  name: z.string(),
  schedule: z.date(),
  description: z.string(),
  iconName: z.string().optional().nullable(),
  quota: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().int().min(0).nullable().optional()
  ),
  registrationLink: z.string().url().nullable().optional().or(z.literal('')),
});

interface RegularEventDetailsFormProps {
  control: Control<z.infer<typeof formSchema>>;
  eventId?: string; // Optional, for keying RichTextEditor
}

const RegularEventDetailsForm: React.FC<RegularEventDetailsFormProps> = ({
  control,
  eventId,
}) => {
  const { t } = useTranslation();
  const availableIcons = Object.keys(iconMap);

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description label')}</FormLabel>
            <FormControl>
              <RichTextEditor
                key={eventId || "new-event-description"} // Pass key prop
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
        control={control}
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
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};

export default RegularEventDetailsForm;