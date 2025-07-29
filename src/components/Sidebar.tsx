"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider";
import { cn } from "@/lib/utils";
import {
  Home, Info, BookOpen, Archive, Mail, Handshake, CalendarDays,
  GraduationCap, Users, Tent, Cpu, Youtube, Music, FileText, Code, BellRing,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isExpanded: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isExpanded }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

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
  const { profile, loading } = useSession();
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
    { to: "/info/programs", labelKey: "programs", icon: GraduationCap },
    { to: "/info/regular-events-classes", labelKey: "regular events classes", icon: Users },
    { to: "/info/camps", labelKey: "camps", icon: Tent },
    { to: "/info/training", labelKey: "training", icon: Cpu },
  ];

  const mediaLinks = [
    { to: "/media/youtube", labelKey: "youtube", icon: Youtube },
    { to: "/media/tiktok", labelKey: "tiktok", icon: Music },
  ];

  const adminLinks = [
    { to: "/admin/manage-blog-posts", labelKey: "blog posts", icon: FileText },
    { to: "/admin/manage-archives", labelKey: "archives", icon: Archive },
    { to: "/admin/manage-calendar", labelKey: "calendar", icon: CalendarDays },
    { to: "/admin/manage-programs", labelKey: "programs", icon: GraduationCap },
    { to: "/admin/manage-running-classes", labelKey: "running classes", icon: Code },
    { to: "/admin/manage-regular-events", labelKey: "regular events", icon: BellRing },
    { to: "/admin/manage-camps", labelKey: "camps", icon: Tent },
    { to: "/admin/manage-training-programs", labelKey: "training programs", icon: Cpu },
    { to: "/admin/manage-youtube-videos", labelKey: "youtube videos", icon: Youtube },
    { to: "/admin/manage-tiktok-videos", labelKey: "tiktok videos", icon: Music },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border py-4 transition-all duration-300 ease-in-out overflow-y-auto", // Menambahkan flex-shrink-0, menghapus max-h-full
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex-grow px-3 space-y-4"> {/* Div ini akan mengisi tinggi yang tersedia di dalam aside */}
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

        {/* Admin Tools (Conditional) */}
        {!loading && isAdmin && (
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