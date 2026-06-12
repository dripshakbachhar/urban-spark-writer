import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { StatCounter } from "@/components/stat-counter";
import { ISSUES, STATS, CATEGORY_LABEL, type Category, type Status } from "@/lib/mock-issues";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Public Dashboard — UrbanPulse Nepal" },
      { name: "description", content: "Transparent metrics: resolution rates, city breakdowns and trending issue categories across Nepal." },
      { property: "og:title", content: "Public Dashboard — UrbanPulse Nepal" },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const byCategory = (Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({
    label: CATEGORY_LABEL[c],
    count: ISSUES.filter((i) => i.category === c).length,
  })).sort((a, b) => b.count - a.count);

  const byStatus: Record<Status, number> = { reported: 0, acknowledged: 0, in_progress: 0, resolved: 0 };
  ISSUES.forEach((i) => { byStatus[i.status]++; });

  const cities = Array.from(new Set(ISSUES.map((i) => i.city)));
  const byCity = cities.map((c) => ({
    city: c,
    total: ISSUES.filter((i) => i.city === c).length,
    resolved: ISSUES.filter((i) => i.city === c && i.status === "resolved").length,
  }));

  const maxCat = Math.max(...byCategory.map((c) => c.count), 1);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <header>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Public dashboard</div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">The pulse of Nepal's cities.</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Open data on what's reported, what's resolved, and how fast — so anyone can hold local authorities to account.</p>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <StatCounter value={STATS.totalReported} label="Total reported" />
            <StatCounter value={STATS.resolved} label="Resolved" />
            <StatCounter value={Math.round((STATS.resolved / STATS.totalReported) * 100)} label="Resolution rate" suffix="%" />
            <StatCounter value={STATS.avgResolutionDays} label="Avg resolution (days)" />
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {/* Category breakdown */}
            <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
              <h2 className="font-display text-xl font-semibold">Top categories</h2>
              <ul className="mt-5 space-y-3">
                {byCategory.map((c) => (
                  <li key={c.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.label}</span>
                      <span className="text-muted-foreground">{c.count}</span>
                    </div>
                    <div className="mt-1 h-2.5 rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-primary transition-all" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status donut-ish */}
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Status mix</h2>
              <div className="mt-5 space-y-3">
                {(Object.entries(byStatus) as [Status, number][]).map(([s, n]) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${{
                      reported: "bg-muted-foreground",
                      acknowledged: "bg-accent-foreground/70",
                      in_progress: "bg-[var(--sev-medium)]",
                      resolved: "bg-primary",
                    }[s]}`} />
                    <div className="flex-1 text-sm capitalize">{s.replace("_", " ")}</div>
                    <div className="text-sm font-semibold">{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* City table */}
          <div className="mt-4 rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">By city</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2">City</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Resolved</th>
                  <th className="py-2">Resolution rate</th>
                </tr>
              </thead>
              <tbody>
                {byCity.map((c) => {
                  const rate = c.total ? Math.round((c.resolved / c.total) * 100) : 0;
                  return (
                    <tr key={c.city} className="border-t border-border">
                      <td className="py-3 font-semibold">{c.city}</td>
                      <td className="py-3">{c.total}</td>
                      <td className="py-3">{c.resolved}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-muted-foreground">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
