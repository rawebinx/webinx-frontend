import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useEffect } from "react";

export default function WebinarPage() {
  const [match, params] = useRoute("/webinar/:slug");
  const slug = params?.slug;

  // ✅ CANONICAL TAG
  useEffect(() => {
    if (!slug) return;

    const canonicalUrl = `https://www.webinx.in/webinar/${slug}`;

    let link = document.querySelector("link[rel='canonical']");

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }

    link.setAttribute("href", canonicalUrl);
  }, [slug]);

  // ✅ HANDLE NO SLUG
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
      if (!Array.isArray(data)) throw new Error("Invalid API response");

      // ✅ STRICT MATCH ONLY (SEO SAFE)
      const found = data.find(
        (e: any) => e.slug?.toLowerCase().trim() === slug.toLowerCase().trim()
      );

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

      {/* ✅ SEO META */}
      <Helmet>
        <title>{data.title} Webinar | WebinX</title>

        <meta
          name="description"
          content={
            data.description ||
            `${data.title} webinar. Join now to learn key insights.`
          }
        />

        {/* ✅ STRUCTURED DATA */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: data.title,
            startDate: data.start_time,
            eventAttendanceMode:
              "https://schema.org/OnlineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: {
              "@type": "VirtualLocation",
              url: data.event_url || "https://webinx.in",
            },
            organizer: {
              "@type": "Organization",
              name: "WebinX",
              url: "https://webinx.in",
            },
          })}
        </script>
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <p className="text-gray-600 mb-2">
        {new Date(data.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      <p className="mb-4">
        {data.description ||
          `${data.title} — Join this webinar to learn key insights and practical knowledge.`}
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

      {/* ✅ SEO CONTENT */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">About this webinar</h2>
        <p>
          This webinar covers {data.title}. It is designed to provide practical
          insights and real-world applications.
        </p>

        <h3 className="text-lg font-semibold mt-4">Who should attend?</h3>
        <ul className="list-disc ml-6">
          <li>Students</li>
          <li>Professionals</li>
          <li>Anyone interested in this topic</li>
        </ul>
      </div>
    </div>
  );
}
