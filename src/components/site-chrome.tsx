import { Link } from "@tanstack/react-router";
import { Bell, MapPin } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="leading-none">
            <div className="font-display text-lg font-semibold text-foreground">UrbanPulse</div>
            <div className="text-[10px] font-semibold tracking-[0.18em] text-primary/80">NEPAL</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/report", label: "Report Issue" },
            { to: "/issues", label: "Community Issues" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/70 transition hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive">
            <span className="absolute inset-0 -m-0.5 rounded-full bg-destructive/60 animate-pulse-dot" />
          </span>
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <div className="font-display text-lg font-semibold">UrbanPulse Nepal</div>
              <div className="text-xs text-muted-foreground">
                Supporting UN SDG 11 · Sustainable Cities & Communities
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A transparent civic platform connecting citizens and authorities to build
            better, more resilient communities across Nepal.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Platform</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/report" className="hover:text-foreground">Report Issue</Link></li>
            <li><Link to="/issues" className="hover:text-foreground">Community Issues</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Public Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">About</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>SDG 11 Mission</li>
            <li>For Authorities</li>
            <li>Privacy & Trust</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} UrbanPulse Nepal · Built with citizens, for citizens.
      </div>
    </footer>
  );
}
