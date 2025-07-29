"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle } from "lucide-react";
import { iconMap } from "@/utils/iconMap";

interface Program {
  id: string;
  title: string;
  description: string;
  schedule: string | null;
  registration_fee: string | null;
  price: string | null;
  type: "kids" | "private" | "professional";
  icon_name: string | null;
  created_by: string | null;
  created_at: string;
}

interface PriceTier {
  id?: string; // Optional for new tiers
  header_key_col1: string;
  header_key_col2: string;
  participants_key: string;
  price: string;
}

interface Topic {
  id?: string; // Optional for new topics
  icon_name: string;
  title: string;
  description: string;
}

const UploadProgram: React.FC = () => {
  const { id: programId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"kids" | "private" | "professional">("kids");
  const [iconName, setIconName] = useState("");
  const [priceTables, setPriceTables] = useState<PriceTier[][]>([]); // Array of arrays for multiple tables
  const [topics, setTopics] = useState<Topic[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const programTypes = ["kids", "private", "professional"];
  const availableIcons = Object.keys(iconMap);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('auth.login required'));
        navigate('/login');
      } else if (profile?.role !== 'admin') {
        toast.error(t('auth.admin access required'));
        navigate('/');
      } else {
        if (programId) {
          fetchProgramData(programId);
        } else {
          setDataLoading(false); // Ready for new program if no ID
        }
      }
    }
  }, [session, profile, sessionLoading, navigate, t, programId]);

  const fetchProgramData = async (id: string) => {
    setDataLoading(true);
    try {
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();

      if (programError) throw programError;

      if (programData) {
        setTitle(programData.title || "");
        setDescription(programData.description || "");
        setSchedule(programData.schedule || "");
        setRegistrationFee(programData.registration_fee || "");
        setPrice(programData.price || "");
        setType(programData.type || "kids");
        setIconName(programData.icon_name || "");

        // Fetch related price tiers
        const { data: priceTiersData, error: priceTiersError } = await supabase
          .from('program_price_tiers')
          .select('*')
          .eq('program_id', id);
        if (priceTiersError) throw priceTiersError;
        // Group price tiers by header_key_col1 to reconstruct tables
        const groupedPriceTiers: { [key: string]: PriceTier[] } = {};
        priceTiersData.forEach(tier => {
          if (!groupedPriceTiers[tier.header_key_col1]) {
            groupedPriceTiers[tier.header_key_col1] = [];
          }
          groupedPriceTiers[tier.header_key_col1].push(tier);
        });
        setPriceTables(Object.values(groupedPriceTiers));

        // Fetch related topics
        const { data: topicsData, error: topicsError } = await supabase
          .from('program_topics')
          .select('*')
          .eq('program_id', id);
        if (topicsError) throw topicsError;
        setTopics(topicsData || []);
      }
    } catch (err: any) {
      console.error("Error fetching program data:", err);
      toast.error(t("upload program.fetch error", { error: err.message }));
      navigate('/admin/manage-programs');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddPriceTable = () => {
    setPriceTables([...priceTables, [{ header_key_col1: "", header_key_col2: "", participants_key: "", price: "" }]]);
  };

  const handleRemovePriceTable = (index: number) => {
    const newPriceTables = priceTables.filter((_, i) => i !== index);
    setPriceTables(newPriceTables);
  };

  const handlePriceTierChange = (tableIndex: number, rowIndex: number, field: keyof PriceTier, value: string) => {
    const newPriceTables = [...priceTables];
    newPriceTables[tableIndex][rowIndex] = { ...newPriceTables[tableIndex][rowIndex], [field]: value };
    setPriceTables(newPriceTables);
  };

  const handleAddPriceTierRow = (tableIndex: number) => {
    const newPriceTables = [...priceTables];
    newPriceTables[tableIndex] = [...newPriceTables[tableIndex], { header_key_col1: "", header_key_col2: "", participants_key: "", price: "" }];
    setPriceTables(newPriceTables);
  };

  const handleRemovePriceTierRow = (tableIndex: number, rowIndex: number) => {
    const newPriceTables = [...priceTables];
    newPriceTables[tableIndex] = newPriceTables[tableIndex].filter((_, i) => i !== rowIndex);
    setPriceTables(newPriceTables);
  };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);

    if (!title || !description || !type) {
      toast.error(t("upload program.required fields missing"));
      setUploading(false);
      return;
    }

    try {
      const programData = {
        title,
        description,
        schedule: schedule || null,
        registration_fee: registrationFee || null,
        price: price || null,
        type,
        icon_name: iconName || null,
        ...(programId ? {} : { created_by: session?.user?.id, created_at: new Date().toISOString() }),
      };

      let currentProgramId = programId;
      let error;

      if (programId) {
        // Update existing program
        const { error: updateError } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', programId);
        error = updateError;
      } else {
        // Insert new program
        const { data, error: insertError } = await supabase
          .from('programs')
          .insert([programData])
          .select('id')
          .single();
        error = insertError;
        if (data) currentProgramId = data.id;
      }

      if (error) throw error;
      if (!currentProgramId) throw new Error("Program ID not found after save.");

      // Handle price tiers
      // First, delete existing price tiers for this program
      await supabase.from('program_price_tiers').delete().eq('program_id', currentProgramId);
      // Then, insert new/updated price tiers
      if (priceTables.length > 0) {
        const allTiersToInsert = priceTables.flat().map(tier => ({
          ...tier,
          program_id: currentProgramId,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: priceTiersError } = await supabase.from('program_price_tiers').insert(allTiersToInsert);
        if (priceTiersError) throw priceTiersError;
      }

      // Handle topics
      // First, delete existing topics for this program
      await supabase.from('program_topics').delete().eq('program_id', currentProgramId);
      // Then, insert new/updated topics
      if (topics.length > 0) {
        const allTopicsToInsert = topics.map(topic => ({
          ...topic,
          program_id: currentProgramId,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
        }));
        const { error: topicsError } = await supabase.from('program_topics').insert(allTopicsToInsert);
        if (topicsError) throw topicsError;
      }

      toast.success(programId ? t("upload program.program updated successfully") : t("upload program.program added successfully"));
      navigate('/admin/manage-programs');

    } catch (err: any) {
      console.error("Error saving program:", err);
      toast.error(t("upload program.save failed", { error: err.message }));
    } finally {
      setUploading(false);
    }
  };

  if (sessionLoading || dataLoading || (!session && !sessionLoading) || (session && profile?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          {programId ? t('upload program.edit program title') : t('upload program.add program title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {programId ? t('upload program.edit program subtitle') : t('upload program.add program subtitle')}
        </p>
      </section>

      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {programId ? t('upload program.edit program') : t('add new program')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {programId ? t('upload program.fill form to edit program') : t('fill form to add new program')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('upload program.title label')}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t('upload program.title placeholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">{t('upload program.description label')}</Label>
              <Textarea
                id="description"
                placeholder={t('upload program.description placeholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="type">{t('upload program.type label')}</Label>
              <Select value={type} onValueChange={(value: "kids" | "private" | "professional") => setType(value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('upload program.select type')} />
                </SelectTrigger>
                <SelectContent>
                  {programTypes.map(pType => (
                    <SelectItem key={pType} value={pType}>{t(`program types.${pType}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="iconName">{t('upload program.icon label')}</Label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('upload program.select icon')} />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {iconName && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  {t('upload program.selected icon preview')}: {React.createElement(iconMap[iconName], { className: "h-4 w-4" })} {iconName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="schedule">{t('upload program.schedule label')}</Label>
              <Input
                id="schedule"
                type="text"
                placeholder={t('upload program.schedule placeholder')}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="registrationFee">{t('upload program.registration fee label')}</Label>
              <Input
                id="registrationFee"
                type="text"
                placeholder={t('upload program.registration fee placeholder')}
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price">{t('upload program.price label')}</Label>
              <Input
                id="price"
                type="text"
                placeholder={t('upload program.price placeholder')}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('upload program.price hint')}
              </p>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-semibold mb-4">{t('upload program.price tables')}</h3>
            {priceTables.map((table, tableIndex) => (
              <Card key={tableIndex} className="p-4 mb-4 border border-border">
                <div className="flex justify-end mb-2">
                  <Button variant="destructive" size="sm" onClick={() => handleRemovePriceTable(tableIndex)}>
                    <MinusCircle className="h-4 w-4 mr-2" /> {t('upload program.remove table')}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>{t('upload program.header col1 label')}</Label>
                    <Input
                      value={table[0]?.header_key_col1 || ""}
                      onChange={(e) => handlePriceTierChange(tableIndex, 0, 'header_key_col1', e.target.value)}
                      placeholder={t('upload program.header col1 placeholder')}
                    />
                  </div>
                  <div>
                    <Label>{t('upload program.header col2 label')}</Label>
                    <Input
                      value={table[0]?.header_key_col2 || ""}
                      onChange={(e) => handlePriceTierChange(tableIndex, 0, 'header_key_col2', e.target.value)}
                      placeholder={t('upload program.header col2 placeholder')}
                    />
                  </div>
                </div>
                {table.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder={t('upload program.participants key placeholder')}
                      value={row.participants_key}
                      onChange={(e) => handlePriceTierChange(tableIndex, rowIndex, 'participants_key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder={t('upload program.price value placeholder')}
                      value={row.price}
                      onChange={(e) => handlePriceTierChange(tableIndex, rowIndex, 'price', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="destructive" size="icon" onClick={() => handleRemovePriceTierRow(tableIndex, rowIndex)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => handleAddPriceTierRow(tableIndex)} className="mt-2">
                  <PlusCircle className="h-4 w-4 mr-2" /> {t('upload program.add row')}
                </Button>
              </Card>
            ))}
            <Button type="button" variant="secondary" onClick={handleAddPriceTable}>
              <PlusCircle className="h-4 w-4 mr-2" /> {t('upload program.add price table')}
            </Button>

            <Separator className="my-6" />
            <h3 className="text-lg font-semibold mb-4">{t('upload program.topics')}</h3>
            {topics.map((topic, index) => (
              <Card key={index} className="p-4 mb-4 border border-border">
                <div className="flex justify-end mb-2">
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveTopic(index)}>
                    <MinusCircle className="h-4 w-4 mr-2" /> {t('upload program.remove topic')}
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label>{t('upload program.topic icon label')}</Label>
                    <Select value={topic.icon_name} onValueChange={(value) => handleTopicChange(index, 'icon_name', value)}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder={t('upload program.select icon')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {topic.icon_name && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        {t('upload program.selected icon preview')}: {React.createElement(iconMap[topic.icon_name], { className: "h-4 w-4" })} {topic.icon_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>{t('upload program.topic title label')}</Label>
                    <Input
                      placeholder={t('upload program.topic title placeholder')}
                      value={topic.title}
                      onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t('upload program.topic description label')}</Label>
                    <Textarea
                      placeholder={t('upload program.topic description placeholder')}
                      value={topic.description}
                      onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button type="button" variant="secondary" onClick={handleAddTopic}>
              <PlusCircle className="h-4 w-4 mr-2" /> {t('upload program.add topic')}
            </Button>

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? t('uploading') : (programId ? t('upload program.save changes') : t('upload program.submit button'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/admin/manage-programs">
          <Button>{t('back to programs list')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UploadProgram;