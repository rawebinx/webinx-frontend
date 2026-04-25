// src/components/webinar-card.tsx
// WebinX — Enhanced WebinarCard — production version

import { useState, useCallback } from 'react';
import { Link } from 'wouter';
import {
  type WebinarEvent,
  getBestRegistrationUrl,
  getCountdownLabel,
  formatEventDate,
  getSectorConfig,
  detectPlatform,
  PLATFORM_LABELS,
  toggleLocalWishlist,
  isWishlisted,
} from '@/lib/api';

// ─── Avatar Helper ─────────────────────────────────────────────────────────────

function HostAvatar({
  name,
  size = 24,
  color,
}: {
  name: string;
  size?: number;
  color: string;
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <span
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        fontSize: size * 0.4,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-0.5px',
      }}
    >
      {initials || '?'}
    </span>
  );
}

// ─── Sector Thumbnail ─────────────────────────────────────────────────────────

function EventThumbnail({
  event,
  sector,
}: {
  event: WebinarEvent;
  sector: ReturnType<typeof getSectorConfig>;
}) {
  if (event.thumbnail_url) {
    return (
      <img
        src={event.thumbnail_url}
        alt={event.title}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${sector.bg} 0%, ${sector.bg}cc 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `${sector.color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
        }}
      >
        {event.content_type === 'podcast'
          ? '🎙️'
          : event.content_type === 'live_event'
          ? '📍'
          : sector.emoji}
      </div>
    </div>
  );
}

// ─── Main Card Component ──────────────────────────────────────────────────────

interface WebinarCardProps {
  event: WebinarEvent;
  variant?: 'default' | 'featured' | 'compact';
  onWishlistChange?: (slug: string, saved: boolean) => void;
}

export function WebinarCard({
  event,
  variant = 'default',
  onWishlistChange,
}: WebinarCardProps) {
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(event.slug));
  const [wishlistPending, setWishlistPending] = useState(false);

  const sector = getSectorConfig(event.sector_slug ?? event.sector_name);
  const regUrl = getBestRegistrationUrl(event);
  const countdown = event.start_time ? getCountdownLabel(event.start_time) : null;
  const platform = detectPlatform(event.event_url ?? event.registration_url);
  const isFeatured = event.is_featured || variant === 'featured';
  const isCompact = variant === 'compact';

  const handleWishlist = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (wishlistPending) return;
      setWishlistPending(true);
      const added = toggleLocalWishlist(event.slug);
      setWishlisted(added);
      onWishlistChange?.(event.slug, added);
      setWishlistPending(false);
    },
    [event.slug, wishlistPending, onWishlistChange]
  );

  const handleRegister = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!regUrl) return;
      window.open(regUrl, '_blank', 'noopener,noreferrer');
    },
    [regUrl]
  );

  // CTA label by content type
  const ctaLabel =
    event.content_type === 'podcast'
      ? 'Listen Now'
      : event.content_type === 'live_event'
      ? event.ticket_price_inr
        ? `Get Tickets ₹${event.ticket_price_inr}`
        : 'Get Tickets'
      : isFeatured
      ? 'Register Now'
      : 'Register Free';

  return (
    <article
      style={{
        background: '#fff',
        border: `1px solid #E5E7EB`,
        borderLeft: `3px solid ${sector.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 12px 32px ${sector.color}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      {!isCompact && (
        <Link href={`/webinar/${event.slug}`}>
          <div style={{ height: 140, position: 'relative', flexShrink: 0 }}>
            <EventThumbnail event={event} sector={sector} />

            {/* Featured badge */}
            {isFeatured && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: '#E8B44A',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 8,
                  letterSpacing: '0.3px',
                }}
              >
                ★ Featured
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              title={wishlisted ? 'Remove from saved' : 'Save event'}
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                width: 30,
                height: 30,
                background: 'rgba(255,255,255,0.92)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                cursor: 'pointer',
                color: wishlisted ? '#f43f5e' : '#9CA3AF',
                transition: 'color 0.15s',
              }}
            >
              {wishlisted ? '♥' : '♡'}
            </button>

            {/* Platform badge */}
            {platform !== 'other' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {PLATFORM_LABELS[platform]}
              </div>
            )}

            {/* Save count indicator */}
            {event.save_count > 2 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  padding: '2px 7px',
                  fontSize: 10,
                  color: '#6B7280',
                  fontWeight: 500,
                }}
              >
                ♥ {event.save_count} saved
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Body */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

        {/* Sector pill */}
        <Link href={`/sector/${event.sector_slug ?? 'general'}`} onClick={e => e.stopPropagation()}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: sector.bg,
              color: sector.color,
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            {sector.emoji} {sector.name}
          </span>
        </Link>

        {/* Title */}
        <Link href={`/webinar/${event.slug}`}>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: '#111827',
              lineHeight: 1.35,
              cursor: 'pointer',
            }}
          >
            {event.title}
          </h3>
        </Link>

        {/* Date + countdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12.5,
            color: '#6B7280',
          }}
        >
          <span>📅 {formatEventDate(event.start_time)}</span>
          {countdown && (
            <span
              style={{
                background: '#E1F5EE',
                color: '#0D4F6B',
                fontSize: 11.5,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 20,
              }}
            >
              {countdown}
            </span>
          )}
        </div>

        {/* Host row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <HostAvatar name={event.host_name} size={22} color={sector.color} />
          <span style={{ fontSize: 12.5, color: '#4B5563', fontWeight: 500 }}>
            {event.host_slug ? (
              <Link
                href={`/hosts/${event.host_slug}`}
                onClick={e => e.stopPropagation()}
                style={{ color: '#0D4F6B', textDecoration: 'none' }}
              >
                {event.host_name}
              </Link>
            ) : (
              event.host_name
            )}
          </span>
          {event.host_is_verified && (
            <span
              title="Verified Host"
              style={{
                background: '#0D4F6B',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 4,
              }}
            >
              ✓
            </span>
          )}
        </div>

        {/* View count */}
        {event.view_count > 0 && (
          <div style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
            👁 {event.view_count}
          </div>
        )}

        {/* Tags */}
        {event.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {event.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{
                  background: '#F3F4F6',
                  color: '#6B7280',
                  fontSize: 11,
                  padding: '3px 9px',
                  borderRadius: 6,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Live event extras */}
        {event.content_type === 'live_event' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {event.venue_city && (
              <span style={{ fontSize: 12, color: '#6B7280' }}>
                📍 {event.venue_city}
              </span>
            )}
            {event.is_hybrid && (
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 6,
                }}
              >
                Hybrid
              </span>
            )}
          </div>
        )}

        {/* Podcast extras */}
        {event.content_type === 'podcast' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {event.episode_number && (
              <span style={{ fontSize: 12, color: '#6B7280' }}>Ep. #{event.episode_number}</span>
            )}
            {event.duration_minutes && (
              <span
                style={{
                  background: '#f3f4f6',
                  color: '#6B7280',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 6,
                }}
              >
                {event.duration_minutes} min
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Sponsor banner */}
        {event.is_sponsored && event.sponsor_name && (
          <div
            style={{
              background: '#fefce8',
              border: '1px solid #fde68a',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11.5,
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Sponsored by {event.sponsor_name}</span>
            {event.sponsor_cta && event.sponsor_url && (
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(event.sponsor_url!, '_blank', 'noopener,noreferrer');
                }}
                style={{
                  background: '#E8B44A',
                  color: '#fff',
                  border: 'none',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
              >
                {event.sponsor_cta}
              </button>
            )}
          </div>
        )}

        {/* CTA Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {regUrl ? (
            <button
              onClick={handleRegister}
              style={{
                flex: 1,
                padding: '11px 0',
                background: isFeatured ? '#0D4F6B' : 'transparent',
                color: isFeatured ? '#fff' : '#0D4F6B',
                border: isFeatured ? 'none' : '1.5px solid #0D4F6B',
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: 'inherit',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
            >
              {event.content_type === 'podcast' ? '▶ ' : '📹 '}
              {ctaLabel} ↗
            </button>
          ) : (
            <button
              disabled
              style={{
                flex: 1,
                padding: '11px 0',
                background: '#f3f4f6',
                color: '#9CA3AF',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'not-allowed',
                fontFamily: 'inherit',
              }}
              title="Registration link not available"
            >
              Registration Unavailable
            </button>
          )}

          {/* Calendar quick-add */}
          <Link href={`/webinar/${event.slug}`}>
            <button
              title="View details"
              onClick={e => e.stopPropagation()}
              style={{
                width: 38,
                height: 38,
                background: 'transparent',
                border: '1.5px solid #E5E7EB',
                borderRadius: 9,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
                color: '#6B7280',
                fontFamily: 'inherit',
              }}
            >
              ▷
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default WebinarCard;
