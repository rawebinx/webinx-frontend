import { useEffect, useState } from "react";
import { useRoute } from "wouter";

export default function WebinarPage() {
  const [match, params] = useRoute("/webinar/:slug");
  const slug = params?.slug;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`https://webinx-backend.onrender.com/api/events/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);

        // ✅ SEO TITLE
        document.title = `${data.title} | WebinX`;

        // ✅ META DESCRIPTION
        const desc = document.querySelector("meta[name='description']");
        if (desc) {
          desc.setAttribute(
            "content",
            `Join ${data.title}. Discover expert-led webinar on WebinX.`
          );
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  if (!event) return <p style={{ padding: "40px" }}>Event not found</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      
      <h1>{event.title}</h1>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        {new Date(event.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}
      </p>

      {/* CTA */}
      <a
        href="#"
        style={{
          display: "inline-block",
          background: "#6C5CE7",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          marginTop: "20px",
        }}
      >
        Register Now →
      </a>

      {/* SEO CONTENT */}
      <div style={{ marginTop: "40px" }}>
        <h2>About this webinar</h2>
        <p>
          Join {event.title} and learn from industry experts. Stay updated with
          latest trends and insights.
        </p>
      </div>

    </div>
  );
}
