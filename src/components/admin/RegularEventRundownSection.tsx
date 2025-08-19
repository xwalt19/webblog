"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RundownItem {
  id?: string;
  time: string;
  session_title: string;
  speaker_name: string; // New
  speaker_role: string; // New
  order_index: number;
}

interface RegularEventRundownSectionProps {
  rundowns: RundownItem[];
  setRundowns: (rundowns: RundownItem[]) => void;
}

const RegularEventRundownSection: React.FC<RegularEventRundownSectionProps> = ({ rundowns, setRundowns }) => {
  const { t } = useTranslation();

  const handleAddRundown = () => {
    setRundowns([...rundowns, { time: "", session_title: "", speaker_name: "", speaker_role: "", order_index: rundowns.length }]);
  };

  const handleRemoveRundown = (index: number) => {
    const newRundowns = rundowns.filter((_, i) => i !== index);
    setRundowns(newRundowns.map((item, idx) => ({ ...item, order_index: idx }))); // Re-index
  };

  const handleRundownChange = (index: number, field: keyof RundownItem, value: string) => {
    const newRundowns = [...rundowns];
    newRundowns[index] = { ...newRundowns[index], [field]: value };
    setRundowns(newRundowns);
  };

  return (
    <>
      <Separator className="my-6" />
      <h3 className="text-lg font-semibold mb-4">{t('event rundown')}</h3>
      {rundowns.map((rundown, index) => (
        <Card key={index} className="p-4 mb-4 border border-border">
          <div className="flex justify-end mb-2">
            <Button variant="destructive" size="sm" onClick={() => handleRemoveRundown(index)}>
              <MinusCircle className="h-4 w-4 mr-2" /> {t('remove rundown button')}
            </Button>
          </div>
          <div className="space-y-2">
            <div>
              <Label>{t('time label')}</Label>
              <Input
                placeholder="HH:MM"
                value={rundown.time}
                onChange={(e) => handleRundownChange(index, 'time', e.target.value)}
              />
            </div>
            <div>
              <Label>{t('session title label')}</Label>
              <Input
                placeholder={t('session title placeholder')}
                value={rundown.session_title}
                onChange={(e) => handleRundownChange(index, 'session_title', e.target.value)}
              />
            </div>
            <div>
              <Label>{t('speaker name label')}</Label>
              <Input
                placeholder={t('speaker name placeholder')}
                value={rundown.speaker_name}
                onChange={(e) => handleRundownChange(index, 'speaker_name', e.target.value)}
              />
            </div>
            <div>
              <Label>{t('speaker role label')}</Label>
              <Input
                placeholder={t('speaker role placeholder')}
                value={rundown.speaker_role}
                onChange={(e) => handleRundownChange(index, 'speaker_role', e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}
      <Button type="button" variant="secondary" onClick={handleAddRundown}>
        <PlusCircle className="h-4 w-4 mr-2" /> {t('add rundown button')}
      </Button>
    </>
  );
};

export default RegularEventRundownSection;