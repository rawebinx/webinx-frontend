import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

export default function WebinarPage() {
  const params = useParams();
  const slug = params?.slug;

  if (!slug) {
    return <div className="p-6">Invalid webinar link</div>;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["webinar", slug],
    queryFn: async () => {
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL ||
        "https://webinx-backend.onrender.com";

      const res = await fetch(`${API_BASE}/api/events/${slug}`);

      if (!res.ok) throw new Error("Failed to fetch");

      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="p-6">Loading webinar...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading webinar</div>;
  }

  if (!data) {
    return <div className="p-6">Webinar not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <p className="text-gray-600 mb-2">
        {new Date(data.start_time).toLocaleString()}
      </p>

      <p className="mb-4">
        {data.description || "No description available"}
      </p>

      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register Now
        </a>
      )}
    </div>
  );
}
