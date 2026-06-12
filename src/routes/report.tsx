import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { CATEGORY_LABEL, CITIES, type Category, type Severity } from "@/lib/mock-issues";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — UrbanPulse Nepal" },
      { name: "description", content: "Report a community issue in your area with a photo, location and description. Track progress to resolution." },
      { property: "og:title", content: "Report an issue — UrbanPulse Nepal" },
      { property: "og:url", content: "/report" },
    ],
    links: [{ rel: "canonical", href: "/report" }],
  }),
  component: Report,
});

const steps = ["Category", "Location", "Details", "Review"] as const;

function Report() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | "">("");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [city, setCity] = useState<string>("Kathmandu");
  const [ward, setWard] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const canNext =
    (step === 0 && category !== "") ||
    (step === 1 && ward.trim().length > 0) ||
    (step === 2 && title.trim().length > 3 && desc.trim().length > 10) ||
    step === 3;

  const submit = () => {
    toast.success("Report submitted", { description: "Thanks — your report is now visible to authorities and your community." });
    setTimeout(() => navigate({ to: "/issues" }), 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <header>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Report an issue</div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Help your community fix it.</h1>
            <p className="mt-2 text-muted-foreground">It takes about a minute. Everything you submit becomes publicly trackable.</p>
          </header>

          {/* Stepper */}
          <ol className="mt-8 flex items-center gap-2">
            {steps.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/15" :
                  "bg-muted text-muted-foreground")}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <div className={cn("text-xs font-semibold", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</div>
                {i < steps.length - 1 && <div className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10">
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">What kind of issue is this?</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn("rounded-2xl border bg-background p-4 text-left transition hover:border-primary",
                        category === c ? "border-primary ring-2 ring-primary/20" : "border-border")}
                    >
                      <div className="text-2xl">{categoryEmoji(c)}</div>
                      <div className="mt-2 font-semibold">{CATEGORY_LABEL[c]}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <div className="text-sm font-semibold">How severe?</div>
                  <div className="mt-3 flex gap-2">
                    {(["low", "medium", "high"] as Severity[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeverity(s)}
                        className={cn("flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition",
                          severity === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40")}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">Where is it?</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="City">
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="input">
                      {CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Ward / locality">
                    <input value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g. Ward 10, Patan Dhoka" className="input" />
                  </Field>
                </div>
                <div className="mt-6 flex aspect-[2/1] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Tap to drop a pin (map preview)</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">Tell us more.</h2>
                <div className="mt-6 grid gap-4">
                  <Field label="Title">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Short summary" className="input" />
                  </Field>
                  <Field label="Description">
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={1000} rows={5} placeholder="What's happening, when did it start, who's affected?" className="input resize-none" />
                  </Field>
                  <Field label="Photo">
                    <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4" /> Add a photo</span>
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-semibold">Review and submit</h2>
                <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-background">
                  <Row k="Category" v={category ? CATEGORY_LABEL[category as Category] : "—"} />
                  <Row k="Severity" v={severity} />
                  <Row k="Location" v={`${city} · ${ward || "—"}`} />
                  <Row k="Title" v={title || "—"} />
                  <Row k="Description" v={desc || "—"} />
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">By submitting, you confirm this report is honest and yours to share publicly.</p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              >
                Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Submit report
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--border);background:var(--background);padding:0.65rem 0.85rem;font-size:0.875rem;outline:none}.input:focus{border-color:var(--primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 px-4 py-3 text-sm">
      <dt className="font-semibold text-muted-foreground">{k}</dt>
      <dd className="text-right text-foreground">{v}</dd>
    </div>
  );
}
function categoryEmoji(c: Category) {
  return { water: "💧", roads: "🛣️", waste: "🗑️", streetlight: "💡", flooding: "🌧️", traffic: "🚦", safety: "⚠️" }[c];
}
