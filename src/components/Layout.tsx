import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User, LayoutDashboard } from "lucide-react"; // Import LayoutDashboard icon
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { session, profile, user, loading } = useSession(); // Get user object

  const isAdmin = profile?.role === 'admin';
  const displayName = profile?.first_name || user?.email || t('my profile'); // Use first_name, fallback to email, then 'My Profile'

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 sticky top-0 z-50 bg-background shadow-sm border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            ProCodeCG
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {!loading && (
              <>
                {session ? (
                  <>
                    <Link to="/dashboard"> {/* Link to Member Dashboard */}
                      <Button variant="ghost" className="px-4 py-2">
                        <LayoutDashboard className="h-5 w-5 mr-2" /> {t('dashboard')}
                      </Button>
                    </Link>
                    {isAdmin && ( // Admin Dashboard link only for admins
                      <Link to="/admin">
                        <Button variant="ghost" className="px-4 py-2">
                          <LayoutDashboard className="h-5 w-5 mr-2" /> {t('admin dashboard')}
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile">
                      <Button variant="ghost" className="px-4 py-2">
                        <User className="h-5 w-5 mr-2" /> {displayName}
                      </Button>
                    </Link>
                    <Button variant="default" onClick={handleLogout} className="px-4 py-2">
                      <LogOut className="h-5 w-5 mr-2" /> {t('logout button')}
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button variant="default" className="px-4 py-2">
                      <LogIn className="h-5 w-5 mr-2" /> {t('sign in')}
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