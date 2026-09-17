"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Copy } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: string[];
  correct: number | number[];
}

interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export default function AdminTests() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "quiz-1",
      moduleId: "t1-l1",
      title: "Компьютер негіздері - Тест",
      questions: [
        {
          id: "q1",
          question: "Монитор не?",
          type: "single",
          options: ["Пернетақта", "Экран", "Тышқан", "Динамик"],
          correct: 1,
        },
      ],
      createdAt: "2024-06-01",
    },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Тесты құрастырушы</h2>
        <Button
          className="gap-2"
          onClick={() => {
            setShowBuilder(true);
            setEditingQuiz(null);
          }}
        >
          <Plus className="w-4 h-4" />
          Жаңа тест
        </Button>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {quiz.questions.length} сұрақ • {new Date(quiz.createdAt).toLocaleDateString("kk-KZ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setShowBuilder(true);
                  }}
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Copy className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setQuizzes(quizzes.filter((q) => q.id !== quiz.id))}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-2">
              {quiz.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {idx + 1}. {question.question}
                      </p>
                      <div className="mt-2 space-y-1">
                        {question.options.map((option, optIdx) => (
                          <p
                            key={optIdx}
                            className={`text-xs ml-4 ${
                              optIdx === question.correct
                                ? "text-green-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}) {option}
                          </p>
                        ))}
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        {question.type === "single" ? "Бір таңдау" : "Көп таңдау"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white rounded transition-colors">
                        <Edit2 className="w-3 h-3 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-white rounded transition-colors">
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 px-3 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">
              + Сұрақ қосу
            </button>
          </Card>
        ))}
      </div>

      {/* Test Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingQuiz ? "Тестті өңдеу" : "Жаңа тест құру"}
              </h3>
              <button
                onClick={() => setShowBuilder(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тест атауы
                </label>
                <input
                  type="text"
                  defaultValue={editingQuiz?.title || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Тест атауын енгізіңіз"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Модуль таңдаңыз
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Модульді таңдаңыз</option>
                  <option>Модуль 1</option>
                  <option>Модуль 2</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-lg text-sm text-blue-700">
                💡 Тест максимум 10 сұрақты қамтиды. Сұрақтарыңызды төменде енгізіңіз.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Сұрақтар (0/10)
                </label>
                <div className="space-y-3">
                  {[1, 2, 3].map((q) => (
                    <div key={q} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <input
                        type="text"
                        placeholder={`Сұрақ ${q}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="flex gap-2">
                        <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>Бір таңдау</option>
                          <option>Көп таңдау</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((opt) => (
                          <div key={opt} className="flex gap-2">
                            <input
                              type="radio"
                              name={`correct-${q}`}
                              className="mt-2"
                            />
                            <input
                              type="text"
                              placeholder={`Вариант ${opt}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowBuilder(false);
                    setEditingQuiz(null);
                  }}
                >
                  Сақтау
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setShowBuilder(false);
                    setEditingQuiz(null);
                  }}
                >
                  Бас тарту
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
