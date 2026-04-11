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
const description = `Explore top ${formatted} webinars in India. Join free expert-led sessions.`;
  const description = `Explore ${data.keyword}. Join free webinars in India.`;

  return (
    <>
      {data.events.length === 0 && (
  <p style={{ marginTop: "20px" }}>
    No webinars found right now. Check back soon for updated listings.
  </p>
)}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.webinx.in/${slug}`} />
      </Helmet>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "40px" }}>
        <h1 style={{ fontSize: "32px" }}>
          {data.keyword.toUpperCase()}
        </h1>

        <p style={{ color: "#666" }}>
          Discover top {data.keyword} webinars in India.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
          marginTop: "30px"
        }}>
          {data.events.map((event: any) => (
            <a key={event.slug} href={`/webinar/${event.slug}`}>
              <div style={{
                padding: "20px",
                border: "1px solid #eee",
                borderRadius: "12px"
              }}>
                <div>
                  {new Date(event.start_time).toLocaleDateString("en-IN")}
                </div>
                <h3>{event.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
