"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale"; // Import Indonesian locale
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconMap";
import RichTextEditor from "@/components/RichTextEditor"; // Re-added RichTextEditor import
// import { Textarea } from "@/components/ui/textarea"; // Removed Textarea import
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form"; // Import UseFormWatch and UseFormSetValue
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker"; // Import DateRange type

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Define a local schema for type inference, matching the main form schema
const formSchema = z.object({
  name: z.string(),
  // Changed from single 'schedule' to date range and time fields
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  startTime: z.string().regex(timeRegex, { message: "Invalid time format (HH:MM)" }).optional().nullable(),
  endTime: z.string().regex(timeRegex, { message: "Invalid time format (HH:MM)" }).optional().nullable(),
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
  watch: UseFormWatch<z.infer<typeof formSchema>>; // Add watch prop
  setValue: UseFormSetValue<z.infer<typeof formSchema>>; // Add setValue prop
  eventId?: string; // Optional, for keying RichTextEditor
}

const RegularEventDetailsForm: React.FC<RegularEventDetailsFormProps> = ({
  control,
  watch,
  setValue,
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
        name="startDate" // Using startDate for the main field, but it controls the range
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('schedule label')}</FormLabel>
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
                    {watch("startDate") ? ( // Use watch here
                      watch("endDate") && watch("endDate")?.getTime() !== watch("startDate")?.getTime() ? ( // Use watch here
                        <>
                          {format(watch("startDate")!, "PPP", { locale: idLocale })} -{" "}
                          {format(watch("endDate")!, "PPP", { locale: idLocale })}
                        </>
                      ) : (
                        format(watch("startDate")!, "PPP", { locale: idLocale })
                      )
                    ) : (
                      <span>{t('pick date and time')}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={field.value || undefined}
                  selected={{ from: watch("startDate") || undefined, to: watch("endDate") || undefined }} // Use watch here
                  onSelect={(range: DateRange | undefined) => {
                    setValue("startDate", range?.from); // Use setValue here
                    setValue("endDate", range?.to); // Use setValue here
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description label')}</FormLabel>
            <FormControl>
              <RichTextEditor // Reverted to RichTextEditor
                key={eventId || "new-regular-event-description"} // Added key for proper re-initialization
                value={field.value}
                onChange={field.onChange}
                placeholder={t('description placeholder')}
                className="min-h-[120px]"
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
                value={field.value === null ? "" : field.value} // Ensure controlled component, display null as empty string
                onChange={(e) => field.onChange(e.target.value)} // Pass raw string value to react-hook-form
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