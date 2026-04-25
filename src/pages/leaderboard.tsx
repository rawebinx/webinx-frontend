// src/pages/leaderboard.tsx — WebinX Top Hosts Leaderboard
// Monthly rankings by events, views, saves. Shareable badges.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

interface LeaderboardEntry {
  host_name:    string;
  host_slug:    string;
  org_name:     string;
  is_verified:  boolean;
  event_count:  number;
  total_views:  number;
  total_saves:  number;
  total_clicks: number;
  score:        number;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const MONTH  = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ background: "#f3f0ff", color: "#7c3aed" }}
    >
      {score.toLocaleString()} pts
    </span>
  );
}

function ShareButton({ rank, name, slug }: { rank: number; name: string; slug: string }) {
  const profileUrl = slug ? `https://www.webinx.in/hosts/${slug}` : "https://www.webinx.in/top-hosts";
  const text = encodeURIComponent(
    `I'm ranked #${rank} on WebinX's Top Hosts this month! 🏆\nCheck out my webinars at ${profileUrl}`
  );
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${text}`;

  return (
    <div className="flex gap-2">
      <a
        href={liUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium px-2.5 py-1 rounded-lg border transition hover:bg-blue-50"
        style={{ borderColor: "#0077b5", color: "#0077b5" }}
      >
        Share on LinkedIn
      </a>
      <a
        href={twUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium px-2.5 py-1 rounded-lg border transition hover:bg-sky-50"
        style={{ borderColor: "#1da1f2", color: "#1da1f2" }}
      >
        Tweet
      </a>
    </div>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

  useEffect(() => {
    fetch(`${API}/api/hosts/leaderboard`)
      .then((r) => r.json())
      .then((data) => { setEntries(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <>
      <Helmet>
        <title>Top Hosts This Month — WebinX Leaderboard</title>
        <meta
          name="description"
          content={`WebinX Top Hosts of ${MONTH} — ranked by webinars hosted, views, and audience engagement.`}
        />
        <link rel="canonical" href="https://www.webinx.in/top-hosts" />
        <meta property="og:title" content={`WebinX Top Hosts — ${MONTH}`} />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h1 className="text-2xl font-bold text-gray-900">Top Hosts This Month</h1>
          <p className="text-gray-500 text-sm mt-1">{MONTH} · Resets monthly</p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
            <span>Score = Events × 10 + Views × 0.1 + Saves × 5 + Clicks × 2</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl border bg-gray-50 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-gray-500 py-10">Failed to load leaderboard. Try again.</p>
        )}

        {/* Empty */}
        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Leaderboard loading up...</p>
            <p className="text-sm">Rankings will appear as hosts post more webinars.</p>
          </div>
        )}

        {/* Leaderboard */}
        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div
                key={entry.host_name}
                className={`relative flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-sm ${
                  idx === 0 ? "border-yellow-200 bg-yellow-50" :
                  idx === 1 ? "border-gray-200 bg-gray-50" :
                  idx === 2 ? "border-orange-100 bg-orange-50" :
                  "border-gray-100 bg-white"
                }`}
              >
                {/* Rank */}
                <div className="text-2xl w-8 text-center shrink-0">
                  {idx < 3 ? MEDALS[idx] : (
                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
                >
                  {entry.host_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={entry.host_slug ? `/hosts/${entry.host_slug}` : "#"}
                      className="font-semibold text-gray-900 hover:text-purple-700 transition truncate"
                    >
                      {entry.host_name}
                    </a>
                    {entry.is_verified && (
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                        style={{ background: "#dbeafe", color: "#1d4ed8" }}
                      >
                        ✓ Verified
                      </span>
                    )}
                    {idx === 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800">
                        Top Host
                      </span>
                    )}
                  </div>
                  {entry.org_name && (
                    <p className="text-xs text-gray-500 truncate">{entry.org_name}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>📋 {entry.event_count} webinar{entry.event_count !== 1 ? "s" : ""}</span>
                    <span>👁 {entry.total_views.toLocaleString()}</span>
                    <span>❤️ {entry.total_saves}</span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <ScoreBadge score={entry.score} />
                  {idx < 3 && (
                    <ShareButton rank={idx + 1} name={entry.host_name} slug={entry.host_slug} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA for hosts */}
        <div className="mt-10 p-6 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white text-center">
          <p className="font-semibold text-gray-900 mb-1">Want to climb the leaderboard?</p>
          <p className="text-sm text-gray-500 mb-4">
            Host more webinars on WebinX and mention us to your audience to earn rewards.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/mention-webinx"
              className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
            >
              🎤 Claim Mention Reward
            </a>
            <a
              href="/get-featured"
              className="text-sm font-medium border border-purple-300 text-purple-700 hover:bg-purple-50 px-5 py-2 rounded-lg transition"
            >
              ⭐ Get Featured
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
