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
  }, []); // No dependencies, so this function reference is stable

  // Function to process auth data and update states (without touching loading)
  const processAuthData = useCallback(async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user || null);

    if (currentSession?.user) {
      console.log("SessionProvider: [DEBUG] User present, fetching profile for state update...");
      const fetchedProfile = await fetchProfileFromDb(currentSession.user.id);
      setProfile(fetchedProfile);
    } else {
      console.log("SessionProvider: [DEBUG] No user found, clearing profile for state update.");
      setProfile(null);
    }
  }, [fetchProfileFromDb]);

  // Function to explicitly clear session state (for logout)
  const clearSession = useCallback(() => {
    console.log("SessionProvider: [DEBUG] Clearing local session data.");
    setSession(null);
    setUser(null);
    setProfile(null);
    // Supabase handles clearing its own localStorage on signOut()
    setLoading(false); // Ensure loading is false after clearing
  }, []);

  // Function to refresh profile, exposed via context
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      // For manual refresh, we can briefly show loading if needed, but not the full app overlay.
      // For now, let's just update the profile without changing the global loading state.
      console.log("SessionProvider: [DEBUG] Manually refreshing profile.");
      try {
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error refreshing profile:", err);
      }
    }
  }, [user, fetchProfileFromDb]); // Depends on `user` and `fetchProfileFromDb`

  // Main effect for initial session load and auth state changes
  useEffect(() => {
    console.log("SessionProvider: [LIFECYCLE] Component Mounted. Initializing session provider.");

    // 1. Fetch initial session and profile immediately on mount
    const getInitialData = async () => {
      setLoading(true); // Ensure loading is true at the very start of initial data fetch
      console.log("SessionProvider: [DEBUG] Fetching initial session and profile...");
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        // Process the initial session data
        await processAuthData(initialSession);

      } catch (err) {
        console.error("SessionProvider: [ERROR] Error fetching initial session or profile:", err);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false); // Crucially, set loading to false *only once* after initial check
        console.log("SessionProvider: [DEBUG] Initial session check complete. Loading set to false.");
      }
    };

    getInitialData(); // Call it immediately on mount

    // 2. Set up real-time auth state change listener for subsequent events
    // This listener should NOT manipulate the global 'loading' state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`SessionProvider: [DEBUG] Auth state change event: ${event}`, currentSession);
      
      // Only process auth data, do NOT touch setLoading here.
      await processAuthData(currentSession);

      // Handle toasts and navigation
      if (event === 'SIGNED_IN') {
        toast.success(t('signed in successfully'));
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        toast.info(t('signed out successfully'));
        // The component calling `handleLogout` will handle navigation.
      } else if (event === 'USER_UPDATED') {
        toast.info(t('profile updated'));
      }
    });

    return () => {
      console.log("SessionProvider: [LIFECYCLE] Component Unmounted. Cleaning up auth listener.");
      subscription.unsubscribe();
    };
  }, [fetchProfileFromDb, navigate, location.pathname, t, processAuthData]); // Dependencies are now stable functions/values.

  // Render children only when loading is false
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

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