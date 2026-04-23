import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { WebinarCard } from "../components/webinar-card";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "https://webinx-backend.onrender.com";

type Host = {
  slug: string;
  name: string;
  org_name?: string;
  bio?: string;
};

export default function HostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [host, setHost] = useState<Host | null>(null);
  const [events, setEvents] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setError(false);

    Promise.all([
      fetch(`${API_BASE}/api/hosts/${slug}`).then((r) => {
        if (!r.ok) throw new Error("Host not found");
        return r.json();
      }),
      fetch(`${API_BASE}/api/hosts/${slug}/events`).then((r) => {
        if (!r.ok) throw new Error("Events not found");
        return r.json();
      }),
    ])
      .then(([hostData, eventsData]) => {
        setHost(hostData);
        setEvents(Array.isArray(eventsData) ? eventsData : eventsData.events ?? []);
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
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/host" className="hover:text-gray-900">Hosts</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{displayName}</span>
        </nav>

        {error && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Host not found.</p>
            <Link href="/host" className="text-purple-600 hover:underline text-sm">
              ← All hosts
            </Link>
          </div>
        )}

        {!host && !error && (
          <div className="space-y-4 animate-pulse">
            <div className="h-7 w-48 bg-gray-100 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-lg border bg-gray-50" />
              ))}
            </div>
          </div>
        )}

        {host && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{host.name}</h1>
              {host.org_name && (
                <p className="text-gray-500 text-sm mt-1">{host.org_name}</p>
              )}
              {host.bio && (
                <p className="text-gray-600 text-sm mt-3 max-w-xl">{host.bio}</p>
              )}
            </div>

            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Upcoming &amp; Recent Events
            </h2>

            {events === null && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-lg border bg-gray-50 animate-pulse" />
                ))}
              </div>
            )}

            {events && events.length === 0 && (
              <p className="text-gray-500 text-sm">No events found for this host.</p>
            )}

            {events && events.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <WebinarCard key={event.slug || event.id} webinar={event} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
