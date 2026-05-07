// src/pages/skill.tsx — /skill/:skill
// Programmatic SEO page for each learnable skill.
// Distinct from /topic/ — skill pages emphasise learning outcome & career angle.

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

function SkeletonCard(): JSX.Element {
  return (
    <div className="border rounded-2xl animate-pulse bg-gray-50" style={{ height: 300 }}>
      <div className="h-36 bg-gray-200 rounded-t-2xl mb-4" />
      <div className="px-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

const SKILL_DESCRIPTIONS: Record<string, string> = {
  python:             "Learn Python through live webinars, workshops and bootcamps led by Indian developers and data scientists.",
  "machine learning": "Hands-on ML webinars — from regression basics to deep learning, taught by practitioners.",
  "data science":     "Data science webinars covering SQL, Python, statistics, and real-world case studies.",
  excel:              "Excel and spreadsheet skills webinars for finance, HR, and business professionals in India.",
  marketing:          "Digital marketing webinars covering SEO, ads, social media, and growth for Indian businesses.",
  finance:            "Finance and investing webinars — personal finance, stock markets, and financial modelling.",
  leadership:         "Leadership development webinars for managers, founders, and aspiring leaders.",
  "product management": "Product management workshops covering roadmaps, discovery, metrics, and stakeholder management.",
};

export default function SkillPage(): JSX.Element {
  const [, params]  = useRoute("/skill/:skill");
  const rawSkill    = params?.skill ?? "";
  const skill       = decodeURIComponent(rawSkill).replace(/-/g, " ");
  const displayName = skill.replace(/\b\w/g, (c) => c.toUpperCase());

  const [events, setEvents] = useState<WebinarEvent[] | null>(null);
  const [error,  setError]  = useState(false);
  const [counts, setCounts] = useState({ total: 0, upcoming: 0, beginner: 0 });

  useEffect(() => {
    if (!skill) return;
    setEvents(null);
    setError(false);

    // Skill pages reuse the same topic API endpoint — both query skills[]
    apiFetch<WebinarEvent[]>(`/api/skill/${encodeURIComponent(rawSkill)}`)
      .then((data) => {
        setEvents(data);
        setCounts({
          total:    data.length,
          upcoming: data.filter((e) => e.start_time && new Date(e.start_time) > new Date()).length,
          beginner: data.filter((e) => e.difficulty === "beginner").length,
        });
      })
      .catch(() => setError(true));
  }, [skill, rawSkill]);

  const customDesc = SKILL_DESCRIPTIONS[skill.toLowerCase()];
  const title = `Learn ${displayName} — Free Webinars & Workshops in India | WebinX`;
  const desc  = customDesc
    ?? `Free ${displayName} webinars and online learning events in India. Live sessions, workshops, and masterclasses — updated daily on WebinX.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://www.webinx.in/skill/${rawSkill}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://www.webinx.in/skill/${rawSkill}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationEvent",
          "name": `${displayName} Learning Events`,
          "description": desc,
          "url": `https://www.webinx.in/skill/${rawSkill}`,
        })}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-[#0D4F6B] transition">Home</a>
          <span>›</span>
          <span>Skills</span>
          <span>›</span>
          <span className="text-gray-600">{displayName}</span>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#E1F5EE] text-[#0D4F6B] text-xs font-semibold px-3 py-1 rounded-full mb-3">
            🎓 Skill Track
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Learn {displayName}
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">{desc}</p>

          {/* Stats */}
          {counts.total > 0 && (
            <div className="flex gap-5 mt-4 flex-wrap">
              {[
                { label: "Sessions",         value: counts.total },
                { label: "Upcoming",         value: counts.upcoming },
                { label: "Beginner-friendly", value: counts.beginner },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-sm">
                  <span className="font-bold text-[#0D4F6B]">{s.value}</span>
                  <span className="text-gray-400">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Failed to load events.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[#0D4F6B] border border-[#0D4F6B] px-4 py-2 rounded-lg hover:bg-[#E1F5EE] transition"
            >
              Retry
            </button>
          </div>
        )}

        {!events && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {events && events.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <div className="text-4xl mb-3">🎓</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              No {displayName} sessions yet
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Our AI tags new events every 30 minutes. Check back soon.
            </p>
            <a
              href="/webinars"
              className="inline-block bg-[#0D4F6B] hover:bg-[#1A6B8A] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              Browse all events →
            </a>
          </div>
        )}

        {events && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {events.map((e) => (
                <WebinarCard key={e.id ?? e.slug} event={e} />
              ))}
            </div>

            {/* Difficulty filter note */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {(["beginner", "intermediate", "advanced"] as const).map((d) => {
                const n = events.filter((e) => e.difficulty === d).length;
                if (!n) return null;
                return (
                  <span key={d} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                    {d}: {n} session{n > 1 ? "s" : ""}
                  </span>
                );
              })}
            </div>
          </>
        )}

        {/* Related skills */}
        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Related skills</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Python", "Excel", "SQL", "Machine Learning",
              "Data Analysis", "Leadership", "Marketing", "Finance",
              "Product Management", "UX Design", "Public Speaking", "Negotiation",
            ]
              .filter((s) => s.toLowerCase() !== skill.toLowerCase())
              .slice(0, 8)
              .map((s) => (
                <a
                  key={s}
                  href={`/skill/${s.toLowerCase().replace(/ /g, "-")}`}
                  className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-full text-gray-600 hover:border-[#0D4F6B] hover:text-[#0D4F6B] transition"
                >
                  {s}
                </a>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
