import { cn } from "@/lib/utils";
import type { Severity, Status } from "@/lib/mock-issues";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/mock-issues";

export function SeverityPill({ severity, className }: { severity: Severity; className?: string }) {
  const map = {
    low: "bg-[oklch(0.96_0.07_95)] text-[oklch(0.42_0.13_75)] ring-[oklch(0.85_0.12_85)]",
    medium: "bg-[oklch(0.96_0.07_55)] text-[oklch(0.42_0.14_45)] ring-[oklch(0.85_0.13_55)]",
    high: "bg-[oklch(0.96_0.05_27)] text-[oklch(0.42_0.18_27)] ring-[oklch(0.85_0.13_27)]",
  } as const;
  const label = { low: "Low Severity", medium: "Medium Severity", high: "High Severity" }[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        map[severity],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function StatusChip({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    reported: "bg-muted text-foreground/70",
    acknowledged: "bg-accent text-accent-foreground",
    in_progress: "bg-[oklch(0.92_0.1_85)] text-[oklch(0.4_0.13_75)]",
    resolved: "bg-primary/10 text-primary",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", map[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StatusTimeline({ status }: { status: Status }) {
  const idx = STATUS_ORDER.indexOf(status);
  return (
    <div className="flex items-center gap-1.5">
      {STATUS_ORDER.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-1.5">
          <div
            className={cn(
              "h-2 flex-1 rounded-full",
              i <= idx ? "bg-primary" : "bg-border",
            )}
          />
        </div>
      ))}
    </div>
  );
}
