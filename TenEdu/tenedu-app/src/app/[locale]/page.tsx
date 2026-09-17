import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";
import {
  Wifi,
  ShieldCheck,
  Users,
  Star,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-50 focus:bg-primary-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-medium"
        >
          Негізгі мазмұнға өту
        </a>

        {/* Hero */}
        <section
          className="bg-white relative overflow-hidden border-b border-gray-100"
          aria-labelledby="hero-heading"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-100/20 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 bg-accent-50 text-accent-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4" aria-hidden="true" />
                Қазақстандағы бірінші accessible білім платформасы
              </p>
              <h1
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-primary-800"
              >
                Тең білім —{" "}
                <span className="text-accent-500">бәріне</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-2xl">
                Ауыл жастары мен мүмкіндігі шектеулі азаматтарға арналған
                цифрлық сауаттылық курстары. Тегін, қазақ тілінде, офлайн жұмыс
                істейді.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button variant="secondary" size="lg" className="shadow-lg">
                    Бастау
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-primary-700 border-primary-200"
                  >
                    Курстарды қарау
                  </Button>
                </Link>
              </div>

              <div
                className="flex flex-wrap gap-6 mt-12 pt-10 border-t border-gray-200"
                aria-label="Платформа статистикасы"
              >
                {[
                  { n: "4", label: "оқу бағыты" },
                  { n: "12+", label: "сабақ" },
                  { n: "5", label: "оқу режимі" },
                  { n: "100%", label: "тегін" },
                ].map(({ n, label }) => (
                  <div key={label} className="text-center min-w-[72px]">
                    <div className="text-3xl font-bold text-accent-500">{n}</div>
                    <div className="text-sm text-gray-600 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="py-20 bg-white" aria-labelledby="problem-heading">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2
                id="problem-heading"
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
              >
                Неліктен TeńEdu?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Қазақстанда 3,5 млн адам ауылда тұрады. Олардың көпшілігінде
                сапалы цифрлық білім алу мүмкіндігі жоқ.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border border-red-100 bg-white/50">
                <h3 className="text-xl font-bold text-red-700 mb-4">
                  🔴 Мәселе
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    "Ауылдық аймақтарда IT-курстар қымбат немесе жоқ",
                    "Мүмкіндігі шектеулі адамдарға арналған accessible платформалар өте аз",
                    "Мемлекеттік қызметтерді онлайн пайдалану қиын",
                    "Цифрлық сауаттылық деңгейі төмен",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5" aria-hidden="true">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="border border-green-100 bg-white/50">
                <h3 className="text-xl font-bold text-green-700 mb-4">
                  🟢 Шешім
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    "Тегін, қазақ тілінде, мобайлдан жұмыс істейді",
                    "5 қолжетімділік режимі: скринридер, дислексия, балалар...",
                    "Офлайн режим: әлсіз интернетте де оқуға болады",
                    "eGov, банкинг, жұмыс іздеу — нақты өмірлік дағдылар",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Tracks */}
        <section className="py-20" aria-labelledby="tracks-heading">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2
                id="tracks-heading"
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
              >
                Оқу бағыттары
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { emoji: "💻", title: "Базалық цифрлық сауаттылық", desc: "Компьютер, email, интернет — нөлден", color: "bg-white border-gray-200 text-primary-700 hover:border-blue-400" },
                { emoji: "🏛️", title: "Өмірдегі цифрлық дағдылар", desc: "eGov, банкинг, интернет қауіпсіздігі", color: "bg-white border-gray-200 text-primary-700 hover:border-green-400" },
                { emoji: "💼", title: "Оқу және жұмыс", desc: "Түйіндеме, жұмыс іздеу, сұхбат", color: "bg-white border-gray-200 text-primary-700 hover:border-purple-400" },
                { emoji: "🌟", title: "Балалар бөлімі", desc: "8–12 жас: компьютер негіздері", color: "bg-white border-yellow-200 text-yellow-800 hover:border-yellow-400" },
              ].map((track) => (
                <Link
                  key={track.title}
                  href="/catalog"
                  className={`group block rounded-[1rem] border-2 p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 ${track.color}`}
                >
                  <div className="text-4xl mb-4" aria-hidden="true">{track.emoji}</div>
                  <h3 className="font-bold text-lg mb-2 leading-tight">{track.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{track.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Қарау <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility modes */}
        <section className="py-20 bg-gray-50 border-t border-gray-100" aria-labelledby="modes-heading">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2
                id="modes-heading"
                className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
              >
                Сізге ыңғайлы оқу режимі
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Платформа барлығына ыңғайлы болу үшін жасалды
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: "👁", label: "Слабовидящим", desc: "Авто-дыбыс, ірі шрифт, жоғары контраст" },
                { icon: "👂", label: "Слабослышащим", desc: "Субтитрлер, визуалды хабарламалар" },
                { icon: "📖", label: "Дислексия", desc: "OpenDyslexic шрифті, аудио дублирование" },
                { icon: "🧒", label: "Балалар", desc: "Геймификация, жарқын батырмалар" },
                { icon: "🎯", label: "Стандарт", desc: "Кәдімгі режим, барлық бағыттар" },
              ].map((mode) => (
                <Card key={mode.label} className="text-center">
                  <div className="text-3xl mb-3" aria-hidden="true">{mode.icon}</div>
                  <h3 className="font-semibold text-primary-800 mb-2">{mode.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{mode.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white border-t border-gray-100" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-primary-800 text-center mb-14"
            >
              Платформаның артықшылықтары
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { Icon: Wifi, color: "text-blue-600 bg-white", title: "Офлайн жұмыс", desc: "Сабақтар кэштеледі. Интернет болмаса да оқуды жалғастыруға болады." },
                { Icon: ShieldCheck, color: "text-green-600 bg-white", title: "WCAG 2.1 AA", desc: "Скринридерлер, пернетақта навигациясы, ARIA разметка." },
                { Icon: Users, color: "text-purple-600 bg-white", title: "5 оқу режимі", desc: "Тіркелу кезінде таңдалады. Кез келген уақытта өзгертіледі." },
                { Icon: BookOpen, color: "text-orange-600 bg-orange-50", title: "Нақты дағдылар", desc: "eGov, банкинг, жұмыс іздеу — күнделікті өмірде қажет." },
                { Icon: Star, color: "text-yellow-600 bg-white", title: "Сертификаттар", desc: "Тректі аяқтаған соң — атыңыз жазылған сертификат (PDF)." },
                { Icon: ChevronRight, color: "text-primary-600 bg-primary-50", title: "Тіркелу оңай", desc: "Email немесе телефон нөмірімен. 2 минутта профиль ашылады." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-[0.75rem] flex items-center justify-center shrink-0 ${f.color}`} aria-hidden="true">
                    <f.Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-1 text-lg">{f.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-20 bg-primary-700 text-white text-center"
          aria-labelledby="cta-heading"
        >
          <div className="max-w-2xl mx-auto px-4">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6">
              Бүгін оқуды бастаңыз
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Тіркелу тегін. Интернет қажет емес. Қазақ тілінде.
            </p>
            <Link href="/register">
              <Button variant="secondary" size="xl" className="shadow-xl">
                Тегін тіркелу
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}
