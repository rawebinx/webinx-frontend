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
      {/* ================= SEO ================= */}
      <Helmet>
        <title>WebinX – Discover Webinars in India (AI, Marketing, Finance)</title>
        <meta
          name="description"
          content="Find and join top webinars in India across AI, marketing, business and finance. Updated daily on WebinX."
        />
        <link rel="canonical" href="https://www.webinx.in/" />

        <meta property="og:title" content="WebinX – Discover Webinars" />
        <meta property="og:description" content="Explore top webinars across AI, marketing and business." />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <meta property="og:url" content="https://www.webinx.in/" />
      </Helmet>

      {/* ================= HERO ================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          padding: "100px 20px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "44px", fontWeight: "700" }}>
          Discover Top Webinars
        </h1>

        <p style={{ fontSize: "18px", marginTop: "10px", opacity: 0.9 }}>
          Learn AI, Marketing, Finance & Business from experts
        </p>

        <Link href="/webinars">
          <a
            style={{
              marginTop: "25px",
              display: "inline-block",
              background: "#facc15",
              color: "#000",
              padding: "14px 28px",
              borderRadius: "10px",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            Explore Webinars →
          </a>
        </Link>
      </div>

      {/* ================= TRUST STRIP ================= */}
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        🔥 100+ webinars discovered • Updated daily • Free access
      </div>

      {/* ================= MAIN ================= */}
      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px" }}>
        <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
          Latest Webinars
        </h2>

        {/* CATEGORY TAGS */}
        <div style={{ marginBottom: "20px" }}>
          {["AI", "Marketing", "Finance", "Business"].map((cat) => (
            <span
              key={cat}
              style={{
                marginRight: "10px",
                padding: "6px 14px",
                background: "#eef2ff",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
                {event.title}
              </h3>

              <p style={{ fontSize: "13px", color: "#666" }}>
                {new Date(event.start_time).toLocaleDateString("en-IN")}
              </p>

              <Link href={`/webinar/${event.slug}`}>
                <a
                  style={{
                    marginTop: "12px",
                    display: "inline-block",
                    color: "#4f46e5",
                    fontWeight: "600",
                  }}
                >
                  View Details →
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SEO CONTENT ================= */}
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <h2>Find Webinars in India</h2>
        <p>
          WebinX helps you discover upcoming webinars in AI, marketing,
          finance, and business. Stay ahead by joining expert-led sessions.
        </p>

        <h2>Popular Webinar Topics</h2>
        <ul>
          <li>AI & Machine Learning</li>
          <li>Digital Marketing</li>
          <li>Stock Market & Finance</li>
          <li>Startup Growth</li>
        </ul>
      </div>
    </>
  );
}
