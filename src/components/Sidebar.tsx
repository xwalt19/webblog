"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { cn } from "@/lib/utils";
import {
  Home, Info, BookOpen, Archive, Mail, Handshake, CalendarDays,
  GraduationCap, Users, Tent, Cpu, Youtube, Music, FileText, Code, BellRing, LayoutDashboard, User, Loader2, Image
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const { t } = useTranslation();
  const { profile, session } = useSession(); 
  const isAdmin = profile?.role === 'admin';
  const [isExpanded, setIsExpanded] = useState(false);

  const mainLinks = [
    { to: "/", labelKey: "home", icon: Home },
    { to: "/about", labelKey: "about", icon: Info },
    { to: "/blog", labelKey: "blog", icon: BookOpen },
    { to: "/archives", labelKey: "archives", icon: Archive },
    { to: "/contact-us", labelKey: "contact us", icon: Mail },
    { to: "/partners", labelKey: "partners", icon: Handshake },
    { to: "/info/calendar", labelKey: "calendar", icon: CalendarDays },
  ];

  const activityLinks = [
    // Removed AllActivities link
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
    { to: "/admin/manage-hero-images", labelKey: "hero images", icon: Image },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border py-4 transition-all duration-300 ease-in-out overflow-y-auto",
        isExpanded ? "w-72" : "w-20" // Changed from w-64 to w-72
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