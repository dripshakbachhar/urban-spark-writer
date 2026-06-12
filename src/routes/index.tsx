import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, AlertTriangle, MapPin, FileText, CheckCircle2, Users, Clock, ShieldCheck, Eye, Building2, Sparkles } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { SeverityPill } from "@/components/severity";
import { StatCounter } from "@/components/stat-counter";
import { ALERTS, ISSUES, STATS } from "@/lib/mock-issues";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanPulse Nepal — Every community issue, visible until resolved" },
      { name: "description", content: "Report potholes, water, waste, streetlight and flooding issues across Nepal. Track progress in real time and hold authorities accountable." },
      { property: "og:title", content: "UrbanPulse Nepal" },
      { property: "og:description", content: "Civic transparency from report to resolution." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <ActiveAlerts />
        <Stats />
        <Problem />
        <Solution />
        <SDG />
        <Testimonials />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-topo relative pt-16 pb-32 text-primary-foreground">
      {/* Topographic SVG pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="topo" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40 Q 20 20 40 40 T 80 40" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 60 Q 20 40 40 60 T 80 60" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 20 Q 20 0 40 20 T 80 20" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)" />
      </svg>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Supporting SDG 11 · Sustainable Cities & Communities
        </div>

        <h1 className="animate-fade-up [animation-delay:120ms] mt-8 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Making every community issue
          <br />
          <span className="text-primary-glow">visible until resolved.</span>
        </h1>

        <p className="animate-fade-up [animation-delay:240ms] mx-auto mt-6 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
          A transparent platform connecting citizens and authorities to build better,
          sustainable cities. Report issues, track progress, and create lasting change in
          your community.
        </p>

        <div className="animate-fade-up [animation-delay:360ms] mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/report"
            className="group inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-lift)] transition hover:translate-y-[-1px]"
          >
            <FileText className="h-4 w-4" />
            Report Issue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/issues"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition hover:bg-primary-foreground/10"
          >
            <Eye className="h-4 w-4" />
            Explore Issues
          </Link>
        </div>
      </div>

      {/* Bottom fade into cream */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}

function ActiveAlerts() {
  return (
    <section className="relative -mt-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-destructive">
              Active Alerts
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {ALERTS.map((a, i) => (
              <div
                key={a.id}
                className="animate-fade-up rounded-2xl border border-border bg-background/60 p-4 transition hover:shadow-[var(--shadow-soft)]"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-foreground">{a.title}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {a.city}
                    </div>
                  </div>
                  <AlertTriangle
                    className={
                      a.severity === "high"
                        ? "h-5 w-5 text-[var(--sev-high)]"
                        : a.severity === "medium"
                          ? "h-5 w-5 text-[var(--sev-medium)]"
                          : "h-5 w-5 text-[var(--sev-low)]"
                    }
                  />
                </div>
                <div className="mt-3">
                  <SeverityPill severity={a.severity} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        <StatCounter value={STATS.totalReported} label="Total Issues Reported" />
        <StatCounter value={STATS.resolved} label="Resolved Issues" />
        <StatCounter value={STATS.communities} label="Communities Connected" />
        <StatCounter value={STATS.avgResolutionDays} label="Avg Resolution (Days)" />
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    { icon: Eye, title: "Hidden Problems", body: "Infrastructure issues and safety hazards often go unreported or are forgotten after submission." },
    { icon: Clock, title: "No Follow-up", body: "Citizens rarely receive updates on reported issues, leading to duplicate reports and frustration." },
    { icon: ShieldCheck, title: "Lack of Accountability", body: "Without transparent tracking, authorities may not prioritize community needs effectively." },
  ];
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="The Problem" title="Citizens report. Then silence." body="Without transparency, trust erodes — and the same problems keep coming back." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((p) => (
            <div key={p.title} className="group rounded-3xl border border-border bg-card p-6 transition hover:shadow-[var(--shadow-lift)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const steps = [
    { n: "01", icon: FileText, title: "Report Issues", body: "Easy-to-use reporting with photos and precise location tagging." },
    { n: "02", icon: Clock, title: "Track Progress", body: "Real-time status updates from report to resolution." },
    { n: "03", icon: Users, title: "Community Support", body: "Residents verify and upvote issues in their area." },
    { n: "04", icon: ShieldCheck, title: "Accountability", body: "Transparent metrics hold authorities accountable." },
  ];
  return (
    <section className="bg-secondary/40 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Our Solution" title="From report to resolution — in the open." body="UrbanPulse creates complete transparency at every step, empowering communities and authorities alike." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="absolute -right-3 -top-3 font-display text-7xl font-bold leading-none text-primary/5">
                {s.n}
              </div>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="absolute right-5 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SDG() {
  const pillars = [
    { icon: Users, title: "Civic Participation", body: "Empowering citizens to participate in improving their communities through transparent reporting.", chip: "Increased engagement in local governance" },
    { icon: Building2, title: "Government Accountability", body: "Authorities can track and resolve community issues efficiently with public visibility.", chip: "Faster response times" },
    { icon: Sparkles, title: "Urban Planning", body: "Data-driven insights help authorities identify problems and plan infrastructure proactively.", chip: "Smarter city development" },
  ];
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-14">
        <div className="grid gap-10 md:grid-cols-[1fr,1.4fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              SDG 11
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Building sustainable communities, together.
            </h2>
            <p className="mt-3 text-primary-foreground/75">
              UrbanPulse Nepal directly supports the UN Sustainable Development Goals by creating safer, more inclusive, and resilient urban environments.
            </p>
          </div>
          <div className="grid gap-3">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-glow/20 text-primary-glow">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                </div>
                <p className="mt-2 text-sm text-primary-foreground/75">{p.body}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-glow/15 px-2.5 py-1 text-[11px] font-semibold text-primary-glow">
                  <CheckCircle2 className="h-3 w-3" />
                  {p.chip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const recent = ISSUES.slice(0, 3);
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Live from the platform" title="Recently reported in your communities" body="Real reports, real progress — all publicly tracked." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {recent.map((i) => (
            <Link
              key={i.id}
              to="/issues/$id"
              params={{ id: i.id }}
              className="group rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{i.photo}</span>
                <SeverityPill severity={i.severity} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{i.title}</h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {i.city} · {i.ward}
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                View progress
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card p-10 text-center shadow-[var(--shadow-lift)] sm:p-16">
        <h2 className="font-display text-3xl font-semibold sm:text-5xl">Ready to make a difference?</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join thousands of citizens helping build better communities across Nepal.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/report" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
            Report Your First Issue
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/issues" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent">
            View Community Issues
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-4 text-muted-foreground">{body}</p>
    </div>
  );
}
