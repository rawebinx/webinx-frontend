import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data.slice(0, 6)));
  }, []);

  return (
    <>
      <Helmet>
        <title>WebinX – Discover Webinars in India (Free & Paid)</title>
        <meta
          name="description"
          content="Discover upcoming webinars in India across AI, Marketing, Finance, Business and more. Join free webinars and learn from experts on WebinX."
        />
        <link rel="canonical" href="https://www.webinx.in/" />
      </Helmet>

      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center"
        }}
      >
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
              fontWeight: "bold"
            }}
          >
            Explore Webinars
          </a>
        </Link>
      </div>

      {/* LATEST WEBINARS */}
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
        <h2>Latest Webinars</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px"
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #e5e7eb",
                padding: "15px",
                borderRadius: "10px"
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
                    fontWeight: "bold"
                  }}
                >
                  View Details →
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* SEO CONTENT BLOCK */}
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <h2>Why WebinX?</h2>
        <p>
          WebinX helps you discover the best webinars in India across multiple
          domains including AI, marketing, finance, and business. Stay updated
          with upcoming events and learn from industry experts.
        </p>

        <h2>Popular Categories</h2>
        <ul>
          <li>AI & Technology Webinars</li>
          <li>Marketing Webinars</li>
          <li>Finance & Investment Webinars</li>
          <li>Business & Startup Webinars</li>
        </ul>
      </div>
    </>
  );
}
