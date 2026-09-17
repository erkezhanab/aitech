"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo mode: pretend a user is logged in (Supabase unavailable)
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      setUserName("Демо қолданушы");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    // Get initial session
    supabase.auth.getUser()
      .then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("profiles")
            .select("name")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              setUserName(data?.name || user.email?.split("@")[0] || "Мен");
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("name")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setUserName(data?.name || session.user.email?.split("@")[0] || "Мен");
          });
      } else {
        setUserName(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuth = !loading && userName !== null;

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-card"
      role="banner"
    >
      <nav
        className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Басты навигация"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 rounded-lg px-1"
          aria-label="TeńEdu — Басты бет"
        >
          <BookOpen className="w-7 h-7 text-accent-500" aria-hidden="true" />
          <span>Ten<span className="text-accent-500">Edu</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1" role="navigation">
          {loading ? (
            <div className="w-20 h-8 rounded-xl bg-white/10 animate-pulse" aria-hidden="true" />
          ) : isAuth ? (
            <>
              <NavLink href="/catalog">{t('nav.courses')}</NavLink>
              <NavLink href="/dashboard">{t('nav.dashboard')}</NavLink>
              <LanguageSwitcher />
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-[0.5rem] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
                aria-label={t('nav.profile')}
              >
                <div className="w-7 h-7 rounded-full bg-accent-500 text-white flex items-center justify-center text-xs font-bold" aria-hidden="true">
                  {userName?.[0]?.toUpperCase() ?? "А"}
                </div>
                <span className="max-w-[120px] truncate">{userName}</span>
              </Link>
            </>
          ) : (
            <>
              <NavLink href="/catalog">{t('nav.courses')}</NavLink>
              <NavLink href="/login">{t('nav.login')}</NavLink>
              <LanguageSwitcher />
              <Link href="/register">
                <Button variant="secondary" size="sm">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-xl text-primary-700 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Мәзірді жабу" : "Мәзірді ашу"}
        >
          {mobileOpen
            ? <X className="w-6 h-6" aria-hidden="true" />
            : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200 border-t border-gray-100 bg-gray-50",
          mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {isAuth ? (
            <>
              {/* User row */}
              <div className="flex items-center gap-3 px-4 py-3 mb-1 border-b border-gray-200">
                <div className="w-9 h-9 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-bold" aria-hidden="true">
                  {userName?.[0]?.toUpperCase() ?? "А"}
                </div>
                <span className="font-semibold text-primary-700 text-sm truncate">{userName}</span>
              </div>
              <MobileNavLink href="/catalog"  onClick={() => setMobileOpen(false)}>{t('nav.courses')}</MobileNavLink>
              <MobileNavLink href="/dashboard" onClick={() => setMobileOpen(false)}>{t('nav.dashboard')}</MobileNavLink>
              <MobileNavLink href="/profile"  onClick={() => setMobileOpen(false)}>
                <User className="w-4 h-4" aria-hidden="true" />
                {t('nav.profile')}
              </MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink href="/catalog"  onClick={() => setMobileOpen(false)}>{t('nav.courses')}</MobileNavLink>
              <MobileNavLink href="/login"    onClick={() => setMobileOpen(false)}>{t('nav.login')}</MobileNavLink>
              <MobileNavLink href="/register" onClick={() => setMobileOpen(false)}>{t('nav.register')}</MobileNavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-700 rounded-xl hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
    >
      {children}
    </Link>
  );
}
