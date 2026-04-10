import { useEffect, useState } from "react";

const API_BASE = "https://webinx-backend.onrender.com";

export default function HostDetail() {
  const slug = window.location.pathname.split("/hosts/")[1];

  const [host, setHost] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid host URL");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const hostRes = await fetch(`${API_BASE}/api/hosts/${slug}`);
        const hostData = await hostRes.json();

        const eventsRes = await fetch(`${API_BASE}/api/hosts/${slug}/events`);
        const eventsData = await eventsRes.json();

        if (!hostData || !hostData.name) {
          setError("Host not found");
          return;
        }

        setHost(hostData);
        setEvents(Array.isArray(eventsData) ? eventsData : []);

      } catch (err) {
        console.error("API error", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (!host) return <div style={{ padding: 20 }}>No data</div>;

  const now = new Date();

  // ✅ SAFE DATE PARSER
  const safeDate = (dateStr: any) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const enhancedEvents = events.map((e) => {
    const parsedDate = safeDate(e?.start_time);

    return {
      ...e,
      parsedDate,
      isUpcoming: parsedDate ? parsedDate > now : false,
      formattedDate: parsedDate
        ? parsedDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        : "Date TBD",
    };
  });

  // ✅ SAFE SORT (NO CRASH POSSIBLE)
  const upcoming = enhancedEvents
    .filter((e) => e.isUpcoming && e.parsedDate)
    .sort((a, b) => (a.parsedDate!.getTime() - b.parsedDate!.getTime()));

  const past = enhancedEvents
    .filter((e) => !e.isUpcoming && e.parsedDate)
    .sort((a, b) => (b.parsedDate!.getTime() - a.parsedDate!.getTime()));

  // SEO
  useEffect(() => {
    if (!host?.name) return;

    document.title = `${host.name} Webinars | WebinX`;

    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      "content",
      `Explore ${host.name} webinars on WebinX. ${upcoming.length} upcoming sessions available.`
    );
  }, [host, upcoming]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      
      {/* HEADER */}
      <h1>{host.name} Webinars</h1>
      <p>{events.length} webinars hosted</p>

      {/* UPCOMING */}
      <h2>Upcoming Webinars</h2>
      {upcoming.length === 0 && <p>No upcoming webinars</p>}

      {upcoming.map((event) => (
        <div key={event.id || event.slug} style={{ marginBottom: "20px" }}>
          <a href={`/webinar/${event.slug}`}>
            <h3>{event.title || "Untitled Webinar"}</h3>
          </a>
          <p>{event.formattedDate}</p>
        </div>
      ))}

      {/* PAST */}
      {past.length > 0 && (
        <>
          <h2>Past Webinars</h2>
          {past.slice(0, 10).map((event) => (
            <div key={event.id || event.slug} style={{ marginBottom: "20px" }}>
              <a href={`/webinar/${event.slug}`}>
                <h3>{event.title || "Untitled Webinar"}</h3>
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
        <a href="/browse">Browse All Webinars</a>
      </div>

    </div>
  );
}
