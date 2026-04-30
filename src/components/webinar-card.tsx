// src/components/webinar-card.tsx
// WebinX — World-Class WebinarCard v2 — Production
// Changes from v1: premium SVG illustrated sector thumbnails, uniform card
// height, sector pill on thumbnail, cleaner overlay badge layout, refined
// CTA, imgError fallback recovery on real thumbnails.

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

// ─── SVG Sector Patterns ──────────────────────────────────────────────────────
// Each pattern is a 400×172 SVG rendered at 100%×100% inside the thumbnail.
// All elements use `color` prop (the sector's main accent) at low opacity so
// the pale gradient background shows through.

function AiPattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── connecting lines ── */}
      <line x1="60"  y1="86"  x2="170" y2="38"  stroke={color} strokeWidth="1.2" opacity="0.28"/>
      <line x1="60"  y1="86"  x2="170" y2="86"  stroke={color} strokeWidth="1.2" opacity="0.28"/>
      <line x1="60"  y1="86"  x2="170" y2="134" stroke={color} strokeWidth="1.2" opacity="0.28"/>
      <line x1="170" y1="38"  x2="280" y2="20"  stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="170" y1="38"  x2="280" y2="86"  stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="170" y1="86"  x2="280" y2="60"  stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="170" y1="86"  x2="280" y2="120" stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="170" y1="134" x2="280" y2="86"  stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="170" y1="134" x2="280" y2="152" stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="280" y1="20"  x2="370" y2="46"  stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="280" y1="86"  x2="370" y2="86"  stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="280" y1="152" x2="370" y2="130" stroke={color} strokeWidth="0.75" opacity="0.14"/>
      {/* ── nodes ── */}
      <circle cx="60"  cy="86"  r="6"   fill={color} opacity="0.45"/>
      <circle cx="170" cy="38"  r="5"   fill={color} opacity="0.4"/>
      <circle cx="170" cy="86"  r="6"   fill={color} opacity="0.5"/>
      <circle cx="170" cy="134" r="5"   fill={color} opacity="0.4"/>
      <circle cx="280" cy="20"  r="4"   fill={color} opacity="0.35"/>
      <circle cx="280" cy="60"  r="4"   fill={color} opacity="0.35"/>
      <circle cx="280" cy="86"  r="6"   fill={color} opacity="0.48"/>
      <circle cx="280" cy="120" r="4"   fill={color} opacity="0.35"/>
      <circle cx="280" cy="152" r="4"   fill={color} opacity="0.35"/>
      <circle cx="370" cy="46"  r="4.5" fill={color} opacity="0.3"/>
      <circle cx="370" cy="86"  r="5"   fill={color} opacity="0.35"/>
      <circle cx="370" cy="130" r="4.5" fill={color} opacity="0.3"/>
      {/* ── pulse rings on central output node ── */}
      <circle cx="280" cy="86" r="12" fill="none" stroke={color} strokeWidth="1"    opacity="0.18"/>
      <circle cx="280" cy="86" r="20" fill="none" stroke={color} strokeWidth="0.75" opacity="0.10"/>
    </svg>
  );
}

function FinancePattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── grid lines ── */}
      <line x1="0" y1="43"  x2="400" y2="43"  stroke={color} strokeWidth="0.6" opacity="0.12" strokeDasharray="6 10"/>
      <line x1="0" y1="86"  x2="400" y2="86"  stroke={color} strokeWidth="0.6" opacity="0.12" strokeDasharray="6 10"/>
      <line x1="0" y1="129" x2="400" y2="129" stroke={color} strokeWidth="0.6" opacity="0.12" strokeDasharray="6 10"/>
      {/* ── area fill ── */}
      <path d="M 0,145 L 40,128 L 80,115 L 130,95 L 175,108 L 220,78 L 265,88 L 300,60 L 340,68 L 380,42 L 400,48 L 400,172 L 0,172 Z"
        fill={color} opacity="0.09"/>
      {/* ── chart line ── */}
      <polyline
        points="0,145 40,128 80,115 130,95 175,108 220,78 265,88 300,60 340,68 380,42 400,48"
        fill="none" stroke={color} strokeWidth="2.5" opacity="0.45"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* ── data dots ── */}
      <circle cx="130" cy="95"  r="3.5" fill={color} opacity="0.55"/>
      <circle cx="220" cy="78"  r="3.5" fill={color} opacity="0.55"/>
      <circle cx="300" cy="60"  r="4.5" fill={color} opacity="0.65"/>
      <circle cx="380" cy="42"  r="3.5" fill={color} opacity="0.55"/>
      {/* ── upward arrow (top-right) ── */}
      <line x1="355" y1="140" x2="382" y2="118" stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
      <line x1="382" y1="118" x2="382" y2="130" stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
      <line x1="382" y1="118" x2="370" y2="118" stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
    </svg>
  );
}

function MarketingPattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── source dot ── */}
      <circle cx="70" cy="86" r="8"   fill={color} opacity="0.5"/>
      <circle cx="70" cy="86" r="14"  fill={color} opacity="0.15"/>
      {/* ── broadcast rings ── */}
      <circle cx="70" cy="86" r="38"  fill="none" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      <circle cx="70" cy="86" r="70"  fill="none" stroke={color} strokeWidth="1.2" opacity="0.22"/>
      <circle cx="70" cy="86" r="110" fill="none" stroke={color} strokeWidth="1"   opacity="0.15"/>
      <circle cx="70" cy="86" r="160" fill="none" stroke={color} strokeWidth="0.75" opacity="0.08"/>
      {/* ── receiver dots ── */}
      <circle cx="222" cy="42"  r="5"   fill={color} opacity="0.35"/>
      <circle cx="264" cy="86"  r="6.5" fill={color} opacity="0.42"/>
      <circle cx="222" cy="130" r="5"   fill={color} opacity="0.35"/>
      <circle cx="314" cy="55"  r="4"   fill={color} opacity="0.28"/>
      <circle cx="314" cy="118" r="4"   fill={color} opacity="0.28"/>
      <circle cx="364" cy="86"  r="5.5" fill={color} opacity="0.32"/>
      <circle cx="352" cy="38"  r="3"   fill={color} opacity="0.2"/>
      <circle cx="352" cy="134" r="3"   fill={color} opacity="0.2"/>
    </svg>
  );
}

function StartupPattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── trajectory arc ── */}
      <path d="M 40,158 Q 180,65 370,12" fill="none" stroke={color}
        strokeWidth="1.5" strokeDasharray="7 7" opacity="0.28"/>
      {/* ── trail particles ── */}
      <circle cx="82"  cy="140" r="2.5" fill={color} opacity="0.32"/>
      <circle cx="132" cy="114" r="2"   fill={color} opacity="0.28"/>
      <circle cx="188" cy="88"  r="2.5" fill={color} opacity="0.32"/>
      <circle cx="248" cy="62"  r="2"   fill={color} opacity="0.28"/>
      <circle cx="308" cy="38"  r="2.5" fill={color} opacity="0.32"/>
      {/* ── main star ── */}
      <polygon points="340,18 343.5,29 355,29 346,36 349.5,47 340,40 330.5,47 334,36 325,29 336.5,29"
        fill={color} opacity="0.48"/>
      {/* ── secondary stars ── */}
      <polygon points="274,108 276.5,115 284,115 278,119 280.5,126 274,122 267.5,126 270,119 264,115 271.5,115"
        fill={color} opacity="0.3"/>
      <polygon points="148,144 150,149 155,149 151,152 152.5,157 148,154 143.5,157 145,152 141,149 146,149"
        fill={color} opacity="0.25"/>
      {/* ── launch rings ── */}
      <circle cx="340" cy="18" r="16" fill="none" stroke={color} strokeWidth="0.75" opacity="0.2"/>
      <circle cx="340" cy="18" r="26" fill="none" stroke={color} strokeWidth="0.5"  opacity="0.12"/>
    </svg>
  );
}

function HrPattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── connection lines ── */}
      <line x1="200" y1="75"  x2="118" y2="48"  stroke={color} strokeWidth="1.5" opacity="0.28"/>
      <line x1="200" y1="75"  x2="282" y2="48"  stroke={color} strokeWidth="1.5" opacity="0.28"/>
      <line x1="200" y1="75"  x2="128" y2="128" stroke={color} strokeWidth="1.5" opacity="0.28"/>
      <line x1="200" y1="75"  x2="272" y2="128" stroke={color} strokeWidth="1.5" opacity="0.28"/>
      <line x1="118" y1="48"  x2="48"  y2="86"  stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="282" y1="48"  x2="352" y2="86"  stroke={color} strokeWidth="1"   opacity="0.2"/>
      <line x1="118" y1="48"  x2="282" y2="48"  stroke={color} strokeWidth="0.75" opacity="0.14" strokeDasharray="5 5"/>
      <line x1="128" y1="128" x2="272" y2="128" stroke={color} strokeWidth="0.75" opacity="0.14" strokeDasharray="5 5"/>
      {/* ── outer nodes ── */}
      <circle cx="48"  cy="86"  r="9"  fill={color} opacity="0.2"/>
      <circle cx="352" cy="86"  r="9"  fill={color} opacity="0.2"/>
      <circle cx="118" cy="48"  r="12" fill={color} opacity="0.28"/>
      <circle cx="282" cy="48"  r="12" fill={color} opacity="0.28"/>
      <circle cx="128" cy="128" r="10" fill={color} opacity="0.22"/>
      <circle cx="272" cy="128" r="10" fill={color} opacity="0.22"/>
      {/* ── central node (leader) ── */}
      <circle cx="200" cy="75" r="18" fill={color} opacity="0.18"/>
      <circle cx="200" cy="75" r="12" fill={color} opacity="0.38"/>
      <circle cx="200" cy="75" r="26" fill="none" stroke={color} strokeWidth="1" opacity="0.14"/>
    </svg>
  );
}

function TechnologyPattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── horizontal traces ── */}
      <line x1="40" y1="43"  x2="360" y2="43"  stroke={color} strokeWidth="1" opacity="0.18"/>
      <line x1="40" y1="86"  x2="360" y2="86"  stroke={color} strokeWidth="1" opacity="0.18"/>
      <line x1="40" y1="129" x2="360" y2="129" stroke={color} strokeWidth="1" opacity="0.18"/>
      {/* ── vertical traces ── */}
      <line x1="80"  y1="20" x2="80"  y2="152" stroke={color} strokeWidth="1" opacity="0.18"/>
      <line x1="160" y1="20" x2="160" y2="152" stroke={color} strokeWidth="1" opacity="0.18"/>
      <line x1="240" y1="20" x2="240" y2="152" stroke={color} strokeWidth="1" opacity="0.18"/>
      <line x1="320" y1="20" x2="320" y2="152" stroke={color} strokeWidth="1" opacity="0.18"/>
      {/* ── junction nodes ── */}
      <circle cx="80"  cy="43"  r="4"   fill={color} opacity="0.4"/>
      <circle cx="160" cy="43"  r="3.5" fill={color} opacity="0.35"/>
      <circle cx="240" cy="43"  r="4"   fill={color} opacity="0.4"/>
      <circle cx="320" cy="43"  r="3.5" fill={color} opacity="0.35"/>
      <circle cx="80"  cy="86"  r="5"   fill={color} opacity="0.45"/>
      <circle cx="160" cy="86"  r="4"   fill={color} opacity="0.4"/>
      <circle cx="240" cy="86"  r="7"   fill={color} opacity="0.52"/>
      <circle cx="320" cy="86"  r="4"   fill={color} opacity="0.4"/>
      <circle cx="80"  cy="129" r="3.5" fill={color} opacity="0.35"/>
      <circle cx="160" cy="129" r="4"   fill={color} opacity="0.4"/>
      <circle cx="240" cy="129" r="3.5" fill={color} opacity="0.35"/>
      <circle cx="320" cy="129" r="5"   fill={color} opacity="0.45"/>
      {/* ── IC chip at center junction ── */}
      <rect x="228" y="74" width="24" height="24" rx="3"
        fill="none" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      {/* left pins */}
      <line x1="228" y1="80" x2="221" y2="80" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      <line x1="228" y1="86" x2="221" y2="86" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      <line x1="228" y1="92" x2="221" y2="92" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      {/* right pins */}
      <line x1="252" y1="80" x2="259" y2="80" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      <line x1="252" y1="86" x2="259" y2="86" stroke={color} strokeWidth="1.5" opacity="0.35"/>
      <line x1="252" y1="92" x2="259" y2="92" stroke={color} strokeWidth="1.5" opacity="0.35"/>
    </svg>
  );
}

function HealthcarePattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── baseline ── */}
      <line x1="0" y1="86" x2="400" y2="86" stroke={color} strokeWidth="0.75" opacity="0.15"/>
      {/* ── ECG pulse line ── */}
      <polyline
        points="0,86 55,86 75,86 85,58 95,112 105,28 118,132 130,86 152,86 208,86 228,86 238,66 248,102 258,52 271,118 282,86 304,86 400,86"
        fill="none" stroke={color} strokeWidth="2.5" opacity="0.45"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* ── peak indicator dot ── */}
      <circle cx="130" cy="86" r="5" fill={color} opacity="0.55"/>
      <circle cx="130" cy="86" r="10" fill="none" stroke={color} strokeWidth="1"   opacity="0.25"/>
      <circle cx="130" cy="86" r="16" fill="none" stroke={color} strokeWidth="0.75" opacity="0.14"/>
      {/* ── medical cross (top right) ── */}
      <rect x="338" y="24" width="8"  height="26" rx="2.5" fill={color} opacity="0.38"/>
      <rect x="327" y="33" width="30" height="8"  rx="2.5" fill={color} opacity="0.38"/>
      {/* ── small cross (bottom left) ── */}
      <rect x="44"  y="128" width="5"  height="16" rx="1.5" fill={color} opacity="0.25"/>
      <rect x="38"  y="134" width="17" height="5"  rx="1.5" fill={color} opacity="0.25"/>
    </svg>
  );
}

function EducationPattern({ color }: { color: string }): JSX.Element {
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── notebook ruled lines ── */}
      <line x1="42" y1="52"  x2="282" y2="52"  stroke={color} strokeWidth="1"   opacity="0.18"/>
      <line x1="42" y1="72"  x2="282" y2="72"  stroke={color} strokeWidth="1"   opacity="0.18"/>
      <line x1="42" y1="92"  x2="282" y2="92"  stroke={color} strokeWidth="1"   opacity="0.18"/>
      <line x1="42" y1="112" x2="282" y2="112" stroke={color} strokeWidth="1"   opacity="0.18"/>
      <line x1="42" y1="132" x2="282" y2="132" stroke={color} strokeWidth="1"   opacity="0.18"/>
      {/* ── vertical margin ── */}
      <line x1="62" y1="38"  x2="62"  y2="148" stroke={color} strokeWidth="1.5" opacity="0.22"/>
      {/* ── 'written' content lines ── */}
      <line x1="72" y1="52"  x2="188" y2="52"  stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
      <line x1="72" y1="72"  x2="228" y2="72"  stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
      <line x1="72" y1="92"  x2="158" y2="92"  stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
      <line x1="72" y1="112" x2="204" y2="112" stroke={color} strokeWidth="2"   opacity="0.3" strokeLinecap="round"/>
      {/* ── graduation cap ── */}
      <polygon points="330,36 372,52 330,68 288,52" fill={color} opacity="0.35"/>
      <rect x="319" y="52" width="22" height="26" rx="2" fill={color} opacity="0.25"/>
      {/* tassel */}
      <line x1="372" y1="52" x2="378" y2="74" stroke={color} strokeWidth="1.5"  opacity="0.3" strokeLinecap="round"/>
      <circle cx="378" cy="77" r="3" fill={color} opacity="0.3"/>
    </svg>
  );
}

function GeneralPattern({ color }: { color: string }): JSX.Element {
  const diamonds: [number, number][] = [
    [80, 43], [200, 43], [320, 43],
    [140, 86], [260, 86],
    [80, 129], [200, 129], [320, 129],
  ];
  return (
    <svg viewBox="0 0 400 172" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {diamonds.map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx - 13} y={cy - 13}
          width={26} height={26}
          rx={4}
          fill={i === 4 ? color : 'none'}
          fillOpacity={i === 4 ? 0.18 : 0}
          stroke={color}
          strokeWidth={i === 4 ? 2 : 1.5}
          opacity={0.25}
          transform={`rotate(45 ${cx} ${cy})`}
        />
      ))}
      {/* connection lines */}
      <line x1="93"  y1="56"  x2="127" y2="73"  stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="187" y1="56"  x2="153" y2="73"  stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="213" y1="56"  x2="247" y2="73"  stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="307" y1="56"  x2="273" y2="73"  stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="153" y1="99"  x2="93"  y2="116" stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="187" y1="99"  x2="187" y2="116" stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="247" y1="99"  x2="247" y2="116" stroke={color} strokeWidth="0.75" opacity="0.14"/>
      <line x1="273" y1="99"  x2="307" y2="116" stroke={color} strokeWidth="0.75" opacity="0.14"/>
    </svg>
  );
}

/** Routes to the correct SVG for a given sector slug */
function SectorPattern({ slug, color }: { slug: string; color: string }): JSX.Element {
  switch (slug) {
    case 'ai':
    case 'ai-data':
      return <AiPattern color={color} />;
    case 'finance':
      return <FinancePattern color={color} />;
    case 'marketing':
      return <MarketingPattern color={color} />;
    case 'startup':
    case 'startup-ecosystem':
      return <StartupPattern color={color} />;
    case 'hr':
      return <HrPattern color={color} />;
    case 'technology':
    case 'it-saas':
    case 'it':
    case 'tech':
      return <TechnologyPattern color={color} />;
    case 'healthcare':
      return <HealthcarePattern color={color} />;
    case 'education':
      return <EducationPattern color={color} />;
    default:
      return <GeneralPattern color={color} />;
  }
}

// ─── Host Avatar ──────────────────────────────────────────────────────────────

function HostAvatar({
  name,
  size = 24,
  color,
}: {
  name: string;
  size?: number;
  color: string;
}): JSX.Element {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
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
        fontSize: size * 0.38,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      {initials || '?'}
    </span>
  );
}

// ─── Illustrated Thumbnail ────────────────────────────────────────────────────
// Renders either a real image (with imgError fallback to illustration) or a
// rich SVG-illustrated banner. In both cases the sector pill is rendered
// inside this component at the bottom-left.

interface ThumbnailProps {
  event: WebinarEvent;
  sector: ReturnType<typeof getSectorConfig>;
}

function EventThumbnail({ event, sector }: ThumbnailProps): JSX.Element {
  const [imgError, setImgError] = useState<boolean>(false);

  const sectorSlug = (event.sector_slug ?? '').toLowerCase();
  const sectorLabel =
    event.content_type === 'podcast'
      ? 'Podcast'
      : event.content_type === 'live_event'
      ? 'Live Event'
      : event.sector_name || 'General';
  const sectorEmoji =
    event.content_type === 'podcast'
      ? '🎙'
      : event.content_type === 'live_event'
      ? '📍'
      : sector.emoji;

  const pillStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 10,
    left: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(255,255,255,0.93)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: 8,
    padding: '3px 9px 3px 6px',
    fontSize: 11,
    fontWeight: 600,
    color: sector.color,
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
    lineHeight: 1,
  };

  // Real image — show it with pill overlay
  if (event.thumbnail_url && !imgError) {
    return (
      <>
        <img
          src={event.thumbnail_url}
          alt={event.title}
          loading="lazy"
          onError={(): void => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={pillStyle}>
          <span style={{ fontSize: 14 }}>{sectorEmoji}</span>
          <span>{sectorLabel}</span>
        </div>
      </>
    );
  }

  // Illustrated sector banner (no image or image failed to load)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: `linear-gradient(145deg, ${sector.color}0e 0%, ${sector.color}22 55%, ${sector.color}3a 100%)`,
        overflow: 'hidden',
        backgroundColor: sector.bg,
      }}
    >
      {/* SVG pattern layer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <SectorPattern slug={sectorSlug} color={sector.color} />
      </div>
      {/* Bottom gradient scrim for pill readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 52,
          background: `linear-gradient(to top, ${sector.color}48, transparent)`,
          pointerEvents: 'none',
        }}
      />
      {/* Sector pill */}
      <div style={pillStyle}>
        <span style={{ fontSize: 14 }}>{sectorEmoji}</span>
        <span>{sectorLabel}</span>
      </div>
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export interface WebinarCardProps {
  event: WebinarEvent;
  variant?: 'default' | 'featured' | 'compact';
  onWishlistChange?: (slug: string, saved: boolean) => void;
}

export function WebinarCard({
  event,
  variant = 'default',
  onWishlistChange,
}: WebinarCardProps): JSX.Element {
  const [wishlisted, setWishlisted] = useState<boolean>(() => isWishlisted(event.slug));
  const [wishlistPending, setWishlistPending] = useState<boolean>(false);

  const sector     = getSectorConfig(event.sector_slug ?? event.sector_name);
  const regUrl     = getBestRegistrationUrl(event);
  const countdown  = event.start_time ? getCountdownLabel(event.start_time) : null;
  const platform   = detectPlatform(event.event_url ?? event.registration_url);
  const isFeatured = event.is_featured || variant === 'featured';
  const isCompact  = variant === 'compact';

  const handleWishlist = useCallback(
    (e: React.MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      if (wishlistPending) return;
      setWishlistPending(true);
      const added = toggleLocalWishlist(event.slug);
      setWishlisted(added);
      onWishlistChange?.(event.slug, added);
      setWishlistPending(false);
    },
    [event.slug, wishlistPending, onWishlistChange],
  );

  const handleRegister = useCallback(
    (e: React.MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      if (!regUrl) return;
      window.open(regUrl, '_blank', 'noopener,noreferrer');
    },
    [regUrl],
  );

  const ctaLabel =
    event.content_type === 'podcast'
      ? 'Listen Now'
      : event.content_type === 'live_event'
      ? event.ticket_price_inr
        ? `Get Tickets ₹${event.ticket_price_inr}`
        : 'Get Tickets'
      : 'Register Free';

  const ctaIcon =
    event.content_type === 'podcast' ? '▶' : '📹';

  // ── Compact variant (no thumbnail, horizontal layout) ──────────────────────
  if (isCompact) {
    return (
      <article
        style={{
          background: '#fff',
          border: `1px solid #E5E7EB`,
          borderLeft: `3px solid ${sector.border}`,
          borderRadius: 12,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          transition: 'transform 0.15s, box-shadow 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e): void => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${sector.color}16`;
        }}
        onMouseLeave={(e): void => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        <Link href={`/webinar/${event.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontWeight: 700, fontSize: 13.5, color: '#111827', lineHeight: 1.35, margin: 0 }}>
            {event.title}
          </h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#6B7280' }}>
          <span>📅 {formatEventDate(event.start_time)}</span>
          {countdown && (
            <span style={{ background: '#E1F5EE', color: '#0D4F6B', fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
              {countdown}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HostAvatar name={event.host_name} size={20} color={sector.color} />
            <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 500 }}>{event.host_name}</span>
          </div>
          {regUrl && (
            <button
              onClick={handleRegister}
              style={{
                padding: '5px 12px',
                background: '#0D4F6B',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              Register ↗
            </button>
          )}
        </div>
      </article>
    );
  }

  // ── Default / Featured variant ─────────────────────────────────────────────
  return (
    <article
      style={{
        background: '#fff',
        border: isFeatured ? `1.5px solid ${sector.color}45` : `1px solid #E5E7EB`,
        borderLeft: `3px solid ${sector.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Uniform card height — all cards in a grid row align bottom
        minHeight: 368,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'pointer',
        boxShadow: isFeatured ? `0 4px 18px ${sector.color}18` : 'none',
      }}
      onMouseEnter={(e): void => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${sector.color}22`;
      }}
      onMouseLeave={(e): void => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = isFeatured
          ? `0 4px 18px ${sector.color}18`
          : 'none';
      }}
    >
      {/* ── Thumbnail ── */}
      <Link href={`/webinar/${event.slug}`}>
        <div style={{ height: 170, position: 'relative', flexShrink: 0, display: 'block', overflow: 'hidden' }}>
          <EventThumbnail event={event} sector={sector} />

          {/* Wishlist button — top left */}
          <button
            onClick={handleWishlist}
            title={wishlisted ? 'Remove from saved' : 'Save event'}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: 32,
              height: 32,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              cursor: 'pointer',
              color: wishlisted ? '#f43f5e' : '#9CA3AF',
              transition: 'color 0.15s, transform 0.15s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              zIndex: 2,
            }}
            onMouseEnter={(e): void => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)'; }}
            onMouseLeave={(e): void => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {wishlisted ? '♥' : '♡'}
          </button>

          {/* Featured badge — top right */}
          {isFeatured && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#E8B44A',
                color: '#fff',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 8,
                letterSpacing: '0.3px',
                boxShadow: '0 1px 6px rgba(232,180,74,0.35)',
                zIndex: 2,
              }}
            >
              ★ Featured
            </div>
          )}

          {/* Platform badge — top right (if not featured) */}
          {!isFeatured && platform !== 'other' && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 7,
                padding: '3px 9px',
                fontSize: 10,
                fontWeight: 600,
                color: '#374151',
                zIndex: 2,
              }}
            >
              {PLATFORM_LABELS[platform]}
            </div>
          )}
        </div>
      </Link>

      {/* ── Card Body ── */}
      <div
        style={{
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          flex: 1,
        }}
      >
        {/* Title */}
        <Link href={`/webinar/${event.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: '#111827',
              lineHeight: 1.38,
              cursor: 'pointer',
              margin: 0,
              // 2-line clamp
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.title}
          </h3>
        </Link>

        {/* Date + countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#6B7280', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>📅</span>
            <span>{formatEventDate(event.start_time)}</span>
          </span>
          {countdown && (
            <span
              style={{
                background: '#E1F5EE',
                color: '#0D4F6B',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 20,
                letterSpacing: '0.1px',
              }}
            >
              {countdown}
            </span>
          )}
        </div>

        {/* Host row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <HostAvatar name={event.host_name} size={22} color={sector.color} />
          <span style={{ fontSize: 12.5, color: '#4B5563', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.host_slug ? (
              <Link
                href={`/hosts/${event.host_slug}`}
                onClick={(e): void => e.stopPropagation()}
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
                padding: '1.5px 5px',
                borderRadius: 4,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
          )}
          {/* Save count (moved from thumbnail overlay into body) */}
          {event.save_count > 2 && (
            <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto', flexShrink: 0 }}>
              ♥ {event.save_count}
            </span>
          )}
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  background: '#F3F4F6',
                  color: '#6B7280',
                  fontSize: 10.5,
                  padding: '3px 9px',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Live event extras */}
        {event.content_type === 'live_event' && (event.venue_city || event.is_hybrid) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {event.venue_city && (
              <span style={{ fontSize: 12, color: '#6B7280' }}>📍 {event.venue_city}</span>
            )}
            {event.is_hybrid && (
              <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                Hybrid
              </span>
            )}
          </div>
        )}

        {/* Podcast extras */}
        {event.content_type === 'podcast' && (event.episode_number || event.duration_minutes) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {event.episode_number && (
              <span style={{ fontSize: 12, color: '#6B7280' }}>Ep. #{event.episode_number}</span>
            )}
            {event.duration_minutes && (
              <span style={{ background: '#f3f4f6', color: '#6B7280', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                {event.duration_minutes} min
              </span>
            )}
          </div>
        )}

        {/* Flex spacer — pushes sponsor + CTA to bottom */}
        <div style={{ flex: 1 }} />

        {/* Sponsor banner */}
        {event.is_sponsored && event.sponsor_name && (
          <div
            style={{
              background: '#fefce8',
              border: '1px solid #fde68a',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11,
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Sponsored by {event.sponsor_name}</span>
            {event.sponsor_cta && event.sponsor_url && (
              <button
                onClick={(e): void => {
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
                  fontFamily: 'inherit',
                }}
              >
                {event.sponsor_cta}
              </button>
            )}
          </div>
        )}

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {regUrl ? (
            <button
              onClick={handleRegister}
              style={{
                flex: 1,
                padding: '11px 0',
                background: '#0D4F6B',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: 'inherit',
                transition: 'opacity 0.15s, transform 0.12s',
              }}
              onMouseEnter={(e): void => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
              onMouseLeave={(e): void => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              <span>{ctaIcon}</span>
              <span>{ctaLabel}</span>
              <span style={{ fontSize: 12 }}>↗</span>
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
            >
              Registration Unavailable
            </button>
          )}

          {/* View details button */}
          <Link
            href={`/webinar/${event.slug}`}
            onClick={(e): void => e.stopPropagation()}
          >
            <button
              title="View details"
              style={{
                width: 40,
                height: 40,
                background: 'transparent',
                border: '1.5px solid #E5E7EB',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
                color: '#6B7280',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e): void => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#0D4F6B';
                (e.currentTarget as HTMLButtonElement).style.color = '#0D4F6B';
              }}
              onMouseLeave={(e): void => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLButtonElement).style.color = '#6B7280';
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
