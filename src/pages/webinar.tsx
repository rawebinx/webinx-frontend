import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function WebinarDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/events`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: any) => e.slug === slug);
        setEvent(found);
      });
  }, [slug]);

  if (!event) return <div style={{ padding: "40px" }}>Loading...</div>;

  const title = `${event.title} Webinar (Free) | WebinX`;
  const description = `Join ${event.title} webinar. Learn practical insights and expert strategies. Register free on WebinX.`;
  const url = `https://www.webinx.in/webinar/${event.slug}`;
  const image = "https://www.webinx.in/og-default.jpg";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_time,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: url,
    image: [image],
    description: description,
    organizer: {
      "@type": "Organization",
      name: "WebinX"
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          {event.title}
        </h1>

        <p style={{ fontSize: "18px", opacity: 0.9 }}>
          {new Date(event.start_time).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}
        </p>

        <a
          href={event.registration_url || "#"}
          target="_blank"
          style={{
            display: "inline-block",
            marginTop: "20px",
            background: "#facc15",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none"
          }}
        >
          Register Now
        </a>
      </div>

      {/* CONTENT SECTION */}
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          {event.description}
        </p>

        <h2>About this webinar</h2>
        <p>
          The <strong>{event.title}</strong> webinar is designed to help you
          gain real-world knowledge, practical insights, and industry-relevant
          strategies.
        </p>

        <h2>What you will learn</h2>
        <ul>
          <li>Latest trends and techniques</li>
          <li>Real-world applications</li>
          <li>Expert strategies</li>
          <li>Hands-on insights</li>
        </ul>

        <h2>Who should attend?</h2>
        <ul>
          <li>Students</li>
          <li>Professionals</li>
          <li>Entrepreneurs</li>
        </ul>

        {/* CTA */}
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f3f4f6",
            borderRadius: "10px",
            textAlign: "center"
          }}
        >
          <h3>Don’t miss this webinar</h3>
          <a
            href={event.registration_url || "#"}
            target="_blank"
            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#4f46e5",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none"
            }}
          >
            Register Now
          </a>
        </div>

        {/* INTERNAL LINK */}
        <p style={{ marginTop: "20px" }}>
          Explore more webinars on{" "}
          <a href="/webinars">WebinX</a>
        </p>
      </div>
    </>
  );
}
