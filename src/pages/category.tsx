import { useEffect, useState } from "react";
import { getEvents } from "../lib/api";

export default function Category() {
  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    getEvents("ai").then(setEvents);
  }, []);

  if (!events) return <div>Loading...</div>;

  if (events.length === 0) {
    return <div>No webinars found</div>;
  }

  return (
    <div>
      <h1>AI Webinars in India</h1>

      {events.map((event) => (
        <div key={event.slug}>
          <h3>{event.title}</h3>
          <p>{new Date(event.start_time).toLocaleString()}</p>

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
