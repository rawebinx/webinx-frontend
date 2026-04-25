// src/pages/category.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getEvents } from '../lib/api';
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
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-8 w-full rounded-lg mt-4" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const categorySlug = slug ?? '';
  const categoryName = categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
      const result = await getEvents({ category: categorySlug, limit: PAGE_SIZE, offset: off });
      // getEvents returns EventsResponse: { events, total, limit, offset }
      const incoming = result.events ?? [];
      const serverTotal = result.total ?? incoming.length;

      setEvents(prev => append ? [...prev, ...incoming] : incoming);
      setTotal(serverTotal);
      setOffset(off + incoming.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    setEvents([]);
    setOffset(0);
    void fetchEvents(0);
  }, [fetchEvents]);

  const hasMore = total > events.length;
  const pageTitle = `${categoryName} Webinars in India | WeBinX`;
  const canonicalUrl = `https://webinx.in/category/${categorySlug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Discover free ${categoryName} webinars and online events in India. Updated daily.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      <div className="has-bottom-nav">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #fff 100%)', borderBottom: '3px solid #0D4F6B', padding: '28px 40px 24px' }}>
          <div className="wx-container">
            <nav style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 12, display: 'flex', gap: 6 }}>
              <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <Link href="/webinars" style={{ color: '#6B7280', textDecoration: 'none' }}>Webinars</Link>
              <span>›</span>
              <span style={{ color: '#0D4F6B' }}>{categoryName}</span>
            </nav>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
              {categoryName} Webinars in India
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280' }}>
              Free online events — updated daily
              {!loading && total > 0 && (
                <span style={{ marginLeft: 8, color: '#0D4F6B', fontWeight: 600 }}>{total} events</span>
              )}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          {error ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#DC2626', fontSize: 15, marginBottom: 16 }}>{error}</p>
              <button onClick={() => void fetchEvents(0)} style={{ background: 'var(--wx-teal)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <SkeletonCards count={PAGE_SIZE} />
                ) : events.length === 0 ? (
                  <div className="col-span-full" style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>No {categoryName} events right now</p>
                    <p style={{ fontSize: 14, marginBottom: 24 }}>New events are added daily. Try browsing all webinars.</p>
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
                {loadingMore && <SkeletonCards count={3} />}
              </div>

              {!loading && !loadingMore && hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                  <button onClick={() => void fetchEvents(offset, true)} style={{ background: '#fff', border: '1.5px solid var(--wx-border)', color: 'var(--wx-ink)', padding: '12px 32px', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Load more ({Math.min(PAGE_SIZE, total - events.length)} more)
                  </button>
                </div>
              )}

              {!loading && !hasMore && events.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#9CA3AF' }}>
                  All {total} {categoryName} events shown ·{' '}
                  <Link href="/ai-search" style={{ color: 'var(--wx-teal)', fontWeight: 600 }}>Try AI Search →</Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
