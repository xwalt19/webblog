import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";

interface UseAdminPageLogicOptions {
  isAdminRequired?: boolean;
  onAuthSuccess?: () => void; // Callback to run after successful authentication and authorization
}

interface UseAdminPageLogicReturn {
  isLoadingAuth: boolean;
  isAuthenticatedAndAuthorized: boolean;
}

export const useAdminPageLogic = ({
  isAdminRequired = true,
  onAuthSuccess,
}: UseAdminPageLogicOptions): UseAdminPageLogicReturn => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [isAuthenticatedAndAuthorized, setIsAuthenticatedAndAuthorized] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Use useCallback for onAuthSuccess to prevent unnecessary re-renders if passed directly
  const memoizedOnAuthSuccess = useCallback(() => {
    onAuthSuccess?.();
  }, [onAuthSuccess]);

  useEffect(() => {
    if (sessionLoading) {
      setIsLoadingAuth(true);
      return;
    }

    setIsLoadingAuth(false); // Auth check is complete

    if (!session) {
      toast.error(t('login required'));
      navigate('/login');
      setIsAuthenticatedAndAuthorized(false);
      return;
    }

    if (isAdminRequired && !isAdmin) {
      toast.error(t('admin required'));
      navigate('/');
      setIsAuthenticatedAndAuthorized(false);
      return;
    }

    // If we reach here, user is authenticated and authorized
    setIsAuthenticatedAndAuthorized(true);
    memoizedOnAuthSuccess(); // Call the callback to initiate data fetching
  }, [session, isAdmin, sessionLoading, isAdminRequired, navigate, t, memoizedOnAuthSuccess]);

  return { isLoadingAuth, isAuthenticatedAndAuthorized };
};