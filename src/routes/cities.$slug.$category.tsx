import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { CATEGORY_BY_SLUG, isCivicCategory } from "@/lib/categories";
import { MetricCard } from "@/components/metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/cities/$slug/$category")({
  head: ({ params }) => ({
    meta: [
      { title: `${formatCat(params.category)} in ${cap(params.slug)} — UrbanPulse Nepal` },
      { name: "description", content: `Live ${formatCat(params.category).toLowerCase()} metrics for ${cap(params.slug)}.` },
    ],
  }),
  component: CategoryDetail,
});

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " "); }
function formatCat(s: string) { return isCivicCategory(s) ? CATEGORY_BY_SLUG[s].label : cap(s); }

function CategoryDetail() {
  const { slug, category } = Route.useParams();

  if (!isCivicCategory(category)) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Unknown category</h1>
          <Link to="/cities/$slug" params={{ slug }} className="mt-4 inline-block text-primary hover:underline">← Back to city</Link>
        </div>
      </div>
    );
  }

  const meta = CATEGORY_BY_SLUG[category];
  const Icon = meta.icon;

  const { data: city } = useQuery({
    queryKey: ["city", slug],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics", slug, category],
    queryFn: async () => {
      if (!city) return [];
      const { data, error } = await supabase
        .from("city_metrics")
        .select("*")
        .eq("city_id", city.id)
        .eq("category", category);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!city,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/cities/$slug"
            params={{ slug }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to {city?.name ?? cap(slug)}
          </Link>

          <header className="mt-4 flex items-start gap-4">
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${meta.accent}`}>
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{city?.name ?? cap(slug)}</div>
              <h1 className="mt-1 font-display text-4xl font-semibold">{meta.label}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">{meta.description}</p>
            </div>
          </header>

          {/* Metrics grid */}
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Live metrics</h2>
            {isLoading ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
              </div>
            ) : metrics && metrics.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {metrics.map((m) => (
                  <MetricCard
                    key={m.id}
                    label={m.metric_label}
                    value={m.value_text ?? (m.value_num != null ? String(m.value_num) : "—")}
                    unit={m.unit}
                    status={m.status as any}
                    trend={m.trend as any}
                    trendPct={m.trend_pct != null ? Number(m.trend_pct) : null}
                    updatedAt={m.updated_at}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No metrics recorded yet for this category.</p>
            )}
          </section>

          {/* Linked issues placeholder */}
          <section className="mt-12 rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <h3 className="font-display text-lg font-semibold">Linked citizen reports coming in Phase 2</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Filed issues, AI severity scoring, votes, comments and authority responses for this category
              will appear here once reporting is wired to the database.
            </p>
            <Link to="/issues" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Browse all community issues →
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
