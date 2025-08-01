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
    const setupSession = async () => {
      // Only set loading to true if we truly don't have any session data at all
      // This prevents showing a loader if we already have data from localStorage
      if (!initialSessionData) {
        setLoading(true);
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Update state based on actual Supabase session
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
        console.error("SessionProvider: Error during initial session fetch:", err);
        setSession(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase_session');
        localStorage.removeItem('user_profile');
      } finally {
        setLoading(false); // Always set to false after initial fetch is complete
      }
    };

    setupSession(); // Call once on mount

    // This listener handles *subsequent* auth state changes (login, logout, user update)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // For actual auth events, we want to show loading briefly
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setLoading(true);
      }

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
        setLoading(false); // Ensure loading is always set to false after processing
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