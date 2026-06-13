import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { MapPin, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/cities/")({
  head: () => ({
    meta: [
      { title: "Cities — UrbanPulse Nepal" },
      { name: "description", content: "Live civic intelligence dashboards for all 17 metropolitan and sub-metropolitan cities of Nepal." },
      { property: "og:title", content: "Cities — UrbanPulse Nepal" },
      { property: "og:description", content: "Browse live dashboards for every metropolitan and sub-metropolitan city of Nepal." },
    ],
    links: [{ rel: "canonical", href: "/cities" }],
  }),
  component: CitiesIndex,
});

function CitiesIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("performance_score", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <header className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">All 17 cities</div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
              Civic intelligence for every Nepali city.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Every metropolitan and sub-metropolitan city of Nepal gets its own real-time dashboard —
              water, waste, roads, environment, public safety, traffic and disaster monitoring, all in one place.
            </p>
          </header>

          {isLoading ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.map((c, i) => {
                const score = Number(c.performance_score ?? 0);
                const scoreColor =
                  score >= 78 ? "text-emerald-700 bg-emerald-500/10" :
                  score >= 70 ? "text-amber-700 bg-amber-500/10" :
                  "text-rose-700 bg-rose-500/10";
                return (
                  <Link
                    key={c.id}
                    to="/cities/$slug"
                    params={{ slug: c.slug }}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {c.province}
                        </div>
                        <h2 className="mt-1 font-display text-2xl font-semibold">{c.name}</h2>
                        {c.name_ne ? (
                          <div className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-nepali)" }}>
                            {c.name_ne}
                          </div>
                        ) : null}
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${scoreColor}`}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {c.city_type === "metropolitan" ? "Metropolitan" : "Sub-metropolitan"}
                        {c.population ? ` · ${(c.population / 1000).toFixed(0)}k people` : ""}
                      </span>
                      <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
                        <TrendingUp className="h-3.5 w-3.5" /> Open
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
