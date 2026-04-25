// src/components/AffiliateToolCard.tsx
// WebinX Affiliate Tool Cards — passive revenue via contextual recommendations

import { useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AffiliateTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'hosting' | 'equipment' | 'marketing' | 'learning' | 'event_platform';
  affiliateUrl: string;
  commission: string;
  cta: string;
  badge?: string;
  badgeColor?: string;
  sectors: string[]; // empty = show for all sectors
}

// ─── Tool Directory (replace affiliateUrls with your tracked links) ───────────

export const AFFILIATE_TOOLS: AffiliateTool[] = [
  // Webinar Hosting
  {
    id: 'zoom',
    name: 'Zoom Webinars',
    emoji: '📹',
    description: "World's #1 video platform. Host up to 10,000 attendees with HD quality.",
    category: 'hosting',
    affiliateUrl: 'https://zoom.us/pricing?utm_source=webinx&utm_medium=affiliate',
    commission: '20% recurring',
    cta: 'Start Free',
    badge: 'Most Popular',
    badgeColor: '#0D4F6B',
    sectors: [],
  },
  {
    id: 'demio',
    name: 'Demio',
    emoji: '🎯',
    description: 'Beautiful webinar platform built for marketers. 30% recurring commission.',
    category: 'hosting',
    affiliateUrl: 'https://demio.com/?fp_ref=webinx',
    commission: '30% recurring',
    cta: 'Try 14 Days Free',
    badge: 'Best for Marketing',
    badgeColor: '#f97316',
    sectors: ['marketing', 'startup', 'finance'],
  },
  {
    id: 'webinarjam',
    name: 'WebinarJam',
    emoji: '🚀',
    description: 'High-converting platform with built-in email + sales automation.',
    category: 'hosting',
    affiliateUrl: 'https://www.webinarjam.com/?a=webinx',
    commission: '40% one-time',
    cta: 'Get $1 Trial',
    sectors: ['startup', 'marketing', 'finance'],
  },
  {
    id: 'streamyard',
    name: 'StreamYard',
    emoji: '🎙️',
    description: 'Stream live webinars to YouTube, LinkedIn & Facebook simultaneously.',
    category: 'hosting',
    affiliateUrl: 'https://streamyard.com/?fpr=webinx',
    commission: '20% recurring',
    cta: 'Try Free',
    sectors: ['marketing', 'education', 'technology'],
  },
  {
    id: 'riverside',
    name: 'Riverside.fm',
    emoji: '🎚️',
    description: 'Record studio-quality podcasts & interviews. Used by BBC & Spotify hosts.',
    category: 'hosting',
    affiliateUrl: 'https://riverside.fm/?utm_campaign=webinx',
    commission: '15% recurring',
    cta: 'Record Free',
    sectors: ['ai', 'technology', 'education'],
  },

  // Event Platforms
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    emoji: '🎟️',
    description: "India's top event ticketing. List & sell tickets for live events.",
    category: 'event_platform',
    affiliateUrl: 'https://www.eventbrite.com/organizer/overview/?ref=webinx',
    commission: '5% ticket revenue',
    cta: 'List Your Event',
    badge: 'India Recommended',
    badgeColor: '#F05537',
    sectors: [],
  },
  {
    id: 'luma',
    name: 'Lu.ma',
    emoji: '✨',
    description: 'Beautiful event pages with built-in RSVP. Loved by startup communities.',
    category: 'event_platform',
    affiliateUrl: 'https://lu.ma/?utm_source=webinx',
    commission: 'Referral credit',
    cta: 'Create Event',
    sectors: ['startup', 'technology', 'ai'],
  },
  {
    id: 'hopin',
    name: 'Hopin',
    emoji: '🌐',
    description: 'All-in-one virtual + hybrid event platform for large conferences.',
    category: 'event_platform',
    affiliateUrl: 'https://hopin.com/?ref=webinx',
    commission: '20% first year',
    cta: 'Try Free',
    sectors: ['hr', 'finance', 'technology'],
  },

  // Equipment (Amazon India Associates — replace tag with yours)
  {
    id: 'logitech-c920',
    name: 'Logitech C920 Webcam',
    emoji: '📸',
    description: 'Full HD 1080p webcam. #1 choice for professional webinar presenters.',
    category: 'equipment',
    affiliateUrl: 'https://www.amazon.in/dp/B006A2LA0W?tag=webinx-21',
    commission: '~6% (Amazon IN)',
    cta: 'Buy ₹7,499',
    badge: 'Best Webcam',
    badgeColor: '#E8B44A',
    sectors: [],
  },
  {
    id: 'blue-yeti',
    name: 'Blue Yeti Mic',
    emoji: '🎤',
    description: 'USB studio mic for crystal-clear podcast & webinar audio.',
    category: 'equipment',
    affiliateUrl: 'https://www.amazon.in/dp/B00N1YPXW2?tag=webinx-21',
    commission: '~6% (Amazon IN)',
    cta: 'Buy ₹11,999',
    sectors: [],
  },
  {
    id: 'elgato-ring',
    name: 'Elgato Ring Light',
    emoji: '💡',
    description: 'Professional LED ring light for crisp, flattering video lighting.',
    category: 'equipment',
    affiliateUrl: 'https://www.amazon.in/dp/B082PPGMM3?tag=webinx-21',
    commission: '~6% (Amazon IN)',
    cta: 'Buy ₹8,999',
    sectors: [],
  },

  // Learning Platforms
  {
    id: 'teachable',
    name: 'Teachable',
    emoji: '📚',
    description: 'Turn your webinar recordings into a paid course. 30-day free trial.',
    category: 'learning',
    affiliateUrl: 'https://teachable.com/?utm_source=webinx',
    commission: '30% recurring',
    cta: 'Start Free Course',
    sectors: ['education', 'marketing', 'startup'],
  },
  {
    id: 'thinkific',
    name: 'Thinkific',
    emoji: '🎓',
    description: 'Build & sell online courses. Used by 50,000+ creators worldwide.',
    category: 'learning',
    affiliateUrl: 'https://www.thinkific.com/?utm_source=webinx',
    commission: '20% recurring',
    cta: 'Create Course Free',
    sectors: ['education', 'hr', 'finance'],
  },
];

// ─── Selector ─────────────────────────────────────────────────────────────────

export function getToolsForContext(
  sectorSlug: string,
  contentType: 'webinar' | 'podcast' | 'live_event' = 'webinar',
  limit = 3
): AffiliateTool[] {
  // Priority IDs per content type
  const priority: Record<string, string[]> = {
    webinar: ['zoom', 'demio', 'webinarjam', 'streamyard', 'logitech-c920', 'blue-yeti'],
    podcast: ['riverside', 'streamyard', 'blue-yeti', 'logitech-c920', 'teachable'],
    live_event: ['eventbrite', 'luma', 'hopin', 'logitech-c920'],
  };

  const prio = priority[contentType] ?? priority.webinar;

  const matched = AFFILIATE_TOOLS
    .filter(t => t.sectors.length === 0 || t.sectors.includes(sectorSlug))
    .sort((a, b) => {
      const ai = prio.indexOf(a.id);
      const bi = prio.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  return matched.slice(0, limit);
}

// ─── Single Tool Card ─────────────────────────────────────────────────────────

interface AffiliateToolCardProps {
  tool: AffiliateTool;
  compact?: boolean;
}

export function AffiliateToolCard({ tool, compact = false }: AffiliateToolCardProps) {
  const handleClick = useCallback(() => {
    window.open(tool.affiliateUrl, '_blank', 'noopener,noreferrer');
  }, [tool.affiliateUrl]);

  if (compact) {
    return (
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          border: '1px solid #f0f0f0',
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
          background: '#fff',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#0D4F6B22';
          (e.currentTarget as HTMLElement).style.background = '#f8fdff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0';
          (e.currentTarget as HTMLElement).style.background = '#fff';
        }}
      >
        <div style={{ fontSize: 22, flexShrink: 0 }}>{tool.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tool.name}
            {tool.badge && (
              <span
                style={{
                  background: tool.badgeColor ?? '#0D4F6B',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 10,
                }}
              >
                {tool.badge}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: '#9CA3AF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {tool.description}
          </div>
        </div>
        <button
          style={{
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 700,
            padding: '5px 11px',
            borderRadius: 7,
            border: '1.5px solid #0D4F6B',
            background: 'transparent',
            color: '#0D4F6B',
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {tool.cta}
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 14,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(13,79,107,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {tool.emoji}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: '#111827' }}>{tool.name}</div>
          {tool.badge && (
            <span
              style={{
                display: 'inline-block',
                background: tool.badgeColor ?? '#0D4F6B',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 10,
                marginTop: 3,
              }}
            >
              {tool.badge}
            </span>
          )}
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>
        {tool.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
          ✓ {tool.commission}
        </span>
        <button
          style={{
            background: '#0D4F6B',
            color: '#fff',
            border: 'none',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {tool.cta} ↗
        </button>
      </div>
    </div>
  );
}

// ─── Section (drop into webinar.tsx sidebar) ─────────────────────────────────

interface AffiliateToolsSectionProps {
  sectorSlug?: string;
  contentType?: 'webinar' | 'podcast' | 'live_event';
  compact?: boolean;
}

export default function AffiliateToolsSection({
  sectorSlug = '',
  contentType = 'webinar',
  compact = true,
}: AffiliateToolsSectionProps) {
  const tools = getToolsForContext(sectorSlug, contentType);
  if (tools.length === 0) return null;

  const sectionLabel =
    contentType === 'podcast'
      ? '🎙️ Start your own podcast'
      : contentType === 'live_event'
      ? '📍 Host your own event'
      : '🎥 Host your own webinar';

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
          {sectionLabel}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 8 : 12 }}>
        {tools.map(tool => (
          <AffiliateToolCard key={tool.id} tool={tool} compact={compact} />
        ))}
      </div>
      <p
        style={{
          fontSize: 11,
          color: '#D1D5DB',
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        Affiliate links — we earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}
