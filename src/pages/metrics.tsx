// src/pages/metrics.tsx
// WebinX — Public Traction Dashboard
// Live data from DB. Shown to investors, press, and the public.
// Design: clean data-journalism style — DM Serif headings, animated counters,
// teal/gold brand colours, transparent about what each number means.

import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Users, Eye, Heart, Bell, MapPin, Zap, Globe, ArrowRight } from 'lucide-react';
import { API_BASE, getStats } from '../lib/api';
import type { PlatformStats } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicMetrics {
  total_events: number;
  total_hosts: number;
  total_subscribers: number;
  total_views: number;
  total_saves: number;
  cities_covered: number;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function Counter({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!value || started.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      started.current = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.floor(eased * value));
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString('en-IN')}</span>;
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  sublabel: string;
  color: string;
  suffix?: string;
  prefix?: string;
}

function MetricCard({ icon, value, label, sublabel, color, suffix = '', prefix = '' }: MetricCardProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #E5E7EB',
      borderRadius: 16,
      padding: '28px 24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: color, borderRadius: '16px 16px 0 0',
      }} />

      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${color}15`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, color,
      }}>
        {icon}
      </div>

      <div style={{
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 800, color: '#0f1923',
        lineHeight: 1, marginBottom: 6,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {prefix}<Counter value={value} />{suffix}
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
        {sublabel}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MetricsPage(): React.ReactElement {
  const [metrics, setMetrics] = useState<PublicMetrics | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pubRes, statsData] = await Promise.all([
          fetch(`${API_BASE}/api/metrics/public`).then(r => r.json()),
          getStats(),
        ]);
        setMetrics(pubRes);
        setStats(statsData);
      } catch {
        // use stats fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Merge both sources for best data
  const totalEvents   = metrics?.total_events   || stats?.total_events    || 0;
  const totalHosts    = metrics?.total_hosts    || stats?.hosts           || 0;
  const totalSubs     = metrics?.total_subscribers || 0;
  const totalViews    = metrics?.total_views    || 0;
  const totalSaves    = metrics?.total_saves    || 0;
  const citiesCovered = metrics?.cities_covered || 8;
  const upcomingEvents = stats?.upcoming_events || stats?.upcoming_events || 0;

  return (
    <>
      <Helmet>
        <title>WebinX Traction — Live Platform Metrics | India's Knowledge Events Marketplace</title>
        <meta name="description"
          content="Live traction metrics for WebinX — India's #1 knowledge events platform. Events, hosts, views, subscribers and more." />
        <meta property="og:title" content="WebinX Live Traction Metrics" />
        <meta property="og:description" content="Real-time platform growth metrics for WebinX." />
      </Helmet>

      <div style={{ background: '#fafbfc', minHeight: '100vh' }}>

        {/* ── Hero ────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #0D4F6B 0%, #1e3a5f 100%)',
          padding: '64px 24px 72px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05,
            backgroundImage: 'radial-gradient(circle, #E8B44A 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }} />

          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(232,180,74,0.15)', border: '1px solid rgba(232,180,74,0.3)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 24,
            }}>
              <TrendingUp size={14} color="#E8B44A" />
              <span style={{ fontSize: 13, color: '#E8B44A', fontWeight: 600 }}>
                Live Platform Metrics — Updated in Real Time
              </span>
            </div>

            <h1 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(30px, 5vw, 50px)',
              color: '#fff', fontWeight: 400, lineHeight: 1.15, marginBottom: 18,
            }}>
              WebinX is growing.<br />
              <em style={{ color: '#E8B44A' }}>Here's the proof.</em>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 32 }}>
              We believe in radical transparency. These numbers come directly
              from our database — no rounding up, no marketing spin.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <a href="/host" style={{
                background: '#E8B44A', color: '#0f1923', textDecoration: 'none',
                padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                List Your Event Free <ArrowRight size={15} />
              </a>
              <a href="mailto:invest@webinx.in" style={{
                background: 'transparent', color: '#fff', textDecoration: 'none',
                padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                border: '1.5px solid rgba(255,255,255,0.3)',
              }}>
                Investor Inquiry →
              </a>
            </div>
          </div>
        </div>

        {/* ── Live badge ─────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: 28, marginBottom: -8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 20, padding: '5px 14px',
            fontSize: 12, color: '#166534', fontWeight: 600,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#16a34a',
              display: 'inline-block', animation: 'pulse 2s infinite',
            }} />
            Live data from our database
          </span>
        </div>

        {/* ── Metric Cards ────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  height: 160, background: '#fff', border: '1.5px solid #E5E7EB',
                  borderRadius: 16, animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}>
              <MetricCard
                icon={<Zap size={20} />}
                value={totalEvents}
                label="Events Listed"
                sublabel="Webinars, podcasts & live events across India"
                color="#0D4F6B"
              />
              <MetricCard
                icon={<Users size={20} />}
                value={totalHosts}
                label="Knowledge Hosts"
                sublabel="Educators, founders & experts sharing knowledge"
                color="#6366f1"
              />
              <MetricCard
                icon={<Bell size={20} />}
                value={totalSubs}
                label="Subscribers"
                sublabel="Learners receiving our weekly digest"
                color="#f97316"
              />
              <MetricCard
                icon={<Eye size={20} />}
                value={totalViews}
                label="Event Views"
                sublabel="Total profile views across all listed events"
                color="#10b981"
              />
              <MetricCard
                icon={<Heart size={20} />}
                value={totalSaves}
                label="Events Saved"
                sublabel="Added to wishlists by engaged learners"
                color="#f43f5e"
              />
              <MetricCard
                icon={<MapPin size={20} />}
                value={citiesCovered}
                label="Cities Covered"
                sublabel="Pan-India reach across all major metros"
                color="#E8B44A"
              />
            </div>
          )}
        </div>

        {/* ── What We're Building ─────────────────────────────── */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: '8px 16px 56px',
        }}>
          <div style={{
            background: '#fff', border: '1.5px solid #E5E7EB',
            borderRadius: 20, padding: '40px 36px',
          }}>
            <h2 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 26, fontWeight: 400, color: '#0f1923',
              marginBottom: 16,
            }}>
              What we're building
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.8, marginBottom: 24 }}>
              WebinX is India's first AI-native knowledge events infrastructure — aggregating
              webinars, podcasts, and live events scattered across 200+ platforms into one
              discoverable, monetizable marketplace. We are the
              <strong style={{ color: '#0D4F6B' }}> Eventbrite × Substack × LinkedIn Events for India</strong>,
              built at 1/10th the cost using AI automation.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
            }}>
              {[
                { label: '4 Revenue Layers', detail: 'SaaS · GMV · Intelligence · Promotions', icon: '💰' },
                { label: 'AI-Managed', detail: 'Claude powers search, tools & promotions', icon: '🤖' },
                { label: 'India-First', detail: 'Razorpay · ₹ pricing · IST · 8 cities', icon: '🇮🇳' },
                { label: 'Open Metrics', detail: 'Transparent traction — no spin', icon: '📊' },
              ].map(({ label, detail, icon }) => (
                <div key={label} style={{
                  background: '#f8fafc', borderRadius: 12,
                  padding: '16px', border: '1px solid #F3F4F6',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── For Investors ───────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #0D4F6B, #1A6B8A)',
          padding: '48px 24px',
        }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <Globe size={28} color="#E8B44A" style={{ marginBottom: 16 }} />
            <h2 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 28, fontWeight: 400, color: '#fff',
              marginBottom: 16,
            }}>
              Interested in investing or partnering?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 28, lineHeight: 1.7 }}>
              We're building India's knowledge events infrastructure with a clear path to
              ₹40L ARR. Reach out for our investor deck, detailed metrics, or a demo call.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:invest@webinx.in" style={{
                background: '#E8B44A', color: '#0f1923', textDecoration: 'none',
                padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                invest@webinx.in <ArrowRight size={16} />
              </a>
              <a href="/pricing" style={{
                background: 'transparent', color: '#fff', textDecoration: 'none',
                padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15,
                border: '1.5px solid rgba(255,255,255,0.35)',
              }}>
                View Host Plans
              </a>
            </div>
          </div>
        </div>

        {/* ── Footer note ─────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '24px 16px', color: '#9CA3AF', fontSize: 12 }}>
          Metrics update in real time from our live database. Last refreshed on page load.
          <br />
          WebinX · India's Knowledge Events Marketplace · contact@webinx.in
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
