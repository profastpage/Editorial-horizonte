'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloating() {
  const whatsappUrl =
    'https://wa.me/51955637859?text=' +
    encodeURIComponent('Hola Editorial Horizonte, deseo consultar sobre sus libros disponibles.');

  return (
    <aside
      aria-label="Atención por WhatsApp"
      className="fixed bottom-5 right-5 z-30"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar por WhatsApp oficial de Editorial Horizonte"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          WhatsApp Oficial
        </span>
      </a>
    </aside>
  );
}
