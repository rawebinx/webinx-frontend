// src/pages/host.tsx
// WebinX — Host Directory — World-Class v2
// Changes from v1:
//   - Uses getHosts() from @/lib/api (no raw fetch, no any, no API_BASE inline)
//   - Uses Host type from @/lib/api
//   - Premium 3-col grid with host cards (avatar, verified ring, plan tier badge)
//   - Client-side search filter
//   - Load-more pagination (12 per page)
//   - Proper skeleton → content → error → empty states
//   - Verified badge + Pro / Scale / Agency plan tier pills
//   - SEO-ready Helmet with canonical

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Search, CheckCircle, ChevronRight, Users, Eye, Calendar } from 'lucide-react';
import { getHosts, type Host } from '@/lib/api';

const PAGE_SIZE = 12;

// ─── Plan tier badge config ───────────────────────────────────────────────────

interface TierConfig {
  label: string;
  bg: string;
  color: string;
}

const TIER_CONFIG: Record<string, TierConfig> = {
  pro:    { label: 'Pro',    bg: '#E1F5EE', color: '#0D4F6B' },
  scale:  { label: 'Scale',  bg: '#F5F3FF', color: '#7C3AED' },
  agency: { label: 'Agency', bg: '#FFFBEB', color: '#92400E' },
};

// ─── Host avatar (image with initials fallback) ───────────────────────────────

function HostAvatar({
  host,
  size = 64,
}: {
  host: Host;
  size?: number;
}): JSX.Element {
  const [imgError, setImgError] = useState<boolean>(false);

  const initials = host.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  // Verified hosts get a teal ring; others get a subtle gray ring
  const ringColor = host.is_verified ? '#0D4F6B' : '#E5E7EB';
  const ringWidth = host.is_verified ? 2.5 : 1.5;

  if (host.avatar_url && !imgError) {
    return (
      <img
        src={host.avatar_url}
        alt={host.name}
        loading="lazy"
        onError={(): void => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: `${ringWidth}px solid ${ringColor}`,
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0D4F6B 0%, #1a6e8f 100%)',
        border: `${ringWidth}px solid ${ringColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#fff',
        fontSize: size * 0.34,
        fontWeight: 700,
        letterSpacing: '-0.5px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {initials || '?'}
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function HostCardSkeleton(): JSX.Element {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 16,
        padding: '24px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%' }} />
      <div className="skeleton h-4 w-32 rounded-lg" />
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-3 w-16 rounded-full mt-1" />
      <div style={{ width: '100%', height: 1, background: '#F3F4F6', margin: '4px 0' }} />
      <div className="flex gap-4 w-full justify-center">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
      <div className="skeleton h-9 w-full rounded-xl mt-1" />
    </div>
  );
}

// ─── Host card ────────────────────────────────────────────────────────────────

function HostCard({ host }: { host: Host }): JSX.Element {
  const tier = host.plan_tier && host.plan_tier !== 'free'
    ? TIER_CONFIG[host.plan_tier] ?? null
    : null;

  return (
    <Link href={`/hosts/${host.slug}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: '24px 20px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          height: '100%',
        }}
        onMouseEnter={(e): void => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(13,79,107,0.12)';
        }}
        onMouseLeave={(e): void => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Avatar */}
        <HostAvatar host={host} size={64} />

        {/* Name */}
        <h3
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.35,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {host.name}
        </h3>

        {/* Org name */}
        {host.org_name && (
          <p
            style={{
              fontSize: 12.5,
              color: '#6B7280',
              textAlign: 'center',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {host.org_name}
          </p>
        )}

        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {host.is_verified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#E1F5EE',
                color: '#0D4F6B',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 20,
                letterSpacing: '0.2px',
              }}
            >
              <CheckCircle size={10} strokeWidth={2.5} />
              Verified
            </span>
          )}
          {tier && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: tier.bg,
                color: tier.color,
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 20,
                letterSpacing: '0.2px',
              }}
            >
              {tier.label}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: '#F3F4F6', margin: '4px 0' }} />

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            fontSize: 12,
            color: '#6B7280',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} strokeWidth={1.75} />
            <span>
              {host.event_count}
              {' '}
              event{host.event_count !== 1 ? 's' : ''}
            </span>
          </span>
          {(host.total_views ?? 0) > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} strokeWidth={1.75} />
              <span>{((host.total_views ?? 0) / 1000).toFixed(1)}K views</span>
            </span>
          )}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 10,
            width: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'transparent',
              border: '1.5px solid #0D4F6B',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: '#0D4F6B',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e): void => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = '#0D4F6B';
              el.style.color = '#fff';
            }}
            onMouseLeave={(e): void => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = 'transparent';
              el.style.color = '#0D4F6B';
            }}
          >
            View Profile
            <ChevronRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Empty / no-results state ─────────────────────────────────────────────────

function EmptyState({ query }: { query: string }): JSX.Element {
  return (
    <div className="text-center py-16">
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <Users size={28} style={{ color: '#9CA3AF' }} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
        {query ? `No hosts matching "${query}"` : 'No hosts yet'}
      </h3>
      <p style={{ fontSize: 13.5, color: '#6B7280', marginBottom: 20 }}>
        {query
          ? 'Try a different name or organisation.'
          : 'Hosts who list events on WebinX will appear here.'}
      </p>
      {query && (
        <Link href="/submit-webinar">
          <button
            style={{
              padding: '10px 24px',
              background: '#0D4F6B',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            List Your Event →
          </button>
        </Link>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HostPage(): JSX.Element {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const loadHosts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHosts();
      // Sort: verified first, then by event_count desc
      const sorted = [...data].sort((a, b) => {
        if (a.is_verified !== b.is_verified) return a.is_verified ? -1 : 1;
        return (b.event_count ?? 0) - (a.event_count ?? 0);
      });
      setHosts(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hosts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHosts();
  }, [loadHosts]);

  // Reset pagination when search query changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  // Client-side filter by name or org
  const filtered = useMemo<Host[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hosts;
    return hosts.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.org_name ?? '').toLowerCase().includes(q),
    );
  }, [hosts, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const verifiedCount = hosts.filter((h) => h.is_verified).length;

  const handleLoadMore = useCallback((): void => {
    setVisibleCount((c) => c + PAGE_SIZE);
  }, []);

  return (
    <>
      <Helmet>
        <title>Webinar Hosts &amp; Speakers in India — WebinX</title>
        <meta
          name="description"
          content={`Browse ${hosts.length > 0 ? hosts.length + '+ ' : ''}webinar hosts, speakers and organisations sharing knowledge on WebinX — India's knowledge events platform.`}
        />
        <link rel="canonical" href="https://www.webinx.in/host" />
        <meta property="og:title" content="Webinar Hosts & Speakers in India — WebinX" />
        <meta property="og:description" content="Browse hosts, speakers and organisations listing events on WebinX." />
      </Helmet>

      <main className="has-bottom-nav">
        {/* ── Page header ─── */}
        <section
          style={{
            background: 'linear-gradient(to bottom, var(--wx-surface, #F8FAFC) 0%, #fff 100%)',
            borderBottom: '1px solid #E5E7EB',
            padding: 'clamp(2rem, 5vw, 3.5rem) 0 2rem',
          }}
        >
          <div className="wx-container">
            {/* Breadcrumb */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                color: '#6B7280',
                marginBottom: 16,
              }}
              aria-label="Breadcrumb"
            >
              <Link href="/" style={{ color: '#0D4F6B', textDecoration: 'none', fontWeight: 500 }}>
                Home
              </Link>
              <ChevronRight size={13} style={{ color: '#D1D5DB' }} />
              <span style={{ color: '#374151', fontWeight: 500 }}>Hosts</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    fontWeight: 400,
                    color: '#0D4F6B',
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}
                >
                  Knowledge Hosts on WebinX
                </h1>
                {!loading && hosts.length > 0 && (
                  <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                    <strong style={{ color: '#111827' }}>{hosts.length}</strong> hosts &nbsp;·&nbsp;
                    <strong style={{ color: '#111827' }}>{verifiedCount}</strong> verified &nbsp;·&nbsp;
                    Updated daily
                  </p>
                )}
              </div>

              {/* Become a host CTA */}
              <Link
                href="/submit-webinar"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: '#0D4F6B',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(13,79,107,0.2)',
                }}
              >
                <Users size={15} strokeWidth={2} />
                List Your Event Free
              </Link>
            </div>
          </div>
        </section>

        {/* ── Search + grid ─── */}
        <section className="wx-container" style={{ padding: '2rem var(--wx-gutter, 1rem)' }}>

          {/* Search bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: 480,
              marginBottom: '1.75rem',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none',
              }}
            />
            <input
              type="search"
              value={query}
              onChange={(e): void => setQuery(e.target.value)}
              placeholder="Search hosts or organisations…"
              style={{
                width: '100%',
                paddingLeft: 40,
                paddingRight: 16,
                paddingTop: 10,
                paddingBottom: 10,
                border: '1.5px solid #E5E7EB',
                borderRadius: 10,
                fontSize: 14,
                color: '#111827',
                background: '#fff',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#0D4F6B'; }}
              onBlur={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
            />
          </div>

          {/* Result count (when searching) */}
          {query && !loading && (
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: '1rem' }}>
              {filtered.length === 0
                ? 'No results'
                : `${filtered.length} host${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          )}

          {/* ── Error state ── */}
          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 13.5,
                color: '#991B1B',
              }}
            >
              <span>Failed to load hosts. Please try again.</span>
              <button
                onClick={(): void => void loadHosts()}
                style={{
                  padding: '6px 14px',
                  background: '#991B1B',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {loading && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <HostCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Host grid ── */}
          {!loading && filtered.length > 0 && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'start',
                }}
              >
                {visible.map((host) => (
                  <HostCard key={host.slug} host={host} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button
                    onClick={handleLoadMore}
                    style={{
                      padding: '11px 32px',
                      border: '1.5px solid #0D4F6B',
                      background: 'transparent',
                      color: '#0D4F6B',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e): void => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = '#0D4F6B';
                      el.style.color = '#fff';
                    }}
                    onMouseLeave={(e): void => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = 'transparent';
                      el.style.color = '#0D4F6B';
                    }}
                  >
                    Show more hosts ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && filtered.length === 0 && (
            <EmptyState query={query} />
          )}

        </section>
      </main>
    </>
  );
}
