// src/pages/ai-search.tsx — WebinX AI-Powered Natural Language Search
// v2 changes:
//  1. CRITICAL BUG FIX: <WebinarCard webinar={event}> → <WebinarCard event={event}>
//     (WebinarCardProps uses `event` not `webinar` — cards were completely broken)
//  2. API_BASE imported from @/lib/api (no import.meta as any)
//  3. AISearchResponse interface properly typed (no any)
//  4. JSX.Element return type on component
//  5. Teal brand throughout (purple removed)
//  6. void handleSearch() + void handleSubmit() patterns
//  7. useCallback on handlers

import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Search, ArrowRight } from 'lucide-react';
import { API_BASE, type WebinarEvent } from '@/lib/api';
import { WebinarCard } from '@/components/webinar-card';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIResult extends WebinarEvent {
  ai_reason?: string;
}

// Backend returns { results: AIResult[], ai_used: boolean }
// Note: api.ts aiSearch() reads `events` field — different schema.
// We keep raw fetch here to access `results` + `ai_used` directly.
interface AISearchResponse {
  results?:  AIResult[];
  ai_used?:  boolean;
  error?:    string;
}

// ─── Example queries ─────────────────────────────────────────────────────────

const EXAMPLES = [
  'AI webinars for startup founders',
  'Free finance and stock market workshops',
  'Digital marketing masterclass under 2 hours',
  'HR and recruitment webinars for professionals',
  'Machine learning basics for beginners',
  'Fundraising and VC pitch workshops India',
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AISearchPage(): JSX.Element {
  const [query,    setQuery]    = useState<string>('');
  const [results,  setResults]  = useState<AIResult[]>([]);
  const [loading,  setLoading]  = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [aiUsed,   setAiUsed]   = useState<boolean>(false);
  const [error,    setError]    = useState<string>('');

  const handleSearch = useCallback(
    async (q: string): Promise<void> => {
      const trimmed = q.trim();
      if (!trimmed || trimmed.length < 3) return;
      setQuery(trimmed);
      setLoading(true);
      setSearched(false);
      setError('');
      setResults([]);

      try {
        // Using API_BASE from api.ts — no raw import.meta as any
        const res = await fetch(`${API_BASE}/api/search/ai`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ query: trimmed }),
          signal:  AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as AISearchResponse;
        setResults(data.results ?? []);
        setAiUsed(data.ai_used ?? false);
        setSearched(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Search failed';
        setError(msg.includes('timeout') ? 'Search timed out — please try again.' : 'Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();
      void handleSearch(query);
    },
    [query, handleSearch],
  );

  const handleExample = useCallback(
    (ex: string): void => {
      setQuery(ex);
      void handleSearch(ex);
    },
    [handleSearch],
  );

  // Filter out the current query from suggestion chips
  const suggestionChips = EXAMPLES
    .filter((e) => !e.toLowerCase().includes(query.toLowerCase().slice(0, 6)))
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>AI Webinar Search — Find Any Webinar in Plain English — WebinX</title>
        <meta
          name="description"
          content="Search India's webinars in plain English. WebinX AI Search understands what you're looking for — no keywords needed."
        />
        <link rel="canonical" href="https://www.webinx.in/ai-search" />
        <meta property="og:title" content="AI Webinar Search — WebinX" />
        <meta property="og:description" content="Find India's best webinars by describing what you need, in plain English." />
      </Helmet>

      <main className="has-bottom-nav">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1rem 3rem' }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#E1F5EE',
                border: '1px solid rgba(13,79,107,0.15)',
                borderRadius: 20,
                padding: '5px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                color: '#0D4F6B',
                marginBottom: 16,
              }}
            >
              <Sparkles size={13} />
              Powered by Claude AI
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 400,
                color: '#0D4F6B',
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              Find Webinars in Plain English
            </h1>
            <p style={{ fontSize: 14.5, color: '#6B7280', maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
              Describe what you're looking for — topic, audience, format, duration.
              Our AI finds the best matches.
            </p>
          </div>

          {/* ── Search bar ── */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#fff',
                border: '1.5px solid #E5E7EB',
                borderRadius: 14,
                padding: '6px 6px 6px 14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={(e): void => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#0D4F6B';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(13,79,107,0.08), 0 4px 16px rgba(0,0,0,0.06)';
              }}
              onBlur={(e): void => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
              }}
            >
              <Search size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e): void => setQuery(e.target.value)}
                placeholder="e.g. AI tools for content creators, free marketing workshops…"
                autoFocus
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14.5,
                  color: '#111827',
                  background: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                disabled={loading || query.length < 3}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 20px',
                  background: (loading || query.length < 3) ? '#E5E7EB' : '#0D4F6B',
                  color: (loading || query.length < 3) ? '#9CA3AF' : '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: (loading || query.length < 3) ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Searching…' : (
                  <>Search <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </form>

          {/* ── Example queries (pre-search) ── */}
          {!searched && !loading && (
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 10 }}>Try these examples:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={(): void => handleExample(ex)}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: '1.5px solid #E5E7EB',
                      background: '#fff',
                      color: '#374151',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e): void => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#0D4F6B';
                      (e.currentTarget as HTMLButtonElement).style.color = '#0D4F6B';
                    }}
                    onMouseLeave={(e): void => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                      (e.currentTarget as HTMLButtonElement).style.color = '#374151';
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: '#6B7280', fontSize: 14 }}>
                <svg
                  style={{ width: 20, height: 20, color: '#0D4F6B', animation: 'spin 0.8s linear infinite' }}
                  viewBox="0 0 24 24" fill="none"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AI is finding the best webinars for you…
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 13.5,
                color: '#991B1B',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span>{error}</span>
              <button
                onClick={(): void => { setError(''); void handleSearch(query); }}
                style={{ background: 'none', border: 'none', color: '#0D4F6B', fontWeight: 600, cursor: 'pointer', fontSize: 12.5, flexShrink: 0, fontFamily: 'inherit' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Results ── */}
          {searched && !loading && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                  {results.length > 0
                    ? `${results.length} match${results.length !== 1 ? 'es' : ''} for "${query}"`
                    : `No matches found for "${query}"`}
                </h2>
                {aiUsed && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0D4F6B',
                      background: '#E1F5EE',
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    <Sparkles size={11} />
                    AI ranked
                  </span>
                )}
              </div>

              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B7280' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: 24,
                    }}
                  >
                    🔍
                  </div>
                  <p style={{ marginBottom: 12, fontSize: 14 }}>No webinars found for this query.</p>
                  <a href="/webinars" style={{ color: '#0D4F6B', fontWeight: 600, fontSize: 13.5, textDecoration: 'none' }}>
                    Browse all webinars →
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {results.map((event) => (
                    <div key={event.slug}>
                      {/* AI reason chip */}
                      {event.ai_reason && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 7,
                            marginBottom: 7,
                            padding: '0 4px',
                          }}
                        >
                          <Sparkles size={13} style={{ color: '#0D4F6B', flexShrink: 0, marginTop: 1 }} />
                          <p style={{ fontSize: 12.5, color: '#6B7280', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                            {event.ai_reason}
                          </p>
                        </div>
                      )}
                      {/* FIX: prop is `event` not `webinar` */}
                      <WebinarCard event={event} variant="compact" />
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestion chips after search */}
              {suggestionChips.length > 0 && (
                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 10 }}>Not what you're looking for?</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {suggestionChips.map((ex) => (
                      <button
                        key={ex}
                        onClick={(): void => handleExample(ex)}
                        style={{
                          fontSize: 12.5,
                          padding: '6px 14px',
                          borderRadius: 20,
                          border: '1.5px solid #E5E7EB',
                          background: '#fff',
                          color: '#374151',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          transition: 'border-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={(e): void => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#0D4F6B';
                          (e.currentTarget as HTMLButtonElement).style.color = '#0D4F6B';
                        }}
                        onMouseLeave={(e): void => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                          (e.currentTarget as HTMLButtonElement).style.color = '#374151';
                        }}
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
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
