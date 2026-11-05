'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartPanel } from '@/components/cart';
import { CheckoutDialog } from '@/components/checkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Lock,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MiCuentaPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Lector Horizonte',
    email: 'lector@ejemplo.com',
    phone: '+51 987 654 321',
  });

  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail) return;
    setUserData({
      name: formName || 'Lector Horizonte',
      email: formEmail,
      phone: formPhone || '+51 987 654 321',
    });
    setIsLoggedIn(true);
    toast.success(mode === 'login' ? '¡Sesión iniciada con éxito!' : '¡Cuenta registrada con éxito!');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <User className="size-6" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Mi Cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tus compras, haz seguimiento de pedidos y accede a beneficios exclusivos de la comunidad lectora.
            </p>
          </div>

          {!isLoggedIn ? (
            /* Formularios de Login / Registro */
            <div className="max-w-md mx-auto rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex rounded-xl bg-muted/60 p-1 border border-border/60">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    mode === 'login'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    mode === 'register'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold">
                      Nombre completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ej. Ariana Gómez"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="rounded-xl h-11"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="rounded-xl h-11"
                  />
                </div>

                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold">
                      Teléfono / WhatsApp (para aviso de envíos)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 987 654 321"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="pass" className="text-xs font-semibold">
                    Contraseña
                  </Label>
                  <Input
                    id="pass"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-xl h-11"
                  />
                </div>

                <Button type="submit" className="w-full rounded-xl font-bold h-11 mt-2">
                  {mode === 'login' ? 'Ingresar a mi cuenta' : 'Registrarme y acceder'}
                </Button>
              </form>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground block">
                  Beneficio de la comunidad lectora:
                </span>
                <span>
                  Obtén 10% de descuento en tu primer pedido y mantén guardados tus títulos favoritos y carritos para más tarde.
                </span>
              </div>
            </div>
          ) : (
            /* Panel de Usuario Autenticado */
            <div className="max-w-2xl mx-auto rounded-2xl border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-foreground">{userData.name}</h3>
                    <p className="text-xs text-muted-foreground">{userData.email}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                  className="rounded-lg text-xs"
                >
                  Cerrar sesión
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                  <span className="text-xs text-muted-foreground">Cupón de Bienvenida</span>
                  <p className="font-mono text-sm font-bold text-primary">HORIZONTE10</p>
                  <span className="text-[11px] text-muted-foreground block">10% de descuento en tu compra</span>
                </div>

                <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                  <span className="text-xs text-muted-foreground">Pedidos realizados</span>
                  <p className="font-bold text-sm text-foreground">1 pedido en preparación</p>
                  <span className="text-[11px] text-muted-foreground block">Despacho a San Miguel</span>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild className="w-full rounded-xl font-bold">
                  <Link href="/catalogo">
                    Explorar catálogo y comprar
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* ─── ACCESO ADMINISTRATIVO (OCULTO DEL MENÚ PÚBLICO) ─── */}
          <div className="max-w-md mx-auto pt-6 border-t border-border/60 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Lock className="size-3.5" />
              <span>Portal exclusivo para equipo editorial</span>
            </div>
            <div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                <Link href="/admin">
                  Acceder al Panel de Administración con credenciales →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartPanel />
      <CheckoutDialog />
    </div>
  );
}
