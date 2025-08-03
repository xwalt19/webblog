"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { cn } from "@/lib/utils";
import {
  Home, Info, BookOpen, Archive, Mail, Handshake, CalendarDays,
  GraduationCap, Users, Tent, Cpu, Youtube, Music, FileText, Code, BellRing, LayoutDashboard, User, Loader2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBlogDateFilters } from "@/hooks/use-blog-date-filters";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isExpanded: boolean;
  isActive?: boolean; // New prop
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isExpanded, isActive: propIsActive }) => {
  const location = useLocation();
  const defaultIsActive = location.pathname === to; // Default behavior

  const isActive = propIsActive !== undefined ? propIsActive : defaultIsActive; // Use prop if provided, else default

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200",
        isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", isExpanded ? "mr-3" : "mx-auto")} />
      {isExpanded && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { profile, session } = useSession(); 
  const isAdmin = profile?.role === 'admin';
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const { data: blogDateFilters, isLoading: isDateFiltersLoading } = useBlogDateFilters();

  const mainLinks = [
    { to: "/", labelKey: "home", icon: Home },
    { to: "/about", labelKey: "about", icon: Info },
    // Blog link will be handled separately with accordion
    { to: "/archives", labelKey: "archives", icon: Archive },
    { to: "/contact-us", labelKey: "contact us", icon: Mail },
    { to: "/partners", labelKey: "partners", icon: Handshake },
    { to: "/info/calendar", labelKey: "calendar", icon: CalendarDays },
  ];

  const activityLinks = [
    { to: "/info/programs", labelKey: "programs", icon: GraduationCap },
    { to: "/info/regular-events-classes", labelKey: "regular events classes", icon: Users },
    { to: "/info/camps", labelKey: "camps", icon: Tent },
    { to: "/info/training", labelKey: "training", icon: Cpu },
  ];

  const mediaLinks = [
    { to: "/media/youtube", labelKey: "youtube", icon: Youtube },
    { to: "/media/tiktok", labelKey: "tiktok", icon: Music },
  ];

  const userLinks = [
    { to: "/profile", labelKey: "my profile", icon: User },
  ];

  const adminLinks = [
    { to: "/admin", labelKey: "admin dashboard", icon: LayoutDashboard },
    { to: "/admin/manage-blog-posts", labelKey: "blog posts", icon: FileText },
    { to: "/admin/manage-archives", labelKey: "archives", icon: Archive },
    { to: "/admin/manage-calendar", labelKey: "calendar", icon: CalendarDays },
    { to: "/admin/manage-programs", labelKey: "programs", icon: GraduationCap },
    { to: "/admin/manage-regular-events", labelKey: "regular events", icon: BellRing },
    { to: "/admin/manage-camps", labelKey: "camps", icon: Tent },
    { to: "/admin/manage-training-programs", labelKey: "training programs", icon: Cpu },
    { to: "/admin/manage-youtube-videos", labelKey: "youtube videos", icon: Youtube },
    { to: "/admin/manage-tiktok-videos", labelKey: "tiktok videos", icon: Music },
    { to: "/admin/manage-users", labelKey: "manage users", icon: Users },
  ];

  // Helper to get month name
  const getMonthName = (monthNumber: number) => {
    const date = new Date(2000, monthNumber - 1, 1); // Use a dummy date for formatting
    return date.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { month: 'long' });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border py-4 transition-all duration-300 ease-in-out overflow-y-auto",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex-grow px-3 space-y-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {isExpanded && <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">{t('main navigation')}</h3>}
          {mainLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={t(link.labelKey)}
              isExpanded={isExpanded}
            />
          ))}
          {/* Blog with Date Filters */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="blog-main" className="border-b-0">
              <AccordionTrigger className={cn(
                "py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200",
                location.pathname === "/blog" && !location.search && "bg-sidebar-primary text-sidebar-primary-foreground" // Highlight "Blog" if no specific date filter
              )}>
                <BookOpen className={cn("h-5 w-5", isExpanded ? "mr-3" : "mx-auto")} />
                {isExpanded && <span className="whitespace-nowrap">{t('blog')}</span>}
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-2 pb-0 space-y-1">
                <SidebarLink
                  to="/blog"
                  icon={FileText} // A generic icon for all posts
                  label={t('all posts')}
                  isExpanded={isExpanded}
                  isActive={location.pathname === "/blog" && location.search === ""} // Explicitly active for "All Posts"
                />
                {isDateFiltersLoading ? (
                  <div className={cn("flex items-center py-2 px-3 text-muted-foreground", isExpanded ? "" : "justify-center")}>
                    <Loader2 className={cn("h-4 w-4 animate-spin", isExpanded ? "mr-2" : "")} />
                    {isExpanded && t('loading dates')}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {blogDateFilters?.map(yearFilter => (
                      <AccordionItem key={yearFilter.year} value={`year-${yearFilter.year}`} className="border-b-0">
                        <AccordionTrigger className={cn(
                          "py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200",
                          isExpanded ? "" : "justify-center",
                          location.pathname === "/blog" && location.search.includes(`year=${yearFilter.year}`) && "bg-sidebar-primary text-sidebar-primary-foreground" // Highlight year if any month within it is filtered
                        )}>
                          <CalendarDays className={cn("h-4 w-4", isExpanded ? "mr-3" : "mx-auto")} />
                          {isExpanded && <span className="whitespace-nowrap">{yearFilter.year}</span>}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pt-2 pb-0 space-y-1">
                          {yearFilter.months.map(monthFilter => (
                            <SidebarLink
                              key={monthFilter.value}
                              to={`/blog?year=${yearFilter.year}&month=${monthFilter.month}`}
                              icon={CalendarDays} // Use a generic icon for months
                              label={isExpanded ? getMonthName(monthFilter.month) : String(monthFilter.month)}
                              isExpanded={isExpanded}
                              isActive={location.pathname === "/blog" && location.search === `?year=${yearFilter.year}&month=${monthFilter.month}`} // Highlight specific month
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Activity */}
        <div className="space-y-1 pt-4 border-t border-sidebar-border">
          {isExpanded && <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">{t('activity')}</h3>}
          {activityLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={t(link.labelKey)}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        {/* Media */}
        <div className="space-y-1 pt-4 border-t border-sidebar-border">
          {isExpanded && <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">{t('media')}</h3>}
          {mediaLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={t(link.labelKey)}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        {/* User Account (Conditional) */}
        {session && (
          <div className="space-y-1 pt-4 border-t border-sidebar-border">
            {isExpanded && <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">{t('my account')}</h3>}
            {userLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={t(link.labelKey)}
                isExpanded={isExpanded}
              />
            ))}
          </div>
        )}

        {/* Admin Tools (Conditional) */}
        {isAdmin && (
          <div className="space-y-1 pt-4 border-t border-sidebar-border">
            {isExpanded && <h3 className="text-sm font-semibold text-muted-foreground px-3 mb-2">{t('admin tools')}</h3>}
            {adminLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={t(link.labelKey)}
                isExpanded={isExpanded}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;