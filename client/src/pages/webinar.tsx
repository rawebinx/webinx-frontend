import { useEffect, useState } from "react";
import { useParams } from "wouter";

export default function WebinarPage() {

  const params = useParams();
  const slug = params?.slug;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchEvent() {

      try {

        const res = await fetch(
          `https://webinx-backend.onrender.com/api/events/${slug}`
        );

        const data = await res.json();

        setEvent(data);

      } catch (error) {

        console.error("Error loading webinar", error);

      } finally {

        setLoading(false);

      }

    }

    if (slug) fetchEvent();

  }, [slug]);

  if (loading) {
    return <div style={{padding:40}}>Loading webinar...</div>;
  }

  if (!event) {
    return <div style={{padding:40}}>Webinar not found.</div>;
  }

  return (
    <div style={{maxWidth:800, margin:"40px auto", padding:"20px"}}>

      <h1>{event.title}</h1>

      <p>{event.start_time}</p>

      <p>{event.description}</p>

      <a
        href={event.registration_url}
        target="_blank"
        rel="noreferrer"
      >
        Register for Webinar
      </a>

    </div>
  );
}
