import { useEffect, useState } from "react";
import { getTrendingEvents } from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

export default function HomePage() {
  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);

    try {
      const data = await getTrendingEvents(12);
      setEvents(data || []);
    } catch {
      setError(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Discover & Join Top Webinars
      </h1>

      {loading && <p>Loading webinars...</p>}

      {error && (
        <div>
          <p>Failed to load webinars</p>
          <button onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <p>No webinars found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((e) => (
          <WebinarCard key={e.id} webinar={e} />
        ))}
      </div>
    </div>
  );
}