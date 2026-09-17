"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CourseLessonPage() {
  const params = useParams();
  const trackId = params.trackId as string;
  const lessonId = params.lessonId as string;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-2">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">Lesson: {lessonId}</h1>
        <p className="text-gray-600">Track: {trackId}</p>
      </div>
    </div>
  );
}
