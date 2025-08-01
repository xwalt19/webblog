"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'; // Import useRef
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

  // Use refs for mutable values that should not trigger effect re-runs
  const profileRef = useRef(profile);

  // Update refs whenever state changes
  useEffect(() => { profileRef.current = profile; }, [profile]);


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

  // Function to explicitly clear session state (for logout)
  const clearSession = useCallback(() => {
    console.log("SessionProvider: [DEBUG] Clearing local session data.");
    setSession(null);
    setUser(null);
    setProfile(null);
    // Supabase handles clearing its own localStorage on signOut()
    setLoading(false);
  }, []);

  // Function to refresh profile, exposed via context
  const refreshProfile = useCallback(async () => {
    if (user?.id) { // Use current `user` state directly as this is a callback
      setLoading(true);
      console.log("SessionProvider: [DEBUG] Manually refreshing profile.");
      try {
        const fetchedProfile = await fetchProfileFromDb(user.id);
        setProfile(fetchedProfile);
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error refreshing profile:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user, fetchProfileFromDb]); // Depends on `user` and `fetchProfileFromDb`

  // Main effect for initial session load and auth state changes
  useEffect(() => {
    console.log("SessionProvider: [LIFECYCLE] Component Mounted. Initializing session provider.");

    // 1. Fetch initial session
    const getInitialSession = async () => {
      setLoading(true); // Ensure loading is true while fetching initial session
      console.log("SessionProvider: [DEBUG] Fetching initial session from Supabase...");
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          console.log("SessionProvider: [DEBUG] Initial session found, fetching profile...");
          const fetchedProfile = await fetchProfileFromDb(initialSession.user.id);
          setProfile(fetchedProfile);
        } else {
          console.log("SessionProvider: [DEBUG] No initial session found.");
          setProfile(null);
        }
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error fetching initial session or profile:", err);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false); // Always set loading to false after initial check
        console.log("SessionProvider: [DEBUG] Initial session check complete. Loading set to false.");
      }
    };

    getInitialSession();

    // 2. Set up real-time auth state change listener for subsequent events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`SessionProvider: [DEBUG] Auth state change event: ${event}`, currentSession);
      
      // Only set loading to true for non-INITIAL_SESSION events
      // For INITIAL_SESSION, getInitialSession() already handled the loading state.
      if (event !== 'INITIAL_SESSION') {
        setLoading(true);
        console.log("SessionProvider: [STATE] setLoading(true) from auth state change event processing (non-INITIAL_SESSION)");
      }

      try {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          // Only fetch profile if it's a new user, user data has potentially changed (e.g., USER_UPDATED),
          // or if profile is not yet loaded for this specific user ID.
          // Use profileRef.current to access the latest profile state without re-running the effect.
          if (!profileRef.current || profileRef.current.id !== currentSession.user.id || event === 'USER_UPDATED') {
            console.log("SessionProvider: [DEBUG] User present or updated, fetching/refreshing profile from DB...");
            const fetchedProfile = await fetchProfileFromDb(currentSession.user.id);
            setProfile(fetchedProfile);
          } else {
            console.log("SessionProvider: [DEBUG] User found, profile already consistent. No re-fetch needed.");
          }
        } else {
          console.log("SessionProvider: [DEBUG] No user found or signed out from auth event, clearing local data.");
          setProfile(null);
        }
      } catch (err) {
        console.error("SessionProvider: [ERROR] Error processing auth state change:", err);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        // Only set loading to false if we set it to true for this event (i.e., not INITIAL_SESSION)
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
          console.log("SessionProvider: [STATE] setLoading(false) from auth state change finally (non-INITIAL_SESSION)");
        }
      }

      // Handle toasts and navigation (use stable references)
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
  }, [fetchProfileFromDb, navigate, location.pathname, t]); // Dependencies are now stable functions/values.

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