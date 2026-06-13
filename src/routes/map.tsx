import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { GoogleMap, type MapPin } from "@/components/google-map";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Map — UrbanPulse Nepal" },
      { name: "description", content: "Interactive map of civic activity across every city in Nepal." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const navigate = useNavigate();
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*");
      return data ?? [];
    },
  });

  const pins: MapPin[] = cities.map((c) => {
    const s = Number(c.performance_score ?? 0);
    const severity = s >= 78 ? "low" : s >= 70 ? "medium" : "high";
    return {
      id: c.id,
      lat: c.lat,
      lng: c.lng,
      title: `${c.name} · score ${s.toFixed(1)}`,
      severity,
      onClick: () => navigate({ to: "/cities/$slug", params: { slug: c.slug } }),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <header className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Live map</div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">All of Nepal, one screen.</h1>
            <p className="mt-3 text-muted-foreground">
              Tap any pin to jump into that city's dashboard. Color indicates current civic performance:
              <span className="ml-2 inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> low</span>
              <span className="ml-2 inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-600" /> medium</span>
              <span className="ml-2 inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-600" /> high attention</span>
            </p>
          </header>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border">
            <GoogleMap
              center={{ lat: 28.3949, lng: 84.124 }}
              zoom={7}
              pins={pins}
              className="h-[640px] w-full"
            />
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {cities.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                to="/cities/$slug"
                params={{ slug: c.slug }}
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">Score {Number(c.performance_score).toFixed(1)} · {c.province}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
