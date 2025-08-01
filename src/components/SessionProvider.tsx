"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean; // Indicates if initial session check or an auth action is in progress
  refreshProfile: () => Promise<void>; // Function to manually refresh profile
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Read from localStorage immediately during component initialization
const getInitialSession = (): Session | null => {
  if (typeof window !== 'undefined') {
    const storedSession = localStorage.getItem('supabase_session');
    return storedSession ? JSON.parse(storedSession) : null;
  }
  return null;
};

const getInitialProfile = (): Profile | null => {
  if (typeof window !== 'undefined') {
    const storedProfile = localStorage.getItem('user_profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  }
  return null;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(getInitialSession());
  const [user, setUser] = useState<User | null>(getInitialSession()?.user || null);
  const [profile, setProfile] = useState<Profile | null>(getInitialProfile());
  // `loading` is true initially only if no session data is found in localStorage.
  // This prevents the "loading" flicker if a session is already cached.
  const [loading, setLoading] = useState(!getInitialSession()); 

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Function to fetch profile from DB
  const fetchProfileFromDb = useCallback(async (userId: string) => {
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
  }, []);

  // Function to refresh profile, exposed via context
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      setLoading(true); // Indicate loading for manual refresh
      try {
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
        localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
      } catch (err) {
        console.error("Error refreshing profile:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user, fetchProfileFromDb]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Set loading to true for explicit auth actions (sign in/out/update)
      // or for the initial session check if no local data was found.
      if (event !== 'INITIAL_SESSION' || !getInitialSession()) {
        setLoading(true); 
      }

      try {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const fetchedProfile = await fetchProfileFromDb(currentSession.user.id);
          setProfile(fetchedProfile);
          localStorage.setItem('supabase_session', JSON.stringify(currentSession));
          localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
        } else {
          setProfile(null);
          localStorage.removeItem('supabase_session');
          localStorage.removeItem('user_profile');
        }
      } catch (err) {
        console.error("SessionProvider: Error processing auth state change:", err);
        // Clear session data on error to ensure consistent state
        setSession(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase_session');
        localStorage.removeItem('user_profile');
      } finally {
        setLoading(false); // Always set to false after processing the event
      }

      // Handle toasts and navigation
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

    // Perform an initial session check to ensure `loading` is correctly set
    // and `profile` is fetched if a session exists but wasn't fully loaded from localStorage.
    // This is crucial for cases where localStorage might be stale or incomplete.
    if (getInitialSession() && !getInitialProfile()) { // If session exists but profile doesn't, fetch it
      setLoading(true);
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession?.user) {
          fetchProfileFromDb(currentSession.user.id).then(fetchedProfile => {
            setProfile(fetchedProfile);
            localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
          }).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      }).catch(err => {
        console.error("Error getting initial session for profile fetch:", err);
        setLoading(false);
      });
    } else if (!getInitialSession()) {
      // If no initial session, ensure loading is true until onAuthStateChange handles INITIAL_SESSION
      setLoading(true);
    } else {
      // If both session and profile are already in localStorage, loading is already false
      // and no further action is needed here.
    }


    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, t, fetchProfileFromDb]); // Dependencies for useEffect

  return (
    <SessionContext.Provider value={{ session, user, profile, loading, refreshProfile }}>
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