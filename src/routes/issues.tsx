import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, MapPin, ThumbsUp, Search } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { SeverityPill, StatusChip } from "@/components/severity";
import { ISSUES, CITIES, CATEGORY_LABEL, type Category, type Status, type Severity } from "@/lib/mock-issues";

export const Route = createFileRoute("/issues")({
  head: () => ({
    meta: [
      { title: "Community Issues — UrbanPulse Nepal" },
      { name: "description", content: "Browse every community issue reported across Nepal — filter by city, category, status and severity." },
      { property: "og:title", content: "Community Issues — UrbanPulse Nepal" },
      { property: "og:description", content: "Real reports, real progress, all in the open." },
      { property: "og:url", content: "/issues" },
    ],
    links: [{ rel: "canonical", href: "/issues" }],
  }),
  component: Issues,
});

function Issues() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");
  const [stat, setStat] = useState<string>("all");
  const [sev, setSev] = useState<string>("all");

  const filtered = ISSUES.filter((i) => {
    if (q && !i.title.toLowerCase().includes(q.toLowerCase()) && !i.id.toLowerCase().includes(q.toLowerCase())) return false;
    if (city !== "all" && i.city !== city) return false;
    if (cat !== "all" && i.category !== cat) return false;
    if (stat !== "all" && i.status !== stat) return false;
    if (sev !== "all" && i.severity !== sev) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Community</div>
              <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Issues across Nepal</h1>
              <p className="mt-2 text-muted-foreground">{filtered.length} issue{filtered.length === 1 ? "" : "s"} match your filters.</p>
            </div>
            <Link to="/report" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Report new issue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-3 md:grid-cols-[1fr,auto,auto,auto,auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search issues or ID..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <Select value={city} onChange={setCity} label="City" options={[["all", "All cities"], ...CITIES.map((c) => [c, c] as [string, string])]} />
            <Select value={cat} onChange={setCat} label="Category" options={[["all", "All categories"], ...Object.entries(CATEGORY_LABEL)]} />
            <Select value={stat} onChange={setStat} label="Status" options={[["all", "All statuses"], ["reported", "Reported"], ["acknowledged", "Acknowledged"], ["in_progress", "In Progress"], ["resolved", "Resolved"]]} />
            <Select value={sev} onChange={setSev} label="Severity" options={[["all", "All severity"], ["low", "Low"], ["medium", "Medium"], ["high", "High"]]} />
          </div>

          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((i) => (
              <li key={i.id}>
                <Link
                  to="/issues/$id"
                  params={{ id: i.id }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-3xl">{i.photo}</span>
                    <SeverityPill severity={i.severity} />
                  </div>
                  <div className="mt-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{i.id}</div>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{i.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{i.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{i.city}</span>
                    <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{i.upvotes}</span>
                    <StatusChip status={i.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <div className="text-3xl">🔎</div>
              <h2 className="mt-3 font-display text-xl font-semibold">No issues match these filters</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing some filters or report a new issue.</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Select({
  value, onChange, label, options,
}: { value: string; onChange: (v: string) => void; label: string; options: [string, string][] }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
