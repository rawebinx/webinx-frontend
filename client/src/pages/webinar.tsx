import { useEffect, useState } from "react";
import { useParams } from "wouter";

export default function WebinarPage() {

  const { slug } = useParams();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadEvent() {
      try {

        const res = await fetch(
          `https://webinx-backend.onrender.com/api/events/${slug}`
        );

        const data = await res.json();

        setEvent(data);

      } catch (err) {

        console.error("Failed to load event", err);

      } finally {

        setLoading(false);

      }
    }

    if (slug) {
      loadEvent();
    }

  }, [slug]);

  if (loading) {
    return <div className="p-10">Loading webinar...</div>;
  }

  if (!event) {
    return <div className="p-10">Webinar not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">
        {event.title}
      </h1>

      <p className="text-gray-600 mb-4">
        {event.start_time}
      </p>

      <p className="mb-6">
        {event.description}
      </p>

      <a
        href={event.registration_url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Register for Webinar
      </a>

    </div>
  );
}
