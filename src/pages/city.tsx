// src/pages/city.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getCityEvents } from '../lib/api';
import type { WebinarEvent } from '../lib/api';
import React from 'react';
// ── Per-card error boundary — prevents one bad card crashing the whole page ──
class CardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null; // silently skip bad cards
    return this.props.children;
  }
}



const CITY_META: Record<string, { emoji: string; desc: string }> = {
  mumbai:    { emoji: '🌊', desc: 'India\'s financial capital' },
  delhi:     { emoji: '🏛️', desc: 'India\'s political capital' },
  bengaluru: { emoji: '🌳', desc: 'India\'s Silicon Valley' },
  bangalore: { emoji: '🌳', desc: 'India\'s Silicon Valley' },
  hyderabad: { emoji: '💎', desc: 'City of Pearls' },
  chennai:   { emoji: '🌴', desc: 'Gateway to South India' },
  pune:      { emoji: '🎭', desc: 'Oxford of the East' },
  kolkata:   { emoji: '🎨', desc: 'City of Joy' },
  ahmedabad: { emoji: '🦁', desc: 'Manchester of India' },
};

// ── FIX: null-safe normalizer — prevents WebinarCard from crashing ──────────
function safeEvent(ev: unknown): WebinarEvent {
  const e = (ev ?? {}) as Record<string, unknown>;
  return {
    ...e,
    id:               (e.id as number)        ?? 0,
    slug:             (e.slug as string)       ?? '',
    title:            (e.title as string)      ?? 'Untitled Event',
    description:      (e.description as string) ?? '',
    start_time:       (e.start_time as string) ?? '',
    end_time:         (e.end_time as string | null) ?? null,
    host_name:        (e.host_name as string)  ?? 'Unknown Host',
    host_slug:        (e.host_slug as string | null) ?? null,
    host_is_verified: Boolean(e.host_is_verified),
    content_type:     ((e.content_type as string) ?? 'webinar') as WebinarEvent['content_type'],
    sector_slug:      (e.sector_slug as string | null) ?? null,
    sector_name:      (e.sector_name as string | null) ?? null,
    event_url:        (e.event_url as string | null) ?? null,
    registration_url: (e.registration_url as string | null) ?? null,
    thumbnail_url:    (e.thumbnail_url as string | null) ?? null,
    is_featured:      Boolean(e.is_featured),
    is_sponsored:     Boolean(e.is_sponsored),
    is_online:        e.is_online !== false,
    quality_score:    (e.quality_score as number) ?? 50,
    view_count:       (e.view_count as number) ?? 0,
    click_count:      (e.click_count as number) ?? 0,
    save_count:       (e.save_count as number) ?? 0,
    tags:             Array.isArray(e.tags) ? (e.tags as string[]) : [],
    ticket_price_inr: (e.ticket_price_inr as number | null) ?? null,
    venue_city:       (e.venue_city as string | null) ?? null,
    venue_name:       (e.venue_name as string | null) ?? null,
    venue_address:    (e.venue_address as string | null) ?? null,
    duration_minutes: (e.duration_minutes as number | null) ?? null,
    episode_number:   (e.episode_number as number | null) ?? null,
    podcast_series:   (e.podcast_series as string | null) ?? null,
    spotify_url:      (e.spotify_url as string | null) ?? null,
    apple_podcasts_url: (e.apple_podcasts_url as string | null) ?? null,
    is_hybrid:        Boolean(e.is_hybrid),
    max_attendees:    (e.max_attendees as number | null) ?? null,
    intent_label:     (e.intent_label as string | null) ?? null,
    sponsor_name:     (e.sponsor_name as string | null) ?? null,
    sponsor_url:      (e.sponsor_url as string | null) ?? null,
    sponsor_cta:      (e.sponsor_cta as string | null) ?? null,
  } as WebinarEvent;
}

function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="wx-card overflow-hidden">
          <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 0 }} />
          <div className="p-4 space-y-3">
            <div className="skeleton h-3 w-1/3 rounded-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-8 w-full rounded-lg mt-4" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function CityPage(): JSX.Element {
  const { city } = useParams<{ city: string }>();
  const citySlug = (city ?? '').toLowerCase();
  const meta = CITY_META[citySlug] ?? { emoji: '🏙️', desc: 'Knowledge events' };
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCityEvents(citySlug);
      // Normalise every item — prevents WebinarCard crashing on null fields
      const raw: unknown[] = Array.isArray(result)
        ? result
        : ((result as Record<string, unknown>)?.events as unknown[] ?? []);
      setEvents(raw.map(safeEvent));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [citySlug]);

  useEffect(() => { void fetchEvents(); }, [fetchEvents]);

  const pageTitle = `${cityName} Webinars & Events | WeBinX`;
  const canonicalUrl = `https://webinx.in/city/${citySlug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Discover free webinars and knowledge events in ${cityName}. ${meta.desc}. Updated daily.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      <div className="has-bottom-nav">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', borderBottom: '3px solid #0D4F6B', padding: '28px 40px 24px' }}>
          <div className="wx-container">
            <nav style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 12, display: 'flex', gap: 6 }}>
              <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <span style={{ color: '#0D4F6B' }}>{cityName}</span>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 40 }}>{meta.emoji}</span>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                  {cityName} Webinars & Events
                </h1>
                <p style={{ fontSize: 14, color: '#6B7280' }}>
                  {meta.desc} · Free online events — updated daily
                  {!loading && events.length > 0 && (
                    <span style={{ marginLeft: 8, color: '#0D4F6B', fontWeight: 600 }}>
                      {events.length} events found
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          {error ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <p style={{ color: '#DC2626', fontSize: 15, marginBottom: 16 }}>{error}</p>
              <button onClick={() => void fetchEvents()} style={{ background: 'var(--wx-teal)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <SkeletonCards count={6} />
                ) : events.length === 0 ? (
                  <div className="col-span-full" style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{meta.emoji}</div>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>No events in {cityName} yet</p>
                    <p style={{ fontSize: 14, marginBottom: 24 }}>
                      Most events are online — browse all webinars below.
                    </p>
                    <Link href="/webinars">
                      <button style={{ background: 'var(--wx-teal)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Browse all webinars →
                      </button>
                    </Link>
                  </div>
                ) : (
                  events.map(event => (
                    <CardErrorBoundary key={event.id ?? event.slug}>
                      <WebinarCard
                        event={event}
                        variant={event.is_featured ? 'featured' : 'default'}
                      />
                    </CardErrorBoundary>
                  ))
                )}
              </div>

              {!loading && events.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#9CA3AF' }}>
                  All {events.length} {cityName} events shown ·{' '}
                  <Link href="/ai-search" style={{ color: 'var(--wx-teal)', fontWeight: 600 }}>
                    Try AI Search for more →
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
