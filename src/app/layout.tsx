import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Editorial Horizonte — Libros que vuelven a casa",
  description:
    "Editorial independiente dedicada a la literatura latinoamericana. Fondo editorial propio y distribución de terceras editoriales con consignación multi-almacén en librerías aliadas.",
  keywords: [
    "Editorial Horizonte",
    "libros",
    "literatura peruana",
    "literatura latinoamericana",
    "Librería SUR",
    "Juan Damonte",
    "independiente",
  ],
  authors: [{ name: "Editorial Horizonte" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Editorial Horizonte",
    description: "Libros que vuelven a casa. Editorial independiente peruana.",
    siteName: "Editorial Horizonte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Horizonte",
    description: "Libros que vuelven a casa. Editorial independiente peruana.",
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
        className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
