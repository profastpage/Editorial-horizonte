'use client';

import * as React from 'react';

export function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.31 19.8 8.12 19.09L7.84 18.92L4.72 19.74L5.55 16.7L5.36 16.4C4.58 15.16 4.17 13.56 4.17 11.92C4.17 7.38 7.87 3.67 12.04 3.67ZM8.84 7.35C8.65 7.35 8.34 7.42 8.08 7.7C7.83 7.98 7.11 8.65 7.11 10.03C7.11 11.41 8.11 12.74 8.25 12.93C8.39 13.12 10.22 15.93 13.02 17.14C15.35 18.15 15.82 17.95 16.32 17.9C16.82 17.85 17.94 17.23 18.17 16.58C18.4 15.93 18.4 15.37 18.33 15.26C18.26 15.15 18.07 15.08 17.79 14.94C17.51 14.8 16.13 14.12 15.87 14.03C15.61 13.94 15.42 13.89 15.23 14.18C15.04 14.47 14.51 15.08 14.34 15.27C14.17 15.46 14.01 15.48 13.73 15.34C13.45 15.2 12.55 14.91 11.48 13.96C10.65 13.22 10.09 12.31 9.92 12.03C9.75 11.75 9.9 11.6 10.04 11.46C10.17 11.33 10.33 11.12 10.47 10.95C10.61 10.78 10.66 10.66 10.75 10.47C10.84 10.28 10.79 10.12 10.72 9.98C10.65 9.84 10.09 8.47 9.86 7.91C9.64 7.37 9.41 7.44 9.24 7.44C9.08 7.44 8.89 7.35 8.84 7.35Z" />
    </svg>
  );
}

export function WhatsAppFloating() {
  const whatsappUrl =
    'https://wa.me/51955637859?text=' +
    encodeURIComponent('Hola Editorial Horizonte, deseo consultar sobre sus libros disponibles.');

  return (
    <aside
      aria-label="Atención por WhatsApp"
      className="fixed bottom-4 right-3.5 sm:bottom-6 sm:right-6 z-40"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar por WhatsApp oficial de Editorial Horizonte (+51 955637859)"
        className="flex items-center justify-center size-12 sm:size-auto sm:gap-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm shadow-[0_4px_16px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <WhatsAppIcon className="size-6 sm:size-5 shrink-0" />
        <span className="hidden sm:inline font-bold tracking-tight">
          WhatsApp Oficial
        </span>
      </a>
    </aside>
  );
}
