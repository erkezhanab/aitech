import { Header } from "@/components/layout/Header";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-50 focus:bg-primary-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-medium"
      >
        Негізгі мазмұнға өту
      </a>
      
      <Header />
      <main id="main-content" className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <AccessibilityPanel />
    </>
  );
}
