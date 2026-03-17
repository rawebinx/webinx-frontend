import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function WebinarPage() {
  const [match, params] = useRoute("/webinar/:slug");
  const slug = params?.slug;

  const { data, isLoading, error } = useQuery({
    queryKey: ["webinar", slug],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/events/${slug}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      return res.json();
    },
    enabled: !!slug,
  });

  if (!match) return null;

  if (isLoading) {
    return <div className="p-6">Loading webinar...</div>;
  }

  if (error || !data) {
    return <div className="p-6">Webinar not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <p className="text-gray-600 mb-2">
        {new Date(data.start_time).toLocaleString()}
      </p>

      <p className="mb-4">{data.description}</p>

      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register Now
      </a>
    </div>
  );
}
