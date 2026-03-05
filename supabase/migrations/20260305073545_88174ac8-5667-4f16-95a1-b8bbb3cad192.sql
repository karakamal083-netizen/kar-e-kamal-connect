-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

-- Create site_images table to track image slots
CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Everyone can read site images (public website)
CREATE POLICY "Anyone can view site images"
  ON public.site_images FOR SELECT USING (true);

-- Only authenticated users can manage images (admin)
CREATE POLICY "Authenticated users can insert site images"
  ON public.site_images FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update site images"
  ON public.site_images FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete site images"
  ON public.site_images FOR DELETE TO authenticated USING (true);

-- Storage policies: anyone can view, authenticated can upload/update/delete
CREATE POLICY "Public read access for site images"
  ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

CREATE POLICY "Auth users can upload site images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Auth users can update site images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images');

CREATE POLICY "Auth users can delete site images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_images_updated_at
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();