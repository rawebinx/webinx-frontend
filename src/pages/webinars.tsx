import { useEffect, useState } from "react";
import { getEvents } from "@/lib/api";
import { WebinarCard, type Webinar } from "@/components/webinar-card";

export default function WebinarsPage() {
  const [events, setEvents] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // FETCH EVENTS
  // =========================
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await getEvents();

        console.log("Fetched events:", data);

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load webinars");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // =========================
  // UI STATES
  // =========================

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-muted-foreground">
          Loading webinars...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-muted-foreground">
          No webinars found
        </p>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">All Webinars</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <WebinarCard
            key={event.id || event.slug || index}
            webinar={event}
          />
        ))}
      </div>
    </div>
  );
}
