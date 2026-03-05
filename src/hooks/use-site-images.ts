import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Default fallback images (bundled)
import defaultHeroBg from "@/assets/hero-bg.jpg";
import defaultRationDelivery from "@/assets/ration-delivery.jpg";
import defaultMedicalCamp from "@/assets/medical-camp.jpg";
import defaultEducationSupport from "@/assets/education-support.jpg";
import defaultSkillsCenter from "@/assets/skills-center.jpg";
import defaultOrphanCare from "@/assets/orphan-care.jpg";
import defaultWinterDrive from "@/assets/winter-drive.jpg";
import defaultFloodRelief from "@/assets/flood-relief.jpg";

const DEFAULTS: Record<string, string> = {
  "hero-bg": defaultHeroBg,
  "ration-delivery": defaultRationDelivery,
  "medical-camp": defaultMedicalCamp,
  "education-support": defaultEducationSupport,
  "skills-center": defaultSkillsCenter,
  "orphan-care": defaultOrphanCare,
  "winter-drive": defaultWinterDrive,
  "flood-relief": defaultFloodRelief,
};

export function useSiteImages() {
  const [images, setImages] = useState<Record<string, string>>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("site_images")
      .select("slot_key, image_url")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const merged = { ...DEFAULTS };
          data.forEach((row: any) => {
            merged[row.slot_key] = row.image_url;
          });
          setImages(merged);
        }
        setLoaded(true);
      });
  }, []);

  const getImage = (key: string) => images[key] || DEFAULTS[key] || "";

  return { getImage, loaded };
}
