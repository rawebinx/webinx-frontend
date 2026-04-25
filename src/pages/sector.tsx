// src/pages/sector.tsx
// WeBinX — Sector listing page

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getEvents, getSectorConfig } from '../lib/api';
import type { WebinarEvent } from '../lib/api';

const PAGE_SIZE = 12;

function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="wx-card overflow-hidden">
          <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 0 }} />
          <div className="p-4 space-y-3">
            <div className="skeleton h-3 w-1/3 rounded-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-8 w-full rounded-lg mt-4" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function SectorPage() {
  const { slug } = useParams<{ slug: string }>();
  const sector = getSectorConfig(slug);

  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (off: number, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      // getEvents returns EventsResponse: { events, total, limit, offset }
      const result = await getEvents({
        sector: slug,
        limit: PAGE_SIZE,
        offset: off,
      });

      setEvents(prev => append ? [...prev, ...result.events] : result.events);
      setTotal(result.total);
      setOffset(off + result.events.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug]);

  useEffect(() => {
    setEvents([]);
    setOffset(0);
    void fetchEvents(0);
  }, [fetchEvents]);

  const hasMore = total > events.length;
  const sectorName = sector.name;
  const pageTitle = `${sectorName} Webinars in India`;
  const canonicalUrl = `https://webinx.in/sector/${slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle} | WeBinX</title>
        <meta
          name="description"
          content={`Discover free ${sectorName} webinars, online events and knowledge sessions in India. Updated daily.`}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${pageTitle} | WeBinX`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="has-bottom-nav">
        {/* Page header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${sector.bg} 0%, #fff 100%)`,
            borderBottom: `3px solid ${sector.border}`,
            padding: '28px 40px 24px',
          }}
        >
          <div className="wx-container">
            {/* Breadcrumb */}
            <nav style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 12, display: 'flex', gap: 6 }}>
              <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <span style={{ color: sector.color }}>{sectorName}</span>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 36 }}>{sector.emoji}</span>
              <div>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#111827',
                    fontFamily: 'var(--font-display)',
                    marginBottom: 4,
                  }}
                >
                  {pageTitle}
                </h1>
                <p style={{ fontSize: 14, color: '#6B7280' }}>
                  Free online events — updated daily
                  {!loading && total > 0 && (
                    <span style={{ marginLeft: 8, color: sector.color, fontWeight: 600 }}>
                      {total} events found
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events grid */}
        <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          {error ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#DC2626', fontSize: 15, marginBottom: 16 }}>{error}</p>
              <button
                onClick={() => void fetchEvents(0)}
                style={{
                  background: 'var(--wx-teal)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <SkeletonCards count={PAGE_SIZE} />
                ) : events.length === 0 ? (
                  <div
                    className="col-span-full"
                    style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{sector.emoji}</div>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>
                      No {sectorName} events right now
                    </p>
                    <p style={{ fontSize: 14, marginBottom: 24 }}>
                      Check back soon — new events are added daily.
                    </p>
                    <Link href="/webinars">
                      <button
                        style={{
                          background: 'var(--wx-teal)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 24px',
                          borderRadius: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Browse all events →
                      </button>
                    </Link>
                  </div>
                ) : (
                  events.map(event => (
                    <WebinarCard
                      key={event.id}
                      event={event}
                      variant={event.is_featured ? 'featured' : 'default'}
                    />
                  ))
                )}
                {loadingMore && <SkeletonCards count={3} />}
              </div>

              {/* Load more */}
              {!loading && !loadingMore && hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                  <button
                    onClick={() => void fetchEvents(offset, true)}
                    style={{
                      background: '#fff',
                      border: '1.5px solid var(--wx-border)',
                      color: 'var(--wx-ink)',
                      padding: '12px 32px',
                      borderRadius: 12,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    Load more ({Math.min(PAGE_SIZE, total - events.length)} more)
                  </button>
                </div>
              )}

              {/* End of results */}
              {!loading && !hasMore && events.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#9CA3AF' }}>
                  All {total} {sectorName} events shown ·{' '}
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
