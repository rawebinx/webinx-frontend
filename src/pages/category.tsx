import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function CategoryPage() {
  const category = window.location.pathname.split("/")[2];
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/category/${category}`)
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, [category]);

  const title = `${category} Webinars (Free) | WebinX`;
  const description = `Explore top ${category} webinars in India. Join free expert-led sessions.`;
  const url = `https://www.webinx.in/category/${category}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
      </Helmet>

      <div style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
        <h1 style={{ fontSize: "32px" }}>
          {category.toUpperCase()} Webinars
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
          marginTop: "30px"
        }}>
          {events.map(event => (
            <a key={event.slug} href={`/webinar/${event.slug}`}>
              <div style={{
                padding: "20px",
                border: "1px solid #eee",
                borderRadius: "12px"
              }}>
                <div>{new Date(event.start_time).toLocaleDateString("en-IN")}</div>
                <h3>{event.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
