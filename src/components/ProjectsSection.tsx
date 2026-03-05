import { motion } from "framer-motion";
import orphanCare from "@/assets/orphan-care.jpg";
import educationSupport from "@/assets/education-support.jpg";
import skillsCenter from "@/assets/skills-center.jpg";
import medicalCamp from "@/assets/medical-camp.jpg";

const projects = [
  {
    img: orphanCare, title: "Alif Home Care", subtitle: "Orphan Support Home",
    points: ["Safe and supportive home for orphaned children", "Quality education and training", "Nutritious meals and comfortable living"],
  },
  {
    img: educationSupport, title: "Alif School of Excellence", subtitle: "Education Project",
    points: ["Activity-based learning", "Sports Day & Speech Competitions", "Building students' confidence"],
  },
  {
    img: skillsCenter, title: "Alif Skills Center", subtitle: "Women Skills Training",
    points: ["Empower women with modern skills", "Financial independence training", "Market-relevant skill development"],
  },
  {
    img: medicalCamp, title: "Bait-ul-Shifa", subtitle: "Low-Cost Medical Dispensary",
    points: ["Medicines for just ₨50", "Lab testing and medical check-ups", "Medical camps for accessible healthcare"],
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-20 bg-secondary">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Mega Projects</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Our Flagship Initiatives</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg overflow-hidden shadow-card border flex flex-col sm:flex-row">
            <img src={p.img} alt={p.title} className="sm:w-48 h-48 sm:h-auto object-cover" />
            <div className="p-6 flex-1">
              <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-1">{p.subtitle}</p>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{p.title}</h3>
              <ul className="space-y-1">
                {p.points.map((pt, j) => (
                  <li key={j} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
