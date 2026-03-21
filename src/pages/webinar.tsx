import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";

export default function WebinarPage() {
  const [match, params] = useRoute("/webinar/:slug");
  const slug = params?.slug;

// ✅ Handle /webinar (no slug)
if (!slug) {
  return (
    <div className="p-6">
      <h1>Browse Webinars</h1>
      <p>Please select a webinar from homepage.</p>
    </div>
  );
}

  const { data, isLoading, error } = useQuery({
    queryKey: ["webinar", slug],
    queryFn: async () => {
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL ||
        "https://webinx-backend.onrender.com";

  const res = await fetch(`${API_BASE}/api/events`);

  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();

if (!Array.isArray(data)) {
  throw new Error("Invalid API response");
}
  const found = data.find((e: any) => {
    const cleanSlug = e.slug?.toLowerCase().trim();
    const urlSlug = slug?.toLowerCase().trim();

    return cleanSlug === urlSlug || cleanSlug?.includes(urlSlug);
});

  if (!found) throw new Error("Webinar not found");

  return found;
},
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="p-6">Loading webinar...</div>;
  }

 if (error || !data) {
  console.error(error);
  return (
    <div className="p-6">
      <h1>Webinar not found</h1>
      <p>This webinar may have expired or removed.</p>
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* ✅ SEO TITLE + META + SCHEMA */}
      <Helmet>
        <title>{data.title} Webinar | WebinX</title>

        <meta
          name="description"
          content={
            data.description ||
            `${data.title} webinar. Join now to learn key insights.`
          }
        />

        {/* ✅ SCHEMA (VERY IMPORTANT FOR GOOGLE) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": data.title,
            "startDate": data.start_time,
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "VirtualLocation",
              "url": data.event_url || "https://webinx.in"
            },
            "organizer": {
              "@type": "Organization",
              "name": "WebinX",
              "url": "https://webinx.in"
            }
          })}
        </script>
      </Helmet>

     <h1 className="text-2xl font-bold mb-4">{data?.title || "Webinar"}</h1>

      <p className="text-gray-600 mb-2">
        {new Date(data.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      <p className="mb-4">
        {data.description ||
          `${data.title} — Join this webinar to learn key insights and practical knowledge from industry experts.`}
      </p>

      {data.event_url && (
        <a
          href={data.event_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register Now
        </a>
      )}

      {/* ✅ SIMPLE SEO CONTENT BLOCK */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">About this webinar</h2>
        <p>
          This webinar covers {data.title}. It is designed to help you understand
          key concepts and practical applications in this field.
        </p>

        <h3 className="text-lg font-semibold mt-4">Who should attend?</h3>
        <ul className="list-disc ml-6">
          <li>Students</li>
          <li>Working professionals</li>
          <li>Anyone interested in this topic</li>
        </ul>
      </div>

    </div>
  );
}
