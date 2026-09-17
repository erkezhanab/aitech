"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Star, MessageCircle, Trash2 } from "lucide-react";

interface Feedback {
  id: string;
  userId: string;
  moduleId: string;
  moduleName: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    async function loadFeedback() {
      // Demo mode: show test feedback without Supabase
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        setFeedbacks([
          { id: "1", userId: "demo-1", moduleId: "module-1", moduleName: "Компьютер негіздері", userName: "Айгүль С.", rating: 5, comment: "Өте пайдалы курс, рахмет!", createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: "2", userId: "demo-2", moduleId: "module-2", moduleName: "Интернетте ақпарат іздеу", userName: "Дәулет Б.", rating: 4, comment: "Жақсы түсіндірілген, бірақ мысалдар көбірек болса екен.", createdAt: new Date(Date.now() - 172800000).toISOString() },
          { id: "3", userId: "demo-3", moduleId: "module-1", moduleName: "Компьютер негіздері", userName: "Мария К.", rating: 5, comment: "Очень доступно для начинающих!", createdAt: new Date(Date.now() - 259200000).toISOString() },
        ]);
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      // Transform data and add mock names
      const transformedData =
        data?.map((f) => ({
          id: f.id,
          userId: f.user_id,
          moduleId: f.module_id,
          moduleName: "Модуль " + (f.module_id?.split("-")[1] || "1"),
          userName: "Пайдаланушы " + f.user_id?.slice(0, 8),
          rating: f.rating || 0,
          comment: f.comment || "",
          createdAt: f.created_at,
        })) || [];

      setFeedbacks(transformedData);
      setLoading(false);
    }

    loadFeedback().catch(() => setLoading(false));
  }, []);

  const filteredFeedbacks = selectedRating
    ? feedbacks.filter((f) => f.rating === selectedRating)
    : feedbacks;

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : "0";

  const ratingCounts = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Фидбек</h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Орташа баға</p>
              <div className="flex items-baseline gap-1 mt-2">
                <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
                <span className="text-gray-600">/5.0</span>
              </div>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600 mb-4">Барлық пікірлер</p>
          <p className="text-3xl font-bold text-gray-900">{feedbacks.length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-600 mb-4">Модульдер</p>
          <p className="text-3xl font-bold text-gray-900">{new Set(feedbacks.map((f) => f.moduleId)).size}</p>
        </Card>
      </div>

      {/* Rating Filter */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Баға бойынша фильтер</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setSelectedRating(selectedRating === rating ? null : rating)
              }
              className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                selectedRating === rating
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">{rating} жұлдыз</span>
                </div>
                <span className="text-sm text-gray-600">{ratingCounts[rating as keyof typeof ratingCounts]}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedRating ? `${selectedRating} жұлдыздар` : "Барлық пікірлер"} ({filteredFeedbacks.length})
        </h3>

        {loading ? (
          <Card className="p-8 text-center text-gray-600">Жүктелуде...</Card>
        ) : filteredFeedbacks.length === 0 ? (
          <Card className="p-8 text-center text-gray-600">
            {selectedRating
              ? "Бұл баға үшін пікірлер жоқ"
              : "Әлі пікірлер жоқ"}
          </Card>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{feedback.userName}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {feedback.moduleName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(feedback.createdAt).toLocaleDateString("kk-KZ")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFeedbacks(feedbacks.filter((f) => f.id !== feedback.id))
                  }
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>

              {feedback.comment && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2 text-gray-700">
                    <MessageCircle className="w-4 h-4 mt-1 shrink-0" />
                    <p className="text-sm">{feedback.comment}</p>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
