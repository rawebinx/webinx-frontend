// src/pages/admin.tsx — WebinX Admin Dashboard
// Password protected. Set ADMIN_PASSWORD env var on Render.

import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";

interface Stats {
  total_events: number; upcoming: number; total_leads: number;
  active_alerts: number; total_saves: number;
  pending_rewards: number; paid_featured: number; revenue_inr: number;
}
interface Reward {
  id: number; host_name: string; host_email: string;
  mention_type: string; webinar_title: string;
  evidence_url: string; reward_tier: string; reward_days: number;
  status: string; created_at: string;
}
interface Lead {
  id: number; email: string; name: string;
  event_slug: string; utm_source: string; created_at: string;
}

const TIER_COLORS: Record<string, string> = {
  bronze: "#92400e", silver: "#374151", gold: "#78350f", platinum: "#312e81",
};
const TIER_BG: Record<string, string> = {
  bronze: "#fef3c7", silver: "#f3f4f6", gold: "#fef9c3", platinum: "#eef2ff",
};

export default function AdminPage() {
  const [password, setPassword]   = useState("");
  const [authed,   setAuthed]     = useState(false);
  const [authErr,  setAuthErr]    = useState("");
  const [tab,      setTab]        = useState<"overview"|"rewards"|"leads">("overview");
  const [stats,    setStats]      = useState<Stats | null>(null);
  const [rewards,  setRewards]    = useState<Reward[]>([]);
  const [leads,    setLeads]      = useState<Lead[]>([]);
  const [loading,  setLoading]    = useState(false);

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

  const apiFetch = useCallback(async (path: string, options?: RequestInit) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: { "X-Admin-Key": password, "Content-Type": "application/json", ...(options?.headers ?? {}) },
    });
    if (res.status === 401) { setAuthed(false); return null; }
    return res.json();
  }, [API, password]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr("");
    const data = await fetch(`${API}/api/admin/stats`, {
      headers: { "X-Admin-Key": password },
    });
    if (data.status === 401) { setAuthErr("Wrong password"); return; }
    setAuthed(true);
    loadAll();
  }

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [s, r, l] = await Promise.all([
      apiFetch("/api/admin/stats"),
      apiFetch("/api/admin/rewards?status=pending"),
      apiFetch("/api/admin/leads"),
    ]);
    if (s) setStats(s);
    if (r) setRewards(r);
    if (l) setLeads(l);
    setLoading(false);
  }, [apiFetch]);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  async function approveReward(id: number) {
    await apiFetch(`/api/admin/rewards/${id}/approve`, { method: "POST" });
    setRewards((prev) => prev.filter((r) => r.id !== id));
  }

  async function rejectReward(id: number) {
    await apiFetch(`/api/admin/rewards/${id}/reject`, { method: "POST" });
    setRewards((prev) => prev.filter((r) => r.id !== id));
  }

  if (!authed) {
    return (
      <>
        <Helmet><title>Admin — WebinX</title><meta name="robots" content="noindex"/></Helmet>
        <div className="max-w-sm mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">🔐</div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">WebinX internal tools</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              autoFocus
            />
            {authErr && <p className="text-sm text-red-500">{authErr}</p>}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              Login →
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Admin Dashboard — WebinX</title><meta name="robots" content="noindex"/></Helmet>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">WebinX Admin</h1>
            <p className="text-gray-500 text-sm">Platform management</p>
          </div>
          <button
            onClick={loadAll}
            className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total Events",    value: stats.total_events,    icon: "📋" },
              { label: "Upcoming",        value: stats.upcoming,         icon: "📅" },
              { label: "Total Leads",     value: stats.total_leads,      icon: "📧" },
              { label: "Active Alerts",   value: stats.active_alerts,    icon: "🔔" },
              { label: "Wishlist Saves",  value: stats.total_saves,      icon: "❤️" },
              { label: "Pending Rewards", value: stats.pending_rewards,  icon: "🎤", highlight: stats.pending_rewards > 0 },
              { label: "Paid Featured",   value: stats.paid_featured,    icon: "⭐" },
              { label: "Revenue (₹)",     value: `₹${Math.round(stats.revenue_inr || 0).toLocaleString()}`, icon: "💰" },
            ].map((s) => (
              <div
                key={s.label}
                className={`p-3 rounded-xl border ${s.highlight ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-white"}`}
              >
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-100">
          {(["overview", "rewards", "leads"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-medium px-4 py-2 border-b-2 transition capitalize ${
                tab === t ? "border-purple-600 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "rewards" ? `Rewards ${rewards.length > 0 ? `(${rewards.length} pending)` : ""}` : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <a href="/top-hosts" target="_blank" rel="noopener noreferrer"
                   className="text-sm font-medium border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  🏆 View Leaderboard
                </a>
                <a href="/webinars" target="_blank" rel="noopener noreferrer"
                   className="text-sm font-medium border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                  📋 View All Webinars
                </a>
                <button onClick={() => setTab("rewards")}
                   className="text-sm font-medium bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-100 transition">
                  🎤 Review Rewards ({rewards.length})
                </button>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-white">
              <h3 className="font-semibold text-gray-900 mb-2">Mark Host as Verified</h3>
              <p className="text-xs text-gray-500 mb-3">Run in Render Shell:</p>
              <code className="block text-xs bg-gray-900 text-green-400 px-4 py-3 rounded-lg">
                psql $DATABASE_URL -c "UPDATE public.hosts SET is_verified=TRUE, verified_at=NOW() WHERE name ILIKE '%host name%';"
              </code>
            </div>
          </div>
        )}

        {/* Rewards tab */}
        {tab === "rewards" && (
          <div className="space-y-3">
            {rewards.length === 0 ? (
              <p className="text-center text-gray-500 py-10 text-sm">No pending reward claims.</p>
            ) : (
              rewards.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-gray-100 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-900">{r.host_name}</span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: TIER_BG[r.reward_tier] || "#f3f4f6", color: TIER_COLORS[r.reward_tier] || "#374151" }}
                        >
                          {r.reward_tier}
                        </span>
                        <span className="text-xs text-gray-500">{r.reward_days} days featured</span>
                      </div>
                      <p className="text-xs text-gray-500">{r.host_email}</p>
                      {r.webinar_title && <p className="text-sm text-gray-700 mt-1">"{r.webinar_title}"</p>}
                      <p className="text-xs text-gray-400 mt-1 capitalize">Mention: {r.mention_type}</p>
                      {r.evidence_url && (
                        <a href={r.evidence_url} target="_blank" rel="noopener noreferrer"
                           className="text-xs text-purple-600 hover:underline mt-1 block">
                          View evidence →
                        </a>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => approveReward(r.id)}
                        className="text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => rejectReward(r.id)}
                        className="text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Leads tab */}
        {tab === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{leads.length} leads</p>
              <button
                onClick={() => {
                  const csv = "email,name,event_slug,utm_source,created_at\n" +
                    leads.map((l) => `${l.email},${l.name || ""},${l.event_slug || ""},${l.utm_source || ""},${l.created_at}`).join("\n");
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                  a.download = "webinx_leads.csv";
                  a.click();
                }}
                className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
              >
                ⬇ Export CSV
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Email</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Name</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Event</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Source</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{l.email}</td>
                      <td className="px-4 py-2 text-gray-600">{l.name || "—"}</td>
                      <td className="px-4 py-2 text-gray-500 max-w-[200px] truncate">{l.event_slug || "—"}</td>
                      <td className="px-4 py-2 text-gray-400">{l.utm_source || "—"}</td>
                      <td className="px-4 py-2 text-gray-400 whitespace-nowrap">
                        {new Date(l.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
