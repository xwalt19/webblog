"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { iconMap } from "@/utils/iconMap";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { z } from "zod";

// Define a local schema for type inference, matching the main form schema
const programFormFieldsSchema = z.object({
  title: z.string(),
  description: z.string(),
  schedule: z.date().optional().nullable(),
  registrationFee: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  type: z.union([z.literal("kids"), z.literal("private"), z.literal("professional")]),
  iconName: z.string().optional().nullable(),
});

interface ProgramFormFieldsProps {
  control: Control<z.infer<typeof programFormFieldsSchema>>;
}

const ProgramFormFields: React.FC<ProgramFormFieldsProps> = ({
  control,
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
              <Textarea
                placeholder={t('description placeholder')}
                className="min-h-[80px]"
                {...field}
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
        name="registrationFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('registration fee label')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('registration fee placeholder')}
                {...field}
                value={field.value || ""} // Ensure controlled component
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
                value={field.value || ""} // Ensure controlled component
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

export default ProgramFormFields;