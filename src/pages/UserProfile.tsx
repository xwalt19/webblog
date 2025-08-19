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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, user, loading: sessionLoading, refreshProfile } = useSession();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Fetch user profile data using react-query
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, error: profileError } = useQuery<UserProfileData, Error>({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated.");
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !sessionLoading, // Only fetch if user is available and session is not loading
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });

  // Update form fields when profile data changes
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  // Mutation for updating user profile
  const updateProfileMutation = useMutation<void, Error, { firstName: string, lastName: string }>({
    mutationFn: async ({ firstName, lastName }) => {
      if (!user) throw new Error(t('not authenticated'));
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("profile updated successfully"));
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] }); // Invalidate to refetch fresh data
      refreshProfile(); // Also trigger refresh in SessionProvider
    },
    onError: (err) => {
      console.error("Error updating profile:", err);
      toast.error(t("profile update failed", { error: err.message }));
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    updateProfileMutation.mutate({ firstName, lastName });
  };

  // Handle authentication and loading states
  if (sessionLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!session) {
    // If not logged in, redirect to login
    useEffect(() => {
      toast.error(t('login required'));
      navigate('/login');
    }, [navigate, t]);
    return null;
  }

  if (isProfileError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{t("fetch data error", { error: profileError?.message })}</p>
        <div className="text-center mt-12">
          <Link to="/">
            <Button>{t('return to home')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('my profile')}</h1>
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
            <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? t('updating status') : t('save changes button')}
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