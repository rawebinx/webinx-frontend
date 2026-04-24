import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import {
  getEventBySlug, getRelatedEvents, formatEventDate,
  isUpcoming, daysUntil, postAlert, buildCalendarUrl,
} from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

export default function WebinarPage() {
  const [, params] = useRoute("/webinar/:slug");
  const slug = params?.slug || "";

  const [event, setEvent]           = useState<WebinarEvent | null>(null);
  const [related, setRelated]       = useState<WebinarEvent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSent, setAlertSent]   = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);

  async function handleSetAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!alertEmail || !event) return;
    setAlertLoading(true);
    const res = await postAlert({ email: alertEmail, event_slug: event.slug });
    setAlertLoading(false);
    if (res.status === "ok") setAlertSent(true);
  }

  async function load() {
    setLoading(true);
    setNotFound(false);
    const cleanSlug = slug.replace(/\uffff/g, "-");
    const data = await getEventBySlug(cleanSlug);
    if (data) {
      setEvent(data);
      const rel = await getRelatedEvents(data.slug, data.sector_slug, 4);
      setRelated(rel || []);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-4/6 mb-8" />
        <div className="h-10 bg-gray-200 rounded w-32" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <>
        <Helmet>
          <title>Webinar Not Found — WebinX</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Webinar not found</h1>
          <p className="text-gray-500 text-sm mb-6">This event may have ended or been removed.</p>
          <a href="/webinars" className="text-purple-600 hover:underline text-sm">
            ← Browse all webinars
          </a>
        </div>
      </>
    );
  }

  const upcoming    = isUpcoming(event.start_time);
  const days        = daysUntil(event.start_time);
  const dateStr     = formatEventDate(event.start_time);
  const canonicalUrl = `https://www.webinx.in/webinar/${event.slug}`;

  // Only show CTA button if we have a real external registration URL
  const ctaUrl = event.url && event.url !== "#" ? event.url : "";

  // schema.org Event structured data
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || event.title,
    startDate: event.start_time || undefined,
    endDate: event.end_time || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: ctaUrl || canonicalUrl,
    },
    organizer: {
      "@type": "Organization",
      name: event.host_name || "WebinX",
    },
    url: canonicalUrl,
    isAccessibleForFree: true,
    ...(event.sector_name && {
      about: { "@type": "Thing", name: event.sector_name },
    }),
  };

  return (
    <>
      <Helmet>
        <title>{event.title} — WebinX</title>
        <meta
          name="description"
          content={
            event.description
              ? event.description.replace(/<[^>]+>/g, "").slice(0, 160)
              : `Join "${event.title}" — a free online webinar on WebinX. ${dateStr}.`
          }
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={event.title} />
        <meta
          property="og:description"
          content={event.description
            ? event.description.replace(/<[^>]+>/g, "").slice(0, 160)
            : `Free webinar: ${event.title}`}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span className="mx-2">/</span>
          <a href="/webinars" className="hover:text-gray-900">Webinars</a>
          {event.sector_slug && (
            <>
              <span className="mx-2">/</span>
              <a href={`/sector/${event.sector_slug}`} className="hover:text-gray-900">
                {event.sector_name}
              </a>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-700 line-clamp-1">{event.title}</span>
        </nav>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.sector_name && (
            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
              {event.sector_name}
            </span>
          )}
          {upcoming && days !== null && (
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
              {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
            </span>
          )}
          {!upcoming && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              Ended
            </span>
          )}
          {event.is_featured && (
            <span className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {event.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-col gap-1 text-sm text-gray-600 mb-6">
          {event.host_name && (
            <p>👤 <span className="font-medium">{event.host_name}</span></p>
          )}
          <p>📅 <span>{dateStr}</span></p>
          {event.source_name && (
            <p>🔗 <span className="text-gray-400">Source: {event.source_name}</span></p>
          )}
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {event.tags
              .filter((t) => t && !t.startsWith("<") && !t.startsWith("href"))
              .slice(0, 8)
              .map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div
            className="text-gray-700 text-sm leading-relaxed mb-8 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: event.description.replace(/<script[^>]*>.*?<\/script>/gi, ""),
            }}
          />
        )}

        {/* CTA — only renders when we have a real external URL */}
        {ctaUrl ? (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition text-sm"
          >
            {event.is_sponsored && event.sponsor_cta
              ? event.sponsor_cta
              : upcoming
              ? "Register Now →"
              : "View Details →"}
          </a>
        ) : (
          // No external URL: show a search CTA so page never feels broken
          <a
            href="/webinars"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition text-sm"
          >
            Browse similar webinars →
          </a>
        )}

        {/* Add to Calendar (upcoming events only) */}
        {upcoming && buildCalendarUrl(event) && (
          <a
            href={buildCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition ml-3"
          >
            📅 Add to Calendar
          </a>
        )}

        {/* Set Alert */}
        {upcoming && (
          <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-gray-50">
            {alertSent ? (
              <p className="text-sm text-green-700 font-medium">
                ✓ Reminder set! We'll email you before this webinar starts.
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  🔔 Get a reminder before this webinar starts
                </p>
                <form onSubmit={handleSetAlert} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    required
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={alertLoading}
                    className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
                  >
                    {alertLoading ? "…" : "Remind me"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Sponsor note */}
        {event.is_sponsored && event.sponsor_name && (
          <p className="text-xs text-gray-400 mt-3">
            Sponsored by {event.sponsor_name}
          </p>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Related Webinars</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((e) => (
                <WebinarCard key={e.id || e.slug} webinar={e} />
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <a href="/webinars" className="text-sm text-purple-600 hover:underline">
            ← Browse all webinars
          </a>
        </div>
      </div>
    </>
  );
}
