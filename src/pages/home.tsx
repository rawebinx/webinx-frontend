import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getTrendingEvents, getPlatformStats } from "../lib/api";
import type { WebinarEvent, PlatformStats } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 animate-pulse bg-gray-50">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

export default function HomePage() {
  const [events, setEvents]   = useState<WebinarEvent[]>([]);
  const [stats, setStats]     = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [data, statsData] = await Promise.all([
        getTrendingEvents(12),
        getPlatformStats(),
      ]);
      setEvents(data || []);
      setStats(statsData);
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <Helmet>
        <title>WebinX — Discover Free Webinars in India</title>
        <meta
          name="description"
          content="Find and join the best free webinars in India across technology, finance, AI, marketing, and more. Updated daily on WebinX."
        />
        <link rel="canonical" href="https://www.webinx.in" />
        <meta property="og:title" content="WebinX — Discover Free Webinars in India" />
        <meta property="og:description" content="Free webinars across technology, finance, AI, marketing and more. Updated daily." />
        <meta property="og:url" content="https://www.webinx.in" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Discover Free Webinars in India
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Trending online events across technology, finance, AI, marketing and more — updated daily.
          </p>

          {/* Stats bar */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
              <span><strong className="text-gray-900">{stats.total_events.toLocaleString()}</strong> events</span>
              <span><strong className="text-gray-900">{stats.upcoming_events.toLocaleString()}</strong> upcoming</span>
              <span><strong className="text-gray-900">{stats.sectors}</strong> sectors</span>
              <span><strong className="text-gray-900">{stats.hosts.toLocaleString()}</strong> hosts</span>
            </div>
          )}
        </div>

        {/* Sector quick links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["technology","finance","ai","marketing","healthcare","startup"].map((s) => (
            <a
              key={s}
              href={`/sector/${s}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-700 transition-colors"
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>

        {/* States */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Failed to load webinars.</p>
            <button
              onClick={load}
              className="text-sm text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No webinars found right now.</p>
            <a href="/webinars" className="text-purple-600 hover:underline text-sm">
              Browse all webinars →
            </a>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Trending Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <WebinarCard key={e.id || e.slug} webinar={e} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href="/webinars"
                className="inline-block text-sm font-medium bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition"
              >
                View All Webinars →
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
