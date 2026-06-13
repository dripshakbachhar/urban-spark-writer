import {
  Droplet,
  Trash2,
  Construction,
  Wind,
  ShieldAlert,
  Car,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export type CivicCategory =
  | "water"
  | "waste"
  | "roads"
  | "environment"
  | "public_safety"
  | "traffic"
  | "disaster";

export interface CategoryMeta {
  slug: CivicCategory;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string; // tailwind classes for icon tile
  ring: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "water",
    label: "Water Supply",
    tagline: "Supply, leaks, quality & shortages",
    description: "Real-time water supply hours, leak reports, quality index and shortage zones across the city.",
    icon: Droplet,
    accent: "bg-sky-500/15 text-sky-700",
    ring: "ring-sky-500/20",
  },
  {
    slug: "waste",
    label: "Waste Management",
    tagline: "Collection, complaints & hotspots",
    description: "Daily collection coverage, open complaints, hotspot zones and average response times.",
    icon: Trash2,
    accent: "bg-emerald-500/15 text-emerald-700",
    ring: "ring-emerald-500/20",
  },
  {
    slug: "roads",
    label: "Roads",
    tagline: "Potholes, construction & maintenance",
    description: "Pothole reports, active construction zones, completed maintenance jobs and traffic impact.",
    icon: Construction,
    accent: "bg-amber-500/15 text-amber-700",
    ring: "ring-amber-500/20",
  },
  {
    slug: "environment",
    label: "Environment",
    tagline: "AQI, PM2.5, weather & pollution",
    description: "Live air quality, particulate levels, temperature, rainfall and pollution trends.",
    icon: Wind,
    accent: "bg-teal-500/15 text-teal-700",
    ring: "ring-teal-500/20",
  },
  {
    slug: "public_safety",
    label: "Public Safety",
    tagline: "Lights, hazards & emergencies",
    description: "Streetlight failures, open hazard reports, flood alerts and emergency updates.",
    icon: ShieldAlert,
    accent: "bg-rose-500/15 text-rose-700",
    ring: "ring-rose-500/20",
  },
  {
    slug: "traffic",
    label: "Traffic",
    tagline: "Congestion, commute & incidents",
    description: "Congestion index, peak commute times, recent incidents and signals out of service.",
    icon: Car,
    accent: "bg-indigo-500/15 text-indigo-700",
    ring: "ring-indigo-500/20",
  },
  {
    slug: "disaster",
    label: "Disaster Monitoring",
    tagline: "Floods, tremors & preparedness",
    description: "Active disaster alerts, flood risk, recent tremors and city preparedness score.",
    icon: AlertTriangle,
    accent: "bg-orange-500/15 text-orange-700",
    ring: "ring-orange-500/20",
  },
];

export const CATEGORY_BY_SLUG: Record<CivicCategory, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.slug]: c }),
  {} as Record<CivicCategory, CategoryMeta>,
);

export function isCivicCategory(v: string): v is CivicCategory {
  return v in CATEGORY_BY_SLUG;
}
