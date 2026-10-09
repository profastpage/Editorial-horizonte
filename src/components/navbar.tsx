'use client';

import { useAppStore } from '@/lib/store';
import type { SectionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import {
  BookOpen,
  Lock,
  ShoppingCart,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems: { key: SectionType; label: string; icon?: React.ReactNode }[] = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'catalogo', label: 'Catálogo' },
  { key: 'nosotros', label: 'Nosotros' },
  { key: 'admin', label: 'Admin', icon: <Lock className="size-3.5" /> },
];

export function Navbar() {
  const { activeSection, setActiveSection, setCartOpen, cartCount } =
    useAppStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = cartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (section: SectionType) => {
    setActiveSection(section);
    setMobileOpen(false);
    if (!isHomePage) {
      router.push(`/#${section}`);
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isOverHero = isHomePage && !scrolled;

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${
        isOverHero
          ? 'border-b border-white/0 bg-transparent'
          : 'border-b border-border bg-background/85 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate('inicio')}
          className={`flex items-center gap-2 font-serif text-lg font-bold tracking-wide transition-colors duration-500 sm:text-xl ${
            isOverHero ? 'text-white' : 'text-primary'
          }`}
        >
          <BookOpen className="size-5 sm:size-6" />
          <span className="hidden sm:inline">EDITORIAL HORIZONTE</span>
          <span className="sm:hidden">EH</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <Button
              key={item.key}
              variant={activeSection === item.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate(item.key)}
              className={`gap-1.5 transition-colors duration-500 ${
                isOverHero && activeSection !== item.key
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : ''
              }`}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className={`transition-colors duration-500 ${isOverHero ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(true)}
            className={`relative transition-colors duration-500 ${isOverHero ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
            aria-label="Open cart"
          >
            <ShoppingCart className="size-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden transition-colors duration-500 ${isOverHero ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-2 pt-8">
                <p className="px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Navegación
                </p>
                {navItems.map((item) => (
                  <Button
                    key={item.key}
                    variant={activeSection === item.key ? 'default' : 'ghost'}
                    className="justify-start gap-2"
                    onClick={() => navigate(item.key)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}