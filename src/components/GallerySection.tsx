import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import rationDelivery from "@/assets/ration-delivery.jpg";
import medicalCamp from "@/assets/medical-camp.jpg";
import educationSupport from "@/assets/education-support.jpg";
import skillsCenter from "@/assets/skills-center.jpg";
import orphanCare from "@/assets/orphan-care.jpg";
import winterDrive from "@/assets/winter-drive.jpg";
import floodRelief from "@/assets/flood-relief.jpg";

const images = [
  { src: heroBg, alt: "Community service" },
  { src: rationDelivery, alt: "Ration delivery" },
  { src: medicalCamp, alt: "Medical camp" },
  { src: educationSupport, alt: "Education support" },
  { src: skillsCenter, alt: "Skills training" },
  { src: orphanCare, alt: "Orphan care" },
  { src: winterDrive, alt: "Winter drive" },
  { src: floodRelief, alt: "Flood relief" },
];

const GallerySection = () => (
  <section id="gallery" className="py-20 bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Gallery</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Moments of Impact</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="rounded-lg overflow-hidden aspect-square group">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
