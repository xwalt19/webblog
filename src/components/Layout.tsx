import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User, Loader2 } from "lucide-react";
import MobileNav from "./MobileNav";
// import LanguageSwitcher from "./LanguageSwitcher"; // Removed import
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./Sidebar";
import { toast } from "sonner";

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, user, loading, clearSession } = useSession();

  const displayName = profile?.first_name || user?.email || t('my profile'); // Translated default text

  const handleLogout = async () => {
    try {
      // Explicitly get session right before signing out to ensure client is up-to-date
      const { data: { session: currentSupabaseSession }, error: getSessionError } = await supabase.auth.getSession();

      if (getSessionError) {
        console.error("Error getting session before logout:", getSessionError);
        // Even if getSession fails, try to sign out to clear local storage
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      clearSession(); // Clear local state in SessionProvider
      navigate('/login');
    } catch (err: any) {
      console.error("Error during logout:", err);
      toast.error(t('logout failed', { error: err.message }));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 sticky top-0 z-50 bg-background shadow-sm border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            ProCodeCG
          </Link>

          <div className="flex items-center gap-2">
            {/* <LanguageSwitcher /> */} {/* Removed component usage */}
            {loading ? ( // Use the loading state from useSession
              <div className="flex items-center px-4 py-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> {t('loading status')}
              </div>
            ) : (
              <>
                {session ? (
                  <>
                    <Link to="/profile">
                      <Button variant="ghost" className="px-4 py-2">
                        <User className="h-5 w-5 mr-2" /> {displayName}
                      </Button>
                    </Link>
                    <Button variant="default" onClick={handleLogout} className="px-4 py-2">
                      <LogOut className="h-5 w-5 mr-2" /> {t('logout')}
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button variant="default" className="px-4 py-2">
                      <LogIn className="h-5 w-5 mr-2" /> {t('login')}
                    </Button>
                  </Link>
                )}
              </>
            )}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <footer className="flex-shrink-0 bg-footer py-4 text-center text-sm text-white border-t border-border">
        <div className="container mx-auto px-4">
          {t('footer text')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;