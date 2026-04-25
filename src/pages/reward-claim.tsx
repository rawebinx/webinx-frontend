// src/pages/reward-claim.tsx — Mention WebinX Reward Claim
// Hosts submit proof of mentioning WebinX → auto-earn Featured listing.

import { useState } from "react";
import { Helmet } from "react-helmet-async";

const MENTION_TYPES = [
  {
    value:   "verbal",
    label:   "Mentioned WebinX verbally during webinar",
    reward:  "7-day Featured listing",
    tier:    "Bronze",
    color:   "#92400e",
    bg:      "#fef3c7",
    icon:    "🎙️",
  },
  {
    value:   "screen",
    label:   "Showed WebinX URL on screen / slide",
    reward:  "30-day Featured + Priority placement",
    tier:    "Silver",
    color:   "#374151",
    bg:      "#f3f4f6",
    icon:    "🖥️",
  },
  {
    value:   "link",
    label:   "Shared my WebinX profile link with attendees",
    reward:  "30-day Featured + Analytics access",
    tier:    "Gold",
    color:   "#78350f",
    bg:      "#fef9c3",
    icon:    "🔗",
  },
  {
    value:   "embed",
    label:   "Embedded WebinX widget on my website",
    reward:  "90-day Featured + Revenue share",
    tier:    "Platinum",
    color:   "#312e81",
    bg:      "#eef2ff",
    icon:    "⭐",
  },
];

export default function RewardClaimPage() {
  const [mentionType, setMentionType] = useState("verbal");
  const [hostName,    setHostName]    = useState("");
  const [hostEmail,   setHostEmail]   = useState("");
  const [webinarTitle,setWebinarTitle]= useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [notes,       setNotes]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState<{ tier: string; message: string } | null>(null);
  const [error,       setError]       = useState("");

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";
  const selected = MENTION_TYPES.find((m) => m.value === mentionType)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/rewards/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host_name: hostName, host_email: hostEmail,
          mention_type: mentionType, webinar_title: webinarTitle,
          evidence_url: evidenceUrl, notes,
        }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setResult({ tier: data.tier, message: data.message });
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Claim Your Mention-WebinX Reward — WebinX</title>
        <meta
          name="description"
          content="Mentioned WebinX during your webinar? Claim your free Featured listing reward and grow your audience."
        />
        <link rel="canonical" href="https://www.webinx.in/mention-webinx" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">🎤</div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Your Mention Reward</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Mentioned WebinX during your webinar? You deserve a reward. Select what you did and claim your free Featured listing.
          </p>
        </div>

        {/* Success */}
        {result ? (
          <div className="text-center py-10 px-6 border border-green-100 rounded-2xl bg-green-50">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">
              {result.tier} Tier Claimed!
            </h2>
            <p className="text-gray-600 text-sm mb-6">{result.message}</p>
            <div className="flex gap-3 justify-center">
              <a href="/top-hosts" className="text-sm font-medium bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
                View Leaderboard
              </a>
              <a href="/webinars" className="text-sm font-medium border border-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition">
                Browse Webinars
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Tier selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {MENTION_TYPES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMentionType(m.value)}
                  className={`text-left p-4 rounded-xl border-2 transition ${
                    mentionType === m.value ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{m.icon}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: m.bg, color: m.color }}
                    >
                      {m.tier}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{m.label}</p>
                  <p className="text-xs text-purple-600 mt-1 font-medium">→ {m.reward}</p>
                </button>
              ))}
            </div>

            {/* What you'll get */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-6 text-sm font-medium"
              style={{ background: selected.bg, color: selected.color }}
            >
              <span className="text-lg">{selected.icon}</span>
              <span>{selected.tier} reward: {selected.reward}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name / Org *</label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="e.g. Priya Sharma / GrowthLabs"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webinar Title</label>
                <input
                  type="text"
                  value={webinarTitle}
                  onChange={(e) => setWebinarTitle(e.target.value)}
                  placeholder="e.g. AI Tools for Marketing Teams 2026"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence URL <span className="text-gray-400 font-normal">(screenshot, recording, or slide link)</span>
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or YouTube link"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else you'd like us to know..."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm"
              >
                {loading ? "Submitting…" : `Claim My ${selected.tier} Reward →`}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Claims are reviewed within 24 hours. No fake submissions — we verify.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
