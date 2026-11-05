'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

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
    <span ref={ref} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground tabular-nums">
      {val.toLocaleString('es-PE')}{suffix}
    </span>
  );
}

const stats = [
  { value: 90, suffix: '+', label: 'Títulos en catálogo activo' },
  { value: 50, suffix: '+', label: 'Años de trayectoria editorial' },
  { value: 60, suffix: '+', label: 'Autores e investigadores' },
  { value: 5, suffix: ' +', label: 'Puntos de distribución física' },
];

export function AboutSection() {
  return (
    <section id="nosotros" className="w-full py-16 sm:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera y Relato Editorial Asimétrico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16">
          {/* Columna Izquierda: Manifiesto Principal */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
              Trayectoria y Compromiso
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Editorial Horizonte
            </h2>
            <p className="font-serif italic text-base sm:text-lg text-foreground/80 leading-relaxed border-l-2 border-primary/50 pl-4 mt-4">
              «Un proyecto comprometido con la difusión del pensamiento crítico, la memoria histórica y la riqueza literaria y cultural del Perú y América Latina.»
            </p>
          </div>

          {/* Columna Derecha: Relato Histórico */}
          <div className="lg:col-span-7 space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            <p>
              Desde su fundación en 1968, Editorial Horizonte ha sido la casa editorial oficial de{' '}
              <strong className="text-foreground font-semibold">José María Arguedas</strong> y ha publicado la obra de{' '}
              <strong className="text-foreground font-semibold">César Vallejo</strong>, junto con destacados escritores e intelectuales de las ciencias sociales, la antropología y las humanidades.
            </p>
            <p>
              Nuestra misión es hacer llegar al lector contemporáneo ediciones rigurosas y cuidadas que preserven
              la identidad costeña, andina y amazónica, propiciando el diálogo intercultural y la reflexión crítica con las nuevas generaciones.
            </p>
            <p className="pt-2 text-xs sm:text-sm font-medium text-foreground">
              Brindamos servicios integrales de edición, asesoría bibliográfica, impresión y distribución mayorista a librerías e instituciones de todo el territorio nacional.
            </p>
          </div>
        </div>

        {/* Fila de Métricas Editoriales Seamless — Sin cajas ni tarjetas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-border/40 border-t border-b border-border/40 py-8 sm:py-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex flex-col items-start lg:px-8 first:lg:pl-0 last:lg:pr-0"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
