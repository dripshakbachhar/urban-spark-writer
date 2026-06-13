import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string;
  unit?: string | null;
  status?: "good" | "warning" | "critical" | "info" | null;
  trend?: "up" | "down" | "flat" | null;
  trendPct?: number | null;
  updatedAt?: string;
}

const STATUS_TONE: Record<NonNullable<MetricCardProps["status"]>, string> = {
  good: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
  critical: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
  info: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
};

export function MetricCard({ label, value, unit, status, trend, trendPct, updatedAt }: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {status ? (
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1", STATUS_TONE[status])}>
            {status}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-semibold leading-none text-foreground">{value}</span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <TrendIcon className={cn("h-3.5 w-3.5", trend === "up" ? "text-rose-600" : trend === "down" ? "text-emerald-600" : "text-muted-foreground")} />
          {trendPct != null ? `${trendPct > 0 ? "+" : ""}${trendPct}% vs last week` : "stable"}
        </span>
        {updatedAt ? <span>updated {new Date(updatedAt).toLocaleDateString()}</span> : null}
      </div>
    </div>
  );
}
