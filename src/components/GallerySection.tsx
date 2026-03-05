import { motion } from "framer-motion";

interface GallerySectionProps {
  getImage: (key: string) => string;
}

const imageKeys = [
  { key: "hero-bg", alt: "Community service" },
  { key: "ration-delivery", alt: "Ration delivery" },
  { key: "medical-camp", alt: "Medical camp" },
  { key: "education-support", alt: "Education support" },
  { key: "skills-center", alt: "Skills training" },
  { key: "orphan-care", alt: "Orphan care" },
  { key: "winter-drive", alt: "Winter drive" },
  { key: "flood-relief", alt: "Flood relief" },
];

const GallerySection = ({ getImage }: GallerySectionProps) => (
  <section id="gallery" className="py-20 bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Gallery</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Moments of Impact</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {imageKeys.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="rounded-lg overflow-hidden aspect-square group">
            <img src={getImage(img.key)} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
