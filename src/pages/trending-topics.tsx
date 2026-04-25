// src/pages/trending-topics.tsx — WebinX Trending Topics
// Public demand signals page. SEO-friendly, linkable.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

interface Topic {
  topic: string;
  demand_count: number;
  sector_slug: string;
  type: "requested" | "trending";
  score?: number;
}

const SECTOR_EMOJI: Record<string, string> = {
  ai: "🤖", finance: "💰", marketing: "📢", startup: "🚀",
  technology: "💻", hr: "👥", healthcare: "🏥", education: "📚",
};

const MONTH = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

export default function TrendingTopicsPage() {
  const [topics,  setTopics]  = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [email,   setEmail]   = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [submitted,   setSubmitted]   = useState(false);

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

  useEffect(() => {
    fetch(`${API}/api/trending-topics`)
      .then((r) => r.json())
      .then((data) => { setTopics(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleTopicRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !customTopic) return;
    try {
      await fetch(`${API}/api/wishlist/topic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topic_query: customTopic }),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); }
  }

  const requested = topics.filter((t) => t.type === "requested");
  const trending  = topics.filter((t) => t.type === "trending");

  return (
    <>
      <Helmet>
        <title>Trending Webinar Topics in India — {MONTH} — WebinX</title>
        <meta
          name="description"
          content={`Most demanded webinar topics in India for ${MONTH}. See what professionals are searching for and request a topic on WebinX.`}
        />
        <link rel="canonical" href="https://www.webinx.in/trending-topics" />
        <meta property="og:title" content={`Trending Webinar Topics — ${MONTH} — WebinX`} />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-3xl mb-3">📈</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Trending Webinar Topics
          </h1>
          <p className="text-gray-500 text-sm mt-1">{MONTH} · What India's professionals want to learn</p>
        </div>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-50 border animate-pulse" />
            ))}
          </div>
        )}

        {/* Requested topics — with demand count */}
        {!loading && requested.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-gray-900">🔥 Most Requested</h2>
              <span className="text-xs text-gray-400">People actively asked for these</span>
            </div>
            <div className="space-y-2">
              {requested.map((t, i) => (
                <a
                  key={t.topic}
                  href={`/webinars?q=${encodeURIComponent(t.topic)}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50 transition group"
                >
                  <span className="text-lg w-7 text-center">
                    {SECTOR_EMOJI[t.sector_slug] || "🎯"}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-800 group-hover:text-purple-700 transition">
                    {t.topic}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                    {t.demand_count} want this
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-purple-500">Search →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Trending tags — from event views */}
        {!loading && trending.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-gray-900">📊 Also Trending</h2>
              <span className="text-xs text-gray-400">Based on views and saves</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <a
                  key={t.topic}
                  href={`/webinars?q=${encodeURIComponent(t.topic)}`}
                  className="text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 transition"
                >
                  {t.topic}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* No data state */}
        {!loading && topics.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="mb-3">Topics are building up as users search and save webinars.</p>
            <a href="/webinars" className="text-purple-600 hover:underline text-sm">Browse all webinars →</a>
          </div>
        )}

        {/* Request a topic */}
        <div className="border border-purple-100 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-white">
          <h2 className="font-semibold text-gray-900 mb-1">📌 Don't see your topic?</h2>
          <p className="text-sm text-gray-500 mb-4">
            Request a topic — we'll alert hosts about the demand and email you when a matching webinar is posted.
          </p>
          {submitted ? (
            <p className="text-sm text-green-700 font-medium">
              ✓ Requested! We'll notify you when a matching webinar is posted.
            </p>
          ) : (
            <form onSubmit={handleTopicRequest} className="space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Python for Finance Professionals"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  required
                  maxLength={120}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                />
                <button
                  type="submit"
                  className="text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
                >
                  Request →
                </button>
              </div>
            </form>
          )}
        </div>

        {/* For hosts CTA */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Are you a host? See what topics people want and plan your next webinar.</p>
          <a href="/top-hosts" className="text-sm text-purple-600 hover:underline font-medium">
            View Host Leaderboard →
          </a>
        </div>
      </div>
    </>
  );
}
