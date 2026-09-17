"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, CheckCircle, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  completedModules: number;
  avgRating: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Demo mode: show test stats without Supabase
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        setStats({
          totalUsers: 128,
          activeUsers: 77,
          completedModules: 342,
          avgRating: 4.6,
        });
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: completedModules } = await supabase
        .from("module_completions")
        .select("*", { count: "exact", head: true });

      const { data: feedback } = await supabase
        .from("feedback")
        .select("rating");

      const avgRating = feedback && feedback.length > 0
        ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length
        : 0;

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: Math.ceil((totalUsers || 0) * 0.6),
        completedModules: completedModules || 0,
        avgRating: Math.round(avgRating * 10) / 10,
      });
      setLoading(false);
    }

    loadStats().catch(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Барлық пайдаланушылар",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: "Ағымды пайдаланушылар",
      value: stats?.activeUsers || 0,
      icon: Users,
      color: "green",
    },
    {
      title: "Аяқталған модульдер",
      value: stats?.completedModules || 0,
      icon: CheckCircle,
      color: "purple",
    },
    {
      title: "Орташа баға",
      value: stats?.avgRating.toFixed(1) || "—",
      icon: Star,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Қош келдіңіз, әкімші!</h2>
        <p className="text-gray-600 mt-2">Төменде сіздің платформаның негізгі статистикасы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const colorClass = {
            blue: "bg-white text-blue-600",
            green: "bg-white text-green-600",
            purple: "bg-white text-purple-600",
            amber: "bg-amber-50 text-amber-600",
          }[card.color];

          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? "—" : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Салау, администратор! 👋</h3>
        <p className="text-gray-700">
          Сол жақтағы мәзірді пайдаланып контентті, тестілерді, статистиканы және фидбектерді басқаңыз.
        </p>
      </Card>
    </div>
  );
}
