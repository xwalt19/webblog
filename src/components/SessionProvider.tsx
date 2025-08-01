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
  // This is the key for instant display on refresh if data is cached.
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
    // This function will handle updating session and profile states, and localStorage
    const updateSessionAndProfile = async (currentSession: Session | null) => {
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
    };

    // Initial session check and setup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // For 'INITIAL_SESSION' event, if we already have data from localStorage,
      // we don't want to show a loading spinner. We only set loading to true
      // if we truly don't have any session data initially.
      if (event === 'INITIAL_SESSION') {
        if (!initialSessionData) { // Only show loading if no initial data from localStorage
          setLoading(true);
        }
        await updateSessionAndProfile(currentSession);
        setLoading(false); // Always set to false after initial session is processed
      } else if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // For explicit auth actions, we show loading
        setLoading(true);
        await updateSessionAndProfile(currentSession);
        setLoading(false);
      }

      // Handle toasts and navigation for explicit auth events
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