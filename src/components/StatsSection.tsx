import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatsSectionProps {
  getValue: (key: string) => string;
}

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const StatsSection = ({ getValue }: StatsSectionProps) => {
  const stats = [
    { value: parseInt(getValue("stat_1_value")) || 0, label: getValue("stat_1_label"), suffix: "+" },
    { value: parseInt(getValue("stat_2_value")) || 0, label: getValue("stat_2_label"), suffix: "+" },
    { value: parseInt(getValue("stat_3_value")) || 0, label: getValue("stat_3_label"), suffix: "+" },
    { value: parseInt(getValue("stat_4_value")) || 0, label: getValue("stat_4_label"), suffix: "+" },
  ];

  return (
    <section className="bg-primary py-16">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground">
              <Counter target={s.value} suffix={s.suffix} />
            </p>
            <p className="text-primary-foreground/75 text-sm mt-2 font-body">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
