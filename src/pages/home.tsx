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
          content="Discover top webinars in India across AI, marketing, finance, business and more. Join free webinars and learn from industry experts on WebinX."
        />
        <link rel="canonical" href="https://www.webinx.in/" />

        <meta property="og:title" content="WebinX – Discover Webinars" />
        <meta property="og:description" content="Find and join top webinars across domains." />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <meta property="og:url" content="https://www.webinx.in/" />
      </Helmet>

      {/* ================= HERO ================= */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 20% 20%, #6366f1, #4f46e5 40%, #9333ea)",
          color: "white",
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            filter: "blur(100px)",
            top: "-50px",
            left: "-50px",
          }}
        />

        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          Discover Top Webinars
        </h1>

        <p style={{ fontSize: "18px", opacity: 0.9 }}>
          Learn from experts in AI, Marketing, Business & Finance
        </p>

        <Link href="/webinars">
          <a
            style={{
              marginTop: "20px",
              display: "inline-block",
              background: "#facc15",
              color: "#000",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Explore Webinars
          </a>
        </Link>
      </div>

      {/* ================= TRUST STRIP ================= */}
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Trusted by learners across India • Growing webinar platform
      </div>

      {/* ================= MAIN ================= */}
      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px" }}>
        <h2>Latest Webinars</h2>

        {/* CATEGORY PILLS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {["AI", "Marketing", "Finance", "Business"].map((cat) => (
            <span
              key={cat}
              style={{
                padding: "6px 12px",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "#ffffff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.05)";
              }}
            >
              <h3 style={{ fontSize: "18px" }}>{event.title}</h3>

              <p style={{ fontSize: "14px", color: "#555" }}>
                {new Date(event.start_time).toLocaleDateString("en-IN")}
              </p>

              <Link href={`/webinar/${event.slug}`}>
                <a
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    color: "#4f46e5",
                    fontWeight: "bold",
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
        <h2>Discover Webinars in India</h2>
        <p>
          WebinX is a webinar discovery platform helping users find upcoming
          webinars across AI, marketing, finance, and business domains. Stay
          updated and join expert-led sessions.
        </p>

        <h2>Popular Webinar Categories</h2>
        <ul>
          <li>AI & Technology Webinars</li>
          <li>Marketing & Growth Webinars</li>
          <li>Finance & Investment Webinars</li>
          <li>Startup & Business Webinars</li>
        </ul>
      </div>
    </>
  );
}
