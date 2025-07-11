import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Gamepad, Globe, Smartphone, Lock, Cpu, Code, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface Topic {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
}

interface RunningClass {
  nameKey: string;
  scheduleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
}

interface RegularEvent {
  nameKey: string;
  scheduleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
}

const RegularEventsClasses: React.FC = () => {
  const { t } = useTranslation();
  const [selectedActivityView, setSelectedActivityView] = useState(""); 

  const topics: Topic[] = [
    {
      icon: BookOpen,
      titleKey: "regular_events_classes_data.topic1_title",
      descriptionKey: "regular_events_classes_data.topic1_desc",
    },
    {
      icon: Gamepad,
      titleKey: "regular_events_classes_data.topic2_title",
      descriptionKey: "regular_events_classes_data.topic2_desc",
    },
    {
      icon: Globe,
      titleKey: "regular_events_classes_data.topic3_title",
      descriptionKey: "regular_events_classes_data.topic3_desc",
    },
    {
      icon: Smartphone,
      titleKey: "regular_events_classes_data.topic4_title",
      descriptionKey: "regular_events_classes_data.topic4_desc",
    },
    {
      icon: Lock,
      titleKey: "regular_events_classes_data.topic5_title",
      descriptionKey: "regular_events_classes_data.topic5_desc",
    },
    {
      icon: Cpu,
      titleKey: "regular_events_classes_data.topic6_title",
      descriptionKey: "regular_events_classes_data.topic6_desc",
    },
  ];

  const runningClasses: RunningClass[] = [
    {
      nameKey: "regular_events_classes_data.class1_name",
      scheduleKey: "regular_events_classes_data.class1_schedule",
      descriptionKey: "regular_events_classes_data.class1_desc",
      icon: Code,
    },
  ];

  const regularEvents: RegularEvent[] = [
    {
      nameKey: "regular_events_classes_data.event1_name",
      scheduleKey: "regular_events_classes_data.event1_schedule",
      descriptionKey: "regular_events_classes_data.event1_desc",
      icon: Users,
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('schedule_events_title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('schedule_events_subtitle')}
        </p>
      </section>

      <div className="flex justify-center mb-10">
        <Select value={selectedActivityView} onValueChange={setSelectedActivityView}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder={t('select_activity')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allActivities">{t('all_activities')}</SelectItem>
            <SelectItem value="runningClasses">{t('running_classes')}</SelectItem>
            <SelectItem value="regularEvents">{t('regular_events')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(selectedActivityView === "allActivities" || selectedActivityView === "runningClasses") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('running_classes_section_title')}</h2>
          <div className="grid grid-cols-1 gap-6"> 
            {runningClasses.map((cls, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  {cls.icon && <cls.icon className="text-primary" size={64} />}
                </div>
                <div className="flex-grow">
                  <CardHeader className="pb-2 p-0">
                    <CardTitle className="text-2xl font-semibold">{t(cls.nameKey)}</CardTitle>
                    <CardDescription className="text-primary font-medium">{t(cls.scheduleKey)}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground p-0 pt-2">
                    {t(cls.descriptionKey)}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {(selectedActivityView === "allActivities" || selectedActivityView === "runningClasses") && <Separator className="my-12" />}

      {(selectedActivityView === "allActivities" || selectedActivityView === "regularEvents") && (
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('regular_events_section_title')}</h2>
          <div className="grid grid-cols-1 gap-6">
            {regularEvents.map((event, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  {event.icon && <event.icon className="text-primary" size={64} />}
                </div>
                <div className="flex-grow">
                  <CardHeader className="pb-2 p-0">
                    <CardTitle className="text-2xl font-semibold">{t(event.nameKey)}</CardTitle>
                    <CardDescription className="text-primary font-medium">{t(event.scheduleKey)}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground p-0 pt-2">
                    {t(event.descriptionKey)}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back_to_home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default RegularEventsClasses;