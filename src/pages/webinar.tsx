import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { getRelatedEvents, WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://webinx-backend.onrender.com";

export default function WebinarDetail() {
  const slug = window.location.pathname.replace(/^\/webinar\//, "").trim();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Related webinars state (Phase 4 addition — does not affect main event load)
  const [related, setRelated] = useState<WebinarEvent[]>([]);

  useEffect(() => {
    if (!slug) {
      setError("Invalid webinar URL.");
      setLoading(false);
      return;
    }

    async function fetchEvent(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/events/${slug}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError("Webinar not found. It may have been removed or the URL is incorrect.");
          } else {
            setError(`Failed to load webinar (HTTP ${res.status}). Please try again.`);
          }
          return;
        }

        const data = await res.json();

        if (!data || !data.title) {
          setError("Webinar data is unavailable.");
          return;
        }

        setEvent(data);

        // Fetch related events after main event loads — non-blocking, silent on error
        if (data.sector_slug || data.sector_name) {
          getRelatedEvents(slug, data.sector_slug || data.sector_name, 4)
            .then(setRelated)
            .catch(() => {}); // silent — related section is non-critical
        }
      } catch (err) {
        console.error("[WebinX] Error fetching event:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [slug]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded w-40" />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-700 mb-1">
            Unable to load webinar
          </h2>
          <p className="text-red-600 text-sm">{error}</p>
          <a
            href="/webinars"
            className="inline-block mt-3 text-sm text-blue-600 underline"
          >
            ← Browse all webinars
          </a>
        </div>
      </div>
    );
  }

  if (!event) return null;

  // ── Safe date formatting ──────────────────────────────────────────────────
  let formattedDate = "Date not available";
  if (event.start_time) {
    const d = new Date(event.start_time);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
    }
  }

  // ── Schema.org structured data ────────────────────────────────────────────
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time || event.start_time,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: event.registration_url || event.event_url,
    },
    organizer: {
      "@type": "Organization",
      name: event.host_name || "Webinar Organizer",
      url: event.event_url,
    },
    isAccessibleForFree: true,
    url: `https://webinx.in/webinar/${event.slug}`,
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Helmet>
        <title>{event.title} | WebinX</title>
        <meta name="description" content={event.description?.slice(0, 155) || ""} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* ── Existing UI — unchanged ─────────────────────────────────────── */}
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

      <p className="text-gray-600 mb-2">📅 {formattedDate}</p>

      {event.host_name && (
        <p className="text-gray-500 text-sm mb-4">🏢 {event.host_name}</p>
      )}

      <p className="mb-6">
        {event.description || "Join this webinar to learn more."}
      </p>

      <a
        href={event.registration_url || event.event_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Register Now
      </a>

      {/* ── Related webinars (Phase 4 addition) ────────────────────────── */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((ev) => (
              <WebinarCard key={ev.slug} webinar={ev} />
            ))}
          </div>
          {event.sector_slug && (
            <Link
              href={`/sector/${event.sector_slug}`}
              className="inline-block mt-4 text-sm text-purple-600 hover:underline"
            >
              See all {event.sector_name || "sector"} webinars →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
