import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="bg-primary-900 text-white/80 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen
                className="w-6 h-6 text-accent-400"
                aria-hidden="true"
              />
              <span className="text-white font-bold text-lg">
                Ten<span className="text-accent-400">Edu</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Тең білім — бәріне.
              <br />
              Қазақстандық ауыл жастары мен мүмкіндігі шектеулі азаматтарға
              арналған цифрлық сауаттылық платформасы.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Сайт карталары">
            <h3 className="text-white font-semibold mb-3">Бөлімдер</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded"
                >
                  Курстар каталогы
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded"
                >
                  Жеке кабинет
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded"
                >
                  Тіркелу
                </Link>
              </li>
            </ul>
          </nav>

          {/* Accessibility note */}
          <div>
            <h3 className="text-white font-semibold mb-3">Қолжетімділік</h3>
            <p className="text-sm leading-relaxed">
              Платформа WCAG 2.1 AA стандартына сәйкес келеді. Скринридерлермен
              (NVDA, JAWS) жұмыс істейді.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-sm text-center text-white/50">
          © 2024 TeńEdu. Барлық құқықтар қорғалған.
        </div>
      </div>
    </footer>
  );
}
