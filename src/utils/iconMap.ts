import {
  BookOpen, Gamepad, Globe, Smartphone, Lock, Cpu, Code, Users, GraduationCap, DollarSign, CalendarDays,
  Lightbulb, Handshake, Building, BellRing, PlayCircle, Image, FileText,
} from "lucide-react";
import React from "react";

export const iconMap: { [key: string]: React.ElementType } = {
  BookOpen,
  Gamepad,
  Globe,
  Smartphone,
  Lock,
  Cpu,
  Code,
  Users,
  GraduationCap,
  DollarSign,
  CalendarDays,
  Lightbulb,
  Handshake,
  Building,
  BellRing,
  PlayCircle,
  Image,
  FileText,
};

export const getIconComponent = (iconName: string | null) => {
  if (!iconName) return null;
  return iconMap[iconName] || null;
};