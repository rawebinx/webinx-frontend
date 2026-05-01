// src/pages/embed.tsx — WebinX Embed Widget
// v2: API_BASE from @/lib/api (no import.meta as any), async/await useEffect,
// no 'as any' on style props (WebkitLineClamp is valid in React.CSSProperties),
// teal brand, JSX.Element return type.
// Note: This is a standalone iframe widget — no navbar/footer.

import { useEffect, useState, useCallback } from 'react';
import { useRoute } from 'wouter';
import { API_BASE, formatShortDate, isUpcoming } from '@/lib/api';
import type { WebinarEvent } from '@/lib/api';

interface EmbedData {
  host:   { slug: string; name: string } | null;
  events: WebinarEvent[];
}

export default function EmbedPage(): JSX.Element {
  const [, params]          = useRoute('/embed/:slug');
  const slug                = params?.slug ?? '';
  const [data, setData]     = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadEmbed = useCallback(async (): Promise<void> => {
    if (!slug) return;
    try {
      const res = await fetch(`${API_BASE}/api/embed/${slug}`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error('embed fetch failed');
      setData(await res.json() as EmbedData);
    } catch {
      // silently degrade — show empty state below
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect((): void => { void loadEmbed(); }, [loadEmbed]);

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#ffffff', padding: 0, margin: 0, minHeight: '100%' }}>

      {/* Header — teal brand */}
      <div style={{ background: 'linear-gradient(135deg, #0D4F6B, #1A6B8A)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
            {data?.host?.name ?? 'Upcoming Webinars'}
          </div>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, marginTop: 1 }}>Upcoming Events</div>
        </div>
        <a
          href="https://www.webinx.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, textDecoration: 'none' }}
        >
          Powered by WebinX ↗
        </a>
      </div>

      {/* Events */}
      <div style={{ padding: '8px 0' }}>
        {loading && (
          <div style={{ padding: '20px 16px', color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>Loading…</div>
        )}

        {!loading && (!data?.events?.length) && (
          <div style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 8 }}>No upcoming webinars yet.</div>
            <a href="https://www.webinx.in/webinars" target="_blank" rel="noopener noreferrer"
              style={{ color: '#0D4F6B', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
              Browse all webinars →
            </a>
          </div>
        )}

        {data?.events?.map((event, i) => {
          const dateStr  = formatShortDate(event.start_time);
          const upcoming = isUpcoming(event.start_time);
          // event.url is not in WebinarEvent interface — use the two typed fields
          const url      = event.registration_url ?? event.event_url ?? '#';
          const detailUrl = `https://www.webinx.in/webinar/${event.slug}`;

          return (
            <div
              key={event.slug ?? i}
              style={{ padding: '12px 16px', borderBottom: i < (data.events.length - 1) ? '1px solid #F3F4F6' : 'none' }}
            >
              {/* Sector badge */}
              {event.sector_name && event.sector_name !== 'General' && (
                <div style={{ display: 'inline-block', background: '#E1F5EE', color: '#0D4F6B', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, marginBottom: 5 }}>
                  {event.sector_name}
                </div>
              )}

              {/* Title — WebkitLineClamp is valid in React.CSSProperties */}
              <a
                href={detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#111827', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  lineHeight: 1.3, marginBottom: 4,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}
              >
                {event.title}
              </a>

              {/* Host + Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 }}>
                {event.host_name && (
                  <span style={{ color: '#6B7280', fontSize: 11 }}>👤 {event.host_name}</span>
                )}
                {dateStr && (
                  <span style={{ color: '#9CA3AF', fontSize: 11 }}>📅 {dateStr}</span>
                )}
              </div>

              {/* CTA */}
              {url && url !== '#' && upcoming && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', background: '#0D4F6B', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, textDecoration: 'none' }}
                >
                  Register →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {data?.host && (
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href={`https://www.webinx.in/hosts/${data.host.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0D4F6B', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}
          >
            View all events →
          </a>
          <a
            href="https://www.webinx.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#D1D5DB', fontSize: 10, textDecoration: 'none' }}
          >
            WebinX.in
          </a>
        </div>
      )}
    </div>
  );
}
