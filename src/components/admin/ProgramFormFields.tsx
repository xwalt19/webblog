"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { iconMap } from "@/utils/iconMap";

interface ProgramFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  schedule: string;
  setSchedule: (value: string) => void;
  registrationFee: string;
  setRegistrationFee: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  type: "kids" | "private" | "professional";
  setType: (value: "kids" | "private" | "professional") => void;
  iconName: string;
  setIconName: (value: string) => void;
}

const ProgramFormFields: React.FC<ProgramFormFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  schedule,
  setSchedule,
  registrationFee,
  setRegistrationFee,
  price,
  setPrice,
  type,
  setType,
  iconName,
  setIconName,
}) => {
  const { t } = useTranslation();
  const programTypes = ["kids", "private", "professional"];
  const availableIcons = Object.keys(iconMap);

  return (
    <>
      <div>
        <Label htmlFor="title">{t('title label')}</Label>
        <Input
          id="title"
          type="text"
          placeholder={t('title placeholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">{t('description label')}</Label>
        <Textarea
          id="description"
          placeholder={t('description placeholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 min-h-[80px]"
        />
      </div>
      <div>
        <Label htmlFor="type">{t('type label')}</Label>
        <Select value={type} onValueChange={(value: "kids" | "private" | "professional") => setType(value)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={t('select type placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {programTypes.map(pType => (
              <SelectItem key={pType} value={pType}>{t(`${pType} program type`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="iconName">{t('icon label')}</Label>
        <Select value={iconName} onValueChange={setIconName}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={t('select icon placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {availableIcons.map(icon => (
              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {iconName && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            {t('selected icon preview')}: {React.createElement(iconMap[iconName], { className: "h-4 w-4" })} {iconName}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="schedule">{t('schedule label')}</Label>
        <Input
          id="schedule"
          type="text"
          placeholder={t('schedule placeholder')}
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="registrationFee">{t('registration fee label')}</Label>
        <Input
          id="registrationFee"
          type="text"
          placeholder={t('registration fee placeholder')}
          value={registrationFee}
          onChange={(e) => setRegistrationFee(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="price">{t('price label')}</Label>
        <Input
          id="price"
          type="text"
          placeholder={t('price placeholder')}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {t('price hint')}
        </p>
      </div>
    </>
  );
};

export default ProgramFormFields;