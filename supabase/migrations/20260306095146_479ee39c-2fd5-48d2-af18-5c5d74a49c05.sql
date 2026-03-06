
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update contact submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete contact submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (true);
