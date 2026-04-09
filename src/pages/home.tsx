import { useState, useEffect } from "react";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://webinx-backend.onrender.com/api/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data || []);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>

      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        WebinX – Discover Webinars
      </h1>

      <p style={{ marginBottom: "20px", color: "#666" }}>
        Simple stable homepage (fixing deployment issues)
      </p>

      <h2 style={{ marginTop: "30px" }}>Latest Webinars</h2>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {events.slice(0, 10).map((e: any) => (
            <div
              key={e.id}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginBottom: "10px"
              }}
            >
              <h3>{e.title}</h3>
              <p style={{ fontSize: "12px", color: "#777" }}>
                {e.start_time}
              </p>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
