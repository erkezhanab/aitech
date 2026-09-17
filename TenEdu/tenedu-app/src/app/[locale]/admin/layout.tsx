"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, BarChart2, MessageSquare,
  Menu, X, BookMarked, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";

const NAV = [
  { href: "/admin",          label: "Дашборд",         icon: LayoutDashboard },
  { href: "/admin/tracks",   label: "Контент",         icon: BookOpen        },
  { href: "/admin/tests",    label: "Тесты",           icon: BookMarked      },
  { href: "/admin/users",    label: "Статистика",      icon: BarChart2       },
  { href: "/admin/feedback", label: "Фидбек",          icon: MessageSquare   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar — desktop */}
      <aside
        className="hidden md:flex flex-col w-60 bg-primary-900 text-white shrink-0"
        aria-label="Әкімші навигациясы"
      >
        <div className="px-5 py-5 border-b border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded"
          >
            <BookMarked className="w-6 h-6 text-accent-400" aria-hidden="true" />
            <span>Ten<span className="text-accent-400">Edu</span> Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Негізгі мәзір">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
                pathname === href || (href !== "/admin" && pathname.startsWith(href))
                  ? "bg-primary-600 text-white"
                  : "text-white/70 hover:bg-primary-700 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-primary-700 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <BarChart2 className="w-4 h-4" aria-hidden="true" />
            Сайтқа өту
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-red-700/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Шығу
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white flex flex-col transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Мобайл навигация"
        aria-hidden={!mobileOpen}
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <span className="font-bold text-lg">
            Ten<span className="text-accent-400">Edu</span> Admin
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label="Мәзірді жабу"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === href || (href !== "/admin" && pathname.startsWith(href))
                  ? "bg-primary-600 text-white"
                  : "text-white/70 hover:bg-primary-700 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
            aria-label="Мәзірді ашу"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1 className="font-semibold text-gray-800">
            {NAV.find((n) => n.href === pathname || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label ?? "Admin"}
          </h1>
        </header>

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
      <AccessibilityPanel />
    </div>
  );
}
export const dynamic = 'force-dynamic';
