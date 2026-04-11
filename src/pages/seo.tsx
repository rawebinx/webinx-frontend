import { useEffect, useState } from "react";
import { getEvents } from "../lib/api";

export default function SeoPage() {
  const [events, setEvents] = useState<any[] | null>(null);

  const path = window.location.pathname;

  // extract sector from URL
  const slug = path.replace("/", "");
  const sector = slug.replace("-webinars-india", ""); // ai-webinars-india → ai

  useEffect(() => {
  if (sector) {
    getEvents(sector).then(setEvents);
  }
}, [sector]);

  if (!events) return <div>Loading...</div>;

  if (events.length === 0) {
    return <div>No webinars found</div>;
  }

  return (
    <div>
      <h1>{sector.toUpperCase()} Webinars in India</h1>

      {events.map((event) => (
        <div key={event.slug}>
          <h3>{event.title}</h3>
          <p>
              {event.start_time
                ? new Date(event.start_time).toLocaleString()
                : "Date not available"}
            </p>

          {event.registration_url ? (
            <a href={event.registration_url} target="_blank">
              Register Now
            </a>
          ) : (
            <span>Registration not available</span>
          )}
        </div>
      ))}
    </div>
  );
}
