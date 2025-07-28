"use client";

import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionProvider';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button'; // Import Button

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const { t } = useTranslation();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in'); // State untuk mengelola tampilan

  useEffect(() => {
    if (session && !loading) {
      navigate('/'); // Redirect ke home jika sudah login
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          {view === 'sign_in' ? t('auth.login title') : t('auth.register title')}
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  defaultButtonBackground: 'hsl(var(--primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--primary-foreground))',
                  defaultButtonBorder: 'hsl(var(--primary))',
                  defaultButtonText: 'hsl(var(--primary-foreground))',
                  anchorTextColor: 'hsl(var(--primary))',
                  anchorTextHoverColor: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light" // Gunakan tema terang
          providers={[]} // Tidak ada penyedia pihak ketiga untuk saat ini
          redirectTo={window.location.origin} // Redirect ke home setelah aksi otentikasi
          view={view} // Atur tampilan secara dinamis
        />
        <div className="mt-4 text-center">
          {view === 'sign_in' ? (
            <p className="text-muted-foreground">
              {t('auth.no account yet')}
              <Button variant="link" onClick={() => setView('sign_up')} className="p-0 h-auto ml-1 text-primary hover:text-primary-foreground">
                {t('auth.sign up')}
              </Button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              {t('auth.already have account')}
              <Button variant="link" onClick={() => setView('sign_in')} className="p-0 h-auto ml-1 text-primary hover:text-primary-foreground">
                {t('auth.sign in')}
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;