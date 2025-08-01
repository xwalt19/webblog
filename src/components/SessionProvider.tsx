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
  clearSession: () => void; // New function to explicitly clear session state
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Always start as true to ensure initial check

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

  // Function to explicitly clear session state and local storage
  const clearSession = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('user_profile');
    setLoading(false); // Ensure loading is false after clearing
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

  // Initial session check and listener setup
  useEffect(() => {
    const getInitialSessionAndProfile = async () => {
      setLoading(true); // Ensure loading is true at the start of this process
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("SessionProvider: Error getting initial session:", sessionError);
          clearSession(); // Clear everything on error
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const fetchedProfile = await fetchProfileFromDb(currentSession.user.id);
          setProfile(fetchedProfile);
          localStorage.setItem('supabase_session', JSON.stringify(currentSession));
          localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
        } else {
          clearSession(); // No session, ensure local storage is clear
        }
      } catch (err) {
        console.error("SessionProvider: Unexpected error during initial session check:", err);
        clearSession(); // Clear everything on unexpected error
      } finally {
        setLoading(false); // Always set to false after initial check completes
      }
    };

    getInitialSessionAndProfile();

    // Set up auth state change listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Only set loading true for explicit auth actions (sign in/out/update)
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
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
          // If currentSession is null (e.g., SIGNED_OUT), clear local storage and state
          // This path is primarily for external sign-outs (e.g., from Supabase dashboard)
          // or if clearSession wasn't called by the app's logout button.
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
        // Do NOT navigate here. The component calling `handleLogout` will navigate.
        // This prevents double navigation or race conditions.
      } else if (event === 'USER_UPDATED') {
        toast.info(t('profile updated'));
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, t, fetchProfileFromDb, clearSession]); // Dependencies for useEffect

  return (
    <SessionContext.Provider value={{ session, user, profile, loading, refreshProfile, clearSession }}>
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