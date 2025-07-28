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
import { programs, Program, PriceTier, Topic } from "@/data/programs";

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('programs page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('programs page subtitle')}
        </p>
      </section>

      <div className="flex justify-center mb-10">
        <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder={t('select program type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all programs')}</SelectItem>
            <SelectItem value="kids">{t('kids classes')}</SelectItem>
            <SelectItem value="private">{t('private tutoring')}</SelectItem>
            <SelectItem value="professional">{t('professional training')}</SelectItem>
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
                  {t('registration fee')}: <span className="font-medium">{program.registrationFee}</span>
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
                  <h3 className="text-lg font-semibold text-primary mb-2">{t('price details')}</h3>
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
                  <h3 className="text-lg font-semibold text-primary mb-4">{t('topics included')}</h3>
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
          {t('no programs available')}
        </p>
      )}

      <Separator className="my-12" />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('back to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramsPage;