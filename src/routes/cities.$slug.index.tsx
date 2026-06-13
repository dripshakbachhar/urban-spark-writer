import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { CATEGORIES } from "@/lib/categories";
import { GoogleMap } from "@/components/google-map";
import { ArrowRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/cities/$slug/")({
  head: ({ params }) => ({
    meta: [
      { title: `${capitalize(params.slug)} — Civic Dashboard | UrbanPulse Nepal` },
      { name: "description", content: `Live civic intelligence for ${capitalize(params.slug)}: water, waste, roads, environment, safety, traffic and disaster monitoring.` },
      { property: "og:title", content: `${capitalize(params.slug)} — Civic Dashboard | UrbanPulse Nepal` },
    ],
  }),
  component: CityDashboard,
  errorComponent: () => <ErrorState />,
  notFoundComponent: () => <ErrorState notFound />,
});

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

function ErrorState({ notFound: nf }: { notFound?: boolean } = {}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">
          {nf ? "City not found" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {nf ? "We couldn't find that city." : "Please try again in a moment."}
        </p>
        <Link to="/cities" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          ← Back to all cities
        </Link>
      </div>
    </div>
  );
}

function CityDashboard() {
  const { slug } = Route.useParams();

  const { data: city, isLoading: cityLoading, error } = useQuery({
    queryKey: ["city", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: metrics } = useQuery({
    queryKey: ["city-metrics", slug],
    queryFn: async () => {
      if (!city) return [];
      const { data, error } = await supabase.from("city_metrics").select("*").eq("city_id", city.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!city,
  });

  if (cityLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Skeleton className="h-12 w-72" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
          </div>
        </div>
      </div>
    );
  }
  if (error || !city) return <ErrorState notFound />;

  const score = Number(city.performance_score ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link to="/cities" className="text-xs text-muted-foreground hover:text-foreground">
            ← All cities
          </Link>

          {/* Header */}
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                <MapPin className="h-3 w-3" /> {city.province} · {city.city_type === "metropolitan" ? "Metropolitan" : "Sub-metropolitan"}
              </div>
              <h1 className="mt-1 font-display text-4xl font-semibold sm:text-5xl">{city.name}</h1>
              {city.name_ne ? (
                <div className="mt-1 text-lg text-muted-foreground" style={{ fontFamily: "var(--font-nepali)" }}>
                  {city.name_ne}
                </div>
              ) : null}
            </div>
            <div className="rounded-2xl border border-border bg-card px-5 py-3 text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Performance score</div>
              <div className="font-display text-3xl font-semibold text-primary">{score.toFixed(1)}<span className="text-base text-muted-foreground">/100</span></div>
            </div>
          </div>

          {/* Map + summary */}
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GoogleMap
                center={{ lat: city.lat, lng: city.lng }}
                zoom={12}
                pins={[{ id: city.id, lat: city.lat, lng: city.lng, title: city.name, severity: "medium" }]}
                className="h-[360px] w-full rounded-3xl border border-border"
              />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold">At a glance</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Population</dt><dd className="font-semibold">{city.population?.toLocaleString() ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Active metrics</dt><dd className="font-semibold">{metrics?.length ?? 0}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Categories</dt><dd className="font-semibold">{CATEGORIES.length}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Coordinates</dt><dd className="font-mono text-xs">{city.lat.toFixed(3)}, {city.lng.toFixed(3)}</dd></div>
              </dl>
            </div>
          </div>

          {/* Category cards */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">Click any card to open the full detail page with live metrics.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const catMetrics = metrics?.filter((m) => m.category === cat.slug) ?? [];
                const Icon = cat.icon;
                const critical = catMetrics.filter((m) => m.status === "critical").length;
                const warning = catMetrics.filter((m) => m.status === "warning").length;
                return (
                  <Link
                    key={cat.slug}
                    to="/cities/$slug/$category"
                    params={{ slug: city.slug, category: cat.slug }}
                    className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${cat.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {critical > 0 ? (
                        <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                          {critical} critical
                        </span>
                      ) : warning > 0 ? (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          {warning} watch
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          Stable
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{cat.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{cat.tagline}</p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{catMetrics.length} live metrics</span>
                      <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
                        Open <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
