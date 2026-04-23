import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { getEventBySlug, getRelatedEvents } from "../lib/api";
import type { WebinarEvent } from "../lib/api";

export default function WebinarPage() {
  const [match, params] = useRoute("/webinar/:slug");

  const slug = params?.slug || "";

  const [event, setEvent] = useState<WebinarEvent | null>(null);
  const [related, setRelated] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // 🔥 SLUG FIX (handles corrupted DB slugs)
    const cleanSlug = slug.replace(/￾/g, "-");

    const data = await getEventBySlug(cleanSlug);

    if (data) {
      setEvent(data);

      const rel = await getRelatedEvents(
        data.slug,
        data.sector_slug,
        4
      );
      setRelated(rel || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (slug) load();
  }, [slug]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!event)
    return (
      <div className="p-6 text-red-600">
        Webinar not found
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {event.title}
      </h1>

      <p className="mb-4">{event.description}</p>

      
        href={event.url}
        target="_blank"
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Register
      </a>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Related Webinars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((e) => (
              <a key={e.id} href={`/webinar/${e.slug}`}>
                <div className="border p-3 rounded">
                  {e.title}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}