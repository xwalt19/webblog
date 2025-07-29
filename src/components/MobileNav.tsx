import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn, LayoutDashboard, Users, User } from "lucide-react"; // Import User icon
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { session, profile, loading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const closeSheet = () => setIsOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeSheet();
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
        <Link to="/" className="text-2xl font-bold text-primary mb-6 block" onClick={closeSheet}>
          ProCodeCG
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link to="/" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
            {t('home')}
          </Link>
          <Link to="/about" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
            {t('about')}
          </Link>
          <Link to="/blog" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
            {t('blog')}
          </Link>
          <Link to="/archives" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
            {t('archives')}
          </Link>
          
          {/* Activity with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                {t('activity')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/info/programs" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('programs')}
                </Link>
                <Link to="/info/regular-events-classes" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('regular events classes')}
                </Link>
                <Link to="/info/camps" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('camps')}
                </Link>
                <Link to="/info/training" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('training')}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* New Media Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                {t('media')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/media/youtube" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('youtube')}
                </Link>
                <Link to="/media/tiktok" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('tiktok')}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Info with Accordion for sub-items */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-3" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                {t('info')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/contact-us" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('contact us')}
                </Link>
                <Link to="/partners" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('partners')}
                </Link>
                <Link to="/info/calendar" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('calendar')}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* User Profile Link */}
          {!loading && session && (
            <>
              <Link to="/dashboard" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                <LayoutDashboard className="h-5 w-5 inline-block mr-2" /> {t('dashboard')}
              </Link>
              <Link to="/profile" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                <User className="h-5 w-5 inline-block mr-2" /> {t('my profile')}
              </Link>
            </>
          )}

          {isAdmin && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-4" className="border-b-0">
                <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                  {t('admin tools')}
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                  <Link to="/admin" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    <LayoutDashboard className="h-4 w-4 inline-block mr-2" /> {t('admin dashboard')}
                  </Link>
                  <Link to="/admin/manage-blog-posts" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('blog posts')}
                  </Link>
                  <Link to="/admin/manage-archives" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('archives')}
                  </Link>
                  <Link to="/admin/manage-calendar" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('calendar')}
                  </Link>
                  <Link to="/admin/manage-programs" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('programs')}
                  </Link>
                  <Link to="/admin/manage-running-classes" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('running classes')}
                  </Link>
                  <Link to="/admin/manage-regular-events" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('regular events')}
                  </Link>
                  <Link to="/admin/manage-camps" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('camps')}
                  </Link>
                  <Link to="/admin/manage-training-programs" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('training programs')}
                  </Link>
                  <Link to="/admin/manage-youtube-videos" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('youtube videos')}
                  </Link>
                  <Link to="/admin/manage-tiktok-videos" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    {t('tiktok videos')}
                  </Link>
                  <Link to="/admin/manage-users" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                    <Users className="h-4 w-4 inline-block mr-2" /> {t('manage users')}
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Auth Buttons for Mobile */}
          {!loading && (
            session ? (
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" /> {t('logout button')}
              </Button>
            ) : (
              <Link to="/login" onClick={closeSheet}>
                <Button variant="ghost" className="w-full justify-start text-lg font-medium text-foreground hover:text-primary transition-colors">
                  <LogIn className="h-5 w-5 mr-2" /> {t('sign in')}
                </Button>
              </Link>
            )
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;