import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
    __upInitMap?: () => void;
  }
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  severity?: "low" | "medium" | "high";
  onClick?: () => void;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  pins?: MapPin[];
  className?: string;
}

let loaderPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
  if (!key) {
    return Promise.reject(new Error("Google Maps key missing"));
  }

  loaderPromise = new Promise<void>((resolve, reject) => {
    window.__upInitMap = () => resolve();
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__upInitMap${channel ? `&channel=${channel}` : ""}`;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

const SEV_COLOR = { low: "#f59e0b", medium: "#ea580c", high: "#dc2626" };

export function GoogleMap({ center, zoom = 7, pins = [], className }: GoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        mapRef.current = new window.google.maps.Map(containerRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "simplified" }] },
          ],
        });
        setLoaded(true);
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  // Update center/zoom when props change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Render markers
  useEffect(() => {
    if (!loaded || !mapRef.current || !window.google) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = pins.map((p) => {
      const color = SEV_COLOR[p.severity ?? "medium"];
      const marker = new window.google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: mapRef.current,
        title: p.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      if (p.onClick) marker.addListener("click", p.onClick);
      return marker;
    });
  }, [pins, loaded]);

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-border bg-muted/40 p-8 text-center ${className ?? ""}`}>
        <div>
          <p className="text-sm font-semibold text-foreground">Map unavailable</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className ?? "h-[480px] w-full rounded-2xl"} />;
}
