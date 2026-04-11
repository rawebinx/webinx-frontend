import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import RelatedWebinars from "../components/RelatedWebinars";

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

  const title = `${event.title} Webinar | WebinX`;
  const url = `https://www.webinx.in/webinar/${event.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_time,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: url
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
        <h1>{event.title}</h1>

        <p>
          {new Date(event.start_time).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}
        </p>

        <a
          href={event.registration_url}
          target="_blank"
          style={{
            background: "#4f46e5",
            color: "#fff",
            padding: "12px 24px",
            display: "inline-block",
            borderRadius: "8px"
          }}
        >
          Register Now
        </a>

        <RelatedWebinars keyword={event.title.split(" ")[0]} />
      </div>
    </>
  );
}
