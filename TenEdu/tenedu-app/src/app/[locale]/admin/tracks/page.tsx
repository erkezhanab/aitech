"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, ChevronDown } from "lucide-react";
import { tracks } from "@/lib/data/courses";
import SlideBuilder from "@/components/admin/SlideBuilder";

type SlideType = "title" | "checklist" | "content" | "summary";

interface Slide {
  id: string;
  type: SlideType;
  title: string;
  content: Record<string, unknown>;
}

export default function AdminTracks() {
  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set());
  const [editingSlide, setEditingSlide] = useState<{
    track: string;
    module: string;
    slide: Slide;
  } | null>(null);

  const toggleTrack = (trackId: string) => {
    const newSet = new Set(expandedTracks);
    if (newSet.has(trackId)) {
      newSet.delete(trackId);
    } else {
      newSet.add(trackId);
    }
    setExpandedTracks(newSet);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Контент құрастырушы</h2>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Жаңа трек
        </Button>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <Card key={track.id} className="overflow-hidden">
            {/* Track Header */}
            <button
              onClick={() => toggleTrack(track.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{track.emoji}</div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{track.title}</h3>
                  <p className="text-sm text-gray-600">{track.lessons.length} сабақ</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedTracks.has(track.id) ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Expanded Content */}
            {expandedTracks.has(track.id) && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                <div className="space-y-3">
                  {track.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 space-y-3"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{lesson.duration} минут</p>
                      </div>

                      {/* Slides */}
                      <div className="space-y-2 pl-4 border-l-2 border-gray-300">
                        {lesson.content.map((block, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                          >
                            <span className="text-gray-700">
                              Слайд {idx + 1}: {block.type} блогі
                            </span>
                            <div className="flex gap-2">
                              <button className="p-1 hover:bg-white rounded transition-colors">
                                <Edit2 className="w-4 h-4 text-blue-600" />
                              </button>
                              <button className="p-1 hover:bg-white rounded transition-colors">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <button className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">
                          + Жаңа слайд қосу
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Edit2 className="w-4 h-4" />
                          Өңдеу
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" variant="ghost">
                    <Plus className="w-4 h-4" />
                    Сабақ қосу
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Slide Builder Modal */}
      {editingSlide && (
        <SlideBuilder
          slide={editingSlide.slide}
          onClose={() => setEditingSlide(null)}
          onSave={(updatedSlide) => {
            console.log("Saving slide:", updatedSlide);
            setEditingSlide(null);
          }}
        />
      )}
    </div>
  );
}
