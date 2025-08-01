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

  // Function to explicitly clear session state and local storage
  const clearSession = useCallback(() => {
    console.log("SessionProvider: [DEBUG] Clearing session data.");
    setSession(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('user_profile');
    console.log("SessionProvider: [STATE] setLoading(false) from clearSession");
    setLoading(false); // Ensure loading is false after clearing
  }, []); // No dependencies, so this function reference is stable

  // Function to refresh profile, exposed via context
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      console.log("SessionProvider: [STATE] setLoading(true) from refreshProfile");
      setLoading(true); // Indicate loading for manual refresh
      console.log("SessionProvider: [DEBUG] Manually refreshing profile.");
      try {
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
        localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error refreshing profile:", err);
      } finally {
        console.log("SessionProvider: [STATE] setLoading(false) from refreshProfile finally");
        setLoading(false);
      }
    }
  }, [user, fetchProfileFromDb]); // Depends on `user` and `fetchProfileFromDb` (which is stable)

  // Main effect for session management
  useEffect(() => {
    console.log("SessionProvider: [LIFECYCLE] Component Mounted. Initializing session provider and setting up auth listener.");
    
    // --- START: Load from localStorage for instant UI ---
    try {
      const storedSession = localStorage.getItem('supabase_session');
      const storedProfile = localStorage.getItem('user_profile');

      if (storedSession && storedProfile) {
        const parsedSession: Session = JSON.parse(storedSession);
        const parsedProfile: Profile = JSON.parse(storedProfile);
        setSession(parsedSession);
        setUser(parsedSession.user);
        setProfile(parsedProfile);
        setLoading(false); // UI can render immediately with stored data
        console.log("SessionProvider: [DEBUG] Loaded initial state from localStorage. Loading set to false.");
      } else {
        setLoading(true); // If no stored data, keep loading true and wait for Supabase auth
        console.log("SessionProvider: [DEBUG] No initial state in localStorage, waiting for Supabase auth.");
      }
    } catch (e) {
      console.error("SessionProvider: [ERROR] Error parsing localStorage data:", e);
      clearSession(); // Clear corrupted data
      setLoading(true); // Wait for Supabase auth
    }
    // --- END: Load from localStorage ---

    // Set up the real-time auth state change listener for authoritative updates
    // This effect should only run once on mount and once on unmount.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`SessionProvider: [DEBUG] Auth state change event: ${event}`, currentSession);
      
      // Always set loading to true when an auth event is being processed,
      // unless it's the initial session check and we already loaded from localStorage.
      // This ensures UI reflects pending auth state changes.
      // However, if we just loaded from localStorage and currentSession is null (initial state),
      // we should not set loading to true again.
      if (event !== 'INITIAL_SESSION' || !localStorage.getItem('supabase_session')) {
         setLoading(true); // Indicate that we are processing an auth event
         console.log("SessionProvider: [STATE] setLoading(true) from auth state change event processing");
      }

      try {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          // Always fetch the latest profile if a user is present in the session.
          // This ensures the profile is up-to-date after any auth event (SIGN_IN, USER_UPDATED).
          console.log("SessionProvider: [DEBUG] User present in session, fetching/refreshing profile from DB...");
          const fetchedProfile = await fetchProfileFromDb(currentSession.user.id);
          setProfile(fetchedProfile);
          localStorage.setItem('supabase_session', JSON.stringify(currentSession));
          localStorage.setItem('user_profile', JSON.stringify(fetchedProfile));
          console.log("SessionProvider: [DEBUG] Profile fetch/refresh complete.");
        } else {
          // No user in currentSession (e.g., SIGNED_OUT, or no session on INITIAL_SESSION)
          console.log("SessionProvider: [DEBUG] No user found or signed out from auth event, clearing local data.");
          setProfile(null);
          localStorage.removeItem('supabase_session');
          localStorage.removeItem('user_profile');
        }
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error processing auth state change:", err);
        // Clear session data on error to ensure consistent state
        setSession(null);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase_session');
        localStorage.removeItem('user_profile');
      } finally {
        // Always set loading to false after processing the auth event
        console.log("SessionProvider: [STATE] setLoading(false) from auth state change finally");
        setLoading(false);
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

    return () => {
      console.log("SessionProvider: [LIFECYCLE] Component Unmounted. Cleaning up auth listener.");
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, t, fetchProfileFromDb, clearSession]); // Dependensi yang stabil

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