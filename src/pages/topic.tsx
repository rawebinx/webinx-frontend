// src/pages/topic.tsx — /topic/:topic
// Programmatic SEO page for each knowledge topic/skill.
// Powers 500-2000 Google-indexed pages as tagger enriches events.

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

function SkeletonCard(): JSX.Element {
  return (
    <div className="border rounded-2xl animate-pulse bg-gray-50" style={{ height: 300 }}>
      <div className="h-36 bg-gray-200 rounded-t-2xl mb-4" />
      <div className="px-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

interface TopicStats {
  total: number;
  upcoming: number;
  free: number;
}

export default function TopicPage(): JSX.Element {
  const [, params]  = useRoute("/topic/:topic");
  const rawTopic    = params?.topic ?? "";
  const topic       = decodeURIComponent(rawTopic).replace(/-/g, " ");
  const displayName = topic.replace(/\b\w/g, (c) => c.toUpperCase());

  const [events,  setEvents]  = useState<WebinarEvent[] | null>(null);
  const [stats,   setStats]   = useState<TopicStats | null>(null);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!topic) return;
    setEvents(null);
    setError(false);

    apiFetch<WebinarEvent[]>(`/api/topic/${encodeURIComponent(rawTopic)}`)
      .then((data) => {
        setEvents(data);
        setStats({
          total:    data.length,
          upcoming: data.filter((e) => e.start_time && new Date(e.start_time) > new Date()).length,
          free:     data.filter((e) => e.is_free !== false).length,
        });
      })
      .catch(() => setError(true));
  }, [topic, rawTopic]);

  const title = `${displayName} Webinars & Events in India — WebinX`;
  const desc  = `Discover free ${displayName} webinars, workshops, and online events in India. Updated daily on WebinX — India's Knowledge Events Marketplace.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.webinx.in/topic/${rawTopic}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://www.webinx.in/topic/${rawTopic}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": title,
          "description": desc,
          "url": `https://www.webinx.in/topic/${rawTopic}`,
        })}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <a href="/" className="hover:text-[#0D4F6B] transition">Home</a>
            <span>›</span>
            <span>Topics</span>
            <span>›</span>
            <span className="text-gray-600">{displayName}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {displayName} — Webinars & Events
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Free online {displayName.toLowerCase()} events in India — updated daily as new events are listed by hosts.
          </p>

          {/* Stats bar */}
          {stats && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {[
                { label: "Events found",  value: stats.total },
                { label: "Upcoming",      value: stats.upcoming },
                { label: "Free to attend", value: stats.free },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-sm">
                  <span className="font-bold text-[#0D4F6B]">{s.value}</span>
                  <span className="text-gray-400">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Failed to load events. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[#0D4F6B] border border-[#0D4F6B] px-4 py-2 rounded-lg hover:bg-[#E1F5EE] transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton */}
        {!events && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {events && events.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              No {displayName} events yet
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Our AI is tagging new events every 30 minutes. Check back soon, or browse all webinars.
            </p>
            <a
              href="/webinars"
              className="inline-block bg-[#0D4F6B] hover:bg-[#1A6B8A] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              Browse all webinars →
            </a>
          </div>
        )}

        {/* Events grid */}
        {events && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {events.map((e) => (
                <WebinarCard key={e.id ?? e.slug} event={e} />
              ))}
            </div>

            {/* Request topic CTA */}
            <div className="border border-[#0D4F6B]/10 rounded-2xl p-6 bg-gradient-to-br from-[#E1F5EE] to-white mt-4">
              <h2 className="font-semibold text-gray-900 mb-1">
                📌 Can't find what you need on {displayName}?
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Tell us exactly what you're looking for — we'll alert you when a matching event is posted.
              </p>
              <a
                href={`/wishlist?topic=${encodeURIComponent(topic)}`}
                className="inline-block bg-[#0D4F6B] hover:bg-[#1A6B8A] text-white text-sm font-medium px-5 py-2 rounded-lg transition"
              >
                Request this topic →
              </a>
            </div>
          </>
        )}

        {/* Related topics */}
        <div className="mt-10">
          <p className="text-sm text-gray-400 mb-3">Also explore</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Python", "Machine Learning", "AI", "Data Science",
              "Marketing", "Finance", "Leadership", "Product Management",
              "UX Design", "Cloud Computing", "Blockchain", "Sales",
            ]
              .filter((t) => t.toLowerCase() !== topic.toLowerCase())
              .slice(0, 8)
              .map((t) => (
                <a
                  key={t}
                  href={`/topic/${t.toLowerCase().replace(/ /g, "-")}`}
                  className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:border-[#0D4F6B] hover:text-[#0D4F6B] transition"
                >
                  {t}
                </a>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
