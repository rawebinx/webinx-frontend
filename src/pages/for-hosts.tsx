// src/pages/for-hosts.tsx
// High-converting landing page for webinar hosts who discover WebinX organically
// SEO target: "how to promote webinar India", "list webinar platform India"

import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

const BENEFITS = [
  { emoji: '🔍', title: 'AI-Powered Discovery', desc: 'Your webinar appears in Claude-powered search results. When learners ask "AI webinars this week", your event shows up.' },
  { emoji: '🆓', title: 'Free Forever', desc: 'Listing your event is always free. No credit card. No approval. No limits on how many events you list.' },
  { emoji: '✅', title: 'Verified Host Badge', desc: 'Get a verified badge on your host profile. Builds trust with thousands of Indian learners browsing WebinX.' },
  { emoji: '🛠', title: 'AI Host Tools', desc: 'Optimize your title, description and email copy with AI — specifically trained on high-performing Indian webinars.' },
  { emoji: '📧', title: 'Email Blast to Subscribers', desc: 'Featured events get included in our weekly digest sent to active subscribers every Sunday.' },
  { emoji: '🎖', title: 'Attendance Certificates', desc: 'Offer certificates to your attendees automatically. Increases registration rates by up to 40%.' },
  { emoji: '📊', title: 'Analytics Dashboard', desc: 'See how many people viewed, clicked and saved your event. Understand your audience better.' },
  { emoji: '🌐', title: 'Embed Your Events', desc: 'Paste one line of code on your website to show your upcoming events automatically.' },
];

const STEPS = [
  { n: '1', title: 'Submit your event', desc: 'Fill in your event title, date, registration link and description. Takes 2 minutes.' },
  { n: '2', title: 'Get discovered', desc: 'Your event appears in search results, sector feeds, city pages and AI search immediately.' },
  { n: '3', title: 'Grow your audience', desc: 'Learners save, share and register for your event. Build a verified host profile over time.' },
];

const TESTIMONIALS = [
  { name: 'HR Leaders India', role: 'Webinar Host', text: 'Listed our HR Tech webinar and got discovery from audiences we never reached on LinkedIn.' },
  { name: 'Startup India', role: 'Event Organiser', text: 'The free listing and AI search visibility brought new registrants we wouldn\'t have found otherwise.' },
  { name: 'Growth Academy', role: 'Marketing Educator', text: 'WebinX is the only platform in India that curates knowledge events across all formats.' },
];

const PRICING = [
  { label: 'Free Listing', price: '₹0', period: 'forever', features: ['List unlimited events', 'Basic host profile', 'Event discovery', 'AI search visibility'], cta: 'Start Free', href: '/submit-webinar', primary: false },
  { label: 'Featured', price: '₹799', period: '30 days', features: ['Everything in Free', 'Top placement in feeds', 'Featured badge on event', 'Email digest inclusion', 'Priority in AI search'], cta: 'Get Featured', href: '/get-featured', primary: true },
  { label: 'Agency', price: '₹1,999', period: '90 days', features: ['Everything in Featured', 'Sponsor slot in newsletter', 'AI Promotion pack', 'Analytics report', 'Dedicated host support'], cta: 'Contact Us', href: 'mailto:contact@webinx.in', primary: false },
];

export default function ForHostsPage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>List Your Webinar Free in India | WeBinX for Hosts</title>
        <meta name="description" content="List your webinar, podcast or live event on WeBinX — India's Knowledge Events Marketplace. Free forever. Reach thousands of Indian learners. Get discovered via AI search." />
        <link rel="canonical" href="https://webinx.in/for-hosts" />
        <meta property="og:title" content="List Your Webinar Free in India | WeBinX" />
        <meta property="og:description" content="India's best platform for webinar hosts. Free listing, AI-powered discovery, verified badges and more." />
      </Helmet>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D4F6B 0%, #0a3d54 100%)', padding: '64px 40px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(232,180,74,0.2)', border: '1px solid rgba(232,180,74,0.4)', borderRadius: 20, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#E8B44A', letterSpacing: '0.08em', marginBottom: 20 }}>
            🎤 FOR WEBINAR HOSTS IN INDIA
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.3px' }}>
            Reach Thousands of Indian Learners.<br />
            <span style={{ color: '#E8B44A' }}>List Your Event Free.</span>
          </h1>
          <p style={{ fontSize: 17, color: '#bae6fd', lineHeight: 1.65, marginBottom: 32 }}>
            WebinX is India's AI-powered knowledge events marketplace.
            List once — get discovered across search, city feeds, sector pages and weekly email digests.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/submit-webinar">
              <button style={{ background: '#E8B44A', color: '#0a3d54', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                List Your Event Free →
              </button>
            </Link>
            <Link href="/host">
              <button style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                View Host Profiles
              </button>
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>
            No credit card. No approval needed. 2 minutes to list.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#f9fafb', borderBottom: '1px solid #E5E7EB', padding: '16px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {[
            { value: '97+', label: 'Events Listed' },
            { value: '24', label: 'Verified Hosts' },
            { value: '8', label: 'Indian Cities' },
            { value: 'Free', label: 'Forever' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0D4F6B' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 40px 0' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: 8 }}>How it works</h2>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 36 }}>Your event goes live in under 2 minutes</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {STEPS.map(step => (
            <div key={step.n} style={{ textAlign: 'center', padding: '24px 20px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0D4F6B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, margin: '0 auto 16px' }}>
                {step.n}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits grid */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 40px 0' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: 8 }}>Everything included free</h2>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 36 }}>Tools that used to cost ₹5,000/month — now free for every WebinX host</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {BENEFITS.map(b => (
            <div key={b.emoji} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{b.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 6 }}>{b.title}</div>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 40px 0' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: 8 }}>Simple pricing</h2>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 36 }}>Start free. Upgrade when you need more reach.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PRICING.map(p => (
            <div key={p.label} style={{
              background: p.primary ? '#0D4F6B' : '#fff',
              border: p.primary ? 'none' : '1.5px solid #E5E7EB',
              borderRadius: 16, padding: '28px 24px',
              transform: p.primary ? 'scale(1.03)' : 'none',
              boxShadow: p.primary ? '0 8px 32px rgba(13,79,107,0.25)' : 'none',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.primary ? '#7dd3fc' : '#6B7280', marginBottom: 8, letterSpacing: '0.05em' }}>
                {p.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: p.primary ? '#fff' : '#111827', marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontSize: 13, color: p.primary ? '#93c5fd' : '#9CA3AF', marginBottom: 20 }}>/{p.period}</div>
              <div style={{ marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: p.primary ? '#e0f2fe' : '#374151' }}>
                    <span style={{ color: p.primary ? '#4ade80' : '#16a34a', flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href={p.href} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '11px 0',
                  background: p.primary ? '#E8B44A' : '#0D4F6B',
                  color: p.primary ? '#0a3d54' : '#fff',
                  border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {p.cta}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 40px 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: 32 }}>Trusted by India's knowledge hosts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: '#f9fafb', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px' }}>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ maxWidth: 600, margin: '56px auto 80px', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
          Ready to reach India's learners?
        </h2>
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 28 }}>
          Join 24 verified hosts already on WebinX. Your next webinar could reach thousands of new learners.
        </p>
        <Link href="/submit-webinar">
          <button style={{ background: '#0D4F6B', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(13,79,107,0.3)' }}>
            List Your First Event Free →
          </button>
        </Link>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>No credit card. 2 minutes. Free forever.</p>
      </div>
    </>
  );
}
