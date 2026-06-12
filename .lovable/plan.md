# Ready-to-use Lovable Prompt

Copy the block below into Lovable as your first message. It's structured so Lovable can render it as a polished, single-page civic platform with clear hierarchy, real interactivity, and a stronger visual identity than the reference site.

---

**Build "UrbanPulse Nepal" — a civic issue reporting platform that makes community problems visible until resolved (supporting UN SDG 11: Sustainable Cities & Communities).**

## Product
A transparent platform where Nepali citizens report local infrastructure and safety issues (potholes, water, waste, streetlights, flooding, traffic), track resolution status in real time, and where authorities are held accountable through public metrics.

## Pages (separate routes, each with unique SEO metadata)
1. **Home (`/`)** — marketing landing
2. **Report Issue (`/report`)** — multi-step form (category → location → photo → description → submit)
3. **Community Issues (`/issues`)** — filterable feed of all reports (status, category, city, severity)
4. **Issue Detail (`/issues/:id`)** — timeline, photos, upvotes, status history, authority response
5. **Dashboard (`/dashboard`)** — public analytics: resolution rates, heatmap-style city breakdown, trending categories
6. **Admin (`/admin`)** — gated authority view to update status and respond

## Home page sections (in order)
- Sticky top nav with logo "UrbanPulse Nepal", links, and a bell with an unread indicator
- Hero: SDG 11 pill badge, bold headline "Making every community issue visible until resolved.", subhead, primary CTA "Report Issue" + secondary "Explore Issues"
- **Active Alerts** strip — 3 live cards (Water Supply Maintenance · Lalitpur · Medium; Traffic Advisory · Bhaktapur-Thimi Highway · Low; Monsoon Flood Warning · Kathmandu Valley · High), color-coded by severity, with animated count-up on view
- Stats row with animated counters: Total Issues Reported, Resolved Issues, Communities Connected, Avg Resolution (Days)
- "The Problem We Solve" — 3 cards: Hidden Problems, No Follow-up, Lack of Accountability
- "Our Solution" — 4 numbered steps: Report Issues → Track Progress → Community Support → Accountability
- "Building Sustainable Communities" — SDG 11 impact section with 3 pillars: Civic Participation, Government Accountability, Urban Planning
- Live map preview teaser (Kathmandu Valley) with pinned recent issues
- Testimonials from citizens + one ward officer quote
- Final CTA band "Ready to make a difference?" with both CTAs
- Footer with SDG logo, links, language toggle (English / नेपाली)

## Design direction (this is what makes it lovable, not generic)
- **Vibe:** civic-trust meets modern Nepali identity — confident, optimistic, not corporate-sterile
- **Palette:** deep forest green primary `#0F5132` with vibrant accent `#34D399`, warm cream background `#FBF7EE`, alert reds/ambers reserved for severity. Avoid the flat saturated green wash the reference uses; layer subtle paper-grain texture and soft radial gradients instead
- **Typography:** display in `Fraunces` (warm serif) for headlines, body in `Inter`. Devanagari fallback `Mukta` for Nepali toggle
- **Motion (Motion for React):** hero headline word-by-word reveal, stats counter on scroll, alert cards slide in with stagger, subtle parallax on hero grid pattern, hover lift on issue cards
- **Components:** rounded-2xl cards with soft shadows, severity pills (low/medium/high) with semantic colors, status chips (Reported → Acknowledged → In Progress → Resolved) with a horizontal progress timeline
- **Hero background:** custom SVG topographic map of Kathmandu Valley as a faint pattern overlay — instead of plain green
- **Mobile-first**, fully responsive, 390px target

## Data
Use Lovable Cloud for: issues table (id, title, description, category, severity, status, city, lat, lng, photo_url, upvotes, reporter_id, created_at), status_history, alerts, profiles, user_roles (citizen/authority/admin). Seed with ~15 realistic Nepali example issues across Kathmandu, Lalitpur, Bhaktapur, Pokhara.

## Auth
Email/password sign-up for citizens. Separate role for authority/admin (stored in `user_roles` table, never on profile). RLS so only authorities can update status.

## SEO
Unique title + meta description per route. Single H1. JSON-LD Organization on home. og:image set per page.

## Quality bar
Awwwards-level polish. No purple gradients, no generic shadcn defaults, no Inter-everywhere. Every section should feel intentional and earn its space. Show empty states, loading skeletons, and a friendly 404.

---

## Optional add-ons to mention later
- WhatsApp/SMS report intake
- Push notifications on status change
- Public API for journalists/researchers
- Multilingual (Nepali + English) with a real translation toggle

Tell me if you'd like me to (a) drop this prompt straight into a fresh build, (b) tweak the palette/typography first, or (c) generate 3 visual design directions before building.
