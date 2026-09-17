"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { BarChart2, Users, TrendingUp, Calendar } from "lucide-react";

interface UserStats {
  byGoal: Record<string, number>;
  byAge: Record<string, number>;
  newUsersThisMonth: number;
  completionRate: number;
}

interface ModuleProgress {
  moduleTitle: string;
  usersStarted: number;
  usersCompleted: number;
  completionPercent: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Demo mode: show test stats without Supabase
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        setStats({
          byGoal: { study: 54, work: 41, personal: 33 },
          byAge: { "18-25": 45, "26-35": 60, "36-45": 30, "45+": 25 },
          newUsersThisMonth: 26,
          completionRate: 68,
        });
        setModuleProgress([
          { moduleTitle: "Компьютер негіздері", usersStarted: 120, usersCompleted: 85, completionPercent: 71 },
          { moduleTitle: "Интернетте ақпарат іздеу", usersStarted: 110, usersCompleted: 72, completionPercent: 65 },
          { moduleTitle: "Электрондық пошта", usersStarted: 95, usersCompleted: 60, completionPercent: 63 },
        ]);
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // Get basic stats
      const { data: profiles } = await supabase.from("profiles").select("goal");
      const { data: completions } = await supabase
        .from("module_completions")
        .select("*");

      const byGoal = { study: 0, work: 0, personal: 0 };
      profiles?.forEach((p) => {
        if (p.goal && p.goal in byGoal) {
          byGoal[p.goal as keyof typeof byGoal]++;
        }
      });

      // Simulated completion rate (would need more complex logic in production)
      const completionRate =
        profiles && completions
          ? Math.round((completions.length / (profiles.length * 3)) * 100)
          : 0;

      setStats({
        byGoal,
        byAge: { "18-25": 45, "26-35": 60, "36-45": 30, "45+": 25 },
        newUsersThisMonth: Math.floor(profiles?.length || 0 * 0.2),
        completionRate: Math.min(completionRate, 100),
      });

      // Simulated module progress
      setModuleProgress([
        {
          moduleTitle: "Компьютер негіздері",
          usersStarted: 120,
          usersCompleted: 85,
          completionPercent: 71,
        },
        {
          moduleTitle: "Интернетте ақпарат іздеу",
          usersStarted: 110,
          usersCompleted: 78,
          completionPercent: 71,
        },
        {
          moduleTitle: "Электрондық пошта",
          usersStarted: 105,
          usersCompleted: 72,
          completionPercent: 69,
        },
      ]);

      setLoading(false);
    }

    loadStats().catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Жаңа пайдаланушылар",
      value: stats?.newUsersThisMonth || 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Аяқталу қарқыны",
      value: `${stats?.completionRate || 0}%`,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Оқу мақсаты",
      value: stats?.byGoal.study || 0,
      icon: Calendar,
      color: "purple",
    },
    {
      label: "Жұмыс мақсаты",
      value: stats?.byGoal.work || 0,
      icon: BarChart2,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Статистика</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClass = {
            blue: "bg-white text-blue-600",
            green: "bg-white text-green-600",
            purple: "bg-white text-purple-600",
            amber: "bg-amber-50 text-amber-600",
          }[stat.color];

          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? "—" : stat.value}
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

      {/* Module Completion */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Модульдер бойынша прогресс</h3>
        <div className="space-y-4">
          {moduleProgress.map((module) => (
            <div key={module.moduleTitle}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{module.moduleTitle}</h4>
                <span className="text-sm text-gray-600">
                  {module.usersCompleted}/{module.usersStarted}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-white0 h-2 rounded-full transition-all"
                  style={{ width: `${module.completionPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">{module.completionPercent}% аяқтады</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Goals Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Мақсат бойынша</h3>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.byGoal).map(([goal, count]) => {
                const labels = {
                  study: "Оқу",
                  work: "Жұмыс",
                  personal: "Жеке дамыту",
                };
                return (
                  <div key={goal}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {labels[goal as keyof typeof labels]}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(count / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Жас бойынша</h3>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.byAge).map(([age, count]) => (
                <div key={age}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{age} жас</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-white0 h-2 rounded-full"
                      style={{ width: `${(count / 60) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
