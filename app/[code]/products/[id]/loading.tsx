import Link from 'next/link';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-7 w-64 rounded bg-gray-200" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-lg bg-gray-200" />

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/3 rounded bg-gray-200" />
            </div>

            <div className="h-6 w-full rounded bg-gray-200" />
            <div className="h-6 w-11/12 rounded bg-gray-200" />

            <div className="h-10 w-40 rounded bg-gray-200" />

            <div className="h-14 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      </main>
    </div>
  );
}
