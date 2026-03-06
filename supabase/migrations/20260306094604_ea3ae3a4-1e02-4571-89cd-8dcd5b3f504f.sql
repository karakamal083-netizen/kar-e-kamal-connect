
CREATE TABLE public.gallery_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  caption text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gallery images" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update gallery images" ON public.gallery_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete gallery images" ON public.gallery_images FOR DELETE TO authenticated USING (true);
