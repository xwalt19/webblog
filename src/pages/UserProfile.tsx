"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, user, profile, loading: sessionLoading } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // Keep this for initial data fetch

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else {
        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
        }
        setDataLoading(false); // Set to false once profile data is loaded or determined
      }
    }
  }, [session, profile, sessionLoading, navigate, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdating(true);

    if (!user) {
      toast.error(t('not authenticated'));
      setUpdating(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      toast.success(t("profile updated successfully"));
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(t("profile update failed", { error: err.message }));
    } finally {
      setUpdating(false);
    }
  };

  if (sessionLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary capitalize">{t('my profile')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('my profile subtitle')}
        </p>
      </section>

      <Card className="max-w-xl mx-auto p-6 md:p-8 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold mb-2">{t('edit profile information')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('edit profile information description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">{t('email label')}</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-1 bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="firstName">{t('first name label')}</Label>
              <Input
                id="firstName"
                type="text"
                placeholder={t('first name placeholder')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('last name label')}</Label>
              <Input
                id="lastName"
                type="text"
                placeholder={t('last name placeholder')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">{t('role label')}</Label>
              <Input
                id="role"
                type="text"
                value={profile?.role || t('member role')}
                disabled
                className="mt-1 bg-muted"
              />
            </div>
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? t('updating status') : t('save changes button')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;