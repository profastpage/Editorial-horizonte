import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';
import { Truck, BookOpen, Building2, Store, MessageCircle, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
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

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Truck className="size-3.5" />
              Cobertura Nacional
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Distribución y Servicios Editoriales
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              En Editorial Horizonte facilitamos el acceso a las obras fundamentales de las letras peruanas
              a librerías, ferias del libro, universidades, bibliotecas e instituciones culturales de todo el país.
            </p>
          </div>

          {/* 3 Pilares de Distribución */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-3 shadow-xs">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Store className="size-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Librerías y Puntos de Venta</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Abastecemos a librerías independientes y comerciales en Lima y provincias con condiciones
                preferenciales, consignación y descuentos por volumen.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-3 shadow-xs">
              <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 className="size-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Universidades y Bibliotecas</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Convenios académicos para fondos bibliográficos, bibliotecas comunales y lectura obligatoria
                de las obras de Arguedas, Vallejo e investigación social.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-3 shadow-xs">
              <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Servicios de Edición e Impresión</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Asesoría integral para autores e instituciones: corrección de estilo, diseño editorial,
                diagramación profesional, gestión de ISBN e impresión de alta calidad.
              </p>
            </div>
          </div>

          {/* Formato y Logística */}
          <div className="rounded-2xl border bg-muted/30 p-8 sm:p-10 space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                ¿Cómo solicitar libros para tu librería o institución?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Coordinamos despachos de manera directa, ágil y con garantía editorial sellada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Catálogo comercial actualizado con precios de venta y márgenes de distribución.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Despachos a todo el Perú mediante agencias autorizadas (Shalom, Olva Courier).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Retiro directo de pedidos en nuestro punto de venta en San Miguel, Lima.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Facturación electrónica formal y emisión de guías de remisión.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-xl font-bold gap-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  Solicitar Catálogo Mayorista por WhatsApp
                </a>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-xl font-bold gap-2">
                <a href="mailto:ventas@horizontelibros.com">
                  <Mail className="size-4" />
                  Escribir a ventas@horizontelibros.com
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
