import { useState, useEffect } from "react";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://webinx-backend.onrender.com/api/events");
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Home API error", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1>WebinX – Discover Webinars</h1>

      <h2>Latest Webinars</h2>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.slice(0, 10).map((e: any) => (
          <div key={e.id || e.slug}>
            <h3>{e.title || "Untitled"}</h3>
            <p>{e.start_time || "No date"}</p>
          </div>
        ))
      )}
    </main>
  );
}
