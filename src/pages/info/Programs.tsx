"use client";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Gamepad, Globe, Smartphone, Lock, Cpu, Code, Users, GraduationCap, DollarSign, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PriceTier {
  participantsKey: string;
  price: string;
}

interface Program {
  id: string;
  titleKey: string;
  descriptionKey: string;
  scheduleKey?: string;
  registrationFee?: string;
  price?: string;
  priceTable?: {
    headerKeys: string[];
    rows: PriceTier[];
  }[];
  topics?: { icon: React.ElementType; titleKey: string; descriptionKey: string }[];
  icon?: React.ElementType;
  type: "kids" | "private" | "professional";
}

const programs: Program[] = [
  {
    id: "kids-regular-coding-class",
    titleKey: "programs_data.kids_regular_coding_class_title",
    descriptionKey: "programs_data.kids_regular_coding_class_desc",
    scheduleKey: "programs_data.kids_regular_coding_class_schedule",
    registrationFee: "Rp50.000,-",
    icon: Code,
    type: "kids",
    priceTable: [
      {
        headerKeys: ["programs_data.kids_regular_coding_class_price_header1_col1", "programs_data.kids_regular_coding_class_price_header1_col2"],
        rows: [
          { participantsKey: "programs_data.kids_regular_coding_class_price_row1_col1", price: "Rp200.000" },
          { participantsKey: "programs_data.kids_regular_coding_class_price_row2_col1", price: "Rp180.000" },
          { participantsKey: "programs_data.kids_regular_coding_class_price_row3_col1", price: "Rp160.000" },
          { participantsKey: "programs_data.kids_regular_coding_class_price_row4_col1", price: "Rp150.000" },
        ],
      },
      {
        headerKeys: ["programs_data.kids_regular_coding_class_price_header2_col1", "programs_data.kids_regular_coding_class_price_header2_col2"],
        rows: [
          { participantsKey: "programs_data.kids_regular_coding_class_price_row1_col1", price: "Rp325.000" },
          { participantsKey: "programs_data.kids_regular_coding_class_price_row2_col1", price: "Rp305.000" },
          { participantsKey: "programs_data.kids_regular_coding_class_price_row3_col1", price: "Rp285.000" },
          { participantsKey: "programs_data.kids_regular_coding_class_price_row4_col1", price: "Rp275.000" },
        ],
      },
    ],
  },
  {
    id: "kids-weekday-coding-class",
    titleKey: "programs_data.kids_weekday_coding_class_title",
    descriptionKey: "programs_data.kids_weekday_coding_class_desc",
    scheduleKey: "programs_data.kids_weekday_coding_class_schedule",
    registrationFee: "Rp50.000,-",
    icon: CalendarDays,
    type: "kids",
    priceTable: [
      {
        headerKeys: ["programs_data.kids_weekday_coding_class_price_header1_col1", "programs_data.kids_weekday_coding_class_price_header1_col2"],
        rows: [
          { participantsKey: "programs_data.kids_weekday_coding_class_price_row1_col1", price: "Rp200.000" },
          { participantsKey: "programs_data.kids_weekday_coding_class_price_row2_col1", price: "Rp180.000" },
          { participantsKey: "programs_data.kids_weekday_coding_class_price_row3_col1", price: "Rp160.000" },
          { participantsKey: "programs_data.kids_weekday_coding_class_price_row4_col1", price: "Rp150.000" },
        ],
      },
    ],
  },
  {
    id: "kids-coding-camp",
    titleKey: "programs_data.kids_coding_camp_title",
    descriptionKey: "programs_data.kids_coding_camp_desc",
    price: "Rp950.000 - Rp2.000.000",
    icon: GraduationCap,
    type: "kids",
  },
  {
    id: "online-private-class",
    titleKey: "programs_data.online_private_class_title",
    descriptionKey: "programs_data.online_private_class_desc",
    price: "Rp500.000 per jam",
    icon: Users,
    type: "private",
  },
  {
    id: "tutoring-coding-class",
    titleKey: "programs_data.tutoring_coding_class_title",
    descriptionKey: "programs_data.tutoring_coding_class_desc",
    scheduleKey: "programs_data.tutoring_coding_class_schedule",
    icon: BookOpen,
    type: "private",
    priceTable: [
      {
        headerKeys: ["programs_data.tutoring_coding_class_price_header1_col1", "programs_data.tutoring_coding_class_price_header1_col2"],
        rows: [
          { participantsKey: "programs_data.tutoring_coding_class_price_row1_col1", price: "Rp250.000" },
          { participantsKey: "programs_data.tutoring_coding_class_price_row2_col1", price: "Rp230.000" },
          { participantsKey: "programs_data.tutoring_coding_class_price_row3_col1", price: "Rp210.000" },
          { participantsKey: "programs_data.tutoring_coding_class_price_row4_col1", price: "Rp190.000" },
          { participantsKey: "programs_data.tutoring_coding_class_price_row5_col1", price: "Rp170.000" },
        ],
      },
    ],
  },
  {
    id: "crash-course-customized-training",
    titleKey: "programs_data.crash_course_customized_training_title",
    descriptionKey: "programs_data.crash_course_customized_training_desc",
    price: "Mulai dari Rp1.000.000",
    icon: Cpu,
    type: "professional",
  },
  {
    id: "coding-mom",
    titleKey: "programs_data.coding_mom_title",
    descriptionKey: "programs_data.coding_mom_desc",
    icon: Smartphone,
    type: "professional",
    topics: [
      { icon: BookOpen, titleKey: "regular_events_classes_data.topic1_title", descriptionKey: "regular_events_classes_data.topic1_desc" },
      { icon: Gamepad, titleKey: "regular_events_classes_data.topic2_title", descriptionKey: "regular_events_classes_data.topic2_desc" },
      { icon: Globe, titleKey: "regular_events_classes_data.topic3_title", descriptionKey: "regular_events_classes_data.topic3_desc" },
      { icon: Smartphone, titleKey: "regular_events_classes_data.topic4_title", descriptionKey: "regular_events_classes_data.topic4_desc" },
      { icon: Lock, titleKey: "regular_events_classes_data.topic5_title", descriptionKey: "regular_events_classes_data.topic5_desc" },
      { icon: Cpu, titleKey: "regular_events_classes_data.topic6_title", descriptionKey: "regular_events_classes_data.topic6_desc" },
    ],
  },
];

const ProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProgramType, setSelectedProgramType] = useState("all");

  const filteredPrograms = useMemo(() => {
    if (selectedProgramType === "all") {
      return programs;
    }
    return programs.filter(program => program.type === selectedProgramType);
  }, [selectedProgramType]);

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('programs_page_title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('programs_page_subtitle')}
        </p>
      </section>

      <div className="flex justify-center mb-10">
        <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder={t('select_program_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_programs')}</SelectItem>
            <SelectItem value="kids">{t('kids_classes')}</SelectItem>
            <SelectItem value="private">{t('private_tutoring')}</SelectItem>
            <SelectItem value="professional">{t('professional_training')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="pb-4 flex-grow">
              <div className="flex items-center gap-4 mb-2">
                {program.icon && <program.icon className="text-primary" size={40} />}
                <CardTitle className="text-2xl font-bold">{t(program.titleKey)}</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                {t(program.descriptionKey)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {program.scheduleKey && (
                <p className="text-md text-foreground mb-2 flex items-center gap-2">
                  <CalendarDays size={18} className="text-muted-foreground" />
                  {t('schedule')}: <span className="font-medium">{t(program.scheduleKey)}</span>
                </p>
              )}
              {program.registrationFee && (
                <p className="text-md text-foreground mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-muted-foreground" />
                  {t('registration_fee')}: <span className="font-medium">{program.registrationFee}</span>
                </p>
              )}

              {program.price && (
                <p className="text-md text-foreground mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-muted-foreground" />
                  {t('price')}: <span className="font-medium">{program.price}</span>
                </p>
              )}

              {!program.price && program.priceTable && program.priceTable.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">{t('price_details')}</h3>
                  {program.priceTable.map((table, idx) => (
                    <Card key={idx} className="mb-4 shadow-sm">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-lg font-semibold">{t(table.headerKeys[1])}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[150px]">{t(table.headerKeys[0])}</TableHead>
                              <TableHead className="text-right">{t(table.headerKeys[1])}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.rows.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                <TableCell className="font-medium">{t(row.participantsKey)}</TableCell>
                                <TableCell className="text-right">{row.price}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {program.topics && program.topics.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-primary mb-4">{t('topics_included')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.topics.map((topic, topicIdx) => (
                      <Card key={topicIdx} className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="p-0 pb-2 flex flex-row items-center gap-3">
                          {topic.icon && <topic.icon size={24} className="text-primary flex-shrink-0" />}
                          <CardTitle className="text-base font-semibold">{t(topic.titleKey)}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-sm text-muted-foreground">
                          {t(topic.descriptionKey)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <p className="text-center text-muted-foreground mt-8 text-lg">
          {t('no_programs_available')}
        </p>
      )}

      <Separator className="my-12" />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back_to_home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramsPage;