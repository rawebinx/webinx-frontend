import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet";

export default function WebinarDetailPage() {
  const [match, params] = useRoute("/webinar/:slug");
  const slug = params?.slug;

  const [canonical, setCanonical] = useState("");

  useEffect(() => {
    if (!slug) return;
    const url = `https://www.webinx.in/webinar/${slug}`;
    setCanonical(url);

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }, [slug]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const res = await fetch("https://webinx-backend.onrender.com/api/events");
      const list = await res.json();

      if (!Array.isArray(list)) throw new Error("Invalid API");

      const found = list.find(
        (e: any) =>
          e.slug?.toLowerCase().trim() === slug?.toLowerCase().trim()
      );

      if (!found) throw new Error("Not found");

      return found;
    },
    enabled: !!slug,
  });

  if (!slug) return null;

  if (isLoading) {
    return <div className="p-6">Loading webinar...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Webinar not found</h1>
        <p>This webinar may have expired or removed.</p>
      </div>
    );
  }

  const title = `${data.title} | WebinX`;
  const description =
    data.description ||
    `${data.title} webinar. Join now to learn key insights.`;

  return (
    <main className="max-w-4xl mx-auto p-6">

      {/* ✅ SEO */}
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />

        <link rel="canonical" href={canonical} />

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
              url: data.url || "https://webinx.in",
            },
            organizer: {
              "@type": "Organization",
              name: data.host || "WebinX",
              url: "https://webinx.in",
            },
          })}
        </script>
      </Helmet>

      {/* ✅ H1 */}
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      {/* ✅ DATE */}
      <p className="text-gray-600 mb-2">
        {new Date(data.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      {/* ✅ DESCRIPTION */}
      <p className="mb-6">{description}</p>

      {/* ✅ CTA */}
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

      {/* ✅ INTERNAL LINKING */}
      <div className="mt-10">
        <Link href="/webinars">
          <span className="text-blue-600 underline cursor-pointer">
            Browse more webinars
          </span>
        </Link>
      </div>

      {/* ✅ SEO CONTENT */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">About this webinar</h2>
        <p>
          This webinar on <strong>{data.title}</strong> provides practical
          insights, real-world applications, and expert knowledge to help you
          stay ahead.
        </p>

        <h3 className="text-lg font-semibold">Who should attend?</h3>
        <ul className="list-disc ml-6">
          <li>Students</li>
          <li>Professionals</li>
          <li>Industry learners</li>
        </ul>
      </div>
    </main>
  );
}
