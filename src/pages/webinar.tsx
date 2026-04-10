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

  // ✅ SEO CORE
  const title = `${event.title} | Free Webinar | WebinX`;
  const description = `Join "${event.title}" webinar. Learn practical insights, real-world strategies, and expert knowledge. Register now on WebinX.`;
  const url = `https://www.webinx.in/webinar/${event.slug}`;
  const image = "https://www.webinx.in/og-default.jpg";

  // ✅ STRUCTURED DATA (GOOGLE RANKING BOOST)
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time || event.start_time,
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

      {/* CONTENT (VERY IMPORTANT FOR SEO) */}
      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
        <h1>{event.title}</h1>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(event.start_time).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}
        </p>

        <p>{event.description}</p>

        {/* SEO CONTENT BLOCK */}
        <h2>About this webinar</h2>
        <p>
          This webinar on <strong>{event.title}</strong> provides practical
          insights, real-world applications, and expert knowledge to help you stay ahead.
        </p>

        <h2>Who should attend?</h2>
        <ul>
          <li>Students</li>
          <li>Professionals</li>
          <li>Industry learners</li>
        </ul>

        {/* INTERNAL LINKING (VERY IMPORTANT) */}
        <p>
          <a href="/webinars">Browse more webinars</a>
        </p>
      </div>
    </>
  );
}
