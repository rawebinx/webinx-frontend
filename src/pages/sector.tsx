// src/pages/sector.tsx
// WebinX — Sector listing page — v2
// Changes from v1:
//  1. Imports SECTOR_META from @/lib/sector-meta — rich intro + FAQ now shown
//  2. BreadcrumbList JSON-LD in Helmet (sector pages are high-value SEO targets)
//  3. FAQPage JSON-LD when sector has FAQ data
//  4. Meta description uses SECTOR_META.description (keyword-rich) instead of generic
//  5. Intro text section between header and events grid
//  6. FAQ accordion section after events grid
//  7. Related sectors row at the bottom
//  8. JSX.Element return types on all components

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import WebinarCard from '@/components/webinar-card';
import { getEvents, getSectorConfig } from '@/lib/api';
import { SECTOR_META } from '@/lib/sector-meta';
import type { WebinarEvent } from '@/lib/api';

const PAGE_SIZE = 12;

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCards({ count = 6 }: { count?: number }): JSX.Element {
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

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
      <button
        onClick={(): void => setOpen((v) => !v)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '16px 20px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{q}</span>
        {open
          ? <ChevronUp   size={17} color="#6B7280" style={{ flexShrink: 0 }} />
          : <ChevronDown size={17} color="#6B7280" style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', fontSize: 14, color: '#6B7280', lineHeight: 1.75 }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SectorPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const sector   = getSectorConfig(slug);
  const meta     = SECTOR_META[slug ?? ''] ?? null;

  const [events,      setEvents]      = useState<WebinarEvent[]>([]);
  const [total,       setTotal]       = useState<number>(0);
  const [offset,      setOffset]      = useState<number>(0);
  const [loading,     setLoading]     = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error,       setError]       = useState<string | null>(null);

  const fetchEvents = useCallback(
    async (off: number, append = false): Promise<void> => {
      if (!append) setLoading(true);
      else         setLoadingMore(true);
      setError(null);
      try {
        const result = await getEvents({ sector: slug, limit: PAGE_SIZE, offset: off });
        setEvents((prev) => append ? [...prev, ...result.events] : result.events);
        setTotal(result.total);
        setOffset(off + result.events.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [slug],
  );

  useEffect((): void => {
    setEvents([]);
    setOffset(0);
    void fetchEvents(0);
  }, [fetchEvents]);

  const hasMore      = total > events.length;
  const sectorName   = sector.name;
  const pageTitle    = `${sectorName} Webinars in India`;
  const canonicalUrl = `https://www.webinx.in/sector/${slug ?? ''}`;
  // Use SECTOR_META description if available — it's keyword-rich and SEO-optimised
  const metaDesc     = meta?.description
    ?? `Discover free ${sectorName} webinars, online events and knowledge sessions in India. Updated daily on WebinX.`;

  // ── Structured data ────────────────────────────────────────────────────────

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://www.webinx.in' },
      { '@type': 'ListItem', position: 2, name: 'Webinars',         item: 'https://www.webinx.in/webinars' },
      { '@type': 'ListItem', position: 3, name: `${sectorName} Webinars`, item: canonicalUrl },
    ],
  };

  const faqSchema = meta?.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle} | WeBinX</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"       content={`${pageTitle} | WeBinX`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url"         content={canonicalUrl} />
        <meta name="twitter:card"       content="summary_large_image" />
        {/* BreadcrumbList structured data — helps Google understand page hierarchy */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        {/* FAQPage structured data — can appear as rich results in Google */}
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="has-bottom-nav">

        {/* ── Page header ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${sector.bg} 0%, #fff 100%)`,
            borderBottom: `3px solid ${sector.border}`,
            padding: 'clamp(1.5rem, 4vw, 1.75rem) 0',
          }}
        >
          <div className="wx-container">
            {/* Breadcrumb */}
            <nav style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <Link href="/webinars" style={{ color: '#6B7280', textDecoration: 'none' }}>Webinars</Link>
              <span>›</span>
              <span style={{ color: sector.color }}>{sectorName}</span>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 40, flexShrink: 0 }}>{sector.emoji}</span>
              <div>
                <h1
                  style={{
                    fontSize: 'clamp(1.3rem, 3vw, 1.65rem)',
                    fontWeight: 800,
                    color: '#111827',
                    fontFamily: 'var(--font-display)',
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {pageTitle}
                </h1>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
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

        {/* ── Intro text (from sector-meta) ── */}
        {meta?.intro && (
          <div
            style={{
              background: '#fff',
              borderBottom: '1px solid #F3F4F6',
              padding: '1.5rem 0',
            }}
          >
            <div className="wx-container">
              <p
                style={{
                  fontSize: 15,
                  color: '#4B5563',
                  lineHeight: 1.8,
                  maxWidth: 820,
                  margin: 0,
                }}
              >
                {meta.intro}
              </p>
            </div>
          </div>
        )}

        {/* ── Events grid ── */}
        <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '2.5rem' }}>
          {error ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#DC2626', fontSize: 15, marginBottom: 16 }}>{error}</p>
              <button
                onClick={(): void => void fetchEvents(0)}
                style={{ background: 'var(--wx-teal)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
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
                  <div className="col-span-full" style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{sector.emoji}</div>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>No {sectorName} events right now</p>
                    <p style={{ fontSize: 14, marginBottom: 24 }}>Check back soon — new events are added daily.</p>
                    <Link href="/webinars">
                      <button style={{ background: 'var(--wx-teal)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Browse all events →
                      </button>
                    </Link>
                  </div>
                ) : (
                  events.map((event) => (
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
                    onClick={(): void => void fetchEvents(offset, true)}
                    style={{
                      background: '#fff', border: '1.5px solid var(--wx-border)',
                      color: 'var(--wx-ink)', padding: '12px 32px', borderRadius: 12,
                      fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
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

        {/* ── FAQ section (from sector-meta) ── */}
        {meta?.faq && meta.faq.length > 0 && (
          <section
            style={{
              background: '#F9FAFB',
              borderTop: '1px solid #E5E7EB',
              padding: 'clamp(2rem, 5vw, 3rem) 0',
            }}
          >
            <div className="wx-container" style={{ maxWidth: 720 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.65rem)',
                  fontWeight: 400,
                  color: '#111827',
                  marginBottom: '1.5rem',
                }}
              >
                Frequently asked questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meta.faq.map(({ q, a }) => (
                  <FaqItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related sectors (from sector-meta) ── */}
        {meta?.related && meta.related.length > 0 && (
          <section
            style={{
              background: '#fff',
              borderTop: '1px solid #E5E7EB',
              padding: 'clamp(1.5rem, 4vw, 2rem) 0',
            }}
          >
            <div className="wx-container">
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Related topics
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {meta.related.map(({ label, slug: relSlug }) => (
                  <Link
                    key={relSlug}
                    href={`/sector/${relSlug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        background: '#F9FAFB',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: 10,
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: '#374151',
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                      onMouseEnter={(e): void => {
                        (e.currentTarget as HTMLSpanElement).style.borderColor = sector.color;
                        (e.currentTarget as HTMLSpanElement).style.color = sector.color;
                      }}
                      onMouseLeave={(e): void => {
                        (e.currentTarget as HTMLSpanElement).style.borderColor = '#E5E7EB';
                        (e.currentTarget as HTMLSpanElement).style.color = '#374151';
                      }}
                    >
                      {label}
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}
