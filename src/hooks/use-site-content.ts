import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContent {
  content_key: string;
  content_value: string;
  category: string;
  label: string | null;
}

const DEFAULTS: Record<string, string> = {
  hero_subtitle: "Non-Profit Student Based Organization",
  hero_title: "Serving Humanity\nwith Compassion",
  hero_description: "Kaar-e-Kamal Welfare Association has been transforming lives across 65+ cities in Pakistan since 2018 with 5,000+ active volunteers.",
  about_text: "Kaar-e-Kamal is a non-profit registered organization founded on October 6, 2018 by Bilal Yousaf. It is purely a student-based organization, officially working in 65+ cities across every province of Pakistan with almost 5,000+ active members. We are committed to transparency — all donor records are publicly available for verification.",
  mission_text: "To uplift underprivileged families through ration delivery, medical aid, education support, and employment assistance across Pakistan.",
  vision_text: "A Pakistan where every family has access to basic necessities — food, healthcare, education, and livelihood opportunities.",
  founder_text: "Bilal Yousaf founded Kaar-e-Kamal with a vision to unite students for social welfare, building a nationwide network of compassionate volunteers.",
  stat_1_value: "3644",
  stat_1_label: "Families Helped",
  stat_2_value: "5000",
  stat_2_label: "Active Volunteers",
  stat_3_value: "65",
  stat_3_label: "Cities Across Pakistan",
  stat_4_value: "6",
  stat_4_label: "Years of Service",
  contact_location: "Khanpur Region, Punjab, Pakistan",
  contact_phone: "0324-9420425",
  contact_email: "kaarekamal@gmail.com",
  social_facebook: "https://www.facebook.com/kaarekamal/",
  social_instagram: "#",
  social_youtube: "#",
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*");
    if (data) setContent(data as SiteContent[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getValue = useCallback(
    (key: string): string => {
      const found = content.find((c) => c.content_key === key);
      return found?.content_value ?? DEFAULTS[key] ?? "";
    },
    [content]
  );

  return { content, loading, getValue, refetch: fetchContent };
};
