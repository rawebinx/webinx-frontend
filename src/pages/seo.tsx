import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { getEvents } from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";
import { SECTOR_META } from "../lib/sector-meta";

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 animate-pulse bg-gray-50">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function SeoPage() {
  const [location] = useLocation();
  const [events, setEvents] = useState<WebinarEvent[] | null>(null);
  const [error, setError]   = useState(false);

  // Extract slug safely without window.location
  const rawSlug = location.replace(/^\//, "");
  const sector  = rawSlug.replace(/-webinars-india$/, "").replace(/-webinars$/, "");

  const meta = SECTOR_META[sector];

  const pageTitle = meta?.title
    || `${sector.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Webinars in India — WebinX`;

  const pageDesc = meta?.description
    || `Discover free ${sector.replace(/-/g, " ")} webinars and online events in India. Updated daily on WebinX.`;

  useEffect(() => {
    if (!sector) return;
    setEvents(null);
    setError(false);
    getEvents({ sector, limit: 24 })
      .then(setEvents)
      .catch(() => setError(true));
  }, [sector]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`https://www.webinx.in/${rawSlug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`https://www.webinx.in/${rawSlug}`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{pageTitle}</h1>
        <p className="text-gray-500 text-sm mb-8">Free online events — updated daily</p>

        {/* Intro text from sector meta */}
        {meta?.intro && (
          <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">{meta.intro}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-6">Failed to load events. Please try again.</p>
        )}

        {!events && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {events && events.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No webinars found for this topic.</p>
            <a href="/webinars" className="text-[#0D4F6B] hover:underline text-sm">
              Browse all webinars →
            </a>
          </div>
        )}

        {events && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              // BUG 1 FIX: was webinar={e}, must be event={e}
              <WebinarCard key={e.id || e.slug} event={e} />
            ))}
          </div>
        )}

        {/* FAQ from sector meta */}
        {meta?.faq && meta.faq.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {meta.faq.map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">{item.q}</p>
                  <p className="text-sm text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related sectors */}
        {meta?.related && meta.related.length > 0 && (
          <div className="mt-10">
            <p className="text-sm text-gray-500 mb-3">Also explore:</p>
            <div className="flex flex-wrap gap-2">
              {meta.related.map((r) => (
                <a
                  key={r.slug}
                  href={`/sector/${r.slug}`}
                  className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:border-[#0D4F6B] hover:text-[#0D4F6B] transition"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
