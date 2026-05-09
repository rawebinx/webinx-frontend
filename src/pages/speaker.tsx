// src/pages/speaker.tsx — Speaker profile page
// Route: /speaker/:speaker (add to App.tsx before /:slug)

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useRoute } from "wouter";
import { apiFetch } from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

export default function SpeakerPage() {
  const [, params]     = useRoute("/speaker/:speaker");
  const speakerRaw     = decodeURIComponent(params?.speaker ?? "");
  const speakerName    = speakerRaw.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const [events,  setEvents]  = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!speakerName) return;
    setLoading(true);
    apiFetch<WebinarEvent[]>(`/api/speaker/${encodeURIComponent(speakerName)}`)
      .then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [speakerName]);

  const title = `${speakerName} — Events & Talks on WebinX`;
  const desc  = `All webinars, podcasts, and live events featuring ${speakerName} on WebinX — India's Knowledge Events Marketplace.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.webinx.in/speaker/${params?.speaker}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
      </Helmet>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="mb-6 text-sm text-gray-500 flex gap-2">
          <Link href="/">Home</Link><span>›</span>
          <Link href="/top-hosts">Speakers</Link><span>›</span>
          <span className="text-gray-900">{speakerName}</span>
        </nav>

        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-700 flex-shrink-0">
            {speakerName.charAt(0)}
          </div>
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-1">🎤 Speaker</span>
            <h1 className="text-3xl font-bold text-gray-900">{speakerName}</h1>
            {!loading && <p className="text-gray-500 text-sm mt-1">{events.length} event{events.length !== 1 ? "s" : ""} on WebinX</p>}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-gray-500">Failed to load. Please try again.</div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎤</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No sessions tagged yet</h2>
            <p className="text-gray-500 mb-6">Our AI tags new events every 30 minutes. Check back soon.</p>
            <Link href="/webinars" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition-colors">
              Browse all events →
            </Link>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(e => <WebinarCard key={e.slug} event={e} />)}
          </div>
        )}
      </main>
    </>
  );
}
