
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  link_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published memberships"
ON public.memberships FOR SELECT
TO anon, authenticated
USING (published = true);

CREATE POLICY "Admins read all memberships"
ON public.memberships FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage memberships"
ON public.memberships FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER memberships_set_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.memberships (name, display_order) VALUES
  ('CAAB', 10),
  ('IATA', 20),
  ('ATAB', 30),
  ('TOB', 40),
  ('BOTOF', 50),
  ('ETAB', 60),
  ('e-Cab', 70),
  ('Lions International', 80);

INSERT INTO storage.buckets (id, name, public)
VALUES ('membership-logos', 'membership-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read membership logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'membership-logos');

CREATE POLICY "Admins upload membership logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'membership-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update membership logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'membership-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete membership logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'membership-logos' AND has_role(auth.uid(), 'admin'::app_role));
