// src/pages/wishlist.tsx — WebinX Saved Webinars Page
// Reads from localStorage, syncs with backend on email entry.

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getWishlist, getWishlistEvents, toggleWishlist,
  syncWishlistEmail, saveWishlistTopic,
} from "../lib/api";
import type { WebinarEvent } from "../lib/api";
import { WebinarCard } from "../components/webinar-card";

function SkeletonCard() {
  return (
    <div className="border rounded-xl p-4 animate-pulse bg-gray-50 h-40">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function WishlistPage() {
  const [events, setEvents]       = useState<WebinarEvent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [count, setCount]         = useState(0);
  const [email, setEmail]         = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [topic, setTopic]         = useState("");
  const [topicSent, setTopicSent] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);

  async function loadSaved() {
    setLoading(true);
    const slugs = getWishlist();
    setCount(slugs.length);
    if (slugs.length === 0) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const data = await getWishlistEvents();
    setEvents(data);
    setLoading(false);
  }

  useEffect(() => { loadSaved(); }, []);

  function handleRemove(slug: string) {
    toggleWishlist(slug);
    setEvents((prev) => prev.filter((e) => e.slug !== slug));
    setCount((c) => Math.max(0, c - 1));
  }

  async function handleEmailSync(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    await syncWishlistEmail(email);
    setEmailLoading(false);
    setEmailSent(true);
  }

  async function handleTopicSave(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !topic) return;
    setTopicLoading(true);
    await saveWishlistTopic(email, topic);
    setTopicLoading(false);
    setTopicSent(true);
    setTopic("");
  }

  const slugs = getWishlist();

  return (
    <>
      <Helmet>
        <title>My Saved Webinars — WebinX</title>
        <meta
          name="description"
          content="Your saved webinars on WebinX — India's free webinar discovery platform."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>❤️</span> Saved Webinars
          </h1>
          {count > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              {count} webinar{count !== 1 ? "s" : ""} saved
            </p>
          )}
        </div>

        {/* Empty state */}
        {!loading && slugs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔖</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No saved webinars yet</h2>
            <p className="text-gray-500 text-sm mb-6">
              Click the ❤️ on any webinar card to save it here.
            </p>
            <a
              href="/webinars"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              Browse Webinars →
            </a>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Saved events grid */}
        {!loading && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {events.map((e) => (
                <div key={e.slug} className="relative">
                  <WebinarCard webinar={e} />
                  <button
                    onClick={() => handleRemove(e.slug)}
                    className="absolute bottom-14 right-3 text-xs text-gray-400 hover:text-red-500 transition"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Slug-only saves that API couldn't resolve */}
            {slugs.length > events.length && (
              <p className="text-xs text-gray-400 mb-8">
                {slugs.length - events.length} saved event{slugs.length - events.length > 1 ? "s" : ""} may have ended or been removed.
              </p>
            )}
          </>
        )}

        {/* ── Notification section ──────────────────────────────── */}
        {slugs.length > 0 && (
          <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50 mb-8">
            <h2 className="font-semibold text-gray-900 mb-1">🔔 Get notified about your saved webinars</h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter your email and we'll remind you before each webinar starts.
            </p>
            {emailSent ? (
              <p className="text-sm text-green-700 font-medium">
                ✓ Saved! We'll remind you before your webinars.
              </p>
            ) : (
              <form onSubmit={handleEmailSync} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                />
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
                >
                  {emailLoading ? "…" : "Notify me"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Topic demand section ───────────────────────────────── */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-white">
          <h2 className="font-semibold text-gray-900 mb-1">📌 Can't find a webinar on your topic?</h2>
          <p className="text-sm text-gray-500 mb-4">
            Tell us what you're looking for — we'll notify you when a matching webinar is posted, and alert hosts about the demand.
          </p>
          {topicSent ? (
            <p className="text-sm text-green-700 font-medium">
              ✓ Demand recorded! We'll email you when a matching webinar is posted.
            </p>
          ) : (
            <form onSubmit={handleTopicSave} className="flex flex-col gap-3 max-w-sm">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              />
              <input
                type="text"
                placeholder="e.g. AI for HR professionals"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                maxLength={120}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              />
              <button
                type="submit"
                disabled={topicLoading}
                className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60 self-start"
              >
                {topicLoading ? "Saving…" : "Request this topic"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
