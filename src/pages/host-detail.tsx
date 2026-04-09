import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { getHost, getHostEvents } from "../lib/api";

export default function HostDetail() {
  const [, params] = useRoute("/hosts/:slug");
  const slug = params?.slug;

  const [host, setHost] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getHost(slug).then(setHost);

    getHostEvents(slug).then((data) => {
  console.log("EVENTS API:", data); // DEBUG

  if (data && data.events && data.events.length > 0) {
    setEvents(data.events);
  } else {
    setEvents([]);
  }

  setLoading(false);
});
  }, [slug]);

  if (loading) return <div className="p-10">Loading...</div>;

  if (!host || host.error) {
    return <div className="p-10">Host not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">{host.name}</h1>

      <h2 className="text-xl font-semibold mt-10 mb-4">
        Webinars by this host
      </h2>

      {events.length === 0 ? (
        <p>No webinars available</p>
      ) : (
        <ul>
          {events.map((e) => (
            <li key={e.slug}>
              <a href={`/webinar/${e.slug}`} className="text-blue-600 underline">
                {e.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
