// ============================================================================
//  READING PROGRESS — Barra de progreso de scroll fija en la parte superior
//  - Línea fina terracota que se llena al hacer scroll
//  - Posicionada sobre el navbar (z-index mayor)
//  - Usa scrollYProgress de framer-motion para animación suave
//  - Visible solo cuando hay scroll real (no al inicio)
// ============================================================================
'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  const opacity = useTransform(scrollYProgress, [0, 0.005, 1], [0, 1, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] origin-left pointer-events-none"
      style={{
        scaleX,
        opacity,
        background: 'linear-gradient(90deg, #C05A42 0%, #BFA076 100%)',
        boxShadow: '0 0 8px rgba(192, 90, 66, 0.6)',
      }}
      aria-hidden="true"
    />
  )
}
