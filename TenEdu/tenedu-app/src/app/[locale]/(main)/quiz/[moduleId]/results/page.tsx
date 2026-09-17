"use client";

import Link from "next/link";

export default function QuizResultsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
      <p className="text-gray-600">Results page placeholder</p>
      <Link href={`/${locale}/dashboard`} className="text-blue-600 hover:underline mt-4 inline-block">
        Back to Dashboard
      </Link>
    </div>
  );
}
