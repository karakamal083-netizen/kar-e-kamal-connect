import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  heroImage: string;
  getValue: (key: string) => string;
}

const HeroSection = ({ heroImage, getValue }: HeroSectionProps) => {
  const title = getValue("hero_title");
  const titleParts = title.split("\n");

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={heroImage} alt="Kaar-e-Kamal volunteers helping families" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 container text-center py-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-primary-foreground/80 font-body text-sm tracking-[0.2em] uppercase mb-4">
            {getValue("hero_subtitle")}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            {titleParts.map((part, i) => (
              <span key={i}>{part}{i < titleParts.length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="text-primary-foreground/85 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body">
            {getValue("hero_description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base font-semibold" asChild>
              <a href="#get-involved"><Heart className="w-5 h-5 mr-2" /> Donate Now</a>
            </Button>
            <Button size="lg" variant="outline" className="text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="#get-involved"><Users className="w-5 h-5 mr-2" /> Join Us</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
