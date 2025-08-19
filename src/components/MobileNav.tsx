import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn, LayoutDashboard, Users, User, Loader2 } from "lucide-react"; // Removed Image and ListFilter icons
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, user, loading, clearSession } = useSession();
  const isAdmin = profile?.role === 'admin';
  const displayName = profile?.first_name || user?.email || t("my profile button");

  const closeSheet = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      clearSession();
      closeSheet();
      navigate('/login');
    } catch (err: any) {
      console.error("Error during logout:", err);
      toast.error(t('logout failed', { error: err.message }));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-accent">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4 pt-10 bg-background text-foreground">
        <Link to="/" className="flex items-center mb-6" onClick={closeSheet}>
          <img src="/procodecg-logo.png" alt="ProCodeCG Logo" className="h-8 w-auto object-contain" />
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link to="/" className="text-lg font-medium text-foreground hover:text-primary transition-colors capitalize" onClick={closeSheet}>
            {t('home')}
          </Link>
          <Link to="/about" className="text-lg font-medium text-foreground hover:text-primary transition-colors capitalize" onClick={closeSheet}>
            {t('about')}
          </Link>
          <Link to="/blog" className="text-lg font-medium text-foreground hover:text-primary transition-colors capitalize" onClick={closeSheet}>
            {t('blog')}
          </Link>
          <Link to="/archives" className="text-lg font-medium text-foreground hover:text-primary transition-colors capitalize" onClick={closeSheet}>
            {t('archives')}
          </Link>
          
          {/* Activity with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors capitalize">
                {t('activity')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                {/* Removed AllActivities link */}
                <Link to="/info/programs" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('programs')}
                </Link>
                <Link to="/info/regular-events-classes" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('regular events classes')}
                </Link>
                <Link to="/info/camps" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('camps')}
                </Link>
                <Link to="/info/training" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('training')}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* New Media Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors capitalize">
                {t('media')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/media/youtube" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('youtube')}
                </Link>
                <Link to="/media/tiktok" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('tiktok')}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Info with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-3" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors capitalize">
                {t('info')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/contact-us" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('contact us')}
                </Link>
                <Link to="/partners" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('partners')}
                </Link>
                <Link to="/info/calendar" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                  {t('calendar')}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* User Account (Conditional) */}
          {session ? (
            <>
              <Link to="/profile" className="text-lg font-medium text-foreground hover:text-primary transition-colors capitalize" onClick={closeSheet}>
                <User className="h-5 w-5 inline-block mr-2" /> {displayName}
              </Link>
            </>
          ) : null}

          {isAdmin ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-4" className="border-b-0">
                <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors capitalize">
                  {t('admin tools')}
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                  <Link to="/admin" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    <LayoutDashboard className="h-4 w-4 inline-block mr-2" /> {t('admin dashboard')}
                  </Link>
                  <Link to="/admin/manage-blog-posts" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('blog posts')}
                  </Link>
                  <Link to="/admin/manage-archives" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('archives')}
                  </Link>
                  <Link to="/admin/manage-calendar" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('calendar')}
                  </Link>
                  <Link to="/admin/manage-programs" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('programs')}
                  </Link>
                  <Link to="/admin/manage-regular-events" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('regular events')}
                  </Link>
                  <Link to="/admin/manage-camps" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('camps')}
                  </Link>
                  <Link to="/admin/manage-training-programs" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('training programs')}
                  </Link>
                  <Link to="/admin/manage-youtube-videos" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('youtube videos')}
                  </Link>
                  <Link to="/admin/manage-tiktok-videos" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    {t('tiktok videos')}
                  </Link>
                  <Link to="/admin/manage-users" className="block text-base text-muted-foreground hover:text-foreground transition-colors capitalize" onClick={closeSheet}>
                    <Users className="h-4 w-4 inline-block mr-2" /> {t('manage users')}
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}

          {/* Auth Buttons for Mobile - Removed */}
          {/* {loading && !session ? (
            <div className="flex items-center px-4 py-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> {t('loading text')}
            </div>
          ) : session ? (
            <Button variant="ghost" className="w-full justify-start text-lg font-medium text-foreground hover:text-primary transition-colors capitalize" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" /> {t('logout')}
            </Button>
          ) : (
            <Link to="/login" onClick={closeSheet}>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-foreground hover:text-primary transition-colors capitalize">
                <LogIn className="h-5 w-5 mr-2" /> {t('login button')}
              </Button>
            </Link>
          )} */}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;