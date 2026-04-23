import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { getEvents } from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 animate-pulse bg-gray-50">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [events, setEvents] = useState<WebinarEvent[] | null>(null);
  const [error, setError]   = useState(false);

  const label = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  useEffect(() => {
    if (!slug) return;
    setEvents(null);
    setError(false);
    getEvents({ category: slug, limit: 24 })
      .then(setEvents)
      .catch(() => setError(true));
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{label} Webinars in India — WebinX</title>
        <meta
          name="description"
          content={`Discover free ${label} webinars and online events in India. Updated daily on WebinX.`}
        />
        <link rel="canonical" href={`https://www.webinx.in/category/${slug}`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {label} Webinars in India
        </h1>
        <p className="text-gray-500 text-sm mb-8">Free online events — updated daily</p>

        {error && (
          <p className="text-red-500 text-sm">Failed to load events. Please try again.</p>
        )}

        {!events && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {events && events.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No webinars found for "{label}"</p>
            <a href="/webinars" className="text-purple-600 hover:underline text-sm">
              Browse all webinars →
            </a>
          </div>
        )}

        {events && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <WebinarCard key={e.id || e.slug} webinar={e} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
