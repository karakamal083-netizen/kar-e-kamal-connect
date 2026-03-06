import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// Fallback defaults
import defaultHeroBg from "@/assets/hero-bg.jpg";
import defaultRationDelivery from "@/assets/ration-delivery.jpg";
import defaultMedicalCamp from "@/assets/medical-camp.jpg";
import defaultEducationSupport from "@/assets/education-support.jpg";
import defaultSkillsCenter from "@/assets/skills-center.jpg";
import defaultOrphanCare from "@/assets/orphan-care.jpg";
import defaultWinterDrive from "@/assets/winter-drive.jpg";
import defaultFloodRelief from "@/assets/flood-relief.jpg";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

const fallbackImages = [
  { id: "f1", image_url: defaultHeroBg, caption: "Community service" },
  { id: "f2", image_url: defaultRationDelivery, caption: "Ration delivery" },
  { id: "f3", image_url: defaultMedicalCamp, caption: "Medical camp" },
  { id: "f4", image_url: defaultEducationSupport, caption: "Education support" },
  { id: "f5", image_url: defaultSkillsCenter, caption: "Skills training" },
  { id: "f6", image_url: defaultOrphanCare, caption: "Orphan care" },
  { id: "f7", image_url: defaultWinterDrive, caption: "Winter drive" },
  { id: "f8", image_url: defaultFloodRelief, caption: "Flood relief" },
];

interface GallerySectionProps {
  getImage?: (key: string) => string;
}

const GallerySection = (_props: GallerySectionProps) => {
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, image_url, caption")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setImages(data as GalleryImage[]);
      });
  }, []);

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Gallery</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Moments of Impact</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-lg overflow-hidden aspect-square group">
              <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
