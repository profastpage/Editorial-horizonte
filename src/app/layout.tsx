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
  metadataBase: new URL("https://editorial-horizonte.vercel.app"),
  title: "Horizonte libros – Página oficial",
  description:
    "Librería independiente ubicada en Lima, Perú. Especializada en literatura, ciencias sociales y humanidades",
  keywords: [
    "HORIZONTE Libros",
    "Editorial Horizonte",
    "José María Arguedas",
    "César Vallejo",
    "Literatura peruana",
    "Ciencias sociales",
    "Librería Lima Perú",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
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
