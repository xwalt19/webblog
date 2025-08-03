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
  const [loading, setLoading] = useState(true); // Start as true, will be set to false after initial check

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

  // Function to explicitly clear session state (for logout)
  const clearSession = useCallback(() => {
    console.log("SessionProvider: [DEBUG] Clearing local session data.");
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  }, []);

  // Function to refresh profile, exposed via context
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      console.log("SessionProvider: [DEBUG] Manually refreshing profile.");
      try {
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error refreshing profile:", err);
      }
    }
  }, [user, fetchProfileFromDb]);

  // Effect 1: Handle initial session load and auth state changes
  useEffect(() => {
    console.log("SessionProvider: [LIFECYCLE] Component Mounted. Initializing session provider.");

    const getInitialSession = async () => {
      setLoading(true);
      console.log("SessionProvider: [DEBUG] Fetching initial session...");
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        setSession(initialSession);
        setUser(initialSession?.user || null); // Set user based on initial session
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error fetching initial session:", err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("SessionProvider: [DEBUG] Initial session check complete. Loading set to false.");
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`SessionProvider: [DEBUG] Auth state change event: ${event}`, currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null); // Always update user on auth state change

      // Handle toasts and navigation
      if (event === 'SIGNED_IN') {
        toast.success(t('signed in successfully'));
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        toast.info(t('signed out successfully'));
      } else if (event === 'USER_UPDATED') {
        toast.info(t('profile updated'));
      }
    });

    return () => {
      console.log("SessionProvider: [LIFECYCLE] Component Unmounted. Cleaning up auth listener.");
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, t]);

  // Effect 2: Fetch profile whenever the user object changes
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        console.log("SessionProvider: [DEBUG] User object changed, fetching profile...");
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
      } else {
        console.log("SessionProvider: [DEBUG] User object is null, clearing profile.");
        setProfile(null);
      }
    };
    loadProfile();
  }, [user, fetchProfileFromDb]); // This effect runs when 'user' changes

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