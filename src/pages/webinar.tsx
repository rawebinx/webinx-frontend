import { useEffect, useState } from "react";
import { useParams } from "wouter";

const API_BASE = import.meta.env.VITE_API_BASE || "https://webinx-backend.onrender.com";

export default function WebinarDetail() {
  const { slug } = useParams();

  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`${API_BASE}/api/events/${slug}`);
      const data = await res.json();
      setEvent(data);
    }

    fetchEvent();
  }, [slug]);

  if (!event) {
    return <div className="p-6">Loading...</div>;
  }

  const formattedDate = new Date(event.start_time).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  // ✅ SCHEMA (IMPORTANT)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time || event.start_time,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: event.registration_url || event.event_url,
    },
    organizer: {
      "@type": "Organization",
      name: event.host || "Webinar Organizer",
      url: event.event_url,
    },
    isAccessibleForFree: true,
    url: `https://webinx.in/webinar/${event.slug}`,
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ✅ SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />

      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

      <p className="text-gray-600 mb-2">
        📅 {formattedDate}
      </p>

      <p className="mb-4">
        {event.description || "Join this webinar to learn more."}
      </p>

      {/* ✅ CTA (VERY IMPORTANT FOR CONVERSION) */}
      <a
        href={event.registration_url || event.event_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Register Now
      </a>
    </div>
  );
}
