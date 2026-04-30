// src/pages/sector-city.tsx
// SEO landing pages: /webinars/ai-india, /webinars/finance-mumbai, etc.
// Targets long-tail keywords like "AI webinars India", "finance webinars Mumbai"

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getEvents } from '../lib/api';
import type { WebinarEvent } from '../lib/api';

// ── Sector config ─────────────────────────────────────────────────────────────

const SECTOR_CONFIG: Record<string, { name: string; emoji: string; desc: string; color: string }> = {
  ai:          { name: 'AI & Machine Learning', emoji: '🤖', desc: 'artificial intelligence, ML and data science', color: '#7c3aed' },
  finance:     { name: 'Finance & Fintech',      emoji: '💹', desc: 'finance, fintech, investing and markets',       color: '#0369a1' },
  marketing:   { name: 'Marketing',              emoji: '📣', desc: 'digital marketing, growth and branding',        color: '#b45309' },
  startup:     { name: 'Startup & Entrepreneurship', emoji: '🚀', desc: 'startups, funding and entrepreneurship',   color: '#dc2626' },
  hr:          { name: 'HR & People Ops',        emoji: '🤝', desc: 'HR, talent, hiring and people management',     color: '#d97706' },
  technology:  { name: 'Technology',             emoji: '⚙️',  desc: 'software, engineering and cloud computing',   color: '#0891b2' },
  healthcare:  { name: 'Healthcare',             emoji: '🏥', desc: 'healthcare, medical and wellness',               color: '#16a34a' },
  education:   { name: 'Education & EdTech',     emoji: '📚', desc: 'education, edtech and learning',               color: '#9333ea' },
};

const CITY_CONFIG: Record<string, { name: string; emoji: string }> = {
  india:      { name: 'India',      emoji: '🇮🇳' },
  mumbai:     { name: 'Mumbai',     emoji: '🌊' },
  delhi:      { name: 'Delhi',      emoji: '🏛️' },
  bangalore:  { name: 'Bangalore',  emoji: '🌳' },
  bengaluru:  { name: 'Bengaluru',  emoji: '🌳' },
  hyderabad:  { name: 'Hyderabad',  emoji: '💎' },
  chennai:    { name: 'Chennai',    emoji: '🌴' },
  pune:       { name: 'Pune',       emoji: '🎭' },
  kolkata:    { name: 'Kolkata',    emoji: '🎨' },
  ahmedabad:  { name: 'Ahmedabad',  emoji: '🦁' },
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="wx-card overflow-hidden">
          <div className="skeleton" style={{ height: 140 }} />
          <div className="p-4 space-y-2">
            <div className="skeleton h-3 w-1/3 rounded-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-3 w-2/3" />
            <div className="skeleton h-8 w-full rounded-lg mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Related combinations (internal linking for SEO) ───────────────────────────

function RelatedPages({ sector, city }: { sector: string; city: string }) {
  const otherCities = Object.entries(CITY_CONFIG)
    .filter(([k]) => k !== city && k !== 'india')
    .slice(0, 4);
  const otherSectors = Object.entries(SECTOR_CONFIG)
    .filter(([k]) => k !== sector)
    .slice(0, 4);

  return (
    <div style={{ marginTop: 48, padding: '24px 0', borderTop: '1px solid #E5E7EB' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 12, letterSpacing: '0.05em' }}>
            OTHER CITIES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {otherCities.map(([slug, cfg]) => (
              <Link key={slug} href={`/webinars/${sector}-${slug}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  background: '#f3f4f6', color: '#374151', fontSize: 13, fontWeight: 500,
                  padding: '5px 12px', borderRadius: 8, display: 'inline-block',
                }}>
                  {cfg.emoji} {cfg.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 12, letterSpacing: '0.05em' }}>
            OTHER TOPICS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {otherSectors.map(([slug, cfg]) => (
              <Link key={slug} href={`/webinars/${slug}-${city}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  background: '#f3f4f6', color: '#374151', fontSize: 13, fontWeight: 500,
                  padding: '5px 12px', borderRadius: 8, display: 'inline-block',
                }}>
                  {cfg.emoji} {cfg.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SectorCityPage(): JSX.Element {
  // Route: /webinars/:combo  e.g. "ai-india", "finance-mumbai"
  const { combo } = useParams<{ combo: string }>();

  // Parse sector and city from combo slug
  const parts = (combo ?? '').toLowerCase().split('-');
  let sectorKey = '';
  let cityKey = '';

  // Try to match sector (could be multi-word like "ai") and city
  for (let i = 1; i <= parts.length; i++) {
    const possibleSector = parts.slice(0, i).join('-');
    const possibleCity   = parts.slice(i).join('-') || 'india';
    if (SECTOR_CONFIG[possibleSector]) {
      sectorKey = possibleSector;
      cityKey   = possibleCity in CITY_CONFIG ? possibleCity : 'india';
      break;
    }
  }

  const sector   = SECTOR_CONFIG[sectorKey];
  const city     = CITY_CONFIG[cityKey];
  const cityName = city?.name ?? 'India';
  const cityEmoji = city?.emoji ?? '🇮🇳';

  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!sector) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      // Use existing /api/events with sector filter; city is text-based match
      const result = await getEvents({
        sector: sectorKey,
        limit: 24,
        q: cityKey !== 'india' ? cityName : undefined,
      });
      const eventsArr = Array.isArray(result) ? result : (result as { events?: WebinarEvent[] }).events ?? [];
      setEvents(eventsArr);
    } catch (e) {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [sectorKey, cityKey, cityName, sector]);

  useEffect(() => { void load(); }, [load]);

  // 404 for unknown combos
  if (!loading && !sector) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Page not found</h2>
        <Link href="/webinars"><button style={{ marginTop: 16, background: '#0D4F6B', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>Browse all webinars →</button></Link>
      </div>
    );
  }

  const pageTitle = sector
    ? `${sector.name} Webinars in ${cityName} | Free Online Events | WeBinX`
    : 'Webinars | WeBinX';

  const metaDesc = sector
    ? `Discover free ${sector.desc} webinars in ${cityName}. Updated daily. Join India's best ${sector.name.toLowerCase()} knowledge events on WeBinX.`
    : '';

  const canonicalUrl = `https://webinx.in/webinars/${combo}`;
  const h1 = sector ? `${sector.emoji} ${sector.name} Webinars in ${cityEmoji} ${cityName}` : '';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        {/* Schema.org breadcrumb */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://webinx.in" },
            { "@type": "ListItem", "position": 2, "name": "Webinars", "item": "https://webinx.in/webinars" },
            { "@type": "ListItem", "position": 3, "name": `${sector?.name} in ${cityName}`, "item": canonicalUrl },
          ]
        })}</script>
      </Helmet>

      {/* Hero band */}
      <div style={{
        background: `linear-gradient(135deg, ${sector?.color ?? '#0D4F6B'}11 0%, #fff 100%)`,
        borderBottom: `3px solid ${sector?.color ?? '#0D4F6B'}`,
        padding: '32px 40px 24px',
      }}>
        <div className="wx-container">
          {/* Breadcrumb */}
          <nav style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/webinars" style={{ color: '#6B7280', textDecoration: 'none' }}>Webinars</Link>
            <span>›</span>
            <Link href={`/sector/${sectorKey}`} style={{ color: sector?.color, textDecoration: 'none' }}>{sector?.name}</Link>
            <span>›</span>
            <span style={{ color: '#374151' }}>{cityName}</span>
          </nav>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1.3, marginBottom: 10 }}>
            {h1}
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 640 }}>
            Free {sector?.desc} webinars and knowledge events in {cityName}.
            Updated every 30 minutes. No registration required to browse.
          </p>

          {!loading && (
            <div style={{ marginTop: 12, fontSize: 13, color: sector?.color, fontWeight: 600 }}>
              {events.length > 0 ? `${events.length} events found` : 'No events yet — check back soon'}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#dc2626', marginBottom: 16 }}>{error}</p>
            <button onClick={() => void load()} style={{ background: '#0D4F6B', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{sector?.emoji}</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              No {sector?.name} events in {cityName} yet
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
              Our pipeline runs every 30 minutes. Check back soon — or browse all {sector?.name} events.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/sector/${sectorKey}`}>
                <button style={{ background: '#0D4F6B', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                  All {sector?.name} events →
                </button>
              </Link>
              <Link href="/submit-webinar">
                <button style={{ background: 'transparent', color: '#0D4F6B', border: '1.5px solid #0D4F6B', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                  List your event free
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(ev => (
              <WebinarCard key={ev.id ?? ev.slug} event={ev} />
            ))}
          </div>
        )}

        {/* Internal linking for SEO */}
        {sector && <RelatedPages sector={sectorKey} city={cityKey} />}

        {/* CTA */}
        <div style={{
          marginTop: 40, background: '#f0f9ff', border: '1px solid #bae6fd',
          borderRadius: 14, padding: '24px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 4 }}>
              Running a {sector?.name} webinar?
            </div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>
              List it free on WeBinX and reach thousands of learners in India.
            </div>
          </div>
          <Link href="/submit-webinar">
            <button style={{ background: '#0D4F6B', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              List Your Event Free →
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
