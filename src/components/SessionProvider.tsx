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
  const [loading, setLoading] = useState(true); // Start as true

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Function to fetch profile from DB
  const fetchProfileFromDb = useCallback(async (userId: string) => {
    console.log("SessionProvider: [DEBUG] Attempting to fetch profile for user ID:", userId);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("SessionProvider: [ERROR] Error fetching profile:", profileError);
      return null;
    }
    console.log("SessionProvider: [DEBUG] Profile fetched:", profileData);
    return profileData;
  }, []);

  const clearSession = useCallback(() => {
    console.log("SessionProvider: [DEBUG] Clearing local session data.");
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false); // Ensure loading is false after clearing
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      console.log("SessionProvider: [DEBUG] Manually refreshing profile.");
      setLoading(true); // Set loading true when manually refreshing
      try {
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error refreshing profile:", err);
      } finally {
        setLoading(false); // Set loading false after manual refresh
      }
    }
  }, [user, fetchProfileFromDb]);

  // Main effect: Load initial session and profile, and set up auth state change listener
  useEffect(() => {
    console.log("SessionProvider: [LIFECYCLE] Component Mounted. Initializing session provider.");

    const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
      console.log(`SessionProvider: [DEBUG] Auth state change event: ${event}`, currentSession);
      setLoading(true); // Set loading true at the start of any auth state change processing

      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);

      let fetchedProfile: Profile | null = null;
      if (currentUser?.id) {
        fetchedProfile = await fetchProfileFromDb(currentUser.id);
      }
      setProfile(fetchedProfile);
      setLoading(false); // Set loading to false only after session and profile are processed

      // Handle toasts and navigation
      if (event === 'SIGNED_IN') {
        toast.success(t('signed in successfully'));
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        toast.info(t('signed out successfully'));
        // If signed out, ensure we are not on protected routes
        if (location.pathname !== '/login' && location.pathname !== '/') { // Add other public routes if necessary
          navigate('/login');
        }
      } else if (event === 'USER_UPDATED') {
        toast.info(t('profile updated'));
      }
    };

    // Fetch initial session and profile immediately
    supabase.auth.getSession().then(({ data: { session: initialSession }, error: sessionError }) => {
      if (sessionError) {
        console.error("SessionProvider: [ERROR] Error fetching initial session:", sessionError);
        handleAuthStateChange('INITIAL_LOAD_ERROR', null); // Treat as signed out on error
      } else {
        handleAuthStateChange('INITIAL_LOAD', initialSession);
      }
    });

    // Set up the real-time listener for subsequent auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup subscription on unmount
    return () => {
      console.log("SessionProvider: [LIFECYCLE] Component Unmounted. Cleaning up auth listener.");
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, t, fetchProfileFromDb]); // Dependencies for this main effect

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