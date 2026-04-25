import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { getEvents } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

export default function SectorPage() {
  const { slug } = useParams<{ slug: string }>();
  const [events, setEvents] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  const sectorLabel = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  useEffect(() => {
    if (!slug) return;
    setEvents(null);
    setError(false);
    getEvents(slug)
      .then(setEvents)
      .catch(() => setError(true));
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{sectorLabel} Webinars in India — WebinX</title>
        <meta
          name="description"
          content={`Discover free ${sectorLabel} webinars and online events in India. Updated daily on WebinX.`}
        />
        <link rel="canonical" href={`https://www.webinx.in/sector/${slug}`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {sectorLabel} Webinars in India
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Free online events — updated daily
        </p>

        {error && (
          <p className="text-red-500 text-sm">Failed to load events. Please try again.</p>
        )}

        {!events && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-50 h-28" />
            ))}
          </div>
        )}

        {events && events.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No webinars found for "{sectorLabel}"</p>
            <a href="/webinars" className="text-purple-600 hover:underline text-sm">
              Browse all webinars →
            </a>
          </div>
        )}

        {events && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <WebinarCard key={event.slug || event.id} webinar={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
