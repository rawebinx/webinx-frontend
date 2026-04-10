import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";

const API_BASE = "https://webinx-backend.onrender.com";

export default function WebinarDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/events`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: any) => e.slug === slug);
        setEvent(found);
      });
  }, [slug]);

  if (!event) return <div>Loading...</div>;

  // SEO CORE
  const title = `${event.title} Webinar (Free) | WebinX`;
  const description = `Join ${event.title} webinar. Learn actionable strategies, real-world applications, and expert insights. Register free on WebinX.`;
  const url = `https://www.webinx.in/webinar/${event.slug}`;
  const image = "https://www.webinx.in/og-default.jpg";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time || event.start_time,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: url,
    image: [image],
    description: description,
    organizer: {
      "@type": "Organization",
      name: "WebinX",
      url: "https://www.webinx.in"
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="event" />
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
        <h1>{event.title}</h1>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(event.start_time).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}
        </p>

        <p>{event.description}</p>

        {/* 🔥 SEO BOOST CONTENT */}

        <h2>About this webinar</h2>
        <p>
          The <strong>{event.title}</strong> webinar is designed to help you gain
          deep insights, practical knowledge, and real-world applications in this domain.
          Whether you are a beginner or experienced professional, this session will help you
          improve your understanding and stay competitive.
        </p>

        <h2>What you will learn</h2>
        <ul>
          <li>Core concepts and fundamentals</li>
          <li>Real-world use cases and applications</li>
          <li>Latest trends and industry practices</li>
          <li>Expert tips and strategies</li>
        </ul>

        <h2>Who should attend?</h2>
        <ul>
          <li>Students looking to learn new skills</li>
          <li>Professionals upgrading their knowledge</li>
          <li>Entrepreneurs and business owners</li>
        </ul>

        <h2>Why attend this webinar?</h2>
        <p>
          This webinar provides actionable insights, expert knowledge, and practical learning
          opportunities that can help you grow your career or business.
        </p>

        {/* 🔥 INTERNAL LINKING */}
        <p>
          Explore more related sessions on our{" "}
          <a href="/webinars">webinar listings page</a>.
        </p>
      </div>
    </>
  );
}
