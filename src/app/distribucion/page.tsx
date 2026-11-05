import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';
import { WhatsAppIcon } from '@/components/whatsapp-floating';
import { Truck, CheckCircle2, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Distribución y Servicios Editoriales | Editorial Horizonte',
  description:
    'Distribución de libros a nivel nacional, convenios con librerías, universidades y bibliotecas. Servicios de edición e impresión.',
};

export default function DistribucionPage() {
  const whatsappUrl =
    'https://wa.me/51955637859?text=' +
    encodeURIComponent('Hola Editorial Horizonte, solicito información sobre distribución mayorista y catálogo comercial.');

  const pillars = [
    {
      num: '01',
      title: 'Librerías y Puntos de Venta',
      description:
        'Abastecemos a librerías independientes y comerciales en Lima y provincias con condiciones preferenciales, esquemas de consignación y descuentos escalonados por volumen.',
    },
    {
      num: '02',
      title: 'Universidades y Bibliotecas',
      description:
        'Convenios académicos para fondos bibliográficos, bibliotecas comunales y lectura obligatoria de las obras fundamentales de José María Arguedas, César Vallejo e investigación social.',
    },
    {
      num: '03',
      title: 'Servicios de Edición e Impresión',
      description:
        'Acompañamiento integral para autores e instituciones: corrección de estilo, diseño editorial, diagramación profesional, gestión formal de ISBN y producción física de alta calidad.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* ─── 1. CABECERA EDITORIAL ELEGANTE ─── */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Truck className="size-3.5" />
              Cobertura Nacional & Convenios
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Distribución y Servicios Editoriales
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed pt-1">
              Facilitamos el acceso directo a las obras fundamentales de las letras peruanas para librerías, ferias del libro, universidades, bibliotecas e instituciones culturales de todo el Perú.
            </p>
          </div>

          {/* ─── 2. PILARES SEAMLESS — SIN BLOQUES ESTILO WORDPRESS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-border/40 border-t border-b border-border/40 py-10 sm:py-14">
            {pillars.map((p, idx) => (
              <div
                key={p.num}
                className="flex flex-col justify-between md:px-8 first:md:pl-0 last:md:pr-0 space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl sm:text-4xl font-light text-muted-foreground/35 group-hover:text-primary transition-colors">
                      {p.num}
                    </span>
                    <div className="w-8 h-[1px] bg-border/60 group-hover:bg-primary/60 transition-colors" />
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ─── 3. PROTOCOLO DE PEDIDOS SEAMLESS ─── */}
          <div className="space-y-8">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-1">
                Logística y Despacho
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                ¿Cómo solicitar libros para tu librería o institución?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Coordinamos despachos de manera directa, ágil y con garantía editorial sellada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Paso 01</span>
                <h4 className="font-serif font-bold text-sm text-foreground">Catálogo Comercial</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Solicita la lista mayorista actualizada con precios de venta al público y márgenes por tiraje.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Paso 02</span>
                <h4 className="font-serif font-bold text-sm text-foreground">Despacho Nacional</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Envíos a todo el Perú mediante agencias autorizadas (Shalom, Olva Courier) con seguimiento en tiempo real.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Paso 03</span>
                <h4 className="font-serif font-bold text-sm text-foreground">Retiro en Sede</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Retiro directo sin costo de embalaje en nuestro almacén de Jirón Sucre 470, San Miguel, Lima.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Paso 04</span>
                <h4 className="font-serif font-bold text-sm text-foreground">Facturación Formal</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Facturación electrónica formal y emisión de guías de remisión oficiales para instituciones públicas y privadas.
                </p>
              </div>
            </div>
          </div>

          {/* ─── 4. CANALES DE ATENCIÓN DIRECTA ─── */}
          <div className="border-t border-border/40 pt-10 sm:pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Inicia una consulta de distribución hoy
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Atención rápida de lunes a viernes en nuestra sede de San Miguel y por canales digitales.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-xl font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 shadow-sm">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" />
                  <span>WhatsApp Distribución</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl font-semibold gap-2 border-border/80">
                <a href="mailto:ventas@horizontelibros.com">
                  <Mail className="size-4" />
                  <span>ventas@horizontelibros.com</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartPanel />
      <CheckoutDialog />
    </div>
  );
}
