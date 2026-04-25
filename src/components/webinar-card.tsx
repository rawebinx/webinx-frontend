import { useState, useCallback, memo } from 'react';
import { Link } from 'wouter';
import {
  Heart,
  Eye,
  Clock,
  Calendar,
  Users,
  ExternalLink,
  BadgeCheck,
  Bookmark,
  Play,
  Video,
} from 'lucide-react';
interface WebinarEvent {
  id: number | string;
  slug: string;
  title: string;
  host_name?: string;
  start_time?: string;
  sector_slug?: string;
  sector_name?: string;
  event_url?: string;
  registration_url?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  is_sponsored?: boolean;
  sponsor_url?: string;
  sponsor_cta?: string;
  view_count?: number;
  save_count?: number;
  tags?: unknown;
  thumbnail_url?: string;
  duration_minutes?: number;
  content_type?: 'webinar' | 'podcast' | 'live_event';
}

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
interface WebinarCardProps {
  event: WebinarEvent;
  featured?: boolean;
  compact?: boolean;
}

/* ─────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────── */
const SECTOR_COLORS: Record<string, string> = {
  ai:           '#6366f1',
  technology:   '#3b82f6',
  finance:      '#10b981',
  marketing:    '#f97316',
  startup:      '#8b5cf6',
  hr:           '#f43f5e',
  healthcare:   '#14b8a6',
  education:    '#f59e0b',
};

const SECTOR_BG: Record<string, string> = {
  ai:           'rgba(99,102,241,0.08)',
  technology:   'rgba(59,130,246,0.08)',
  finance:      'rgba(16,185,129,0.08)',
  marketing:    'rgba(249,115,22,0.08)',
  startup:      'rgba(139,92,246,0.08)',
  hr:           'rgba(244,63,94,0.08)',
  healthcare:   'rgba(20,184,166,0.08)',
  education:    'rgba(245,158,11,0.08)',
};

const SECTOR_ICONS: Record<string, string> = {
  ai: '🤖', technology: '💻', finance: '💹',
  marketing: '📣', startup: '🚀', hr: '🤝',
  healthcare: '🏥', education: '🎓',
};

/* ─────────────────────────────────────────────────────
   Platform badge detection
───────────────────────────────────────────────────── */
function detectPlatform(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.toLowerCase();
  if (u.includes('zoom.us') || u.includes('zoom.com')) return 'Zoom';
  if (u.includes('meet.google') || u.includes('g.co/meet')) return 'Google Meet';
  if (u.includes('teams.microsoft') || u.includes('teams.live')) return 'Teams';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'YouTube';
  if (u.includes('webinarjam') || u.includes('webinar.jam')) return 'WebinarJam';
  if (u.includes('demio.com')) return 'Demio';
  if (u.includes('airmeet.com')) return 'Airmeet';
  if (u.includes('hopin.com')) return 'Hopin';
  if (u.includes('streamyard.com')) return 'StreamYard';
  return null;
}

const PLATFORM_COLORS: Record<string, string> = {
  'Zoom': '#2D8CFF',
  'Google Meet': '#34A853',
  'Teams': '#5058D2',
  'YouTube': '#FF0000',
  'WebinarJam': '#E03D2B',
  'Demio': '#6C5CE7',
  'Airmeet': '#FB5343',
  'Hopin': '#7B61FF',
  'StreamYard': '#0E71EB',
};

/* ─────────────────────────────────────────────────────
   Countdown
───────────────────────────────────────────────────── */
function useCountdown(startTime: string | null | undefined): string | null {
  if (!startTime) return null;
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  if (mins > 0) return `in ${mins}m`;
  return 'Starting soon';
}

/* ─────────────────────────────────────────────────────
   Date formatter (IST)
───────────────────────────────────────────────────── */
function formatEventDate(isoString: string | null | undefined): string {
  if (!isoString) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(isoString));
  } catch {
    return '';
  }
}

/* ─────────────────────────────────────────────────────
   Thumbnail / gradient placeholder
───────────────────────────────────────────────────── */
function EventThumbnail({
  thumbnailUrl,
  sectorSlug,
  title,
}: {
  thumbnailUrl?: string | null;
  sectorSlug?: string | null;
  title: string;
}): JSX.Element {
  const [imgError, setImgError] = useState<boolean>(false);
  const color = SECTOR_COLORS[sectorSlug ?? ''] ?? '#0D4F6B';
  const icon = SECTOR_ICONS[sectorSlug ?? ''] ?? '📚';

  if (thumbnailUrl && !imgError) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  /* Sector gradient placeholder */
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{
        aspectRatio: '16/9',
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        borderBottom: `1px solid ${color}20`,
      }}
    >
      {/* Play / video icon */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 44,
          height: 44,
          background: `${color}18`,
          border: `1.5px solid ${color}30`,
        }}
      >
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>

      {/* Decorative dots */}
      <div
        aria-hidden
        className="absolute top-2 right-3 text-4xl opacity-10 select-none pointer-events-none"
        style={{ color, fontFamily: 'monospace', letterSpacing: -4 }}
      >
        ○○○
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Host avatar (initials)
───────────────────────────────────────────────────── */
function HostAvatar({
  name,
  sectorSlug,
  size = 28,
}: {
  name: string;
  sectorSlug?: string | null;
  size?: number;
}): JSX.Element {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const color = SECTOR_COLORS[sectorSlug ?? ''] ?? '#0D4F6B';

  return (
    <span
      className="flex-shrink-0 flex items-center justify-center rounded-full font-semibold select-none"
      style={{
        width: size,
        height: size,
        background: `${color}18`,
        color,
        fontSize: size * 0.35,
        border: `1.5px solid ${color}30`,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {initials || '?'}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Wishlist toggle (localStorage)
───────────────────────────────────────────────────── */
function useWishlist(slug: string): [boolean, () => void] {
  const key = 'webinx_wishlist';

  const read = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
    } catch {
      return [];
    }
  };

  const [saved, setSaved] = useState<boolean>(() => read().includes(slug));

  const toggle = useCallback((): void => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(next.includes(slug));
    window.dispatchEvent(new Event('storage'));
  }, [slug]);

  return [saved, toggle];
}

/* ─────────────────────────────────────────────────────
   Main card component
───────────────────────────────────────────────────── */
const WebinarCard = memo(function WebinarCard({
  event,
  featured = false,
  compact = false,
}: WebinarCardProps): JSX.Element {
  const [saved, toggleSaved] = useWishlist(event.slug);
  const countdown = useCountdown(event.start_time);
  const platform = detectPlatform(event.registration_url ?? event.event_url);
  const sectorSlug = event.sector_slug ?? '';
  const sectorColor = SECTOR_COLORS[sectorSlug] ?? '#0D4F6B';
  const dateStr = formatEventDate(event.start_time);

  const handleWishlistClick = useCallback(
    (e: React.MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      toggleSaved();
    },
    [toggleSaved],
  );

  return (
    <article
      className="wx-card flex flex-col relative overflow-hidden group"
      style={{
        borderLeft: `3px solid ${sectorColor}`,
        ...(featured
          ? {
              borderColor: 'var(--wx-gold)',
              boxShadow: '0 2px 12px rgba(232,180,74,0.12), var(--shadow-sm)',
            }
          : {}),
      }}
    >
      {/* Thumbnail */}
      {!compact && (
        <Link href={`/webinar/${event.slug}`} style={{ textDecoration: 'none' }}>
          <EventThumbnail
            thumbnailUrl={event.thumbnail_url}
            sectorSlug={sectorSlug}
            title={event.title}
          />
        </Link>
      )}

      {/* Featured ribbon */}
      {featured && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold z-10"
          style={{ background: 'var(--wx-gold)', color: 'var(--wx-ink)' }}
        >
          <span style={{ fontSize: 10 }}>★</span>
          Featured
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlistClick}
        aria-label={saved ? 'Remove from wishlist' : 'Save event'}
        className="absolute top-2 rounded-full flex items-center justify-center transition-all z-10"
        style={{
          right: featured ? 80 : 8,
          top: compact ? 12 : 44,
          width: 32,
          height: 32,
          background: saved ? 'rgba(232,180,74,0.15)' : 'rgba(255,255,255,0.9)',
          border: `1.5px solid ${saved ? 'var(--wx-gold)' : 'var(--wx-border)'}`,
          backdropFilter: 'blur(8px)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Heart
          size={14}
          fill={saved ? 'var(--wx-gold)' : 'none'}
          stroke={saved ? 'var(--wx-gold-dark)' : 'var(--wx-muted)'}
          strokeWidth={2}
        />
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Sector + platform row */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/sector/${sectorSlug}`}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: SECTOR_BG[sectorSlug] ?? 'var(--wx-teal-pale)',
              color: sectorColor,
              textDecoration: 'none',
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <span style={{ fontSize: 11 }}>{SECTOR_ICONS[sectorSlug] ?? '📚'}</span>
            {event.sector_name ?? sectorSlug}
          </Link>

          {platform && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: `${PLATFORM_COLORS[platform] ?? '#6b7280'}12`,
                color: PLATFORM_COLORS[platform] ?? '#6b7280',
                border: `1px solid ${PLATFORM_COLORS[platform] ?? '#6b7280'}22`,
              }}
            >
              {platform}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/webinar/${event.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            className="font-semibold mb-2 leading-snug line-clamp-2 group-hover:text-wx-teal transition-colors"
            style={{
              fontSize: compact ? '0.8125rem' : '0.875rem',
              color: 'var(--wx-ink)',
              fontFamily: 'var(--font-sans)',
              display: '-webkit-box' as React.CSSProperties['display'],
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'],
              overflow: 'hidden',
            }}
          >
            {event.title}
          </h3>
        </Link>

        {/* Date + countdown */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--wx-muted)' }}>
            <Calendar size={12} strokeWidth={1.75} />
            <span>{dateStr || 'Date TBD'}</span>
          </div>
          {countdown && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--wx-teal-pale)', color: 'var(--wx-teal)' }}
            >
              {countdown}
            </span>
          )}
        </div>

        {/* Host row */}
        <div className="flex items-center gap-2 mb-3">
          <HostAvatar name={event.host_name ?? 'Host'} sectorSlug={sectorSlug} size={24} />
          <div className="flex items-center gap-1 min-w-0">
            <span
              className="text-xs truncate"
              style={{ color: 'var(--wx-muted)', maxWidth: 160 }}
            >
              {event.host_name ?? 'Unknown Host'}
            </span>
            {event.is_verified && (
              <BadgeCheck size={13} style={{ color: 'var(--wx-teal)', flexShrink: 0 }} />
            )}
          </div>
        </div>

        {/* Micro stats */}
        <div className="flex items-center gap-3 mb-3">
          {(event.view_count ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--wx-muted)' }}>
              <Eye size={11} strokeWidth={1.75} />
              {(event.view_count ?? 0).toLocaleString('en-IN')}
            </span>
          )}
          {(event.save_count ?? 0) > 2 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--wx-muted)' }}>
              <Bookmark size={11} strokeWidth={1.75} />
              {event.save_count} saved
            </span>
          )}
          {event.duration_minutes && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--wx-muted)' }}>
              <Clock size={11} strokeWidth={1.75} />
              {event.duration_minutes} min
            </span>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(event.tags) && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(event.tags as string[]).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA footer */}
        <div
          className="flex items-center gap-2 pt-3"
          style={{ borderTop: '1px solid var(--wx-border-light)' }}
        >
          {event.is_sponsored && event.sponsor_cta && event.sponsor_url ? (
            <a
              href={event.sponsor_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: 'var(--wx-gold)',
                color: 'var(--wx-ink)',
                textDecoration: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {event.sponsor_cta}
              <ExternalLink size={11} />
            </a>
          ) : featured ? (
            <a
              href={event.registration_url ?? event.event_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: 'var(--wx-teal)',
                color: '#fff',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(13,79,107,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Video size={12} />
              Register Now
              <ExternalLink size={11} />
            </a>
          ) : (
            <a
              href={event.registration_url ?? event.event_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: 'transparent',
                color: 'var(--wx-teal)',
                textDecoration: 'none',
                border: '1.5px solid var(--wx-teal)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Register Free
              <ExternalLink size={11} />
            </a>
          )}

          <Link
            href={`/webinar/${event.slug}`}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: 34,
              height: 34,
              background: 'var(--wx-surface)',
              border: '1px solid var(--wx-border)',
              color: 'var(--wx-muted)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            title="View details"
          >
            <Play size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
});

export default WebinarCard;
