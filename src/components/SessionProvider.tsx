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

// Read from localStorage immediately during component initialization
const initialStoredSession = typeof window !== 'undefined' ? localStorage.getItem('supabase_session') : null;
const initialStoredProfile = typeof window !== 'undefined' ? localStorage.getItem('user_profile') : null;

const initialSessionData = initialStoredSession ? JSON.parse(initialStoredSession) : null;
const initialProfileData = initialStoredProfile ? JSON.parse(initialStoredProfile) : null;

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(initialSessionData);
  const [user, setUser] = useState<User | null>(initialSessionData?.user || null);
  const [profile, setProfile] = useState<{ id: string; first_name: string; last_name: string; role: string } | null>(initialProfileData);
  // Set loading to false if we have initial data from localStorage, true otherwise
  const [loading, setLoading] = useState(!initialSessionData);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Function to fetch profile from DB
  const fetchProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("SessionProvider: Error fetching profile:", profileError);
      return null;
    }
    return profileData;
  };

  useEffect(() => {
    const fetchLatestSessionAndProfile = async () => {
      // Only set loading to true if we truly don't have any session data at all
      // This prevents showing a loader if we already have data from localStorage
      if (!session && !user && !profile) {
        setLoading(true);
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Only update state if there's a change or if we didn't have initial data
        if (currentSession?.user?.id !== user?.id || JSON.stringify(currentSession) !== JSON.stringify(session)) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            const fetchedProfile = await fetchProfile(currentSession.user.id);
            setProfile(fetchedProfile);
            localStorage.setItem('supabase_session', JSON.stringify(currentSession));
            localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
          } else {
            setProfile(null);
            localStorage.removeItem('supabase_session');
            localStorage.removeItem('user_profile');
          }
        }
      } catch (err) {
        console.error("SessionProvider: Error during background session/profile refresh:", err);
        // On error, clear session to avoid stale data, but don't block UI
        setSession(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase_session');
        localStorage.removeItem('user_profile');
      } finally {
        setLoading(false); // Always set to false after the initial/background fetch
      }
    };

    // Run this once on mount to fetch the latest session/profile
    fetchLatestSessionAndProfile();

    // The onAuthStateChange listener should still handle real-time updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // For auth state changes (like SIGNED_IN, SIGNED_OUT), we *do* want to show loading
      // as a new state is being established and verified.
      setLoading(true);
      try {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const fetchedProfile = await fetchProfile(currentSession.user.id);
          setProfile(fetchedProfile);
          localStorage.setItem('supabase_session', JSON.stringify(currentSession));
          localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
        } else {
          setProfile(null);
          localStorage.removeItem('supabase_session');
          localStorage.removeItem('user_profile');
        }
      } catch (err) {
        console.error("SessionProvider: Error during auth state change processing:", err);
        setSession(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase_session');
        localStorage.removeItem('user_profile');
      } finally {
        setLoading(false);
      }

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