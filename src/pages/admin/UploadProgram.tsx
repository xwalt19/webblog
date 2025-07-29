"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import ProgramFormFields from "@/components/admin/ProgramFormFields";
import ProgramPriceTables from "@/components/admin/ProgramPriceTables";
import ProgramTopics from "@/components/admin/ProgramTopics";

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
  id?: string;
  header_key_col1: string;
  header_key_col2: string;
  participants_key: string;
  price: string;
}

interface Topic {
  id?: string;
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
  const [priceTables, setPriceTables] = useState<PriceTier[][]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

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
          setDataLoading(false);
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

        const { data: priceTiersData, error: priceTiersError } = await supabase
          .from('program_price_tiers')
          .select('*')
          .eq('program_id', id);
        if (priceTiersError) throw priceTiersError;
        const groupedPriceTiers: { [key: string]: PriceTier[] } = {};
        priceTiersData.forEach(tier => {
          if (!groupedPriceTiers[tier.header_key_col1]) {
            groupedPriceTiers[tier.header_key_col1] = [];
          }
          groupedPriceTiers[tier.header_key_col1].push(tier);
        });
        setPriceTables(Object.values(groupedPriceTiers));

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
        const { error: updateError } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', programId);
        error = updateError;
      } else {
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

      await supabase.from('program_price_tiers').delete().eq('program_id', currentProgramId);
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

      await supabase.from('program_topics').delete().eq('program_id', currentProgramId);
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
            <ProgramFormFields
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              schedule={schedule}
              setSchedule={setSchedule}
              registrationFee={registrationFee}
              setRegistrationFee={setRegistrationFee}
              price={price}
              setPrice={setPrice}
              type={type}
              setType={setType}
              iconName={iconName}
              setIconName={setIconName}
            />

            <ProgramPriceTables
              priceTables={priceTables}
              setPriceTables={setPriceTables}
            />

            <ProgramTopics
              topics={topics}
              setTopics={setTopics}
            />

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