import { motion } from "framer-motion";
import { Heart, Users, HandHelping } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GetInvolvedSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Thank you!", description: "We'll get back to you soon, InshaAllah." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="get-involved" className="py-20 bg-secondary">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Get Involved</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Be Part of the Change</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Ways to help */}
          <div className="space-y-6">
            {[
              { icon: Heart, title: "Donate", desc: "Even a small contribution of ₨100 can make a difference. Every rupee goes directly to families in need." },
              { icon: Users, title: "Volunteer", desc: "Join 5,000+ Kamalians across Pakistan. Fill the form and start your journey of giving back." },
              { icon: HandHelping, title: "Become a Member", desc: "Go through our induction process: Form Filling → Buffer Training → Official Team Member." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex gap-4 bg-card rounded-lg p-6 shadow-card border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Volunteer form */}
          <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            onSubmit={handleSubmit} className="bg-card rounded-lg p-8 shadow-card border space-y-5">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Volunteer with Us</h3>
            <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Textarea placeholder="Why do you want to join Kaar-e-Kamal?" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button type="submit" size="lg" className="w-full">Submit Application</Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
