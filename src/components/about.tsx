'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from '@/components/section-wrapper';
import { BookOpen, Users, Store, History } from 'lucide-react';

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
  { icon: History, value: 50, suffix: '+', label: 'Años de trayectoria' },
  { icon: Users, value: 60, suffix: '+', label: 'Autores e investigadores' },
  { icon: Store, value: 5, suffix: ' +', label: 'Puntos de venta físicos' },
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
          className="mx-auto max-w-3xl text-center mb-16 space-y-4"
        >
          <h2 className="font-serif text-3xl font-bold sm:text-4xl text-foreground">
            Nosotros
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Nuestro sello Editorial Horizonte nació como un proyecto comprometido con la difusión
            del pensamiento crítico, la memoria histórica y la riqueza literaria y cultural del Perú y América Latina.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Desde su fundación en 1968, ha sido la casa editorial oficial de José María Arguedas y ha publicado la obra
            de César Vallejo y de destacados escritores e intelectuales de las ciencias sociales y las humanidades.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Nuestra misión es hacer llegar al lector contemporáneo ediciones rigurosas y cuidadas que preserven
            la identidad costeña, andina y amazónica, propiciando el diálogo intercultural y la reflexión crítica con las nuevas generaciones.
          </p>
          <p className="text-xs sm:text-sm font-medium text-primary pt-2">
            Actualmente también ofrecemos servicios de edición, impresión y distribución de libros a nivel nacional.
          </p>
        </motion.div>

        {/* Stats */}
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
                className="flex flex-col items-center gap-2 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 text-center shadow-xs"
              >
                <Icon className="size-5 text-primary/70" />
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-tight">
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
