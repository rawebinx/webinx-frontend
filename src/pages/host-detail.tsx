import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { getHost, getHostEvents } from "../lib/api";

export default function HostDetail() {
  const { slug } = useParams();

  const [host, setHost] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        const hostData = await getHost(slug);
        setHost(hostData);

        const eventData = await getHostEvents(slug);

        console.log("EVENT API RESPONSE:", eventData);

        // ✅ STRICT SAFE PARSE
        if (
          eventData &&
          typeof eventData === "object" &&
          Array.isArray(eventData.events)
        ) {
          setEvents(eventData.events);
        } else {
          console.error("Invalid events structure:", eventData);
          setEvents([]);
        }
      } catch (err) {
        console.error("Host detail error:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{host?.name || "Host"}</h1>
      <p className="text-gray-500">Slug: {host?.slug}</p>

      <h2 className="mt-6 text-xl font-semibold">
        Webinars by this host
      </h2>

      {/* DEBUG LINE (remove later) */}
      <p style={{ color: "red", fontSize: "12px" }}>
        DEBUG: {events.length} events loaded
      </p>

      {events.length === 0 ? (
        <p>No webinars available</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {events.map((e, i) => (
            <li key={i} className="border p-3 rounded">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-500">
                {e.start_time
                  ? new Date(e.start_time).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                  : "No date"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
