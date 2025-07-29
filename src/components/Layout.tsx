import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { session, loading } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header (Navbar) */}
      <header className="flex-shrink-0 sticky top-0 z-50 bg-background shadow-sm border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ProCodeCG
          </Link>

          {/* Language Switcher and Auth Buttons */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {!loading && (
              <> {/* Menggunakan React.Fragment untuk membungkus kondisional */}
                {session ? (
                  <Button variant="default" onClick={handleLogout} className="px-4 py-2">
                    <LogOut className="h-5 w-5 mr-2" /> {t('logout button')}
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="default" className="px-4 py-2">
                      <LogIn className="h-5 w-5 mr-2" /> {t('sign in')}
                    </Button>
                  </Link>
                )}
              </>
            )}
            {/* MobileNav trigger */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 bg-footer py-4 text-center text-sm text-white border-t border-border">
        <div className="container mx-auto px-4">
          {t('footer text')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;