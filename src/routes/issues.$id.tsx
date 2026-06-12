import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, ThumbsUp, Calendar, User as UserIcon } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { SeverityPill, StatusChip, StatusTimeline } from "@/components/severity";
import { ISSUES, STATUS_LABEL, CATEGORY_LABEL } from "@/lib/mock-issues";

export const Route = createFileRoute("/issues/$id")({
  loader: ({ params }) => {
    const issue = ISSUES.find((i) => i.id === params.id);
    if (!issue) throw notFound();
    return { issue };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.issue.title} — UrbanPulse Nepal` : "Issue — UrbanPulse" },
      { name: "description", content: loaderData?.issue.description ?? "Civic issue detail" },
      { property: "og:title", content: loaderData?.issue.title },
      { property: "og:description", content: loaderData?.issue.description },
    ],
  }),
  component: IssueDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Issue not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed or the link is incorrect.</p>
        <Link to="/issues" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Browse all issues
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
      <SiteFooter />
    </div>
  ),
});

function IssueDetail() {
  const { issue } = Route.useLoaderData();
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link to="/issues" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All issues
          </Link>

          <div className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{issue.id} · {CATEGORY_LABEL[issue.category]}</div>
                <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{issue.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{issue.city} · {issue.ward}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Reported {fmt(issue.createdAt)}</span>
                  <span className="inline-flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" />by {issue.reporter}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <SeverityPill severity={issue.severity} />
                <StatusChip status={issue.status} />
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-[1fr,260px]">
              <div>
                <div className="flex aspect-video items-center justify-center rounded-2xl bg-secondary/60 text-8xl">{issue.photo}</div>
                <p className="mt-6 text-foreground/80 leading-relaxed">{issue.description}</p>

                <h2 className="mt-10 font-display text-xl font-semibold">Resolution timeline</h2>
                <div className="mt-3"><StatusTimeline status={issue.status} /></div>
                <ol className="mt-6 space-y-4">
                  {issue.timeline.map((t, i) => (
                    <li key={i} className="relative pl-8">
                      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15" />
                      <div className="text-sm font-semibold text-foreground">{STATUS_LABEL[t.status]}</div>
                      <div className="text-xs text-muted-foreground">{fmt(t.at)}</div>
                      {t.note && <p className="mt-1 text-sm text-foreground/80">{t.note}</p>}
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="space-y-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:bg-accent">
                  <ThumbsUp className="h-4 w-4" />
                  Support · {issue.upvotes}
                </button>
                <div className="rounded-2xl border border-border bg-background p-4 text-xs text-muted-foreground">
                  <div className="font-semibold text-foreground">Authority response</div>
                  <p className="mt-1">
                    {issue.status === "resolved"
                      ? "Marked resolved. Thank you for reporting."
                      : issue.status === "in_progress"
                        ? "Work is currently underway. You'll be notified on status change."
                        : issue.status === "acknowledged"
                          ? "Acknowledged by the ward office. Awaiting scheduling."
                          : "Pending review by the relevant ward office."}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
