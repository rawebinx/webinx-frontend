import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { getHost, getHostEvents } from "../lib/api";

export default function HostDetail() {
  const params = useParams();
  const slug = params?.slug;

  const [host, setHost] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!slug || slug === "undefined") return;

    // Fetch host
    getHost(slug).then((data) => {
      setHost(data);
    });

    // Fetch events
    getHostEvents(slug).then((data) => {
      setEvents(data.events || []);
    });
  }, [slug]);

  // SEO META TAGS
  useEffect(() => {
    if (!host) return;

    document.title = `${host.name} Webinars & Events | WebinX`;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        `Explore all webinars and events hosted by ${host.name}. Discover upcoming sessions, workshops, and expert-led discussions on WebinX.`
      );
    }

    // JSON-LD Schema
    const script = document.createElement("script");
    script.type = "application/ld+json";

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: host.name,
      url: `https://webinx.in/hosts/${slug}`,
    };

    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [host, slug]);

  if (!host) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">

      {/* H1 */}
      <h1 className="text-3xl font-bold mb-2">
        {host.name} Webinars & Events
      </h1>

      {/* SEO TEXT BLOCK */}
      <p className="text-gray-600 mb-6">
        Browse all upcoming and past webinars hosted by <strong>{host.name}</strong>.
        Stay updated with expert sessions, industry insights, and professional learning opportunities.
      </p>

      {/* EVENTS LIST */}
      <div className="grid gap-4">

        {events.length === 0 && (
          <p>No events available.</p>
        )}

        {events.map((event) => (
          <a
            key={event.id}
            href={`/webinar/${event.slug}`}
            className="block border p-4 rounded hover:shadow transition"
          >
            <h2 className="text-xl font-semibold">
              {event.title}
            </h2>

            <p className="text-sm text-gray-500">
              {new Date(event.start_time).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </p>

            {/* Internal linking reinforcement */}
            <p className="text-sm mt-2 text-blue-600">
              Hosted by {host.name}
            </p>
          </a>
        ))}

      </div>
    </div>
  );
}
