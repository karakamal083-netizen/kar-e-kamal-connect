import { motion } from "framer-motion";
import { Target, Eye, User } from "lucide-react";

interface AboutSectionProps {
  getValue: (key: string) => string;
}

const AboutSection = ({ getValue }: AboutSectionProps) => {
  const cards = [
    { icon: Target, title: "Our Mission", textKey: "mission_text" },
    { icon: Eye, title: "Our Vision", textKey: "vision_text" },
    { icon: User, title: "Our Founder", textKey: "founder_text" },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">About Us</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Who We Are</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground text-lg leading-relaxed text-center">
            {getValue("about_text")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="bg-card rounded-lg p-8 shadow-card border text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getValue(item.textKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
