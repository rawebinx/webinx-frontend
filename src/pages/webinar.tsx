// src/pages/webinar.tsx
// WebinX — Webinar Detail Page — v2
// Changes from v1:
//  1. Responsive layout — mobile-first single column → lg: two-column sidebar
//  2. Explicit JSX.Element return types on all sub-components
//  3. Responsive hero padding, responsive related events grid
//  4. All existing functionality preserved (JSON-LD, OG, schema, wishlist, alerts, share)

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  getEventBySlug,
  getRelatedEvents,
  submitAlert,
  submitLead,
  buildCalendarUrl,
  getBestRegistrationUrl,
  formatEventDate,
  formatShortDate,
  getCountdownLabel,
  getSectorConfig,
  detectPlatform,
  PLATFORM_LABELS,
  toggleLocalWishlist,
  isWishlisted,
  type WebinarEvent,
} from '@/lib/api';
import WebinarCard from '@/components/webinar-card';
import AffiliateToolsSection from '@/components/AffiliateToolCard';

// ─── Schema.org Event JSON-LD ─────────────────────────────────────────────────

function EventSchema({
  event,
  regUrl,
}: {
  event: WebinarEvent;
  regUrl: string | null;
}): JSX.Element {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `https://webinx.in/webinar/${event.slug}`,
    name: event.title,
    description: event.description,
    startDate: event.start_time,
    endDate: event.end_time ?? undefined,
    eventAttendanceMode:
      event.content_type === 'live_event' && !event.is_online
        ? 'https://schema.org/OfflineEventAttendanceMode'
        : 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: event.host_name ?? 'WebinX',
      url: `https://webinx.in/hosts/${event.host_slug ?? ''}`,
    },
    ...(regUrl ? { url: regUrl } : {}),
    offers: {
      '@type': 'Offer',
      url: regUrl ?? `https://webinx.in/webinar/${event.slug}`,
      price: event.ticket_price_inr ?? 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: event.created_at ?? new Date().toISOString(),
      ...(event.ticket_price_inr
        ? {}
        : { description: 'Free to attend' }),
    },
    isAccessibleForFree: !event.ticket_price_inr,
    inLanguage: 'en-IN',
    location: event.venue_name
      ? {
          '@type': 'Place',
          name: event.venue_name,
          address: event.venue_address ?? event.venue_city ?? '',
        }
      : {
          '@type': 'VirtualLocation',
          url: regUrl ?? `https://webinx.in/webinar/${event.slug}`,
        },
    image: event.thumbnail_url
      ? [event.thumbnail_url]
      : ['https://webinx.in/og-default.jpg'],
    keywords: [event.sector_name ?? '', event.content_type ?? 'webinar', 'India'].filter(Boolean).join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Social Share ─────────────────────────────────────────────────────────────

function SocialShare({ event }: { event: WebinarEvent }): JSX.Element {
  const url  = encodeURIComponent(`https://webinx.in/webinar/${event.slug}`);
  const text = encodeURIComponent(`${event.title} — check out this webinar on WeBinX!`);

  const shareLinks = {
    twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${event.title}\n${decodeURIComponent(url)}`)}`,
  };

  const handleShare = useCallback(
    (platform: keyof typeof shareLinks): void => {
      window.open(shareLinks[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [event.slug],
  );

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(`https://webinx.in/webinar/${event.slug}`);
      alert('Link copied!');
    } catch {
      // clipboard blocked in some contexts — silent fallback
    }
  }, [event.slug]);

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    padding: '8px 0', border: '1px solid #E5E7EB', borderRadius: 9,
    background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
    flex: 1, color: '#374151', fontFamily: 'inherit',
    transition: 'border-color 0.15s, color 0.15s',
  };

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>
        Share this event
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        <button style={btnStyle} onClick={(): void => handleShare('twitter')}
          onMouseEnter={(e): void => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1DA1F2'; el.style.color = '#1DA1F2'; }}
          onMouseLeave={(e): void => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#E5E7EB'; el.style.color = '#374151'; }}>
          𝕏
        </button>
        <button style={btnStyle} onClick={(): void => handleShare('linkedin')}
          onMouseEnter={(e): void => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0A66C2'; el.style.color = '#0A66C2'; }}
          onMouseLeave={(e): void => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#E5E7EB'; el.style.color = '#374151'; }}>
          in
        </button>
        <button style={btnStyle} onClick={(): void => handleShare('whatsapp')}
          onMouseEnter={(e): void => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#25D366'; el.style.color = '#25D366'; }}
          onMouseLeave={(e): void => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#E5E7EB'; el.style.color = '#374151'; }}>
          WA
        </button>
        <button style={btnStyle} onClick={(): void => { void handleCopy(); }}
          onMouseEnter={(e): void => { (e.currentTarget as HTMLElement).style.borderColor = '#0D4F6B'; }}
          onMouseLeave={(e): void => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; }}>
          🔗
        </button>
      </div>
    </div>
  );
}

// ─── Reminder Alert Form ──────────────────────────────────────────────────────

function AlertForm({ eventSlug }: { eventSlug: string }): JSX.Element {
  const [email,        setEmail]        = useState<string>('');
  const [state,        setState]        = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [digestState,  setDigestState]  = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!email.trim() || state === 'loading') return;
      setState('loading');
      try {
        await submitAlert({ email: email.trim(), event_slug: eventSlug });
        setState('done');
      } catch {
        setState('error');
      }
    },
    [email, eventSlug, state],
  );

  const handleDigest = useCallback(async (): Promise<void> => {
    if (digestState !== 'idle') return;
    setDigestState('loading');
    try {
      await submitLead({ email: email.trim(), utm_source: 'reminder-upsell' });
      setDigestState('done');
    } catch {
      // silent — reminder already set, digest is bonus
      setDigestState('done');
    }
  }, [email, digestState]);

  // ── Post-alert success state with digest upsell ──
  if (state === 'done') {
    return (
      <div>
        {/* Reminder confirmed */}
        <div style={{
          background: '#ecfdf5', border: '1px solid #a7f3d0',
          borderRadius: 10, padding: '10px 12px',
          fontSize: 13, color: '#065f46', marginBottom: 10,
        }}>
          ✓ Reminder set — we'll email you before this event!
        </div>

        {/* Digest upsell */}
        {digestState === 'done' ? (
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 10, padding: '10px 12px',
            fontSize: 13, color: '#1e40af',
          }}>
            ✓ You're on the weekly digest. See you Monday!
          </div>
        ) : (
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 12.5, color: '#374151', lineHeight: 1.5 }}>
              📬 Also get India's top webinars every Monday — free digest, no spam.
            </p>
            <button
              onClick={(): void => { void handleDigest(); }}
              disabled={digestState === 'loading'}
              style={{
                width: '100%', padding: '9px',
                background: '#0D4F6B', color: '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 12.5, fontWeight: 700,
                cursor: digestState === 'loading' ? 'wait' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {digestState === 'loading' ? '…' : 'Yes, send me the digest →'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Default: reminder capture form ──
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>
        🔔 Get reminder before event
      </div>
      <form onSubmit={(e): void => { void handleSubmit(e); }} style={{ display: 'flex', gap: 0 }}>
        <input
          type="email"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          style={{
            flex: 1, padding: '9px 12px',
            border: '1.5px solid #E5E7EB', borderRight: 'none',
            borderRadius: '9px 0 0 9px', fontSize: 13,
            fontFamily: 'inherit', outline: 'none', color: '#111827',
          }}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          style={{
            padding: '9px 14px', background: '#0D4F6B', color: '#fff', border: 'none',
            borderRadius: '0 9px 9px 0', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {state === 'loading' ? '…' : 'Notify'}
        </button>
      </form>
      {state === 'error' && (
        <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Something went wrong. Try again.</p>
      )}
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonLoader(): JSX.Element {
  const pulse: React.CSSProperties = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-pulse 1.4s ease infinite',
    borderRadius: 8,
  };
  return (
    <>
      <style>{`@keyframes skeleton-pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div className="wx-container py-8">
        <div style={{ ...pulse, height: 32, width: '60%', marginBottom: 16 }} />
        <div style={{ ...pulse, height: 20, width: '40%', marginBottom: 32 }} />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-10">
          <div>
            <div style={{ ...pulse, height: 240, marginBottom: 20 }} />
            <div style={{ ...pulse, height: 16, marginBottom: 10 }} />
            <div style={{ ...pulse, height: 16, width: '85%', marginBottom: 10 }} />
            <div style={{ ...pulse, height: 16, width: '70%' }} />
          </div>
          <div style={{ ...pulse, height: 400 }} />
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WebinarPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();

  const [event,     setEvent]     = useState<WebinarEvent | null>(null);
  const [related,   setRelated]   = useState<WebinarEvent[]>([]);
  const [loading,   setLoading]   = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState<boolean>(false);

  useEffect((): (() => void) => {
    if (!slug) return (): void => {};

    let cancelled = false;

    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      setEvent(null);
      setRelated([]);

      try {
        const ev = await getEventBySlug(slug);
        if (cancelled) return;

        setEvent(ev);
        setWishlisted(isWishlisted(ev.slug));

        // Related events are non-critical — failure must never block the page
        try {
          const rel = await getRelatedEvents(ev.slug, ev.sector_slug ?? undefined);
          if (!cancelled) setRelated((rel ?? []).slice(0, 3));
        } catch {
          // silently ignore — user still sees the event
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return (): void => { cancelled = true; };
  }, [slug]);

  const handleWishlist = useCallback((): void => {
    if (!event) return;
    const added = toggleLocalWishlist(event.slug);
    setWishlisted(added);
  }, [event]);

  if (loading) return <SkeletonLoader />;

  if (error || !event) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Event not found</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>This event may have ended or been removed.</p>
        <Link href="/webinars">
          <button style={{ background: '#0D4F6B', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Browse all events →
          </button>
        </Link>
      </div>
    );
  }

  // Safe derived values
  const sectorKey  = event.sector_slug ?? event.sector_name ?? '';
  const sector     = getSectorConfig(sectorKey);
  const regUrl     = getBestRegistrationUrl(event);
  const countdown  = getCountdownLabel(event.start_time);
  const calendarUrl = buildCalendarUrl(event);
  const platform   = detectPlatform(event.event_url ?? event.registration_url ?? null);
  const hostName   = event.host_name ?? 'Unknown Host';
  const hostInitials = hostName.split(' ').slice(0, 2).map((w: string) => w[0] ?? '').join('');
  const tags: string[] = Array.isArray(event.tags) ? event.tags : [];
  const canonicalUrl  = `https://webinx.in/webinar/${event.slug}`;
  const ogImage       = event.thumbnail_url ?? 'https://webinx.in/og-default.jpg';
  const ogDescription = event.description?.slice(0, 160) ?? event.title;

  const ctaLabel =
    event.content_type === 'podcast'
      ? 'Listen Now'
      : event.content_type === 'live_event'
      ? event.ticket_price_inr
        ? `Get Tickets — ₹${event.ticket_price_inr}`
        : 'Get Tickets Free'
      : 'Register Now — Free';

  return (
    <>
      <Helmet>
        <title>{event.title} | WeBinX</title>
        <meta name="description" content={ogDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"       content={`${event.title} | WeBinX`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image"       content={ogImage} />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:type"        content="event" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content={event.title} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image"      content={ogImage} />
      </Helmet>

      <EventSchema event={event} regUrl={regUrl} />

      {/* ── Hero Band — responsive padding ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${sector.bg} 0%, #fff 100%)`,
          borderBottom: `3px solid ${sector.border}`,
          padding: 'clamp(1.5rem, 4vw, 2rem) 0',
        }}
      >
        <div className="wx-container">
          {/* Breadcrumb */}
          <nav style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/webinars" style={{ color: '#6B7280', textDecoration: 'none' }}>Webinars</Link>
            <span>›</span>
            {event.sector_slug ? (
              <Link href={`/sector/${event.sector_slug}`} style={{ color: sector.color, textDecoration: 'none' }}>
                {sector.emoji} {sector.name}
              </Link>
            ) : (
              <span style={{ color: sector.color }}>{sector.emoji} {sector.name}</span>
            )}
            <span>›</span>
            <span style={{ color: '#374151' }}>
              {event.title.slice(0, 40)}{event.title.length > 40 ? '…' : ''}
            </span>
          </nav>

          {/* Title + featured badge */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', fontWeight: 800, color: '#111827', lineHeight: 1.3, flex: 1, margin: 0 }}>
              {event.title}
            </h1>
            {event.is_featured && (
              <span style={{ background: '#E8B44A', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, flexShrink: 0, marginTop: 4 }}>
                ★ Featured
              </span>
            )}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: sector.bg, color: sector.color, fontWeight: 600, fontSize: 13, padding: '5px 12px', borderRadius: 8 }}>
              {sector.emoji} {sector.name}
            </span>
            <span style={{ fontSize: 13.5, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
              📅 {formatEventDate(event.start_time)}
              {countdown && (
                <span style={{ background: '#E1F5EE', color: '#0D4F6B', fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>
                  {countdown}
                </span>
              )}
            </span>
            {platform !== 'other' && (
              <span style={{ background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 7 }}>
                {PLATFORM_LABELS[platform]}
              </span>
            )}
            <span style={{ fontSize: 12.5, color: '#9CA3AF' }}>👁 {event.view_count ?? 0} views</span>
          </div>
        </div>
      </div>

      {/* ── Main Content — RESPONSIVE: single col mobile → 2-col desktop ── */}
      <div className="wx-container grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-10 items-start py-8 lg:py-12 pb-16">

        {/* LEFT — Content */}
        <div>
          {/* Host card */}
          <div style={{ background: '#f9fafb', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: sector.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
              {hostInitials || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{hostName}</span>
                {event.host_is_verified && (
                  <span style={{ background: '#0D4F6B', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>✓ VERIFIED</span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>Event Host</div>
            </div>
            {event.host_slug && (
              <Link href={`/hosts/${event.host_slug}`}>
                <button style={{ background: 'transparent', border: '1.5px solid #0D4F6B', color: '#0D4F6B', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  View Profile →
                </button>
              </Link>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 12 }}>About this event</h2>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {event.description}
            </div>
          </div>

          {/* Podcast extras */}
          {event.content_type === 'podcast' && (
            <div style={{ background: '#f5f3ff', border: '1px solid #ede9fe', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {event.podcast_series && <div><span style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 600 }}>SERIES</span><div style={{ fontWeight: 600, color: '#111827' }}>{event.podcast_series}</div></div>}
              {event.episode_number && <div><span style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 600 }}>EPISODE</span><div style={{ fontWeight: 600, color: '#111827' }}>#{event.episode_number}</div></div>}
              {event.duration_minutes && <div><span style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 600 }}>DURATION</span><div style={{ fontWeight: 600, color: '#111827' }}>{event.duration_minutes} min</div></div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 4, width: '100%' }}>
                {event.spotify_url && <a href={event.spotify_url} target="_blank" rel="noopener noreferrer" style={{ background: '#1DB954', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Spotify</a>}
                {event.apple_podcasts_url && <a href={event.apple_podcasts_url} target="_blank" rel="noopener noreferrer" style={{ background: '#8b5cf6', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Apple Podcasts</a>}
              </div>
            </div>
          )}

          {/* Live event extras */}
          {event.content_type === 'live_event' && (event.venue_name || event.venue_city) && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e', marginBottom: 8 }}>📍 Venue</div>
              {event.venue_name    && <div style={{ fontWeight: 600, color: '#111827' }}>{event.venue_name}</div>}
              {event.venue_address && <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 4 }}>{event.venue_address}</div>}
              {event.venue_city    && <div style={{ fontSize: 13, color: '#f97316', fontWeight: 600, marginTop: 4 }}>{event.venue_city}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {event.is_hybrid     && <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>Hybrid</span>}
                {event.is_online     && <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>Online Available</span>}
                {event.max_attendees && <span style={{ background: '#f3f4f6', color: '#6B7280', fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>Max {event.max_attendees} attendees</span>}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 10 }}>Topics covered</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <span key={tag} style={{ background: '#F3F4F6', color: '#374151', fontSize: 13, padding: '5px 12px', borderRadius: 8 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Sticky Sidebar: sticky only on lg+ to avoid mobile weirdness */}
        <aside className="lg:sticky" style={{ top: 80 }}>
          <div
            style={{
              background: '#fff', border: '1px solid #E5E7EB',
              borderRadius: 18, padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Date summary */}
            <div style={{ textAlign: 'center', paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 4 }}>
                {event.content_type === 'podcast' ? 'Published' : 'Event Date'}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>
                {formatShortDate(event.start_time)}
              </div>
              {countdown && (
                <div style={{ background: '#E1F5EE', color: '#0D4F6B', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-block', marginTop: 6 }}>
                  {countdown}
                </div>
              )}
            </div>

            {/* Main CTA */}
            {regUrl ? (
              <a href={regUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: '100%', padding: '14px', background: '#0D4F6B', color: '#fff',
                    border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {event.content_type === 'podcast' ? '▶ ' : '📹 '}{ctaLabel} ↗
                </button>
              </a>
            ) : (
              <button disabled style={{ width: '100%', padding: '14px', background: '#f3f4f6', color: '#9CA3AF', border: 'none', borderRadius: 12, fontSize: 14, cursor: 'not-allowed', fontFamily: 'inherit' }}>
                Registration Not Available
              </button>
            )}

            {/* Secondary actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', padding: '9px 0', background: 'transparent', border: '1.5px solid #E5E7EB', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  📅 Calendar
                </button>
              </a>
              <button
                onClick={handleWishlist}
                style={{ padding: '9px 0', background: wishlisted ? '#fff1f2' : 'transparent', border: `1.5px solid ${wishlisted ? '#f43f5e' : '#E5E7EB'}`, borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: wishlisted ? '#f43f5e' : '#374151', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
              >
                {wishlisted ? '♥ Saved' : '♡ Save'}
              </button>
            </div>

            {/* Certificate */}
            <Link href={`/certificate/${event.slug}`}>
              <button style={{ width: '100%', padding: '9px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: '#92400e', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                🎖 Get Certificate
              </button>
            </Link>

            {/* Alert form */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
              <AlertForm eventSlug={event.slug} />
            </div>

            {/* Social share */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
              <SocialShare event={event} />
            </div>

            {/* Affiliate Tools */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
              <AffiliateToolsSection
                sectorSlug={event.sector_slug ?? ''}
                contentType={event.content_type ?? 'webinar'}
                compact={true}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ── Related Events — responsive grid ── */}
      {related.length > 0 && (
        <div style={{ background: '#f9fafb', padding: 'clamp(2rem, 5vw, 3rem) 0', borderTop: '1px solid #E5E7EB' }}>
          <div className="wx-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Related Events</h2>
              {event.sector_slug && (
                <Link href={`/sector/${event.sector_slug}`} style={{ fontSize: 14, color: '#0D4F6B', fontWeight: 600, textDecoration: 'none' }}>
                  View all {sector.name} events →
                </Link>
              )}
            </div>
            {/* Responsive grid: 1 col mobile → 2 col sm → 3 col lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {related.map((rel) => (
                <WebinarCard key={rel.id} event={rel} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
