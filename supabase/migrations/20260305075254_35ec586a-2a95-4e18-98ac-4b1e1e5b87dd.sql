
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  content_value text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  label text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site content" ON public.site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site content" ON public.site_content FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default content
INSERT INTO public.site_content (content_key, content_value, category, label) VALUES
  ('hero_subtitle', 'Non-Profit Student Based Organization', 'hero', 'Hero Subtitle'),
  ('hero_title', 'Serving Humanity\nwith Compassion', 'hero', 'Hero Title'),
  ('hero_description', 'Kaar-e-Kamal Welfare Association has been transforming lives across 65+ cities in Pakistan since 2018 with 5,000+ active volunteers.', 'hero', 'Hero Description'),
  ('about_text', 'Kaar-e-Kamal is a non-profit registered organization founded on October 6, 2018 by Bilal Yousaf. It is purely a student-based organization, officially working in 65+ cities across every province of Pakistan with almost 5,000+ active members. We are committed to transparency — all donor records are publicly available for verification.', 'about', 'About Description'),
  ('mission_text', 'To uplift underprivileged families through ration delivery, medical aid, education support, and employment assistance across Pakistan.', 'about', 'Mission Statement'),
  ('vision_text', 'A Pakistan where every family has access to basic necessities — food, healthcare, education, and livelihood opportunities.', 'about', 'Vision Statement'),
  ('founder_text', 'Bilal Yousaf founded Kaar-e-Kamal with a vision to unite students for social welfare, building a nationwide network of compassionate volunteers.', 'about', 'Founder Description'),
  ('stat_1_value', '3644', 'stats', 'Stat 1 Value'),
  ('stat_1_label', 'Families Helped', 'stats', 'Stat 1 Label'),
  ('stat_2_value', '5000', 'stats', 'Stat 2 Value'),
  ('stat_2_label', 'Active Volunteers', 'stats', 'Stat 2 Label'),
  ('stat_3_value', '65', 'stats', 'Stat 3 Value'),
  ('stat_3_label', 'Cities Across Pakistan', 'stats', 'Stat 3 Label'),
  ('stat_4_value', '6', 'stats', 'Stat 4 Value'),
  ('stat_4_label', 'Years of Service', 'stats', 'Stat 4 Label'),
  ('contact_location', 'Khanpur Region, Punjab, Pakistan', 'contact', 'Location'),
  ('contact_phone', '0324-9420425', 'contact', 'Phone'),
  ('contact_email', 'kaarekamal@gmail.com', 'contact', 'Email'),
  ('social_facebook', 'https://www.facebook.com/kaarekamal/', 'contact', 'Facebook URL'),
  ('social_instagram', '#', 'contact', 'Instagram URL'),
  ('social_youtube', '#', 'contact', 'YouTube URL');
