import { useEffect, useState } from "react";

const API_BASE = "https://webinx-backend.onrender.com";

export default function HostDetail() {
  // ✅ SAFE SLUG EXTRACTION (NO WOUTER DEPENDENCY)
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

        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        } else {
          setEvents([]);
        }

      } catch (err) {
        console.error("API error", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // ✅ ALWAYS RENDER SOMETHING
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (!host) return <div style={{ padding: 20 }}>No data</div>;

  const now = new Date();

  const enhancedEvents = events.map((e) => ({
    ...e,
    isUpcoming: e?.start_time ? new Date(e.start_time) > now : false,
    formattedDate: e?.start_time
      ? new Date(e.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      : "Date TBD",
  }));

  const upcoming = enhancedEvents
    .filter((e) => e.isUpcoming)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const past = enhancedEvents
    .filter((e) => !e.isUpcoming)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // ✅ SEO + SCHEMA
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

    // JSON-LD
    const scriptId = "host-schema";
    let script = document.getElementById(scriptId);

    if (script) script.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: host.name,
      url: `https://webinx.in/hosts/${slug}`,
    };

    const newScript = document.createElement("script");
    newScript.id = scriptId;
    newScript.type = "application/ld+json";
    newScript.innerHTML = JSON.stringify(schema);

    document.head.appendChild(newScript);

  }, [host, upcoming, slug]);

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
