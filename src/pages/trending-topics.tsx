// src/pages/trending-topics.tsx — WebinX Trending Topics
// v2: API_BASE from @/lib/api (no import.meta as any), saveWishlistTopic() from api.ts
// for topic submission, async/await, useCallback, teal brand, JSX.Element return type.

import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp } from 'lucide-react';
import { API_BASE, saveWishlistTopic } from '@/lib/api';

interface Topic {
  topic:        string;
  demand_count: number;
  sector_slug:  string;
  type:         'requested' | 'trending';
  score?:       number;
}

interface TopicsResponse {
  topics?: Topic[];
}

const SECTOR_EMOJI: Record<string, string> = {
  ai: '🤖', finance: '💰', marketing: '📢', startup: '🚀',
  technology: '💻', hr: '👥', healthcare: '🏥', education: '📚',
};

const MONTH = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

export default function TrendingTopicsPage(): JSX.Element {
  const [topics,      setTopics]      = useState<Topic[]>([]);
  const [loading,     setLoading]     = useState<boolean>(true);
  const [email,       setEmail]       = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [submitted,   setSubmitted]   = useState<boolean>(false);
  const [submitting,  setSubmitting]  = useState<boolean>(false);

  useEffect((): void => {
    const load = async (): Promise<void> => {
      try {
        const res  = await fetch(`${API_BASE}/api/trending-topics`);
        const data = await res.json() as Topic[] | TopicsResponse;
        // Backend may return array directly or { topics: [] }
        const list = Array.isArray(data) ? data : (data as TopicsResponse).topics ?? [];
        setTopics(list);
      } catch {
        // silently degrade — show empty state
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleTopicRequest = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!email || !customTopic || submitting) return;
      setSubmitting(true);
      try {
        // Uses saveWishlistTopic() from api.ts — no raw fetch
        await saveWishlistTopic({ email: email.trim(), topic_query: customTopic.trim() });
      } catch {
        // silently succeed — UX wins over error display here
      } finally {
        setSubmitted(true);
        setSubmitting(false);
      }
    },
    [email, customTopic, submitting],
  );

  const requested = topics.filter((t) => t.type === 'requested');
  const trending  = topics.filter((t) => t.type === 'trending');

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

      <main className="has-bottom-nav">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3rem) 1rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#E1F5EE', border: '1px solid rgba(13,79,107,0.15)',
                borderRadius: 20, padding: '5px 14px',
                fontSize: 12.5, fontWeight: 700, color: '#0D4F6B', marginBottom: 16,
              }}
            >
              <TrendingUp size={13} />
              {MONTH}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 400, color: '#0D4F6B', marginBottom: 8, lineHeight: 1.2,
              }}
            >
              Trending Webinar Topics
            </h1>
            <p style={{ fontSize: 14.5, color: '#6B7280' }}>
              What India's professionals want to learn right now
            </p>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          )}

          {/* Requested topics */}
          {!loading && requested.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>🔥 Most Requested</h2>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>People actively asked for these</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {requested.map((t) => (
                  <a
                    key={t.topic}
                    href={`/webinars?q=${encodeURIComponent(t.topic)}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                      borderRadius: 12, border: '1px solid #E5E7EB', background: '#fff',
                      textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={(e): void => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0D4F6B';
                      (e.currentTarget as HTMLAnchorElement).style.background = '#E1F5EE';
                    }}
                    onMouseLeave={(e): void => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB';
                      (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
                    }}
                  >
                    <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>
                      {SECTOR_EMOJI[t.sector_slug] ?? '🎯'}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#111827' }}>{t.topic}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#DC2626', flexShrink: 0 }}>
                      {t.demand_count} want this
                    </span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>Search →</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Trending tags */}
          {!loading && trending.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>📊 Also Trending</h2>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Based on views and saves</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {trending.map((t) => (
                  <a
                    key={t.topic}
                    href={`/webinars?q=${encodeURIComponent(t.topic)}`}
                    style={{
                      fontSize: 13.5, fontWeight: 500, padding: '7px 16px', borderRadius: 20,
                      border: '1.5px solid #E5E7EB', color: '#374151', textDecoration: 'none',
                      background: '#fff', transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e): void => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = '#0D4F6B';
                      el.style.color = '#0D4F6B';
                    }}
                    onMouseLeave={(e): void => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = '#E5E7EB';
                      el.style.color = '#374151';
                    }}
                  >
                    {t.topic}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && topics.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B7280' }}>
              <p style={{ marginBottom: 12 }}>Topics are building up as users search and save webinars.</p>
              <a href="/webinars" style={{ color: '#0D4F6B', fontWeight: 600, fontSize: 14 }}>Browse all webinars →</a>
            </div>
          )}

          {/* Request a topic */}
          <div
            style={{
              border: '1.5px solid rgba(13,79,107,0.15)',
              borderRadius: 16,
              padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              background: 'linear-gradient(135deg, #E1F5EE 0%, #fff 100%)',
            }}
          >
            <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: 6, fontSize: 15 }}>📌 Don't see your topic?</h2>
            <p style={{ fontSize: 13.5, color: '#6B7280', marginBottom: 16, lineHeight: 1.6 }}>
              Request a topic — we'll alert hosts about the demand and email you when a matching webinar is posted.
            </p>
            {submitted ? (
              <p style={{ fontSize: 14, fontWeight: 600, color: '#065f46' }}>
                ✓ Requested! We'll notify you when a matching webinar is posted.
              </p>
            ) : (
              <form onSubmit={(e): void => { void handleTopicRequest(e); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e): void => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', fontSize: 13.5, border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '10px 12px', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="e.g. Python for Finance Professionals"
                    value={customTopic}
                    onChange={(e): void => setCustomTopic(e.target.value)}
                    required
                    maxLength={120}
                    style={{ flex: 1, fontSize: 13.5, border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '10px 12px', outline: 'none', fontFamily: 'var(--font-sans)', minWidth: 0 }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      fontSize: 13.5, fontWeight: 600, padding: '10px 20px', borderRadius: 10,
                      background: submitting ? '#9CA3AF' : '#0D4F6B', color: '#fff', border: 'none',
                      cursor: submitting ? 'wait' : 'pointer', fontFamily: 'var(--font-sans)', flexShrink: 0,
                    }}
                  >
                    {submitting ? '…' : 'Request →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Hosts CTA */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 8 }}>
              Are you a host? See what topics people want and plan your next webinar.
            </p>
            <a href="/top-hosts" style={{ fontSize: 13.5, color: '#0D4F6B', fontWeight: 600, textDecoration: 'none' }}>
              View Host Leaderboard →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
