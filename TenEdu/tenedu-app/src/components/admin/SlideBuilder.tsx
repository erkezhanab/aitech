"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

type SlideType = "title" | "checklist" | "content" | "summary";

interface Slide {
  id: string;
  type: SlideType;
  title: string;
  content: Record<string, unknown>;
}

interface SlideBuilderProps {
  slide: Slide;
  onClose: () => void;
  onSave: (slide: Slide) => void;
}

export default function SlideBuilder({ slide, onClose, onSave }: SlideBuilderProps) {
  const [formData, setFormData] = useState<Slide>(slide);

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "title":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тақырыбы
              </label>
              <input
                type="text"
                value={(formData.content.subtitle as string) || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, subtitle: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Слайдтың тақырыбы"
              />
            </div>
          </div>
        );

      case "checklist":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пункттар
              </label>
              <div className="space-y-2">
                {((formData.content.items as string[]) || []).map((item: string, idx: number) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...((formData.content.items as string[]) || [])];
                      newItems[idx] = e.target.value;
                      setFormData({
                        ...formData,
                        content: { ...formData.content, items: newItems },
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Пункт ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      items: [...((formData.content.items as string[]) || []), ""],
                    },
                  })
                }
                className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                + Пункт қосу
              </button>
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Мәтін
              </label>
              <textarea
                value={(formData.content.text as string) || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-32"
                placeholder="Слайдтың мәтіні"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сурет URL (қалыпты)
              </label>
              <input
                type="text"
                value={(formData.content.imageUrl as string) || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, imageUrl: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Резюме мәтіні
              </label>
              <textarea
                value={(formData.content.summary as string) || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, summary: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-32"
                placeholder="Сабақтың резюмесі"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Слайдты өңдеу</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Слайдтың атауы
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Слайдтың атауы"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Слайд түрі
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as SlideType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="title">Титульный слайд</option>
              <option value="checklist">Чек-лист</option>
              <option value="content">Контентный слайд</option>
              <option value="summary">Резюме</option>
            </select>
          </div>

          {renderTypeSpecificFields()}

          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={() => onSave(formData)}>
              Сақтау
            </Button>
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Бас тарту
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
