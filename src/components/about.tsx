'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/section-wrapper';
import { BookOpen, Users, Award, MapPin } from 'lucide-react';

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = target;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      setVal(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-serif text-3xl font-bold text-primary sm:text-4xl tabular-nums">
      {val.toLocaleString('es-PE')}{suffix}
    </span>
  );
}

const stats = [
  { icon: BookOpen, value: 90, suffix: '+', label: 'Títulos en catálogo' },
  { icon: MapPin, value: 50, suffix: '+', label: 'Años de trayectoria' },
  { icon: Users, value: 60, suffix: '+', label: 'Autores e investigadores' },
  { icon: Award, value: 2, suffix: '', label: 'Almacenes y salas' },
];

export function AboutSection() {
  return (
    <SectionWrapper id="nosotros" className="py-20 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Nosotros
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Editorial Horizonte nació en Lima como un proyecto comprometido con la
            difusión del pensamiento crítico, la memoria histórica y la riqueza
            literaria y cultural del Perú y América Latina. Desde su fundación, ha
            sido la casa emblemática de las obras fundamentales de José María Arguedas,
            César Vallejo y destacados intelectuales de las ciencias sociales.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Nuestra misión es hacer llegar al lector ediciones rigurosas y cuidadas
            que preserven la identidad andina y amazónica, fortaleciendo el diálogo
            intercultural y la reflexión crítica en nuevas generaciones.
          </p>
        </motion.div>

        {/* Stats — horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-5 sm:p-6 text-center"
              >
                <Icon className="size-5 text-muted-foreground/60" />
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}