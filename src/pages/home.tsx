import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data.slice(0, 6)))
      .catch(() => setEvents([]));
  }, []);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>WebinX – Discover Webinars in India</title>
        <meta
          name="description"
          content="Discover top webinars across AI, marketing, finance and business."
        />
      </Helmet>

      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(135deg,#4f46e5,#9333ea)",
          padding: "110px 20px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: 800 }}>
          Discover Top Webinars
        </h1>

        <p style={{ marginTop: "10px", fontSize: "18px", opacity: 0.9 }}>
          Learn from experts in AI, Marketing, Finance & Business
        </p>

        <Link href="/webinars">
          <a
            style={{
              marginTop: "30px",
              display: "inline-block",
              background: "#facc15",
              padding: "14px 30px",
              borderRadius: "12px",
              fontWeight: 700,
              color: "#000",
              textDecoration: "none",
            }}
          >
            Explore Webinars →
          </a>
        </Link>
      </div>
<div style={{ textAlign: "center", marginTop: "40px" }}>
  <a href="/category/ai">AI</a> •
  <a href="/category/marketing">Marketing</a> •
  <a href="/category/finance">Finance</a> •
  <a href="/category/business">Business</a>
</div>
      {/* TRUST BAR */}
      <div
        style={{
          textAlign: "center",
          padding: "15px",
          fontSize: "14px",
          color: "#666",
          borderBottom: "1px solid #eee",
        }}
      >
        🔥 100+ webinars • Updated daily • Free learning
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: "1100px", margin: "50px auto", padding: "20px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
          Latest Webinars
        </h2>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "24px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                transition: "all 0.25s ease",
                border: "1px solid #f1f1f1",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ fontSize: "12px", color: "#888" }}>
                {new Date(event.start_time).toLocaleDateString("en-IN")}
              </div>

              <h3
                style={{
                  fontSize: "18px",
                  margin: "10px 0",
                  lineHeight: "1.4",
                }}
              >
                {event.title}
              </h3>

              <Link href={`/webinar/${event.slug}`}>
                <a
                  style={{
                    marginTop: "10px",
                    display: "inline-block",
                    color: "#4f46e5",
                    fontWeight: 600,
                  }}
                >
                  View Details →
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div
        style={{
          background: "#f9fafb",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "26px" }}>
          Never miss a valuable webinar again
        </h2>

        <p style={{ color: "#666", marginTop: "10px" }}>
          Explore curated webinars across industries
        </p>

        <Link href="/webinars">
          <a
            style={{
              marginTop: "20px",
              display: "inline-block",
              background: "#4f46e5",
              color: "#fff",
              padding: "12px 26px",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            Browse All Webinars
          </a>
        </Link>
      </div>
    </>
  );
}
