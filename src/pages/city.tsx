// src/pages/city.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getCityEvents } from '../lib/api';
import type { WebinarEvent } from '../lib/api';

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

export default function CityPage() {
  const { city } = useParams<{ city: string }>();
  const citySlug = (city ?? '').toLowerCase();
  const meta = CITY_META[citySlug] ?? { emoji: '🏙️', desc: 'Knowledge events' };
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCityEvents(citySlug);
      // getCityEvents returns WebinarEvent[] directly
      const list = Array.isArray(result) ? result : ((result as unknown as { events: WebinarEvent[] })?.events ?? []);
      setEvents(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [citySlug]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

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
                    <p style={{ fontSize: 14, marginBottom: 24 }}>Most events are online — browse all webinars below.</p>
                    <Link href="/webinars">
                      <button style={{ background: 'var(--wx-teal)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Browse all webinars →
                      </button>
                    </Link>
                  </div>
                ) : (
                  events.map(event => (
                    <WebinarCard key={event.id} event={event} variant={event.is_featured ? 'featured' : 'default'} />
                  ))
                )}
              </div>

              {!loading && events.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#9CA3AF' }}>
                  All {events.length} {cityName} events shown ·{' '}
                  <Link href="/ai-search" style={{ color: 'var(--wx-teal)', fontWeight: 600 }}>Try AI Search for more →</Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
