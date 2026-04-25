// src/pages/city.tsx — WebinX SEO City Pages
// /city/mumbai, /city/delhi, /city/bangalore, etc.

import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { getCityEvents } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";
import type { WebinarEvent } from "../lib/api";

// ── City SEO metadata ─────────────────────────────────────────────
interface CityMeta {
  label: string;
  state: string;
  description: string;
  faq: Array<{ q: string; a: string }>;
}

const CITY_META: Record<string, CityMeta> = {
  mumbai: {
    label: "Mumbai",
    state: "Maharashtra",
    description: "Discover free webinars and online events for Mumbai professionals. Finance, startup, marketing & tech webinars — updated daily.",
    faq: [
      { q: "Are these webinars only for Mumbai residents?", a: "No — all webinars on WebinX are online events accessible from anywhere in India. The Mumbai page curates events most relevant to Mumbai professionals." },
      { q: "How often are new webinars added?", a: "Our pipeline adds new events daily. Bookmark this page or set an alert to stay updated." },
      { q: "Which sectors are popular in Mumbai?", a: "Finance, BFSI, startup funding, real estate, and marketing are the most-searched sectors among Mumbai professionals on WebinX." },
    ],
  },
  delhi: {
    label: "Delhi",
    state: "Delhi NCR",
    description: "Free webinars for Delhi NCR professionals. Government policy, legal, startup, and HR webinars — discover and register on WebinX.",
    faq: [
      { q: "Does WebinX list government or policy webinars?", a: "Yes — WebinX aggregates webinars across all sectors including policy, law, and public administration relevant to Delhi NCR professionals." },
      { q: "Can I find UPSC or civil services webinars here?", a: "Yes — use the search bar to find education and career development webinars." },
      { q: "Are the webinars free to attend?", a: "Most webinars listed on WebinX are free. Paid events are clearly marked." },
    ],
  },
  bangalore: {
    label: "Bangalore",
    state: "Karnataka",
    description: "Top webinars for Bangalore tech and startup professionals. AI, SaaS, product management & engineering events — updated daily on WebinX.",
    faq: [
      { q: "Which tech topics are covered?", a: "AI/ML, SaaS, product management, cloud, DevOps, and startup growth are the most popular categories among Bangalore professionals on WebinX." },
      { q: "Are there webinars for engineering managers?", a: "Yes — search for 'engineering leadership' or 'product management' to find relevant sessions." },
      { q: "How do I get notified about new webinars?", a: "Set an alert on any event page to get email reminders before it starts." },
    ],
  },
  hyderabad: {
    label: "Hyderabad",
    state: "Telangana",
    description: "Free online webinars for Hyderabad professionals. IT, pharma, BFSI & startup events — discover and register on WebinX.",
    faq: [
      { q: "Does WebinX have pharma industry webinars?", a: "Yes — WebinX covers healthcare, pharma, and life sciences webinars highly relevant to Hyderabad's industry base." },
      { q: "Are there IT sector webinars for Hyderabad professionals?", a: "Absolutely. Technology and IT & SaaS are among the most popular sectors on WebinX." },
      { q: "How many webinars are listed on WebinX?", a: "Over 500 active webinars across 10+ sectors, updated daily." },
    ],
  },
  chennai: {
    label: "Chennai",
    state: "Tamil Nadu",
    description: "Webinars for Chennai professionals in manufacturing, IT, finance & healthcare. Free online events — discover on WebinX.",
    faq: [
      { q: "Are there manufacturing or automobile sector webinars?", a: "Yes — WebinX covers engineering, manufacturing, and supply chain events relevant to Chennai's industry clusters." },
      { q: "Can I find Tamil Nadu government scheme webinars?", a: "Check the Education and HR sectors for policy and professional development webinars." },
      { q: "Is WebinX free to use?", a: "Yes — WebinX is completely free for attendees." },
    ],
  },
  pune: {
    label: "Pune",
    state: "Maharashtra",
    description: "Free webinars for Pune professionals. IT, automotive, education & startup events — find and register on WebinX.",
    faq: [
      { q: "Does WebinX cover startup events in Pune?", a: "Yes — Startup is one of the top sectors on WebinX, with events on funding, GTM strategy, and founder skills." },
      { q: "Are there IT sector webinars for Pune professionals?", a: "Yes — IT & SaaS is one of the most active categories on WebinX with daily new events." },
      { q: "How do I save a webinar to watch later?", a: "Click the heart icon on any webinar card to save it to your wishlist." },
    ],
  },
  kolkata: {
    label: "Kolkata",
    state: "West Bengal",
    description: "Online webinars for Kolkata professionals in finance, trade, education & technology. Free events updated daily on WebinX.",
    faq: [
      { q: "Are there finance and trade webinars relevant to Kolkata?", a: "Yes — Finance and BFSI are well-represented on WebinX with events on banking, investment, and trade finance." },
      { q: "Does WebinX have Bengali language webinars?", a: "Most webinars are in English and Hindi. Use search to find regional language events." },
      { q: "How do I discover new webinars?", a: "Browse by sector, use search, or check the Trending section on the WebinX homepage." },
    ],
  },
  ahmedabad: {
    label: "Ahmedabad",
    state: "Gujarat",
    description: "Webinars for Ahmedabad professionals in manufacturing, textiles, MSME & startup. Free online events — register on WebinX.",
    faq: [
      { q: "Are there MSME or manufacturing webinars on WebinX?", a: "Yes — WebinX covers entrepreneurship, manufacturing, and MSME-focused events highly relevant to Gujarat's business ecosystem." },
      { q: "Can I find GST or taxation webinars?", a: "Yes — search 'GST' or 'taxation' to find finance and compliance webinars." },
      { q: "Is WebinX free to use?", a: "Completely free for attendees. No account required to browse." },
    ],
  },
};

const DEFAULT_META: CityMeta = {
  label: "",
  state: "India",
  description: "Free online webinars for professionals. Discover and register on WebinX — updated daily.",
  faq: [
    { q: "Are these webinars free?", a: "Most webinars on WebinX are free to attend. Paid events are clearly marked." },
    { q: "How often are new webinars added?", a: "Our pipeline adds new events daily from across India." },
    { q: "How do I get reminders?", a: "Set an alert on any event page to get email reminders before it starts." },
  ],
};

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const [events, setEvents]   = useState<WebinarEvent[] | null>(null);
  const [error, setError]     = useState(false);

  const meta      = (city && CITY_META[city.toLowerCase()]) || DEFAULT_META;
  const cityLabel = meta.label || (city ? city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");
  const canonical = `https://www.webinx.in/city/${city}`;

  useEffect(() => {
    if (!city) return;
    setEvents(null);
    setError(false);
    getCityEvents(city)
      .then(setEvents)
      .catch(() => setError(true));
  }, [city]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: meta.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Free Webinars for {cityLabel} Professionals — WebinX</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`Free Webinars for ${cityLabel} Professionals — WebinX`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
            📍 {meta.state}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Free Webinars for {cityLabel} Professionals
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            {meta.description}
          </p>
        </div>

        {/* City quick-nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(CITY_META).map(([slug, m]) => (
            <a
              key={slug}
              href={`/city/${slug}`}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                city === slug
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {m.label}
            </a>
          ))}
        </div>

        {/* Events grid */}
        {error && (
          <p className="text-red-500 text-sm mb-4">Failed to load events. Please try again.</p>
        )}

        {!events && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-50 h-28" />
            ))}
          </div>
        )}

        {events && events.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No webinars found for {cityLabel}</p>
            <a href="/webinars" className="text-purple-600 hover:underline text-sm">
              Browse all webinars →
            </a>
          </div>
        )}

        {events && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <WebinarCard key={event.slug || event.id} webinar={event} />
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {meta.faq.map(({ q, a }) => (
              <div key={q} className="border border-gray-100 rounded-lg p-4">
                <p className="font-medium text-gray-800 mb-1 text-sm">{q}</p>
                <p className="text-gray-500 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-link to other cities */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Webinars by city:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CITY_META)
              .filter(([slug]) => slug !== city)
              .map(([slug, m]) => (
                <a
                  key={slug}
                  href={`/city/${slug}`}
                  className="text-xs text-purple-600 hover:underline"
                >
                  {m.label} →
                </a>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
