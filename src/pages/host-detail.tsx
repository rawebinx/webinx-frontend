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

        const eventsData = await getHostEvents(slug);
        console.log("EVENTS API:", eventsData);

        setEvents(eventsData.events || []);
      } catch (err) {
        console.error("Error loading host:", err);
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
      <h1 className="text-3xl font-bold">{host?.name}</h1>
      <p className="text-gray-500">Slug: {host?.slug}</p>

      <h2 className="mt-6 text-xl font-semibold">
        Webinars by this host
      </h2>

      {events.length === 0 ? (
        <p>No webinars available</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {events.map((e, i) => (
            <li key={i} className="border p-3 rounded">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(e.start_time).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
