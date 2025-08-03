import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn, LayoutDashboard, Users, User, Loader2, Info, BookOpen, FileText, CalendarDays } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useBlogDateFilters } from "@/hooks/use-blog-date-filters";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, user, loading, clearSession } = useSession();
  const isAdmin = profile?.role === 'admin';
  const displayName = profile?.first_name || user?.email || t("my profile button");
  const location = useLocation();

  const { data: blogDateFilters, isLoading: isDateFiltersLoading } = useBlogDateFilters();

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

  // Helper to get month name
  const getMonthName = (monthNumber: number) => {
    const date = new Date(2000, monthNumber - 1, 1);
    return date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { month: 'long' });
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

          {/* Blog with Date Filters */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="blog-main" className="border-b-0">
              <AccordionTrigger className="py-0 text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                {t('blog')}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                <Link to="/blog" className="block text-base text-muted-foreground hover:text-foreground transition-colors" onClick={closeSheet}>
                  {t('all posts')}
                </Link>
                {isDateFiltersLoading ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('loading dates')}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {blogDateFilters?.map(yearFilter => (
                      <AccordionItem key={yearFilter.year} value={`year-${yearFilter.year}`} className="border-b-0">
                        <AccordionTrigger className={cn(
                          "py-0 text-base font-medium text-muted-foreground hover:no-underline hover:text-foreground transition-colors",
                          location.pathname === "/blog" && location.search.includes(`year=${yearFilter.year}`) && "text-primary font-semibold" // Highlight year if any month within it is filtered
                        )}>
                          {yearFilter.year}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pt-2 pb-0 space-y-2">
                          {yearFilter.months.map(monthFilter => (
                            <Link
                              key={monthFilter.value}
                              to={`/blog?year=${yearFilter.year}&month=${monthFilter.month}`}
                              className={cn(
                                "block text-sm text-muted-foreground hover:text-foreground transition-colors",
                                location.pathname === "/blog" && location.search === `?year=${yearFilter.year}&month=${monthFilter.month}` && "text-primary font-semibold" // Highlight specific month
                              )}
                              onClick={closeSheet}
                            >
                              {getMonthName(monthFilter.month)}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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

          {/* User Account (Conditional) */}
          {session ? (
            <>
              <Link to="/profile" className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                <User className="h-5 w-5 inline-block mr-2" /> {displayName}
              </Link>
            </>
          ) : null}

          {isAdmin ? (
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
          ) : null}

          {/* Auth Buttons for Mobile */}
          {loading && !session ? (
            <div className="flex items-center px-4 py-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> {t('loading text')}
            </div>
          ) : session ? (
            <Button variant="ghost" className="w-full justify-start text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" /> {t('logout button')}
            </Button>
          ) : (
            <Link to="/login" onClick={closeSheet}>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-foreground hover:text-primary transition-colors">
                <LogIn className="h-5 w-5 mr-2" /> {t('login button')}
              </Button>
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;