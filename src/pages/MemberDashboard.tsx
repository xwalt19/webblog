"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { User as UserIcon, LayoutDashboard } from "lucide-react";

const MemberDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">{t('access denied')}</h1>
          <p className="text-lg text-muted-foreground mb-6">{t('login to view dashboard')}</p>
          <Link to="/login">
            <Button>{t('sign in')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('member dashboard title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('member dashboard subtitle', { name: profile?.first_name || user.email })}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('my profile')}</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Link to="/profile" className="mt-4 block">
              <Button variant="outline" className="w-full">{t('view profile')}</Button>
            </Link>
          </CardContent>
        </Card>

        {profile?.role === 'admin' && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin tools')}</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{t('admin access')}</p>
              <p className="text-sm text-muted-foreground">{t('full control over content')}</p>
              <Link to="/admin" className="mt-4 block">
                <Button className="w-full">{t('go to admin dashboard')}</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('explore programs')}</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{t('learn something new')}</p>
            <p className="text-sm text-muted-foreground">{t('check out our courses and camps')}</p>
            <Link to="/info/programs" className="mt-4 block">
              <Button variant="outline" className="w-full">{t('view programs')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default MemberDashboard;