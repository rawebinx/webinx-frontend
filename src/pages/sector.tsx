import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SectorPage({ slug }: { slug: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/api/events?sector=${slug}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]);
        setLoading(false);
      });

  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // EMPTY STATE
  if (!events.length) {
    return (
      <div>
        <h2>No webinars found</h2>
        <p>Try exploring other categories.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{slug} Webinars</h1>

      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.start_time}</p>
        </div>
      ))}
    </div>
  );
}
