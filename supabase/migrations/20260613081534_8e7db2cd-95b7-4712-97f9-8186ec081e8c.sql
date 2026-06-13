
-- Category enum
CREATE TYPE public.civic_category AS ENUM (
  'water', 'waste', 'roads', 'environment', 'public_safety', 'traffic', 'disaster'
);

-- Cities
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_ne TEXT,
  province TEXT NOT NULL,
  city_type TEXT NOT NULL CHECK (city_type IN ('metropolitan','sub_metropolitan')),
  population INTEGER,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  performance_score NUMERIC(4,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cities TO anon, authenticated;
GRANT ALL ON public.cities TO service_role;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are public" ON public.cities FOR SELECT USING (true);

-- City metrics (flexible key/value)
CREATE TABLE public.city_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  category public.civic_category NOT NULL,
  metric_key TEXT NOT NULL,
  metric_label TEXT NOT NULL,
  value_num NUMERIC,
  value_text TEXT,
  unit TEXT,
  status TEXT CHECK (status IN ('good','warning','critical','info')),
  trend TEXT CHECK (trend IN ('up','down','flat')),
  trend_pct NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(city_id, category, metric_key)
);
GRANT SELECT ON public.city_metrics TO anon, authenticated;
GRANT ALL ON public.city_metrics TO service_role;
ALTER TABLE public.city_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Metrics are public" ON public.city_metrics FOR SELECT USING (true);

CREATE INDEX idx_city_metrics_city_cat ON public.city_metrics(city_id, category);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_cities_updated BEFORE UPDATE ON public.cities
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_metrics_updated BEFORE UPDATE ON public.city_metrics
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
