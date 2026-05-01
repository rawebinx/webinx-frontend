// src/pages/blog-webinar-attendees.tsx
// SEO target: "how to get more webinar attendees India"
// Canonical: https://www.webinx.in/blog/get-more-webinar-attendees
// Article JSON-LD + FAQPage JSON-LD for rich results

import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { ArrowRight, CheckCircle } from 'lucide-react';

const PUBLISHED = '2026-05-01';
const UPDATED   = '2026-05-01';

const FAQS = [
  {
    q: 'How do I get more attendees for my webinar in India for free?',
    a: 'List your webinar on free discovery platforms like WebinX, share in relevant LinkedIn groups, post in WhatsApp communities related to your topic, and ask past attendees to forward the invite. Listing on WebinX puts you in front of 50,000+ monthly visitors searching for exactly your topic.',
  },
  {
    q: 'What is the best time to host a webinar in India?',
    a: 'Tuesday to Thursday between 6–8 PM IST consistently gets the highest attendance for professional webinars in India. Saturday 10 AM–12 PM works well for non-working-hour audiences. Avoid Mondays and Fridays.',
  },
  {
    q: 'How far in advance should I promote my webinar?',
    a: 'List your event at least 14 days before the date. Send the first reminder 7 days before, a second one 24 hours before, and a third one 1 hour before. WebinX sends automated alerts to subscribers interested in your topic the moment you list.',
  },
  {
    q: 'Is it worth listing my webinar on multiple platforms?',
    a: 'Yes — especially on aggregator platforms like WebinX that already have audiences interested in learning. Unlike social media where you build from zero, WebinX visitors are already in "find a webinar" mode. Listing is free and takes under 2 minutes.',
  },
  {
    q: 'What details should I include in my webinar listing to get more sign-ups?',
    a: 'A strong title with a specific outcome (not "AI Webinar" but "Build Your First AI Chatbot in 60 Minutes"), a speaker name or credential, the exact date and time in IST, and a clear one-sentence description of who should attend. Listings with these details get 3–5× more clicks.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }): JSX.Element {
  return (
    <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: 20, marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8, lineHeight: 1.4 }}>{q}</h3>
      <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.75, margin: 0 }}>{a}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      style={{
        display: 'flex', gap: 12, padding: '12px 16px',
        background: '#E1F5EE', borderRadius: 10,
        border: '1px solid rgba(13,79,107,0.12)',
        marginBottom: 10,
      }}
    >
      <CheckCircle size={17} color="#0D4F6B" style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: 14.5, color: '#0D4F6B', lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}

export default function BlogWebinarAttendeesPage(): JSX.Element {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Get More Attendees for Your Webinar in India (Free)',
    description: 'Step-by-step strategies to grow webinar attendance in India — from listing on discovery platforms to WhatsApp promotion and SEO. Includes free tools.',
    author: { '@type': 'Organization', name: 'WebinX', url: 'https://www.webinx.in' },
    publisher: {
      '@type': 'Organization',
      name: 'WebinX',
      logo: { '@type': 'ImageObject', url: 'https://www.webinx.in/logo-wordmark.png' },
    },
    datePublished: PUBLISHED,
    dateModified: UPDATED,
    mainEntityOfPage: 'https://www.webinx.in/blog/get-more-webinar-attendees',
    image: 'https://www.webinx.in/og-default.jpg',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>How to Get More Attendees for Your Webinar in India (Free) — WebinX</title>
        <meta name="description" content="Step-by-step guide to growing webinar attendance in India. Free listing on WebinX, WhatsApp promotion, LinkedIn groups, timing strategies, and more. Used by 200+ India hosts." />
        <link rel="canonical" href="https://www.webinx.in/blog/get-more-webinar-attendees" />
        <meta property="og:title" content="How to Get More Attendees for Your Webinar in India" />
        <meta property="og:description" content="Proven strategies to grow your webinar audience in India — free tools, timing tips, and distribution channels used by 200+ hosts." />
        <meta property="og:url" content="https://www.webinx.in/blog/get-more-webinar-attendees" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <main style={{ background: '#fafbfc', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0D4F6B 0%, #1e3a5f 100%)', padding: 'clamp(3rem, 7vw, 4.5rem) 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginBottom: 20, display: 'flex', justifyContent: 'center', gap: 6 }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <span>Blog</span>
              <span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>Get More Webinar Attendees</span>
            </nav>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(232,180,74,0.15)', border: '1px solid rgba(232,180,74,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20, fontSize: 12.5, fontWeight: 700, color: '#E8B44A' }}>
              Host Guide · 6 min read
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
              How to Get More Attendees for Your Webinar in India
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 28, maxWidth: 580, margin: '0 auto 28px' }}>
              A practical, free-first guide for Indian webinar hosts — from listing your event to filling your virtual room.
            </p>
            <Link href="/submit-webinar">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E8B44A', color: '#0f1923', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', textDecoration: 'none' }}>
                List Your Next Webinar Free <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>

        {/* Article body */}
        <div style={{ maxWidth: 740, margin: '0 auto', padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem' }}>

          {/* Intro */}
          <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.85, marginBottom: 28, fontWeight: 400 }}>
            You've built a great webinar. The slides are ready, the speaker is confirmed, and the Zoom link is set up. But registration numbers are low. If this sounds familiar, you're not alone — getting attendees is the hardest part of running webinars in India. Here's exactly what works.
          </p>

          {/* Stat box */}
          <div style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: '20px 24px', marginBottom: 36, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { n: '83%', l: 'of webinar discovery happens through search or aggregator platforms' },
              { n: '6–8 PM', l: 'IST is the highest-attendance window for professional webinars' },
              { n: '14 days', l: 'minimum promotion window needed for 100+ registrations' },
            ].map(({ n, l }) => (
              <div key={n} style={{ flex: '1 1 160px' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0D4F6B', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.5, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Section 1 */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 16, marginTop: 40 }}>
            1. List on India's webinar discovery platforms first
          </h2>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
            Most webinar hosts only promote their event on their own social channels — reaching the same audience that already knows them. Discovery platforms reach people who are actively searching for webinars to attend, not just scrolling their feed.
          </p>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>
            <strong>WebinX</strong> is India's dedicated webinar and live events marketplace. Listing is free and takes under 2 minutes. Your event gets indexed on Google, appears in AI Search results, and gets sent to subscribers who have set alerts for your topic. Hosts on WebinX report 40–120 additional registrations per event from discovery alone.
          </p>
          <Tip>List your event on WebinX at least 14 days before the date. The algorithm surfaces upcoming events more prominently than same-week events.</Tip>
          <Tip>Use your exact topic as the title — "Stock Market Basics for Beginners" outperforms "Finance Webinar" by 5× in search discovery.</Tip>

          <div style={{ margin: '24px 0', background: '#E1F5EE', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(13,79,107,0.15)' }}>
            <p style={{ fontWeight: 700, color: '#0D4F6B', margin: '0 0 8px', fontSize: 15 }}>Free listing on WebinX includes:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
              {['Google-indexed event page', 'AI Search visibility', 'Wishlist saves by interested attendees', 'Email alerts to topic subscribers', 'Certificate after hosting', 'Analytics: views, clicks, saves'].map((f) => (
                <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: '#0D4F6B', alignItems: 'flex-start' }}>
                  <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 16, marginTop: 40 }}>
            2. Pick the right timing for India audiences
          </h2>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
            Timing is one of the most underrated factors in webinar attendance. India has specific patterns because most professionals commute and have fixed office hours.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { time: 'Tue–Thu, 6–8 PM IST', label: '🏆 Best overall', desc: 'Professionals home from office, dinner not yet started' },
              { time: 'Sat, 10 AM–12 PM IST', label: '✅ Great for learning', desc: 'Weekend morning learners, high engagement' },
              { time: 'Lunch 12:30–1:30 PM IST', label: '👍 Works for short sessions', desc: 'Keep to 45 min max; drop-off is higher' },
              { time: 'Mon / Fri evening', label: '❌ Avoid', desc: 'Monday catch-up, Friday wind-down — high no-show rates' },
            ].map(({ time, label, desc }) => (
              <div key={time} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{time}</div>
                <div style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Section 3 */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 16, marginTop: 40 }}>
            3. WhatsApp is India's highest-reach channel — use it
          </h2>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
            India has 500M+ WhatsApp users. Professional WhatsApp groups — for specific industries, cities, alumni networks — often have better engagement than LinkedIn. A single post in a relevant WhatsApp group with 200 members can drive 30–60 registrations.
          </p>
          <Tip>Join 5 WhatsApp groups in your sector. Post 10 days before, 3 days before, and the day of the event. Keep messages under 3 lines — WhatsApp groups hate walls of text.</Tip>
          <Tip>Message template: "🎓 Free webinar on [topic] on [date] at [time] IST — [link]. Sharing because this community would find it useful." Add a line "Feel free to forward" to trigger sharing.</Tip>

          {/* Section 4 */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 16, marginTop: 40 }}>
            4. LinkedIn for professional topics
          </h2>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
            LinkedIn is India's dominant professional network and works best for B2B topics — finance, HR, marketing, startup, technology. A personal post from the speaker outperforms a company page post by 4–10×.
          </p>
          <Tip>The speaker should post about the webinar 7 days before and 24 hours before. Title posts as a question: "What do most Indian founders get wrong about fundraising?" then say the answer will be shared live in the webinar.</Tip>
          <Tip>Use the LinkedIn Event feature to create a separate event page. Tag co-hosts or past attendees — each tag exposes your event to their network.</Tip>

          {/* Section 5 */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 16, marginTop: 40 }}>
            5. Email your existing audience — even a small list converts
          </h2>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 20 }}>
            If you have an existing email list — even 200 subscribers — a personal email from you will convert 15–25% to registrations. That's more reliable than any social post. Send three emails: announcement (14 days out), reminder (24 hours out), last chance (1 hour out).
          </p>
          <Tip>Subject line that works in India: "Free on [day]: [specific outcome]. Are you in?" Personalised subject lines get 40% higher open rates than generic "Webinar Invitation" subjects.</Tip>

          {/* Section 6 */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 16, marginTop: 40 }}>
            6. Optimise your listing title for search
          </h2>
          <p style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.8, marginBottom: 16 }}>
            People search for webinars by topic, not by your name. Your event title should contain the words people actually type into Google.
          </p>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: '#DC2626', background: '#FEF2F2' }}>❌ Weak titles</div>
              <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: '#065F46', background: '#ECFDF5' }}>✅ Strong titles</div>
            </div>
            {[
              ['Finance Webinar', 'Stock Market Basics for Beginners — Free Live Webinar'],
              ['AI Session', 'Build Your First AI App Using ChatGPT — No Code Required'],
              ['Marketing Workshop', 'Digital Marketing for Indian Startups: What Works in 2026'],
              ['HR Training', 'Recruiting with AI: Tools for HR Professionals in India'],
            ].map(([bad, good]) => (
              <div key={bad} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #F9FAFB' }}>
                <div style={{ padding: '10px 16px', fontSize: 13.5, color: '#6B7280', borderRight: '1px solid #F3F4F6' }}>{bad}</div>
                <div style={{ padding: '10px 16px', fontSize: 13.5, color: '#111827', fontWeight: 500 }}>{good}</div>
              </div>
            ))}
          </div>

          {/* Summary checklist */}
          <div style={{ background: 'linear-gradient(135deg, #0D4F6B, #1A6B8A)', borderRadius: 16, padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginTop: 48, marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: '#fff', marginBottom: 20 }}>
              Your 7-day webinar promotion checklist
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Day 1 (14 days before)', 'List on WebinX · Create LinkedIn Event · Email announcement'],
                ['Day 3', 'Post in 5 WhatsApp groups · Speaker posts on LinkedIn'],
                ['Day 7', 'Second LinkedIn post with a teaser question'],
                ['Day 13 (24 hours before)', 'Email reminder · WhatsApp reminder · LinkedIn reminder'],
                ['Day 14 (1 hour before)', 'Email final reminder · Post "we start in 1 hour" on LinkedIn'],
                ['After event', 'Share recording on WebinX · Ask attendees to rate your event'],
              ].map(([day, action]) => (
                <div key={day} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CheckCircle size={16} color="#E8B44A" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#E8B44A' }}>{day}: </span>
                    <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>{action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '2rem 0 1rem', borderTop: '1px solid #F3F4F6' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: '#111827', marginBottom: 10 }}>
              Ready to get more attendees?
            </h3>
            <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>
              List your next webinar on WebinX — free, takes 2 minutes, gets indexed on Google immediately.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/submit-webinar">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0D4F6B', color: '#fff', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(13,79,107,0.25)' }}>
                  List My Webinar Free <ArrowRight size={16} />
                </span>
              </Link>
              <Link href="/webinars">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #E5E7EB', color: '#374151', padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  Browse Webinars →
                </span>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: '#111827', marginBottom: 28 }}>
              Frequently asked questions
            </h2>
            {FAQS.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </section>

        </div>
      </main>
    </>
  );
}
