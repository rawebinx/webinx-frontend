import { useEffect, useState } from "react";

const API_BASE = "https://webinx-backend.onrender.com";

export default function RelatedWebinars({ keyword }: { keyword: string }) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/category/${keyword}`)
      .then(res => res.json())
      .then(data => setEvents(data.slice(0, 4)));
  }, [keyword]);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Related Webinars</h3>

      {events.map(e => (
        <div key={e.slug}>
          <a href={`/webinar/${e.slug}`}>{e.title}</a>
        </div>
      ))}
    </div>
  );
}
