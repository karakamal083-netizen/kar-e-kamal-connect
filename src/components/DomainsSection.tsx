import { motion } from "framer-motion";
import { Package, Pill, GraduationCap, Briefcase, Droplets } from "lucide-react";

const domains = [
  { icon: Package, title: "Ration Delivery", desc: "Monthly ration packages worth ₨5-6K delivered to registered families across Pakistan." },
  { icon: Pill, title: "Medical Assistance", desc: "Medicines and healthcare support provided to patients within ₨5-6K per case." },
  { icon: GraduationCap, title: "Education Support", desc: "School fee assistance within ₨5-6K to keep underprivileged children in school." },
  { icon: Briefcase, title: "Employment Support", desc: "Rozgar domain helps families become self-sufficient with support up to ₨25K." },
  { icon: Droplets, title: "Blood Donation", desc: "Arranging blood for patients in emergency need through our volunteer network." },
];

const DomainsSection = () => (
  <section id="domains" className="py-20 bg-secondary">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Our Work</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Domains of Service</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-8 shadow-card border hover:shadow-elevated transition-shadow group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <d.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">{d.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{d.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DomainsSection;
