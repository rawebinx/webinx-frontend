import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getEvents, getSectors } from "../lib/api";
import type { WebinarEvent, Sector } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

const PAGE_SIZE = 24;

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

export default function WebinarsPage() {
  const [events, setEvents]       = useState<WebinarEvent[]>([]);
  const [sectors, setSectors]     = useState<Sector[]>([]);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]         = useState(false);
  const [hasMore, setHasMore]     = useState(true);
  const [offset, setOffset]       = useState(0);

  // Filters
  const [search, setSearch]       = useState("");
  const [sector, setSector]       = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Load sectors for filter dropdown
  useEffect(() => {
    getSectors().then(setSectors).catch(() => {});
  }, []);

  // Reset and reload when filters change
  const load = useCallback(async (newOffset = 0, append = false) => {
    if (newOffset === 0) setLoading(true);
    else setLoadingMore(true);
    setError(false);

    try {
      const data = await getEvents({
        q: search || undefined,
        sector: sector || undefined,
        limit: PAGE_SIZE,
        offset: newOffset,
      });
      if (append) {
        setEvents((prev) => [...prev, ...(data || [])]);
      } else {
        setEvents(data || []);
      }
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
      setOffset(newOffset + PAGE_SIZE);
    } catch {
      setError(true);
    }

    setLoading(false);
    setLoadingMore(false);
  }, [search, sector]);

  useEffect(() => {
    setOffset(0);
    load(0, false);
  }, [load]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  function handleLoadMore() {
    load(offset, true);
  }

  const pageTitle = sector
    ? `${sector.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Webinars — WebinX`
    : "All Webinars in India — WebinX";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Browse all free webinars in India. Filter by sector, search by topic, and register for the best online events — updated daily on WebinX."
        />
        <link rel="canonical" href="https://www.webinx.in/webinars" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">All Webinars</h1>
        <p className="text-gray-500 text-sm mb-8">Free online events — updated daily</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search webinars…"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <select
            value={sector}
            onChange={(e) => { setSector(e.target.value); setOffset(0); }}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
          >
            <option value="">All Sectors</option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} {s.event_count > 0 ? `(${s.event_count})` : ""}
              </option>
            ))}
          </select>
          {(search || sector) && (
            <button
              onClick={() => { setSearchInput(""); setSector(""); }}
              className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2 border border-gray-200 rounded-lg transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Failed to load webinars.</p>
            <button
              onClick={() => load(0, false)}
              className="text-sm text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
            >
              Try Again
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
            <p className="text-lg mb-2">
              No webinars found{search ? ` for "${search}"` : ""}
              {sector ? ` in ${sector}` : ""}
            </p>
            <button
              onClick={() => { setSearchInput(""); setSector(""); }}
              className="text-purple-600 hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <WebinarCard key={e.id || e.slug} webinar={e} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="text-sm font-medium border border-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
