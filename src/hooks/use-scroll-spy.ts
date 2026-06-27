// ============================================================================
//  HOOK — Scroll Spy con History API (deep-linking)
//  - Observa las secciones con [data-section]
//  - Actualiza la URL con pushState (sin recargar) al hacer scroll
//  - Soporta navegación por hash y smooth scroll
// ============================================================================
'use client'

import { useEffect, useState, useCallback } from 'react'

interface Section {
  id: string
  label: string
}

export function useScrollSpy(sections: Section[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string>(
    typeof window !== 'undefined'
      ? window.location.hash.replace('#', '') || sections[0]?.id || ''
      : ''
  )

  // Observa las secciones con IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Tomar la sección más visible que cruce el umbral
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-section')
          if (id) {
            setActiveSection(id)
            // Actualizar URL sin recargar
            const newHash = `#${id}`
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, '', newHash)
            }
          }
        }
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    sections.forEach((s) => {
      const el = document.querySelector(`[data-section="${s.id}"]`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections, offset])

  // Navegación programática con smooth scroll
  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(`[data-section="${id}"]`)
    if (el) {
      const top = (el as HTMLElement).offsetTop - 80
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveSection(id)
      window.history.pushState(null, '', `#${id}`)
    }
  }, [])

  return { activeSection, scrollTo }
}

// Hook de navegación por hash al cargar la página
export function useHashNavigation() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '')
      setTimeout(() => {
        const el = document.querySelector(`[data-section="${id}"]`)
        if (el) {
          const top = (el as HTMLElement).offsetTop - 80
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 300)
    }
  }, [])
}
