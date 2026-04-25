// src/pages/ai-search.tsx — WebinX AI-Powered Natural Language Search
// Claude API powered. "Find me webinars on AI for startup founders"

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

const EXAMPLES = [
  "AI webinars for startup founders",
  "Free finance and stock market workshops",
  "Digital marketing masterclass under 2 hours",
  "HR and recruitment webinars for professionals",
  "Machine learning basics for beginners",
  "Fundraising and VC pitch workshops India",
];

interface AIResult extends WebinarEvent {
  ai_reason?: string;
}

export default function AISearchPage() {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState<AIResult[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [aiUsed,   setAiUsed]   = useState(false);
  const [error,    setError]    = useState("");

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

  async function handleSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 3) return;
    setQuery(trimmed);
    setLoading(true);
    setSearched(false);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`${API}/api/search/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setAiUsed(data.ai_used ?? false);
      setSearched(true);
    } catch {
      setError("Search failed. Please try again.");
    }
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch(query);
  }

  return (
    <>
      <Helmet>
        <title>AI Webinar Search — Find Any Webinar in Plain English — WebinX</title>
        <meta
          name="description"
          content="Search India's webinars in plain English. WebinX AI Search understands what you're looking for — no keywords needed."
        />
        <link rel="canonical" href="https://www.webinx.in/ai-search" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 mb-4">
            <span>✨</span> Powered by Claude AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Find Webinars in Plain English
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Describe what you're looking for — topic, audience, format, duration. Our AI finds the best matches.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2 shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. AI tools for content creators, free marketing workshops..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || query.length < 3}
              className="text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Searching…" : "Search →"}
            </button>
          </div>
        </form>

        {/* Example queries */}
        {!searched && !loading && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-3 text-center">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); handleSearch(ex); }}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-700 transition bg-white"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-gray-500 text-sm">
              <svg className="animate-spin w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              AI is finding the best webinars for you…
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-sm py-4">{error}</p>
        )}

        {/* Results */}
        {searched && !loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                {results.length > 0
                  ? `${results.length} match${results.length !== 1 ? "es" : ""} for "${query}"`
                  : `No matches found for "${query}"`}
              </h2>
              {aiUsed && (
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">
                  ✨ AI ranked
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="mb-3">No webinars found for this query.</p>
                <a href="/webinars" className="text-purple-600 hover:underline text-sm">
                  Browse all webinars →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((event) => (
                  <div key={event.slug} className="relative">
                    {/* AI reason chip */}
                    {event.ai_reason && (
                      <div className="flex items-start gap-2 mb-2 px-1">
                        <span className="text-purple-500 text-sm mt-0.5">✨</span>
                        <p className="text-xs text-gray-500 italic">{event.ai_reason}</p>
                      </div>
                    )}
                    <WebinarCard webinar={event} />
                  </div>
                ))}
              </div>
            )}

            {/* Try another search */}
            {searched && (
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-400 mb-3">Not what you're looking for?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLES.filter((e) => !e.toLowerCase().includes(query.toLowerCase().slice(0, 6)))
                    .slice(0, 3)
                    .map((ex) => (
                      <button
                        key={ex}
                        onClick={() => { setQuery(ex); handleSearch(ex); }}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition"
                      >
                        {ex}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
