import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter, LogOut, LogIn } from "lucide-react";
import MobileNav from "./MobileNav";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { session, profile, loading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (Navbar) */}
      <header className="sticky top-0 z-50 bg-background shadow-sm border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ProCodeCG
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex flex-grow justify-center">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link to="/" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  {t('home')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  {t('about')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  {t('blog')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/archives" className={cn(navigationMenuTriggerStyle(), "bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground")}>
                  {t('archives')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">{t('activity')}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background text-foreground border-border !left-[var(--radix-navigation-menu-trigger-x)]">
                  <ul className="flex flex-col w-max gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/programs"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('programs')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/regular-events-classes"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('regular events classes')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/camps"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('camps')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/training"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('training')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* New Media Navigation Item */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">{t('media')}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background text-foreground border-border !left-[var(--radix-navigation-menu-trigger-x)]">
                  <ul className="flex flex-col w-max gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/media/youtube"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('youtube')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/media/tiktok"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('tiktok')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">{t('info')}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background text-foreground border-border !left-[var(--radix-navigation-menu-trigger-x)]">
                  <ul className="flex flex-col w-max gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/contact-us"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('contact us')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/partners"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('partners')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/info/calendar"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none text-foreground">{t('calendar')}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-background text-foreground hover:text-primary data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground">{t('admin tools')}</NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background text-foreground border-border !left-[var(--radix-navigation-menu-trigger-x)]">
                    <ul className="flex flex-col w-max gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-blog-posts"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('blog posts')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-archives"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('archives')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-calendar"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('calendar')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-programs"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('programs')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-running-classes"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('running classes')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-regular-events"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('regular events')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-camps"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('camps')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-training-programs"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('training programs')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-youtube-videos"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('youtube videos')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/manage-tiktok-videos"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{t('tiktok videos')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Language Switcher and Auth Buttons */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {!loading && (
              session ? (
                <Button variant="default" onClick={handleLogout} className="px-4 py-2">
                  <LogOut className="h-5 w-5 mr-2" /> {t('logout button')}
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="default" className="px-4 py-2">
                    <LogIn className="h-5 w-5 mr-2" /> {t('sign in')}
                  </Button>
                </Link>
              )
            )}
            {/* MobileNav trigger is now hidden on desktop */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-footer py-4 text-center text-sm text-white border-t border-border">
        <div className="container mx-auto px-4">
          {t('footer text')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;