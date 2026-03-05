import { motion } from "framer-motion";
import winterDrive from "@/assets/winter-drive.jpg";
import floodRelief from "@/assets/flood-relief.jpg";
import medicalCamp from "@/assets/medical-camp.jpg";
import rationDelivery from "@/assets/ration-delivery.jpg";
import orphanCare from "@/assets/orphan-care.jpg";

const campaigns = [
  { img: winterDrive, title: "Winter Drive", desc: "Distributing warm clothing and blankets to families in harsh winter." },
  { img: floodRelief, title: "Flood Relief", desc: "Emergency relief and ration delivery to flood-affected communities." },
  { img: rationDelivery, title: "Food Drives", desc: "Regular food distribution campaigns to combat hunger." },
  { img: medicalCamp, title: "Medical Camps", desc: "Free medical checkups and medicines for underserved areas." },
  { img: orphanCare, title: "Orphanage Visits", desc: "Regular visits to orphanages bringing joy and essential supplies." },
  { img: rationDelivery, title: "Iftaar Drives", desc: "Providing Iftaar meals during Ramadan to those in need." },
];

const CampaignsSection = () => (
  <section id="campaigns" className="py-20 bg-background">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Campaigns & Events</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Making a Difference</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-lg overflow-hidden bg-card shadow-card border group">
            <div className="overflow-hidden h-48">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CampaignsSection;
