// src/pages/live-events.tsx
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import WebinarCard from '../components/webinar-card';
import { getEvents, submitLead } from '../lib/api';
import type { WebinarEvent } from '../lib/api';

const CITIES = [
  { name: 'Mumbai', emoji: '🌊' }, { name: 'Delhi', emoji: '🏛️' },
  { name: 'Bengaluru', emoji: '🌳' }, { name: 'Hyderabad', emoji: '💎' },
  { name: 'Chennai', emoji: '🌴' }, { name: 'Pune', emoji: '🎭' },
  { name: 'Kolkata', emoji: '🎨' }, { name: 'Ahmedabad', emoji: '🦁' },
];

export default function LiveEventsPage() {
  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle'|'loading'|'done'>('idle');

  useEffect(() => {
    getEvents({ content_type: 'live_event', limit: 12 })
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
      await submitLead({ email: email.trim(), utm_source: 'live-events-notify' });
      setSubStatus('done');
    } catch {
      setSubStatus('done');
    }
  };

  return (
    <>
      <Helmet>
        <title>Live Events — In-Person Knowledge Events in India | WeBinX</title>
        <meta name="description" content="Discover in-person conferences, meetups, workshops and hackathons across India's top 8 cities." />
        <link rel="canonical" href="https://webinx.in/live-events" />
      </Helmet>

      <div className="has-bottom-nav">
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)', borderBottom: '3px solid #ef4444', padding: '48px 40px 40px', textAlign: 'center' }}>
          <div className="wx-container">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
            <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1 }}>
              🚀 Coming Soon
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#111827', marginTop: 16, marginBottom: 8 }}>
              Live Events Across India
            </h1>
            <p style={{ color: '#6B7280', fontSize: 16, maxWidth: 520, margin: '0 auto 32px' }}>
              In-person conferences, meetups, workshops and hackathons across India's top 8 cities — all discoverable in one place. Be the first to know.
            </p>

            {subStatus === 'done' ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '14px 24px', display: 'inline-block', color: '#065f46', fontWeight: 600 }}>
                🎉 You're on the list! We'll notify you when live events launch.
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
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '13px 20px', borderRadius: '0 12px 12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  🔔 Notify Me
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Events across 8 cities */}
        {!loading && events.length > 0 ? (
          <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#111827' }}>Upcoming Live Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(ev => <WebinarCard key={ev.id} event={ev} />)}
            </div>
          </div>
        ) : (
          /* City grid */
          <div className="wx-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16, textAlign: 'center' }}>
              Events across 8 cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ maxWidth: 700, margin: '0 auto' }}>
              {CITIES.map(city => (
                <Link key={city.name} href={`/city/${city.name.toLowerCase()}`}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 12,
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{city.emoji}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{city.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>View events →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 24px', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6B7280', marginBottom: 16, fontSize: 15 }}>
            Looking for online events? Browse hundreds of webinars
          </p>
          <Link href="/webinars">
            <button style={{ background: '#0D4F6B', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
              Browse Webinars →
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
