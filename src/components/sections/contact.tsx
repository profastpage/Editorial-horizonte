// ============================================================================
//  CONTACTO — Formulario de contacto + datos
// ============================================================================
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, MapPin, Phone, Send, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function Contact() {
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    // Simulación de envío
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    toast.success('Mensaje enviado', {
      description: `Gracias ${data.name}. Te responderemos en menos de 24h.`,
    })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section
      data-section="contacto"
      className="relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Texto + datos */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="editorial-rule" />
              <span className="text-xs uppercase tracking-editorial text-muted-foreground">
                Hablemos
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-balance"
            >
              ¿Tienes un <span className="italic text-primary">manuscrito</span> o una
              consulta editorial?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 text-lg text-muted-foreground leading-relaxed"
            >
              Recibimos propuestas todo el año. Escríbenos con un resumen de tu proyecto,
              una muestra del texto y una nota sobre ti. Respondemos cada mensaje en menos
              de 72 horas hábiles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 space-y-4"
            >
              {[
                { icon: MapPin, label: 'Dirección', value: 'Av. La Mar 1234, Lima 15072, Perú' },
                { icon: Phone, label: 'Teléfono', value: '+51 1 234 5678' },
                { icon: Mail, label: 'Email', value: 'contacto@editorialhorizonte.com' },
                { icon: Instagram, label: 'Instagram', value: '@editorialhorizonte' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-editorial text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 -m-6 bg-primary/5 rounded-sm blur-2xl" />
            <form
              onSubmit={handleSubmit}
              className="relative p-8 md:p-10 rounded-sm border border-border bg-card shadow-sm space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-editorial">
                    Nombre
                  </Label>
                  <Input id="name" name="name" required placeholder="Tu nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-editorial">
                    Email
                  </Label>
                  <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs uppercase tracking-editorial">
                  Asunto
                </Label>
                <Input id="subject" name="subject" required placeholder="Propuesta de manuscrito / Consulta editorial" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs uppercase tracking-editorial">
                  Mensaje
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Cuéntanos sobre tu proyecto, tu propuesta o tu consulta. Mientras más contexto nos des, mejor podremos ayudarte."
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="w-full h-12"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Enviar mensaje
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Al enviar aceptas nuestra política de privacidad. No compartimos tus datos.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
