import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function SeoPage() {
  const slug = window.location.pathname.replace("/", "");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/seo/${slug}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [slug]);

  if (!data) return <div style={{ padding: "40px" }}>Loading...</div>;

  const formatted = data.keyword
    .split(" ")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = `${formatted} | WebinX`;
  const description = `Explore top ${formatted} webinars in India. Join free expert-led online events and upgrade your skills.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.webinx.in/${slug}`} />
      </Helmet>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "40px" }}>
        
        {/* HERO */}
        <h1 style={{ fontSize: "34px", marginBottom: "10px" }}>
          {formatted}
        </h1>

        <p style={{ color: "#555", maxWidth: "700px" }}>
          Looking for the best {formatted.toLowerCase()} webinars?  
          Discover expert-led sessions, live training, and free online webinars across India.  
          Stay ahead with the latest trends and insights.
        </p>

        {/* EMPTY STATE */}
        {data.events.length === 0 && (
          <p style={{ marginTop: "20px" }}>
            No webinars found right now. Please check again later.
          </p>
        )}

        {/* GRID */}
        {data.events.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "20px",
              marginTop: "30px"
            }}
          >
            {data.events.map((event: any) => (
              <a key={event.slug} href={`/webinar/${event.slug}`}>
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    background: "#fff",
                    transition: "0.2s"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    {new Date(event.start_time).toLocaleDateString("en-IN")}
                  </div>

                  <h3 style={{ marginTop: "8px" }}>
                    {event.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* SEO CONTENT BLOCK */}
        <div style={{ marginTop: "50px" }}>
          <h2>Why attend {formatted} webinars?</h2>

          <ul>
            <li>Learn from industry experts</li>
            <li>Stay updated with latest trends</li>
            <li>Gain practical knowledge</li>
            <li>Improve career opportunities</li>
          </ul>

          <h2>Who should attend?</h2>

          <ul>
            <li>Students and beginners</li>
            <li>Working professionals</li>
            <li>Entrepreneurs and founders</li>
          </ul>
        </div>

      </div>
    </>
  );
}
