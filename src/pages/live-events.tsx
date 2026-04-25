import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { MapPin, Sparkles, ArrowRight, Bell, Users, Calendar } from 'lucide-react';
import { getEvents, captureLead } from '../lib/api';
import type { WebinarEvent } from '../lib/api';
import { WebinarCard } from '../components/webinar-card';

const CITIES = [
  { name: 'Mumbai', slug: 'mumbai', emoji: '🌊', desc: 'Finance, startup & tech events' },
  { name: 'Delhi', slug: 'delhi', emoji: '🏛️', desc: 'Policy, education & corporate' },
  { name: 'Bengaluru', slug: 'bengaluru', emoji: '🌳', desc: 'AI, SaaS & engineering' },
  { name: 'Hyderabad', slug: 'hyderabad', emoji: '💎', desc: 'Tech & pharma events' },
  { name: 'Chennai', slug: 'chennai', emoji: '🌴', desc: 'Manufacturing & healthcare' },
  { name: 'Pune', slug: 'pune', emoji: '🎭', desc: 'Auto, IT & startup ecosystem' },
  { name: 'Kolkata', slug: 'kolkata', emoji: '🎨', desc: 'Culture, fintech & media' },
  { name: 'Ahmedabad', slug: 'ahmedabad', emoji: '🦁', desc: 'Trade, textile & MSME' },
];

export default function LiveEventsPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [webinars, setWebinars] = useState<WebinarEvent[]>([]);
  const [loadingWebinars, setLoadingWebinars] = useState<boolean>(true);

  useEffect(() => {
    getEvents({ limit: 6 }).then(data => {
      setWebinars(data ?? []);
      setLoadingWebinars(false);
    }).catch(() => setLoadingWebinars(false));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    const res = await captureLead({ email: email.trim(), utm_source: 'live-events-waitlist' });
    setStatus(res.status === 'ok' ? 'success' : 'error');
  }, [email, status]);

  return (
    <>
      <Helmet>
        <title>Live Events — In-Person Knowledge Events in India | WeBinX</title>
        <meta name="description" content="Discover in-person conferences, meetups and workshops across India's top cities. Coming soon to WeBinX." />
        <link rel="canonical" href="https://webinx.in/live-events" />
        <meta property="og:title" content="Live Events | WeBinX" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="has-bottom-nav">
        {/* Hero */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(232,180,74,0.05) 100%)',
            borderBottom: '1px solid rgba(220,38,38,0.1)',
            padding: 'clamp(3rem, 8vw, 5rem) 0',
          }}
        >
          <div className="wx-container text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 mx-auto"
              style={{ background: 'rgba(220,38,38,0.1)', border: '2px solid rgba(220,38,38,0.15)' }}
            >
              <MapPin size={28} style={{ color: '#dc2626' }} />
            </div>

            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}
            >
              🚀 Coming Soon
            </span>

            <h1
              className="font-bold mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: 'var(--wx-ink)',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Live Events Across India
            </h1>

            <p
              className="mx-auto mb-8"
              style={{ fontSize: '1rem', color: 'var(--wx-muted)', maxWidth: 480, lineHeight: 1.7 }}
            >
              In-person conferences, meetups, workshops and hackathons across India's top 8 cities —
              all discoverable in one place. Be the first to know.
            </p>

            {/* Waitlist */}
            {status === 'success' ? (
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#065f46', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                🎉 You're on the list! We'll notify you when Live Events launch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 text-sm px-4 py-3 rounded-xl outline-none"
                  style={{
                    border: '1.5px solid var(--wx-border)',
                    background: '#fff',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--wx-ink)',
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold flex-shrink-0"
                  style={{
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                  }}
                >
                  <Bell size={14} />
                  {status === 'loading' ? 'Joining…' : 'Notify Me'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-sm mt-2" style={{ color: '#DC2626' }}>Something went wrong. Please try again.</p>
            )}
          </div>
        </section>

        {/* City grid */}
        <section className="wx-section">
          <div className="wx-container">
            <h2
              className="text-center mb-8"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--wx-ink)' }}
            >
              Events across 8 cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CITIES.map(city => (
                <Link
                  key={city.slug}
                  href={`/city/${city.slug}`}
                  className="wx-card flex items-start gap-3 p-4 group"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="text-2xl flex-shrink-0">{city.emoji}</span>
                  <div>
                    <div
                      className="font-semibold text-sm mb-0.5"
                      style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)' }}
                    >
                      {city.name}
                    </div>
                    <div className="text-xs leading-snug" style={{ color: 'var(--wx-muted)' }}>
                      {city.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="wx-section" style={{ background: 'var(--wx-surface)' }}>
          <div className="wx-container">
            <h2
              className="text-center mb-8"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--wx-ink)' }}
            >
              What's coming
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: <MapPin size={24} style={{ color: '#dc2626' }} />, title: 'Venue Maps', desc: 'Embedded venue maps, directions and nearby accommodation for every event.' },
                { icon: <Users size={24} style={{ color: 'var(--wx-teal)' }} />, title: 'Attendee Networking', desc: 'Connect with other attendees before the event. Share plans, find travel buddies.' },
                { icon: <Calendar size={24} style={{ color: '#8b5cf6' }} />, title: 'Ticket Tracking', desc: 'Track ticket availability, price drops and early-bird windows automatically.' },
              ].map(item => (
                <div key={item.title} className="wx-card p-6 text-center">
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--wx-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meanwhile webinars */}
        <section className="wx-section">
          <div className="wx-container">
            <div className="wx-section-header">
              <h2 className="wx-section-title">Meanwhile — online events</h2>
              <Link href="/webinars" className="wx-section-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingWebinars
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="wx-card overflow-hidden">
                      <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 0 }} />
                      <div className="p-4 space-y-2">
                        <div className="skeleton h-3 w-1/3 rounded-full" />
                        <div className="skeleton h-4 w-full" />
                      </div>
                    </div>
                  ))
                : webinars.map(event => (
                    <WebinarCard key={event.id} event={event} />
                  ))}
            </div>

            <div
              className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4"
              style={{ background: 'linear-gradient(135deg, var(--wx-teal-pale), var(--wx-gold-pale))', border: '1.5px solid rgba(13,79,107,0.1)' }}
            >
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--wx-ink)' }}>
                  Looking for something specific?
                </p>
                <p className="text-xs" style={{ color: 'var(--wx-muted)' }}>
                  Ask our AI to find events by topic, city, or date — it searches everything instantly.
                </p>
              </div>
              <Link
                href="/ai-search"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0"
                style={{ background: 'var(--wx-teal)', color: '#fff', textDecoration: 'none' }}
              >
                <Sparkles size={14} />
                Try AI Search
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
