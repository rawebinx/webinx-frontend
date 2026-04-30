// src/pages/upcoming.tsx
// WebinX — Upcoming Features Roadmap Page
// Visually bold roadmap with 4 phases: Live, Building, Soon, Vision

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

// ── Types ──────────────────────────────────────────────────────────────────────

type FeatureStatus = 'live' | 'building' | 'soon' | 'vision';

interface Feature {
  emoji: string;
  title: string;
  desc: string;
  tag?: string;
}

interface Phase {
  id: FeatureStatus;
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  features: Feature[];
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PHASES: Phase[] = [
  {
    id: 'live',
    label: '✅ Live Now',
    subtitle: 'Already working for you today',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#86efac',
    dot: '#16a34a',
    features: [
      { emoji: '🔍', title: 'AI-Powered Search', desc: 'Ask anything in plain English — "finance webinars in Mumbai next week" — Claude finds it instantly.' },
      { emoji: '📅', title: '97+ Curated Events', desc: 'Webinars, podcasts and live events from 35+ sources, updated every 30 minutes automatically.' },
      { emoji: '🏙️', title: '8 Indian Cities', desc: 'Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad — all covered.' },
      { emoji: '🎤', title: 'Free Host Listings', desc: 'Any Indian professional can list their event in 60 seconds. No credit card. No approval needed.' },
      { emoji: '🖥️', title: 'Host Tools Suite', desc: 'AI-generated titles, descriptions, email copy and social posts — optimised for discovery.' },
      { emoji: '🎖️', title: 'Attendance Certificates', desc: 'Auto-generated PDF certificates for any event. Hosts can offer, learners can claim.' },
      { emoji: '❤️', title: 'Saved Events Wishlist', desc: 'Save any event, get reminded before it starts, never miss a session again.' },
      { emoji: '🌐', title: 'Embed Widget', desc: 'Any host can embed their event feed on their own website with one line of code.' },
      { emoji: '📊', title: 'Live Public Metrics', desc: 'Full transparency — real numbers, no spin. webinx.in/metrics shows everything live.' },
    ],
  },
  {
    id: 'building',
    label: '🔨 Building Now',
    subtitle: 'In development — coming within weeks',
    color: '#0369a1',
    bg: '#eff6ff',
    border: '#93c5fd',
    dot: '#2563eb',
    features: [
      { emoji: '📱', title: 'WhatsApp Reminders', desc: 'Save an event → get a WhatsApp message 1 hour before it starts. 500M+ Indians use WhatsApp daily.', tag: 'High Impact' },
      { emoji: '🎙️', title: 'Podcast Directory', desc: 'India\'s first curated podcast directory focused on professional knowledge — finance, tech, HR, startup.', tag: 'New Vertical' },
      { emoji: '💳', title: 'Host SaaS Plans', desc: 'Pro (₹299) · Scale (₹799) · Agency (₹1,999) — unlock analytics, priority listing, AI promotion quota.', tag: 'Revenue' },
      { emoji: '📧', title: 'Weekly Digest Email', desc: 'Every Sunday: your personalised top 10 events for the week. Curated by AI. Delivered to 1,000+ subscribers.', tag: 'Growth' },
      { emoji: '🏛️', title: 'Government Events Feed', desc: 'ICMAI, NASSCOM, SEBI, DGFT, Startup India — all government webinars in one place. Untapped gold.', tag: 'Unique' },
      { emoji: '🌍', title: 'Luma Integration', desc: 'India\'s fastest-growing event platform integrated — 50+ new events per week pulled automatically.' },
    ],
  },
  {
    id: 'soon',
    label: '⏳ Coming Soon',
    subtitle: 'Designed and roadmapped — launching in 1–3 months',
    color: '#92400e',
    bg: '#fffbeb',
    border: '#fde68a',
    dot: '#d97706',
    features: [
      { emoji: '🤖', title: 'AI Promotion-as-a-Service', desc: 'Pay ₹499–₹2,499 → Claude generates your LinkedIn post, email sequence and WhatsApp message. Done in 30 seconds.', tag: 'Revenue' },
      { emoji: '📈', title: 'Intelligence Reports', desc: 'Monthly sector PDFs: "AI Webinar Trends in India — May 2026". Sell to HR teams and L&D managers at ₹999–₹2,499.', tag: 'B2B Revenue' },
      { emoji: '🎫', title: 'Ticketing with Commission', desc: 'Sell tickets for live events directly on WebinX. We take 6% — Razorpay Routes handles the rest.', tag: 'Revenue' },
      { emoji: '💰', title: 'Newsletter Sponsorships', desc: 'One sponsored slot per weekly digest. ₹3,000–₹5,000/week. Target: webinar tool companies (Zoom, StreamYard, Canva).', tag: 'Revenue' },
      { emoji: '🏆', title: 'Host Leaderboard & Badges', desc: 'Top hosts ranked by event quality, attendance and learner ratings. Verified badge unlocks premium features.' },
      { emoji: '📲', title: 'Native Mobile App', desc: 'iOS and Android apps with push notifications, offline saved events and one-tap registration.', tag: 'Growth' },
      { emoji: '🗺️', title: 'Interactive City Maps', desc: 'Visual map view for live events — see what\'s happening near you in any Indian city today.' },
      { emoji: '🔔', title: 'Topic Alerts', desc: 'Follow any topic — "AI" or "Finance" — and get notified the moment a new matching event is listed.' },
    ],
  },
  {
    id: 'vision',
    label: '🚀 The Vision',
    subtitle: 'Ambitious. Maybe audacious. Definitely coming.',
    color: '#6d28d9',
    bg: '#faf5ff',
    border: '#c4b5fd',
    dot: '#7c3aed',
    features: [
      { emoji: '🧠', title: 'Personalised AI Learning Path', desc: 'Tell WebinX your career goal → it builds your 90-day webinar learning roadmap across sectors automatically.', tag: 'AI Native' },
      { emoji: '🎓', title: 'WebinX Academy', desc: 'Live 4-week cohorts: "How to Run Webinars That Convert." ₹4,999/seat. Run by verified WebinX hosts. India-first.', tag: 'Education' },
      { emoji: '🤝', title: 'Host Collaboration Engine', desc: 'AI matches hosts with complementary audiences — co-host webinars, split registrations, grow together.', tag: 'Network Effects' },
      { emoji: '🌐', title: 'Multi-language Support', desc: 'Hindi, Tamil, Telugu, Marathi, Bengali — knowledge events in every major Indian language. Bharat, not just India.', tag: 'Bharat Scale' },
      { emoji: '💼', title: 'Corporate Learning Marketplace', desc: 'L&D managers subscribe for ₹49,999/year → unlimited employee access to all WebinX events. B2B SaaS play.', tag: 'Enterprise' },
      { emoji: '🎙️', title: 'Live Recording Studio', desc: 'Browser-based studio: record directly on WebinX, auto-transcribe, auto-generate clip highlights for LinkedIn.', tag: 'Platform' },
      { emoji: '🛰️', title: 'API for Developers', desc: 'Open event API — any Indian edtech, HR tool or learning platform can embed WebinX\'s event intelligence feed.', tag: 'Ecosystem' },
      { emoji: '🌏', title: 'Southeast Asia Expansion', desc: 'India model → Singapore, Malaysia, Indonesia. The knowledge economy gap exists everywhere in Asia.', tag: 'Global' },
      { emoji: '🏅', title: 'WebinX Awards', desc: 'Annual awards for India\'s best webinar hosts, most impactful podcasts and most innovative live events.', tag: 'Community' },
      { emoji: '🧬', title: 'AI Event Cloning', desc: 'Upload your past webinar recording → AI generates a complete new event: title, description, thumbnail, email sequence. One click.', tag: 'Sci-fi Mode' },
    ],
  },
];

// ── Animated counter ───────────────────────────────────────────────────────────

function Counter({ target, suffix = '' }: { target: number; suffix?: string }): JSX.Element {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

// ── Feature Card ───────────────────────────────────────────────────────────────

function FeatureCard({ feature, phase }: { feature: Feature; phase: Phase }): JSX.Element {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#fff' : phase.bg,
        border: `1.5px solid ${hovered ? phase.dot : phase.border}`,
        borderRadius: 14,
        padding: '16px 18px',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 6px 24px ${phase.color}22` : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{feature.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{feature.title}</span>
            {feature.tag && (
              <span style={{
                background: phase.dot, color: '#fff',
                fontSize: 9, fontWeight: 700, padding: '2px 7px',
                borderRadius: 4, letterSpacing: '0.05em',
              }}>
                {feature.tag}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.55, margin: 0 }}>{feature.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Phase Section ──────────────────────────────────────────────────────────────

function PhaseSection({ phase, index }: { phase: Phase; index: number }): JSX.Element {
  return (
    <div
      style={{
        animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
      }}
    >
      {/* Phase header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 20, paddingBottom: 16,
        borderBottom: `2px solid ${phase.border}`,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: phase.dot, flexShrink: 0,
          boxShadow: `0 0 0 4px ${phase.color}22`,
        }} />
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>
            {phase.label}
          </h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>{phase.subtitle}</p>
        </div>
        <div style={{ marginLeft: 'auto', background: phase.bg, border: `1px solid ${phase.border}`, borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 600, color: phase.color }}>
          {phase.features.length} features
        </div>
      </div>

      {/* Feature grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
        marginBottom: 48,
      }}>
        {phase.features.map((f, i) => (
          <FeatureCard key={i} feature={f} phase={phase} />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function UpcomingPage(): JSX.Element {
  const totalFeatures = PHASES.reduce((sum, p) => sum + p.features.length, 0);

  return (
    <>
      <Helmet>
        <title>Upcoming Features — What We're Building | WeBinX</title>
        <meta name="description" content="WebinX roadmap — from AI learning paths to WhatsApp reminders, corporate marketplaces and Southeast Asia expansion. See what India's Knowledge Events Marketplace is building next." />
        <link rel="canonical" href="https://webinx.in/upcoming" />
      </Helmet>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D4F6B 0%, #0a3d54 60%, #051f2b 100%)',
        padding: '56px 40px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #E8B44A 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0D4F6B 0%, transparent 50%)',
        }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,180,74,0.15)', border: '1px solid rgba(232,180,74,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#E8B44A', letterSpacing: '0.08em' }}>LIVE ROADMAP — UPDATED WEEKLY</span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.5px' }}>
            What We're Building for<br />
            <span style={{ color: '#E8B44A' }}>India's Knowledge Economy</span>
          </h1>

          <p style={{ fontSize: 16, color: '#7dd3fc', lineHeight: 1.65, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            From AI-powered personalisation to WhatsApp reminders, government event feeds and a full corporate learning marketplace — here's every feature we're building, in the order we're building them.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Features live today', value: PHASES[0].features.length, suffix: '' },
              { label: 'In development', value: PHASES[1].features.length, suffix: '' },
              { label: 'Total roadmap items', value: totalFeatures, suffix: '+' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline indicator */}
      <div style={{ background: '#f9fafb', borderBottom: '1px solid #E5E7EB', padding: '12px 40px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0 }}>
          {PHASES.map((phase, i) => (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: phase.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: phase.color }}>{phase.label}</span>
              </div>
              {i < PHASES.length - 1 && (
                <div style={{ flex: 1, height: 1, background: '#E5E7EB', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 40px 80px' }}>
        {PHASES.map((phase, i) => (
          <PhaseSection key={phase.id} phase={phase} index={i} />
        ))}

        {/* Bottom CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0D4F6B 0%, #0a3d54 100%)',
          borderRadius: 20, padding: '36px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Want to influence what we build next?
            </h3>
            <p style={{ fontSize: 14, color: '#7dd3fc', margin: 0 }}>
              Host your first webinar free · Your usage shapes our roadmap
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/submit-webinar">
              <button style={{
                background: '#E8B44A', color: '#0a3d54',
                border: 'none', borderRadius: 10, padding: '12px 22px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                List Your Event Free →
              </button>
            </Link>
            <a href="mailto:contact@webinx.in" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10,
                padding: '12px 22px', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Share Feature Idea
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
