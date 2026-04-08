import { useEffect, useState } from "react";
import { useRoute } from "wouter";

export default function HostDetail() {
  const [, params] = useRoute("/hosts/:id");
  const id = params?.id;

  const [host, setHost] = useState<any>(null);
  const [webinars, setWebinars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://webinx-backend.onrender.com";

  useEffect(() => {
    if (!id) return;

    // Fetch host
    fetch(`${API_BASE}/api/hosts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch webinars
    fetch(`${API_BASE}/api/hosts/${id}/webinars`)
      .then((res) => res.json())
      .then((data) => setWebinars(data))
      .catch(() => {});
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;

  if (!host || host.error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Host not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      {/* Host Info */}
      <h1 className="text-3xl font-bold mb-4">{host.name}</h1>
      <p className="text-gray-600 mb-4">Slug: {host.slug}</p>

      {host.website_url && (
        <a
          href={host.website_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          Visit Website
        </a>
      )}

      {/* Webinars Section */}
      <h2 className="text-xl font-semibold mt-10 mb-4">
        Webinars by this host
      </h2>

      {webinars.length === 0 ? (
        <p>No webinars available</p>
      ) : (
        <ul className="space-y-2">
          {webinars.map((w: any) => (
            <li key={w.id}>
              <a
                href={`/webinar/${w.slug}`}
                className="text-blue-600 underline"
              >
                {w.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
