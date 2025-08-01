"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: { id: string; first_name: string; last_name: string; role: string } | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ id: string; first_name: string; last_name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true); // Start as true
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const loadSessionAndProfile = async () => {
      setLoading(true); // Ensure loading is true at the start of any session/profile fetch operation
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user || null);

      if (initialSession?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('id', initialSession.user.id)
          .single();

        if (profileError) {
          console.error("SessionProvider: Error fetching profile during initial load:", profileError);
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }
      setLoading(false); // Set loading to false only after profile is also updated
    };

    loadSessionAndProfile(); // Call once on mount for initial state

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setLoading(true); // Set loading to true when auth state changes, until new profile is fetched
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('id', currentSession.user.id)
          .single();

        if (profileError) {
          console.error("SessionProvider: Error fetching profile on auth change:", profileError);
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }
      setLoading(false); // Set loading to false after profile is updated

      if (event === 'SIGNED_IN') {
        toast.success(t('signed in successfully'));
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        toast.info(t('signed out successfully'));
        navigate('/login');
      } else if (event === 'USER_UPDATED') {
        toast.info(t('profile updated'));
        // Profile is already fetched above, no need for another fetchProfile call here.
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, t]); // Dependencies for useEffect

  return (
    <SessionContext.Provider value={{ session, user, profile, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};