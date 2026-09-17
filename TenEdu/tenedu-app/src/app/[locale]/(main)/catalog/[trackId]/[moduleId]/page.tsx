"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ModulePage() {
  const params = useParams();
  const trackId = params.trackId as string;
  const moduleId = params.moduleId as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [trackId, moduleId]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-2">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">Module: {moduleId}</h1>
        <p className="text-gray-600">Track: {trackId}</p>
      </div>
    </div>
  );
}
