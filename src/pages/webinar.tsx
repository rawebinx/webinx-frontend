import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function WebinarDetailPage() {
  const slug = window.location.pathname.replace("/webinar/", "");

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/events/${slug}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [slug]);

  if (!data) return <div style={{ padding: "40px" }}>Loading...</div>;

  return (
    <>
      <Helmet>
        <title>{data.title} | WebinX</title>
        <meta
          name="description"
          content={`Join ${data.title}. Discover expert-led webinar on WebinX.`}
        />
        <link
          rel="canonical"
          href={`https://www.webinx.in/webinar/${slug}`}
        />
      </Helmet>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "40px" }}>
        <h1>{data.title}</h1>

        <p style={{ color: "#666", marginTop: "10px" }}>
          {new Date(data.start_time).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}
        </p>

        <div style={{ marginTop: "20px" }}>
          <a
            href={data.url || "#"}
            target="_blank"
            style={{
              background: "#2563EB",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none"
            }}
          >
            Join Webinar →
          </a>
        </div>
      </div>
    </>
  );
}
