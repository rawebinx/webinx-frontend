// src/pages/podcasts.tsx
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getEvents, submitLead } from '../lib/api';
import type { WebinarEvent } from '../lib/api';

export default function PodcastsPage() {
  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle'|'loading'|'done'>('idle');

  useEffect(() => {
    getEvents({ content_type: 'podcast', limit: 12 })
      .then(result => {
        const list = Array.isArray(result) ? result : (result?.events ?? []);
        setEvents(list);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subStatus === 'loading') return;
    setSubStatus('loading');
    try {
      await submitLead({ email: email.trim(), utm_source: 'podcasts-notify' });
      setSubStatus('done');
    } catch {
      setSubStatus('done');
    }
  };

  return (
    <>
      <Helmet>
        <title>Podcasts — India's Best Knowledge Podcasts | WeBinX</title>
        <meta name="description" content="Discover India's best business, tech and startup podcasts. Updated daily." />
        <link rel="canonical" href="https://webinx.in/podcasts" />
      </Helmet>

      <div className="has-bottom-nav">
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fff 100%)', borderBottom: '3px solid #8b5cf6', padding: '48px 40px 40px', textAlign: 'center' }}>
          <div className="wx-container">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎙️</div>
            <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1 }}>
              🚀 COMING SOON
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#111827', marginTop: 16, marginBottom: 8 }}>
              India's Best Knowledge Podcasts
            </h1>
            <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Business, tech, startup and finance podcasts — curated from India's top creators. Be first to know when we launch.
            </p>

            {subStatus === 'done' ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '14px 24px', display: 'inline-block', color: '#065f46', fontWeight: 600 }}>
                🎉 You're on the list! We'll notify you when podcasts launch.
              </div>
            ) : (
              <form onSubmit={handleNotify} style={{ display: 'flex', gap: 0, maxWidth: 420, margin: '0 auto' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1, padding: '13px 18px', border: '1.5px solid #e5e7eb', borderRight: 'none', borderRadius: '12px 0 0 12px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '13px 20px', borderRadius: '0 12px 12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  🔔 Notify Me
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Events (if any podcast-type events exist) */}
        {!loading && events.length > 0 && (
          <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#111827' }}>Available Podcasts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(ev => <WebinarCard key={ev.id} event={ev} />)}
            </div>
          </div>
        )}

        {/* Browse webinars CTA */}
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6B7280', marginBottom: 16, fontSize: 15 }}>
            While you wait — browse hundreds of webinars on similar topics
          </p>
          <Link href="/webinars">
            <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
              Browse Webinars →
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
