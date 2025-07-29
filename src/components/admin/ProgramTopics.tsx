"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { iconMap } from "@/utils/iconMap";

interface Topic {
  id?: string;
  icon_name: string;
  title: string;
  description: string;
}

interface ProgramTopicsProps {
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
}

const ProgramTopics: React.FC<ProgramTopicsProps> = ({ topics, setTopics }) => {
  const { t } = useTranslation();
  const availableIcons = Object.keys(iconMap);

  const handleAddTopic = () => {
    setTopics([...topics, { icon_name: "", title: "", description: "" }]);
  };

  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleTopicChange = (index: number, field: keyof Topic, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    setTopics(newTopics);
  };

  return (
    <>
      <Separator className="my-6" />
      <h3 className="text-lg font-semibold mb-4">{t('topics')}</h3>
      {topics.map((topic, index) => (
        <Card key={index} className="p-4 mb-4 border border-border">
          <div className="flex justify-end mb-2">
            <Button variant="destructive" size="sm" onClick={() => handleRemoveTopic(index)}>
              <MinusCircle className="h-4 w-4 mr-2" /> {t('remove topic button')}
            </Button>
          </div>
          <div className="space-y-2">
            <div>
              <Label>{t('topic icon label')}</Label>
              <Select value={topic.icon_name} onValueChange={(value) => handleTopicChange(index, 'icon_name', value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('select icon placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {topic.icon_name && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  {t('selected icon preview')}: {React.createElement(iconMap[topic.icon_name], { className: "h-4 w-4" })} {topic.icon_name}
                </p>
              )}
            </div>
            <div>
              <Label>{t('topic title label')}</Label>
              <Input
                placeholder={t('topic title placeholder')}
                value={topic.title}
                onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
              />
            </div>
            <div>
              <Label>{t('topic description label')}</Label>
              <Textarea
                placeholder={t('topic description placeholder')}
                value={topic.description}
                onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button type="button" variant="secondary" onClick={handleAddTopic}>
        <PlusCircle className="h-4 w-4 mr-2" /> {t('add topic button')}
      </Button>
    </>
  );
};

export default ProgramTopics;