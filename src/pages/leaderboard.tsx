// src/pages/leaderboard.tsx — WebinX Top Hosts Leaderboard
// v2: API_BASE from @/lib/api (no import.meta as any), async/await useEffect,
// JSX.Element return types on ScoreBadge + ShareButton + LeaderboardPage, teal brand.
// Note: LeaderboardEntry[] schema differs from Host[] in api.ts — keeping raw fetch
// with API_BASE for correct field mapping (host_name, total_clicks, score).

import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Linkedin, Twitter } from 'lucide-react';
import { API_BASE } from '@/lib/api';

interface LeaderboardEntry {
  host_name:    string;
  host_slug:    string;
  org_name:     string;
  is_verified:  boolean;
  event_count:  number;
  total_views:  number;
  total_saves:  number;
  total_clicks: number;
  score:        number;
}

const MEDALS = ['🥇', '🥈', '🥉'];
const MONTH  = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }): JSX.Element {
  return (
    <span
      style={{
        fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
        background: '#E1F5EE', color: '#0D4F6B', whiteSpace: 'nowrap',
      }}
    >
      {score.toLocaleString('en-IN')} pts
    </span>
  );
}

function ShareButton({ rank, name, slug }: { rank: number; name: string; slug: string }): JSX.Element {
  const profileUrl = slug
    ? `https://www.webinx.in/hosts/${slug}`
    : 'https://www.webinx.in/top-hosts';
  const text    = encodeURIComponent(`I'm ranked #${rank} on WebinX's Top Hosts this month! 🏆\nCheck out my webinars at ${profileUrl}`);
  const liUrl   = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
  const twUrl   = `https://twitter.com/intent/tweet?text=${text}`;

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 11.5, fontWeight: 600, padding: '5px 10px', borderRadius: 8,
    textDecoration: 'none', transition: 'background 0.15s', border: '1px solid',
  };

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <a href={liUrl} target="_blank" rel="noopener noreferrer"
        style={{ ...linkStyle, borderColor: '#0077b5', color: '#0077b5' }}
        onMouseEnter={(e): void => { (e.currentTarget as HTMLAnchorElement).style.background = '#EFF6FF'; }}
        onMouseLeave={(e): void => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
      >
        <Linkedin size={11} /> Share
      </a>
      <a href={twUrl} target="_blank" rel="noopener noreferrer"
        style={{ ...linkStyle, borderColor: '#1da1f2', color: '#1da1f2' }}
        onMouseEnter={(e): void => { (e.currentTarget as HTMLAnchorElement).style.background = '#F0F9FF'; }}
        onMouseLeave={(e): void => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
      >
        <Twitter size={11} /> Tweet
      </a>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LeaderboardPage(): JSX.Element {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error,   setError]   = useState<boolean>(false);

  const loadLeaderboard = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE}/api/hosts/leaderboard`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json() as LeaderboardEntry[];
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect((): void => { void loadLeaderboard(); }, [loadLeaderboard]);

  // Row background by rank
  const rowBg = (idx: number): string => {
    if (idx === 0) return '#FFFBEB';
    if (idx === 1) return '#F9FAFB';
    if (idx === 2) return '#FFF7ED';
    return '#fff';
  };
  const rowBorder = (idx: number): string => {
    if (idx === 0) return '#FDE68A';
    if (idx === 1) return '#E5E7EB';
    if (idx === 2) return '#FED7AA';
    return '#F3F4F6';
  };

  return (
    <>
      <Helmet>
        <title>Top Hosts This Month — WebinX Leaderboard</title>
        <meta name="description" content={`WebinX Top Hosts of ${MONTH} — ranked by webinars hosted, views, and audience engagement.`} />
        <link rel="canonical" href="https://www.webinx.in/top-hosts" />
        <meta property="og:title" content={`WebinX Top Hosts — ${MONTH}`} />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
      </Helmet>

      <main className="has-bottom-nav">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3rem) 1rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Trophy size={40} color="#E8B44A" style={{ marginBottom: 12 }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 6 }}>
              Top Hosts This Month
            </h1>
            <p style={{ fontSize: 13.5, color: '#9CA3AF', marginBottom: 16 }}>{MONTH} · Resets monthly</p>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: '#E1F5EE', border: '1px solid rgba(13,79,107,0.15)',
                borderRadius: 20, padding: '5px 14px',
                fontSize: 12, color: '#0D4F6B', fontWeight: 600,
              }}
            >
              Score = Events × 10 + Views × 0.1 + Saves × 5 + Clicks × 2
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B7280' }}>
              <p style={{ marginBottom: 12 }}>Failed to load leaderboard.</p>
              <button
                onClick={(): void => { void loadLeaderboard(); }}
                style={{ background: '#0D4F6B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && entries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6B7280' }}>
              <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Leaderboard loading up…</p>
              <p style={{ fontSize: 14 }}>Rankings will appear as hosts post more webinars.</p>
            </div>
          )}

          {/* Leaderboard rows */}
          {!loading && !error && entries.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {entries.map((entry, idx) => (
                <div
                  key={entry.host_name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 16px', borderRadius: 14,
                    border: `1.5px solid ${rowBorder(idx)}`,
                    background: rowBg(idx),
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={(e): void => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
                  onMouseLeave={(e): void => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  {/* Rank */}
                  <div style={{ fontSize: idx < 3 ? 24 : 18, width: 32, textAlign: 'center', flexShrink: 0, fontWeight: 700, color: '#9CA3AF' }}>
                    {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                  </div>

                  {/* Avatar initials */}
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg, #0D4F6B, #1A6B8A)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                    }}
                  >
                    {entry.host_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                      <a
                        href={entry.host_slug ? `/hosts/${entry.host_slug}` : '#'}
                        style={{ fontWeight: 700, fontSize: 14.5, color: '#111827', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {entry.host_name}
                      </a>
                      {entry.is_verified && (
                        <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: '#DBEAFE', color: '#1D4ED8', flexShrink: 0 }}>✓ Verified</span>
                      )}
                      {idx === 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#FDE68A', color: '#92400E', flexShrink: 0 }}>Top Host</span>
                      )}
                    </div>
                    {entry.org_name && (
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.org_name}</p>
                    )}
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9CA3AF' }}>
                      <span>📋 {entry.event_count} webinar{entry.event_count !== 1 ? 's' : ''}</span>
                      <span>👁 {entry.total_views.toLocaleString('en-IN')}</span>
                      <span>❤️ {entry.total_saves}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <ScoreBadge score={entry.score} />
                    {idx < 3 && <ShareButton rank={idx + 1} name={entry.host_name} slug={entry.host_slug} />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA for hosts */}
          <div
            style={{
              marginTop: '2.5rem', padding: 'clamp(1.5rem, 4vw, 2rem)',
              borderRadius: 16, textAlign: 'center',
              background: 'linear-gradient(135deg, #E1F5EE 0%, #fff 100%)',
              border: '1.5px solid rgba(13,79,107,0.12)',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 8 }}>
              Want to climb the leaderboard?
            </p>
            <p style={{ fontSize: 13.5, color: '#6B7280', marginBottom: 20, lineHeight: 1.6 }}>
              Host more webinars on WebinX and mention us to your audience to earn rewards.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/mention-webinx" style={{ fontSize: 13.5, fontWeight: 600, background: '#0D4F6B', color: '#fff', padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                🎤 Claim Mention Reward
              </a>
              <a href="/get-featured" style={{ fontSize: 13.5, fontWeight: 600, border: '1.5px solid rgba(13,79,107,0.25)', color: '#0D4F6B', padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                ⭐ Get Featured
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
