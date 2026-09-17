import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
      <div className="flex flex-col min-h bg-gray-50-[calc(100vh-4rem)]">
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </div>
      <AccessibilityPanel />
    </>
  );
}
