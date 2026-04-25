import { useEffect, useState, useCallback } from 'react';
import { useRoute, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  getEventBySlug, getRelatedEvents, formatEventDate,
  isUpcoming, daysUntil, postAlert, buildCalendarUrl,
  toggleWishlist, isWishlisted,
} from '../lib/api';
import type { WebinarEvent } from '../lib/api';
import { WebinarCard } from '../components/webinar-card';
import {
  Calendar, ExternalLink, Share2, Twitter, Linkedin,
  MessageCircle, Bell, BadgeCheck, ChevronRight,
  Clock, Eye, Bookmark, ArrowLeft, Star, Users,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────── */
const SECTOR_COLORS: Record<string, string> = {
  ai: '#6366f1', technology: '#3b82f6', finance: '#10b981',
  marketing: '#f97316', startup: '#8b5cf6', hr: '#f43f5e',
  healthcare: '#14b8a6', education: '#f59e0b',
};
const SECTOR_ICONS: Record<string, string> = {
  ai: '🤖', technology: '💻', finance: '💹', marketing: '📣',
  startup: '🚀', hr: '🤝', healthcare: '🏥', education: '🎓',
};

/* ─────────────────────────────────────────────────────
   Host avatar
───────────────────────────────────────────────────── */
function HostAvatar({ name, color, size = 44 }: { name: string; color: string; size?: number }): JSX.Element {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  return (
    <span
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold select-none"
      style={{
        width: size, height: size,
        background: `${color}18`, color,
        fontSize: size * 0.33,
        border: `2px solid ${color}30`,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {initials || '?'}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Share buttons
───────────────────────────────────────────────────── */
function ShareButtons({ title, url }: { title: string; url: string }): JSX.Element {
  const encoded = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const links = [
    {
      label: 'Twitter / X',
      icon: <Twitter size={14} />,
      href: `https://twitter.com/intent/tweet?text=${encoded}&url=${encodedUrl}`,
      color: '#000',
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin size={14} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle size={14} />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`,
      color: '#25D366',
    },
  ];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
    }
  }, [url]);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold" style={{ color: 'var(--wx-muted)' }}>Share:</span>
      {links.map(link => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
          style={{
            background: `${link.color}10`,
            color: link.color,
            border: `1px solid ${link.color}22`,
          }}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        title="Copy link"
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
        style={{
          background: 'var(--wx-surface)',
          color: 'var(--wx-muted)',
          border: '1px solid var(--wx-border)',
          cursor: 'pointer',
        }}
      >
        <Share2 size={12} />
        Copy link
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Sticky sidebar CTA box
───────────────────────────────────────────────────── */
interface SidebarProps {
  event: WebinarEvent;
  ctaUrl: string;
  upcoming: boolean;
  alertSent: boolean;
  alertEmail: string;
  alertLoading: boolean;
  onAlertEmailChange: (v: string) => void;
  onAlertSubmit: (e: React.FormEvent) => void;
  saved: boolean;
  onToggleSaved: () => void;
}

function Sidebar({
  event, ctaUrl, upcoming,
  alertSent, alertEmail, alertLoading,
  onAlertEmailChange, onAlertSubmit,
  saved, onToggleSaved,
}: SidebarProps): JSX.Element {
  const calUrl = buildCalendarUrl(event);
  const sectorColor = SECTOR_COLORS[event.sector_slug] ?? 'var(--wx-teal)';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1.5px solid var(--wx-border)', boxShadow: 'var(--shadow-md)' }}
    >
      {/* Sector color band */}
      <div style={{ height: 6, background: sectorColor }} />

      <div className="p-5 space-y-4">
        {/* Register CTA */}
        {ctaUrl ? (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: 'var(--wx-teal)',
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(13,79,107,0.25)',
            }}
          >
            <ExternalLink size={15} />
            {event.is_sponsored && event.sponsor_cta
              ? event.sponsor_cta
              : upcoming ? 'Register Now — Free' : 'View Details'}
          </a>
        ) : (
          <Link
            href="/webinars"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm"
            style={{
              background: 'var(--wx-surface)',
              color: 'var(--wx-teal)',
              border: '1.5px solid var(--wx-teal)',
              textDecoration: 'none',
            }}
          >
            Browse similar webinars →
          </Link>
        )}

        {/* Save + Calendar row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onToggleSaved}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: saved ? 'rgba(232,180,74,0.12)' : 'var(--wx-surface)',
              color: saved ? '#92610A' : 'var(--wx-muted)',
              border: `1.5px solid ${saved ? 'rgba(232,180,74,0.4)' : 'var(--wx-border)'}`,
              cursor: 'pointer',
            }}
          >
            <Bookmark size={13} fill={saved ? '#E8B44A' : 'none'} stroke={saved ? '#92610A' : 'currentColor'} />
            {saved ? 'Saved' : 'Save'}
          </button>
          {upcoming && calUrl && (
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: 'var(--wx-surface)',
                color: 'var(--wx-muted)',
                border: '1.5px solid var(--wx-border)',
                textDecoration: 'none',
              }}
            >
              <Calendar size={13} />
              Calendar
            </a>
          )}
        </div>

        {/* Alert */}
        {upcoming && (
          <div
            className="rounded-xl p-3"
            style={{ background: 'var(--wx-teal-pale)', border: '1px solid rgba(13,79,107,0.12)' }}
          >
            {alertSent ? (
              <p className="text-xs font-semibold text-center" style={{ color: 'var(--wx-teal)' }}>
                ✓ Reminder set! We'll email you before this starts.
              </p>
            ) : (
              <>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--wx-teal)' }}>
                  <Bell size={11} className="inline mr-1" />
                  Get reminded before it starts
                </p>
                <form onSubmit={onAlertSubmit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={alertEmail}
                    onChange={e => onAlertEmailChange(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg outline-none"
                    style={{
                      border: '1.5px solid rgba(13,79,107,0.2)',
                      background: '#fff',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--wx-ink)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={alertLoading}
                    className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: 'var(--wx-teal)',
                      color: '#fff',
                      border: 'none',
                      cursor: alertLoading ? 'wait' : 'pointer',
                      opacity: alertLoading ? 0.7 : 1,
                    }}
                  >
                    {alertLoading ? 'Setting…' : 'Remind me'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Stats */}
        <div
          className="flex items-center justify-around py-2 rounded-xl"
          style={{ background: 'var(--wx-surface)', border: '1px solid var(--wx-border)' }}
        >
          {event.view_count > 0 && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-bold text-sm" style={{ color: 'var(--wx-ink)' }}>
                {event.view_count.toLocaleString('en-IN')}
              </span>
              <span className="text-xs" style={{ color: 'var(--wx-muted)' }}>views</span>
            </div>
          )}
          {event.click_count > 0 && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-bold text-sm" style={{ color: 'var(--wx-ink)' }}>
                {event.click_count.toLocaleString('en-IN')}
              </span>
              <span className="text-xs" style={{ color: 'var(--wx-muted)' }}>clicks</span>
            </div>
          )}
          {event.relevance_score > 0 && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-bold text-sm" style={{ color: 'var(--wx-ink)' }}>
                {Math.round(event.relevance_score * 10)}/10
              </span>
              <span className="text-xs" style={{ color: 'var(--wx-muted)' }}>score</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Loading skeleton
───────────────────────────────────────────────────── */
function LoadingSkeleton(): JSX.Element {
  return (
    <div className="wx-container has-bottom-nav" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="skeleton h-3 w-32 rounded-full mb-6" />
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-5 w-24 rounded-full mb-4" />
        <div className="skeleton h-8 w-full mb-2" />
        <div className="skeleton h-8 w-4/5 mb-6" />
        <div className="skeleton h-4 w-48 mb-2" />
        <div className="skeleton h-4 w-36 mb-8" />
        <div className="skeleton h-24 w-full rounded-xl mb-4" />
        <div className="skeleton h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────── */
export default function WebinarPage(): JSX.Element {
  const [, params] = useRoute('/webinar/:slug');
  const slug = params?.slug ?? '';

  const [event, setEvent] = useState<WebinarEvent | null>(null);
  const [related, setRelated] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [alertEmail, setAlertEmail] = useState<string>('');
  const [alertSent, setAlertSent] = useState<boolean>(false);
  const [alertLoading, setAlertLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setNotFound(false);
    const cleanSlug = slug.replace(/\uffff/g, '-');
    const data = await getEventBySlug(cleanSlug);
    if (data) {
      setEvent(data);
      setSaved(isWishlisted(data.slug));
      const rel = await getRelatedEvents(data.slug, data.sector_slug, 4);
      setRelated(rel ?? []);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (slug) void load();
  }, [slug, load]);

  const handleAlertSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!alertEmail || !event) return;
    setAlertLoading(true);
    const res = await postAlert({ email: alertEmail, event_slug: event.slug });
    setAlertLoading(false);
    if (res.status === 'ok') setAlertSent(true);
  }, [alertEmail, event]);

  const handleToggleSaved = useCallback((): void => {
    if (!event) return;
    const nowSaved = toggleWishlist(event.slug);
    setSaved(nowSaved);
    window.dispatchEvent(new Event('storage'));
  }, [event]);

  /* ── Loading ── */
  if (loading) return <LoadingSkeleton />;

  /* ── Not found ── */
  if (notFound || !event) {
    return (
      <>
        <Helmet>
          <title>Webinar Not Found — WeBinX</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex flex-col items-center justify-center py-24 text-center px-4 has-bottom-nav">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl"
            style={{ background: 'var(--wx-surface)', border: '1px solid var(--wx-border)' }}
          >
            🔍
          </div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--wx-ink)' }}>
            Webinar not found
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--wx-muted)' }}>
            This event may have ended or been removed.
          </p>
          <Link
            href="/webinars"
            className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl"
            style={{ background: 'var(--wx-teal)', color: '#fff', textDecoration: 'none' }}
          >
            <ArrowLeft size={14} />
            Browse all webinars
          </Link>
        </div>
      </>
    );
  }

  /* ── Data ── */
  const upcoming = isUpcoming(event.start_time);
  const days = daysUntil(event.start_time);
  const dateStr = formatEventDate(event.start_time);
  const canonicalUrl = `https://www.webinx.in/webinar/${event.slug}`;
  const ctaUrl = event.url && event.url !== '#' ? event.url : '';
  const sectorColor = SECTOR_COLORS[event.sector_slug] ?? 'var(--wx-teal)';
  const sectorIcon = SECTOR_ICONS[event.sector_slug] ?? '📚';
  const description = event.description
    ? event.description.replace(/<[^>]+>/g, '').slice(0, 160)
    : `Join "${event.title}" — a free online event on WeBinX.`;

  /* Schema.org */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': canonicalUrl,
    name: event.title,
    description: event.description?.replace(/<[^>]+>/g, '').slice(0, 500) ?? event.title,
    startDate: event.start_time ?? undefined,
    endDate: event.end_time ?? undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url: ctaUrl || canonicalUrl },
    organizer: { '@type': 'Organization', name: event.host_name || 'WeBinX' },
    url: canonicalUrl,
    isAccessibleForFree: true,
    inLanguage: 'en-IN',
    ...(event.sector_name ? { about: { '@type': 'Thing', name: event.sector_name } } : {}),
  };

  return (
    <>
      <Helmet>
        <title>{event.title} | WeBinX</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event.title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="has-bottom-nav">
        {/* ─── Sector hero band ─── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${sectorColor}12 0%, ${sectorColor}06 100%)`,
            borderBottom: `1px solid ${sectorColor}20`,
            padding: '1.5rem 0 0',
          }}
        >
          <div className="wx-container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--wx-muted)' }}>
              <Link href="/" style={{ color: 'var(--wx-muted)', textDecoration: 'none' }}>Home</Link>
              <ChevronRight size={12} />
              <Link href="/webinars" style={{ color: 'var(--wx-muted)', textDecoration: 'none' }}>Webinars</Link>
              {event.sector_slug && (
                <>
                  <ChevronRight size={12} />
                  <Link
                    href={`/sector/${event.sector_slug}`}
                    style={{ color: sectorColor, textDecoration: 'none', fontWeight: 600 }}
                  >
                    {sectorIcon} {event.sector_name}
                  </Link>
                </>
              )}
            </nav>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.sector_name && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${sectorColor}15`, color: sectorColor, border: `1px solid ${sectorColor}25` }}
                >
                  {sectorIcon} {event.sector_name}
                </span>
              )}
              {upcoming && days !== null && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'var(--wx-teal-pale)', color: 'var(--wx-teal)', border: '1px solid rgba(13,79,107,0.15)' }}
                >
                  {days === 0 ? '🔴 Today' : days === 1 ? '📅 Tomorrow' : `📅 In ${days} days`}
                </span>
              )}
              {!upcoming && (
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: 'var(--wx-surface)', color: 'var(--wx-muted)', border: '1px solid var(--wx-border)' }}
                >
                  Ended
                </span>
              )}
              {event.is_featured && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'var(--wx-gold-pale)', color: '#92610A', border: '1px solid rgba(232,180,74,0.3)' }}
                >
                  <Star size={11} fill="#E8B44A" stroke="none" />
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-bold leading-tight mb-5"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.375rem, 3.5vw, 2rem)',
                color: 'var(--wx-ink)',
                maxWidth: '72ch',
              }}
            >
              {event.title}
            </h1>

            {/* Host row */}
            <div className="flex items-center gap-3 pb-5">
              <HostAvatar name={event.host_name || 'H'} color={sectorColor} size={44} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm" style={{ color: 'var(--wx-ink)' }}>
                    {event.host_name}
                  </span>
                  {event.is_verified && (
                    <BadgeCheck size={15} style={{ color: 'var(--wx-teal)' }} />
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--wx-muted)' }}>
                  <Calendar size={11} className="inline mr-1" />
                  {dateStr}
                  {event.source_name && (
                    <span className="ml-3 opacity-70">via {event.source_name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="flex gap-8 items-start">

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">

              {/* Mobile CTA (shown above content on mobile) */}
              {ctaUrl && (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm mb-6"
                  style={{
                    background: 'var(--wx-teal)',
                    color: '#fff',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(13,79,107,0.25)',
                  }}
                >
                  <ExternalLink size={15} />
                  {upcoming ? 'Register Now — Free' : 'View Details'}
                </a>
              )}

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {event.tags
                    .filter(t => t && !t.startsWith('<') && !t.startsWith('href'))
                    .slice(0, 8)
                    .map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background: 'var(--wx-surface)',
                          color: 'var(--wx-muted)',
                          border: '1px solid var(--wx-border)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}

              {/* Description */}
              {event.description ? (
                <div
                  className="text-sm leading-relaxed mb-8"
                  style={{
                    color: 'var(--wx-ink)',
                    lineHeight: 1.75,
                    fontFamily: 'var(--font-sans)',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: event.description.replace(/<script[^>]*>.*?<\/script>/gi, ''),
                  }}
                />
              ) : (
                <p className="text-sm mb-8" style={{ color: 'var(--wx-muted)' }}>
                  No description available for this event.
                </p>
              )}

              {/* Share */}
              <div
                className="p-4 rounded-xl mb-8"
                style={{ background: 'var(--wx-surface)', border: '1px solid var(--wx-border)' }}
              >
                <ShareButtons title={event.title} url={canonicalUrl} />
              </div>

              {/* Sponsor note */}
              {event.is_sponsored && event.sponsor_name && (
                <p className="text-xs mb-6" style={{ color: 'var(--wx-muted)' }}>
                  Sponsored by <span className="font-medium">{event.sponsor_name}</span>
                </p>
              )}

              {/* Mobile alert */}
              {upcoming && (
                <div className="md:hidden mb-8 p-4 rounded-xl" style={{ background: 'var(--wx-teal-pale)', border: '1px solid rgba(13,79,107,0.12)' }}>
                  {alertSent ? (
                    <p className="text-sm font-semibold" style={{ color: 'var(--wx-teal)' }}>
                      ✓ Reminder set! We'll email you before this starts.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium mb-3" style={{ color: 'var(--wx-teal)' }}>
                        <Bell size={13} className="inline mr-1" />
                        Get reminded before it starts
                      </p>
                      <form onSubmit={handleAlertSubmit} className="flex gap-2">
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={alertEmail}
                          onChange={e => setAlertEmail(e.target.value)}
                          className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                          style={{
                            border: '1.5px solid rgba(13,79,107,0.2)',
                            background: '#fff',
                            fontFamily: 'var(--font-sans)',
                          }}
                        />
                        <button
                          type="submit"
                          disabled={alertLoading}
                          className="px-4 py-2 rounded-lg text-sm font-semibold"
                          style={{
                            background: 'var(--wx-teal)', color: '#fff',
                            border: 'none', cursor: 'pointer',
                            opacity: alertLoading ? 0.7 : 1,
                          }}
                        >
                          {alertLoading ? '…' : 'Remind me'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}

              {/* Related events */}
              {related.length > 0 && (
                <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--wx-border)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      className="font-semibold"
                      style={{ fontSize: '1.125rem', color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)' }}
                    >
                      Related Events
                    </h2>
                    <Link
                      href={`/sector/${event.sector_slug}`}
                      className="text-xs font-semibold"
                      style={{ color: 'var(--wx-teal)', textDecoration: 'none' }}
                    >
                      View all {event.sector_name} →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map(e => (
                      <WebinarCard key={e.id || e.slug} event={e} />
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <div className="mt-8">
                <Link
                  href="/webinars"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: 'var(--wx-muted)', textDecoration: 'none' }}
                >
                  <ArrowLeft size={14} />
                  Browse all webinars
                </Link>
              </div>
            </div>

            {/* ── Sticky sidebar (desktop only) ── */}
            <div
              className="hidden md:block flex-shrink-0"
              style={{ width: 280, position: 'sticky', top: '5rem' }}
            >
              <Sidebar
                event={event}
                ctaUrl={ctaUrl}
                upcoming={upcoming}
                alertSent={alertSent}
                alertEmail={alertEmail}
                alertLoading={alertLoading}
                onAlertEmailChange={setAlertEmail}
                onAlertSubmit={handleAlertSubmit}
                saved={saved}
                onToggleSaved={handleToggleSaved}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
