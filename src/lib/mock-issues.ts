export type Severity = "low" | "medium" | "high";
export type Status = "reported" | "acknowledged" | "in_progress" | "resolved";
export type Category =
  | "water"
  | "roads"
  | "waste"
  | "streetlight"
  | "flooding"
  | "traffic"
  | "safety";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: Status;
  city: string;
  ward: string;
  upvotes: number;
  reporter: string;
  createdAt: string; // ISO
  photo: string; // emoji as placeholder thumb
  timeline: { status: Status; at: string; note?: string }[];
}

export const ALERTS = [
  { id: "a1", title: "Water Supply Maintenance", city: "Lalitpur", severity: "medium" as Severity },
  { id: "a2", title: "Traffic Advisory", city: "Bhaktapur-Thimi Highway", severity: "low" as Severity },
  { id: "a3", title: "Monsoon Flood Warning", city: "Kathmandu Valley", severity: "high" as Severity },
];

const days = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const ISSUES: Issue[] = [
  {
    id: "UP-1042",
    title: "Large pothole near Patan Dhoka",
    description: "A growing pothole on the main road is damaging vehicles and dangerous for bikes after dark.",
    category: "roads",
    severity: "high",
    status: "in_progress",
    city: "Lalitpur",
    ward: "Ward 16",
    upvotes: 124,
    reporter: "Anish K.",
    createdAt: days(4),
    photo: "🛣️",
    timeline: [
      { status: "reported", at: days(4) },
      { status: "acknowledged", at: days(3), note: "Ward office logged the report." },
      { status: "in_progress", at: days(1), note: "Repair crew scheduled for this week." },
    ],
  },
  {
    id: "UP-1041",
    title: "Streetlights out on Sankhamul road",
    description: "Three consecutive streetlights have been off for two weeks, making the stretch unsafe.",
    category: "streetlight",
    severity: "medium",
    status: "acknowledged",
    city: "Kathmandu",
    ward: "Ward 10",
    upvotes: 78,
    reporter: "Priya S.",
    createdAt: days(6),
    photo: "💡",
    timeline: [
      { status: "reported", at: days(6) },
      { status: "acknowledged", at: days(2) },
    ],
  },
  {
    id: "UP-1039",
    title: "Garbage pileup at Bhotahity junction",
    description: "Mixed waste has been accumulating for days. Bad smell and stray animals.",
    category: "waste",
    severity: "high",
    status: "reported",
    city: "Kathmandu",
    ward: "Ward 22",
    upvotes: 201,
    reporter: "Ramesh T.",
    createdAt: days(1),
    photo: "🗑️",
    timeline: [{ status: "reported", at: days(1) }],
  },
  {
    id: "UP-1038",
    title: "Water leakage on Pulchowk feeder",
    description: "Continuous leak wasting water and flooding the footpath.",
    category: "water",
    severity: "medium",
    status: "in_progress",
    city: "Lalitpur",
    ward: "Ward 3",
    upvotes: 54,
    reporter: "Sunita M.",
    createdAt: days(8),
    photo: "💧",
    timeline: [
      { status: "reported", at: days(8) },
      { status: "acknowledged", at: days(7) },
      { status: "in_progress", at: days(3) },
    ],
  },
  {
    id: "UP-1032",
    title: "Open manhole near Maitighar",
    description: "Cover missing, serious safety hazard especially at night.",
    category: "safety",
    severity: "high",
    status: "resolved",
    city: "Kathmandu",
    ward: "Ward 11",
    upvotes: 312,
    reporter: "Bikash P.",
    createdAt: days(14),
    photo: "⚠️",
    timeline: [
      { status: "reported", at: days(14) },
      { status: "acknowledged", at: days(13) },
      { status: "in_progress", at: days(11) },
      { status: "resolved", at: days(9), note: "Cover replaced and area secured." },
    ],
  },
  {
    id: "UP-1028",
    title: "Persistent traffic jam at Koteshwor",
    description: "Signal timing seems off during peak hours, causing 30+ min jams.",
    category: "traffic",
    severity: "low",
    status: "acknowledged",
    city: "Kathmandu",
    ward: "Ward 32",
    upvotes: 47,
    reporter: "Anonymous",
    createdAt: days(10),
    photo: "🚦",
    timeline: [
      { status: "reported", at: days(10) },
      { status: "acknowledged", at: days(8) },
    ],
  },
  {
    id: "UP-1019",
    title: "Drain overflow during rain on Putalisadak",
    description: "Drain backs up within 10 minutes of rainfall, flooding the road.",
    category: "flooding",
    severity: "high",
    status: "in_progress",
    city: "Kathmandu",
    ward: "Ward 28",
    upvotes: 168,
    reporter: "Manju R.",
    createdAt: days(12),
    photo: "🌧️",
    timeline: [
      { status: "reported", at: days(12) },
      { status: "acknowledged", at: days(11) },
      { status: "in_progress", at: days(6) },
    ],
  },
  {
    id: "UP-1015",
    title: "Broken footpath tiles near Durbar Square",
    description: "Loose tiles a tripping hazard for tourists and elders.",
    category: "roads",
    severity: "medium",
    status: "resolved",
    city: "Bhaktapur",
    ward: "Ward 5",
    upvotes: 89,
    reporter: "Gopal D.",
    createdAt: days(20),
    photo: "🧱",
    timeline: [
      { status: "reported", at: days(20) },
      { status: "acknowledged", at: days(19) },
      { status: "in_progress", at: days(15) },
      { status: "resolved", at: days(11) },
    ],
  },
];

export const STATS = {
  totalReported: 4280,
  resolved: 2914,
  communities: 38,
  avgResolutionDays: 9,
};

export const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"] as const;

export const CATEGORY_LABEL: Record<Category, string> = {
  water: "Water",
  roads: "Roads",
  waste: "Waste",
  streetlight: "Streetlight",
  flooding: "Flooding",
  traffic: "Traffic",
  safety: "Safety",
};

export const STATUS_LABEL: Record<Status, string> = {
  reported: "Reported",
  acknowledged: "Acknowledged",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const STATUS_ORDER: Status[] = ["reported", "acknowledged", "in_progress", "resolved"];
