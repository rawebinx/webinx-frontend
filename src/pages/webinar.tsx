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

  if (!event) return <div>Loading...</div>;

  const title = `${event.title} | Free Webinar | WebinX`;
  const description = `Join "${event.title}" webinar. Discover insights, learn from experts, and grow your skills. Register now on WebinX.`;
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
      name: "WebinX",
      url: "https://www.webinx.in"
    }
  };

  return (
    <>
      <Helmet>
        {/* TITLE */}
        <title>{title}</title>

        {/* META */}
        <meta name="description" content={description} />

        {/* CANONICAL */}
        <link rel="canonical" href={url} />

        {/* OPEN GRAPH */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="event" />
        <meta property="og:image" content={image} />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* SCHEMA */}
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      {/* UI */}
      <div style={{ padding: "20px" }}>
        <h1>{event.title}</h1>
        <p><strong>Date:</strong> {new Date(event.start_time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
    </>
  );
}
