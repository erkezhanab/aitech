"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function TrackCompletePage() {
  const params = useParams();
  const trackId = params.trackId as string;

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Track Completed!</h1>
        <p className="text-gray-600 mb-6">Congratulations on completing the track: {trackId}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
