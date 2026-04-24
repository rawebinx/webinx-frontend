// src/pages/host-detail.tsx — WebinX Host Detail Page v2
// Verified badge, improved layout, uses api.ts (fixed getHost/getHostEvents).

import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { getHost, getHostEvents } from "../lib/api";
import type { Host, WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

function VerifiedBadge() {
  return (
    <span
      title="Verified Host on WebinX"
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
      style={{ background: "#dbeafe", color: "#1d4ed8" }}
    >
      <svg viewBox="0 0 24 24" width="11" height="11" fill="#1d4ed8">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
      Verified Host
    </span>
  );
}

function HostInitials({ name }: { name: string }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
      style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
    >
      {initials || "?"}
    </div>
  );
}

export default function HostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [host, setHost]     = useState<Host | null>(null);
  const [events, setEvents] = useState<WebinarEvent[] | null>(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    if (!slug) return;
    setError(false);
    setHost(null);
    setEvents(null);

    Promise.all([
      getHost(slug),
      getHostEvents(slug),
    ])
      .then(([hostData, eventsData]) => {
        if (!hostData) { setError(true); return; }
        setHost(hostData);
        setEvents(eventsData);
      })
      .catch(() => setError(true));
  }, [slug]);

  const displayName = host?.name ?? slug ?? "";

  return (
    <>
      <Helmet>
        <title>{displayName} — WebinX Host</title>
        <meta
          name="description"
          content={`Webinars and events by ${displayName} on WebinX — India's free webinar discovery platform.`}
        />
        <link rel="canonical" href={`https://www.webinx.in/hosts/${slug}`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span className="mx-2">/</span>
          <a href="/host" className="hover:text-gray-900">Hosts</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{displayName}</span>
        </nav>

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Host not found.</p>
            <a href="/host" className="text-purple-600 hover:underline text-sm">← All hosts</a>
          </div>
        )}

        {/* Skeleton */}
        {!host && !error && (
          <div className="space-y-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-6 w-48 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 rounded-xl border bg-gray-50" />
              ))}
            </div>
          </div>
        )}

        {/* Host profile */}
        {host && (
          <>
            <div className="flex gap-4 mb-10 items-start">
              <HostInitials name={host.name} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{host.name}</h1>
                  {host.is_verified && <VerifiedBadge />}
                </div>
                {host.org_name && (
                  <p className="text-gray-500 text-sm mb-2">{host.org_name}</p>
                )}
                {host.bio && (
                  <p className="text-gray-600 text-sm max-w-xl leading-relaxed">{host.bio}</p>
                )}
                {/* Links */}
                <div className="flex gap-3 mt-3">
                  {host.website && (
                    <a
                      href={host.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:underline"
                    >
                      🌐 Website
                    </a>
                  )}
                  {host.linkedin && (
                    <a
                      href={host.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Upcoming &amp; Recent Events
              {events !== null && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({events.length})
                </span>
              )}
            </h2>

            {/* Events loading */}
            {events === null && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-36 rounded-xl border bg-gray-50 animate-pulse" />
                ))}
              </div>
            )}

            {/* No events */}
            {events !== null && events.length === 0 && (
              <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                <p className="text-sm mb-2">No events found for this host.</p>
                <a href="/webinars" className="text-purple-600 hover:underline text-sm">
                  Browse all webinars →
                </a>
              </div>
            )}

            {/* Events grid */}
            {events !== null && events.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <WebinarCard
                    key={event.slug || event.id}
                    webinar={{ ...event, is_verified: host.is_verified }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
