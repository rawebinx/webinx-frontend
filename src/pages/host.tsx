import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "https://webinx-backend.onrender.com";

type Host = {
  slug: string;
  name: string;
  org_name?: string;
  event_count?: number;
};

export default function HostPage() {
  const [hosts, setHosts] = useState<Host[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/hosts`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setHosts)
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <Helmet>
        <title>Webinar Hosts &amp; Organisers — WebinX</title>
        <meta
          name="description"
          content="Browse all webinar hosts and organisations listing events on WebinX — India's free webinar discovery platform."
        />
        <link rel="canonical" href="https://www.webinx.in/host" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Webinar Hosts</h1>
        <p className="text-gray-500 text-sm mb-8">
          Organisations and speakers hosting events on WebinX
        </p>

        {error && (
          <p className="text-red-500 text-sm">Failed to load hosts. Please try again.</p>
        )}

        {!hosts && !error && (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg border bg-gray-50 animate-pulse" />
            ))}
          </div>
        )}

        {hosts && hosts.length === 0 && (
          <p className="text-gray-500 text-sm">No hosts found.</p>
        )}

        {hosts && hosts.length > 0 && (
          <div className="divide-y divide-gray-100 border rounded-lg overflow-hidden">
            {hosts.map((host) => (
              <Link
                key={host.slug}
                href={`/hosts/${host.slug}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{host.name}</p>
                  {host.org_name && (
                    <p className="text-xs text-gray-500">{host.org_name}</p>
                  )}
                </div>
                {host.event_count != null && (
                  <span className="text-xs text-gray-400">
                    {host.event_count} event{host.event_count !== 1 ? "s" : ""}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
