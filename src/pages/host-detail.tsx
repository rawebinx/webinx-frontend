import { useEffect, useState } from "react";
import { useParams } from "wouter";

const API_BASE = "https://webinx-backend.onrender.com";

export default function HostDetail() {
  const { slug } = useParams();

  const [host, setHost] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const hostRes = await fetch(`${API_BASE}/api/hosts/${slug}`);
        const hostData = await hostRes.json();

        const eventsRes = await fetch(`${API_BASE}/api/hosts/${slug}/events`);
        const eventsData = await eventsRes.json();

        setHost(hostData || {});
        setEvents(eventsData || []);
      } catch (err) {
        console.error("API error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!host) return <div>Host not found</div>;

  const now = new Date();

  const enhancedEvents = events.map((e) => ({
    ...e,
    isUpcoming: new Date(e.start_time) > now,
    formattedDate: new Date(e.start_time).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }),
  }));

  const upcoming = enhancedEvents
    .filter((e) => e.isUpcoming)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const past = enhancedEvents
    .filter((e) => !e.isUpcoming)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // SEO
  useEffect(() => {
    const title = `${host.name} Webinars | WebinX`;
    const description = `Explore ${host.name} webinars on WebinX. ${upcoming.length} upcoming sessions available.`;

    document.title = title;

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [host, upcoming]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      
      {/* HEADER */}
      <h1>{host.name} Webinars</h1>
      <p>{events.length} total webinars hosted</p>

      {/* UPCOMING */}
      <h2>Upcoming Webinars</h2>
      {upcoming.length === 0 && <p>No upcoming webinars</p>}

      {upcoming.map((event) => (
        <div key={event.id} style={{ marginBottom: "20px" }}>
          <a href={`/webinar/${event.slug}`}>
            <h3>{event.title}</h3>
          </a>
          <p>{event.formattedDate}</p>
        </div>
      ))}

      {/* PAST */}
      {past.length > 0 && (
        <>
          <h2>Past Webinars</h2>
          {past.slice(0, 10).map((event) => (
            <div key={event.id} style={{ marginBottom: "20px" }}>
              <a href={`/webinar/${event.slug}`}>
                <h3>{event.title}</h3>
              </a>
              <p>{event.formattedDate}</p>
            </div>
          ))}
        </>
      )}

      {/* CTA */}
      <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>Become a Webinar Host</h2>
        <p>List your webinars and reach thousands of professionals.</p>
        <a href="/">Get Started</a>
      </div>

      {/* INTERNAL LINKS */}
      <div style={{ marginTop: "40px" }}>
        <h2>Explore More Webinars</h2>
        <a href="/browse">Browse All</a>
      </div>

    </div>
  );
}
