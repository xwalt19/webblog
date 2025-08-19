"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { getIconComponent } from "@/utils/iconMap";
import { formatDynamicScheduleOrDates } from "@/utils/dateUtils"; // Import new dynamic formatter

interface SupabasePriceTier {
  id: string;
  program_id: string;
  header_key_col1: string;
  header_key_col2: string;
  participants_key: string;
  price: string;
}

interface SupabaseTopic {
  id: string;
  program_id: string;
  icon_name: string;
  title: string;
  description: string;
}

interface SupabaseProgram {
  id: string;
  title: string;
  description: string;
  schedule: string | null; // Now a formatted string
  registration_fee: string | null;
  price: string | null;
  type: "kids" | "private" | "professional";
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
  program_price_tiers: SupabasePriceTier[];
  program_topics: SupabaseTopic[];
}

const ProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProgramType, setSelectedProgramType] = useState("all");
  const [allPrograms, setAllPrograms] = useState<SupabaseProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: programsData, error: programsError } = await supabase
          .from('programs')
          .select('*, program_price_tiers(*), program_topics(*)')
          .order('created_at', { ascending: false });

        if (programsError) {
          throw programsError;
        }
        setAllPrograms(programsData || []);
      } catch (err: any) {
        console.error("Error fetching programs:", err);
        setError(t("fetch data error", { error: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [t]);

  const filteredPrograms = useMemo(() => {
    if (selectedProgramType === "all") {
      return allPrograms;
    }
    return allPrograms.filter(program => program.type === selectedProgramType);
  }, [selectedProgramType, allPrograms]);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('our programs page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('our programs page subtitle')}
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

      {loading ? (
        <p className="text-center text-muted-foreground">{t('loading programs')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredPrograms.map((program) => {
            const ProgramIcon = getIconComponent(program.icon_name);
            return (
              <Card key={program.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-4 flex-grow">
                  <div className="flex items-center gap-4 mb-2">
                    {ProgramIcon && <ProgramIcon className="text-primary" size={40} />}
                    <CardTitle className="text-2xl font-bold">{program.title}</CardTitle>
                  </div>
                  <div
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: program.description }}
                  />
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  {program.schedule && (
                    <p className="text-md text-foreground mb-2 flex items-center gap-2">
                      {t('schedule label')}: <span className="font-medium">{formatDynamicScheduleOrDates(program.schedule)}</span>
                    </p>
                  )}
                  {program.registration_fee && (
                    <p className="text-md text-foreground mb-4 flex items-center gap-2">
                      {t('registration fee label')}: <span className="font-medium">{program.registration_fee}</span>
                    </p>
                  )}

                  {!program.price && program.program_price_tiers && program.program_price_tiers.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('price details')}</h3>
                      <Card className="mb-4 shadow-sm">
                        <CardHeader className="p-3 pb-2">
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[150px] text-left">{t('number of meetings')}</TableHead>
                                <TableHead className="text-right">{t('price')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {program.program_price_tiers.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  <TableCell className="font-medium">{row.participants_key}</TableCell>
                                  <TableCell className="text-right">{row.price}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {program.program_topics && program.program_topics.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-foreground mb-4">{t('topics included')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {program.program_topics.map((topic, topicIdx) => {
                          const TopicIcon = getIconComponent(topic.icon_name);
                          return (
                            <Card key={topicIdx} className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <CardHeader className="p-0 pb-2 flex flex-row items-center gap-3">
                                {TopicIcon && <TopicIcon size={24} className="text-primary flex-shrink-0" />}
                                <CardTitle className="text-base font-semibold">{topic.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0 text-sm text-muted-foreground">
                                {topic.description}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredPrograms.length === 0 && !loading && (
        <p className="text-center text-muted-foreground mt-8 text-lg">
          {t('no programs available')}
        </p>
      )}

      <Separator className="my-12" />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramsPage;