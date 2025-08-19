"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconMap";
import RichTextEditor from "@/components/RichTextEditor";
import { DateRange } from "react-day-picker";
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

// Define a local schema for type inference, matching the main form schema
const programFormFieldsSchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  registrationFee: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  type: z.union([z.literal("kids"), z.literal("private"), z.literal("professional")]),
  iconName: z.string().optional().nullable(),
});

interface ProgramDetailsFormProps {
  control: Control<z.infer<typeof programFormFieldsSchema>>;
  watch: UseFormWatch<z.infer<typeof programFormFieldsSchema>>; // Add watch prop
  setValue: UseFormSetValue<z.infer<typeof programFormFieldsSchema>>; // Add setValue prop
  programId?: string; // Optional, for keying RichTextEditor
}

const ProgramDetailsForm: React.FC<ProgramDetailsFormProps> = ({
  control,
  watch, // Destructure watch
  setValue, // Destructure setValue
  programId,
}) => {
  const { t } = useTranslation();
  const programTypes = ["kids", "private", "professional"];
  const availableIcons = Object.keys(iconMap);

  return (
    <>
      <FormField
        control={control}
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

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description label')}</FormLabel>
            <FormControl>
              <RichTextEditor
                componentKey={programId || "new-program-description"}
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
                {programTypes.map(pType => (
                  <SelectItem key={pType} value={pType}>{t(`${pType} program type`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                {t('selected icon preview')}: {React.createElement(iconMap[field.value], { className: "h-4 w-4" })} {field.value}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="startDate"
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
                    {watch("startDate") ? ( // Use watch here
                      watch("endDate") && watch("endDate")?.getTime() !== watch("startDate")?.getTime() ? ( // Use watch here
                        <>
                          {format(watch("startDate")!, "PPP", { locale: id })} -{" "}
                          {format(watch("endDate")!, "PPP", { locale: id })}
                        </>
                      ) : (
                        format(watch("startDate")!, "PPP", { locale: id })
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

      <FormField
        control={control}
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
    </>
  );
};

export default ProgramDetailsForm;