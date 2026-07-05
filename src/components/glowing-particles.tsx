// ============================================================================
//  GLOWING PARTICLES — Estela de partículas brillantes en mouse move
//  - Canvas global con partículas que siguen al cursor
//  - Performance optimizada: requestAnimationFrame + pool de partículas
//  - Colores cálidos deluxe (terracota + dorado) con blend mode
//  - Respeta prefers-reduced-motion
// ============================================================================
'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const COLORS = [
  'rgba(192, 90, 66, 0.8)',   // terracota
  'rgba(191, 160, 118, 0.8)', // dorado
  'rgba(255, 200, 150, 0.6)', // crema cálido
]

export function GlowingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Respeta prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Solo en desktop / tablet (no táctil)
    if (window.matchMedia('(hover: none)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x
      mouseRef.current.prevY = mouseRef.current.y
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      // Distancia recorrida → más partículas si el mouse se mueve rápido
      const dx = mouseRef.current.x - mouseRef.current.prevX
      const dy = mouseRef.current.y - mouseRef.current.prevY
      const speed = Math.sqrt(dx * dx + dy * dy)
      const count = Math.min(Math.floor(speed / 6) + 1, 4)

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const spread = Math.random() * 1.5
        particlesRef.current.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 8,
          y: mouseRef.current.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * spread * 0.5,
          vy: Math.sin(angle) * spread * 0.5 - 0.3, // ligero float hacia arriba
          life: 0,
          maxLife: 60 + Math.random() * 40,
          size: 1.5 + Math.random() * 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }

      // Cap máxima de partículas para performance
      if (particlesRef.current.length > 120) {
        particlesRef.current.splice(0, particlesRef.current.length - 120)
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter' // blend mode brillante

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96

        const lifeRatio = p.life / p.maxLife
        if (lifeRatio >= 1) {
          particles.splice(i, 1)
          continue
        }

        const alpha = 1 - lifeRatio
        const radius = p.size * (1 - lifeRatio * 0.5)

        // Glow halo
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4)
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${alpha * 0.9})`))
        gradient.addColorStop(0.4, p.color.replace(/[\d.]+\)$/, `${alpha * 0.3})`))
        gradient.addColorStop(1, p.color.replace(/[\d.]+\)$/, '0)'))
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core brillante
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
