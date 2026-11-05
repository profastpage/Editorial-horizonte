import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://editorial-horizonte-five.vercel.app"),
  title: {
    default: "Horizonte libros – Página oficial",
    template: "%s | Horizonte libros – Página oficial",
  },
  description:
    "Editorial Horizonte - Desde 1968, casa editorial oficial de José María Arguedas, César Vallejo y destacados pensadores de las ciencias sociales y la literatura peruana.",
  keywords: [
    "Horizonte Libros",
    "Editorial Horizonte",
    "José María Arguedas",
    "César Vallejo",
    "Literatura peruana",
    "Ciencias sociales",
    "Librería Lima Perú",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Horizonte libros – Página oficial",
    description:
      "Desde 1968, casa editorial oficial de José María Arguedas, César Vallejo y destacados pensadores de las ciencias sociales y la literatura peruana.",
    url: "https://editorial-horizonte-five.vercel.app",
    siteName: "Horizonte libros – Página oficial",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Horizonte libros – Página oficial",
    description:
      "Desde 1968, casa editorial oficial de José María Arguedas, César Vallejo y destacados pensadores de las ciencias sociales y la literatura peruana.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
          <WhatsAppFloating />
        </Providers>
      </body>
    </html>
  );
}
