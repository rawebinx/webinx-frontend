// src/pages/gear.tsx
// WebinX — /gear page: affiliate tools organized by host/learner/podcaster
// SEO target: "best webcam for webinars India", "podcast mic India", "webinar tools India"

import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

// ── Types ──────────────────────────────────────────────────────────────────────

interface GearItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;          // e.g. "Free" | "₹0 to start" | "From $15/mo"
  commission: string;     // e.g. "20% recurring"
  affiliateUrl: string;
  category: 'host' | 'podcaster' | 'learner' | 'design' | 'marketing';
  badge?: string;         // e.g. "India" | "Top Pick" | "Free Trial"
  emoji: string;
}

// ── Affiliate Data ─────────────────────────────────────────────────────────────

const GEAR_ITEMS: GearItem[] = [
  // FOR HOSTS
  {
    id: 'zoom',
    name: 'Zoom',
    tagline: 'The world\'s most trusted webinar platform',
    description: 'Host webinars for up to 1,000 attendees with HD video, breakout rooms, and recording. The default choice for Indian knowledge hosts.',
    price: 'Free plan available',
    commission: '30% recurring',
    affiliateUrl: 'https://zoom.us/pricing',
    category: 'host',
    badge: 'Top Pick',
    emoji: '🎥',
  },
  {
    id: 'streamyard',
    name: 'StreamYard',
    tagline: 'Live stream to YouTube, LinkedIn & Facebook simultaneously',
    description: 'Browser-based live streaming studio. Go live on multiple platforms at once. Perfect for building a webinar audience on social media.',
    price: 'From $49/mo',
    commission: '20% recurring',
    affiliateUrl: 'https://streamyard.com',
    category: 'host',
    emoji: '📡',
  },
  {
    id: 'riverside',
    name: 'Riverside.fm',
    tagline: 'Record studio-quality video calls',
    description: 'Records each participant locally for crystal-clear quality. Separates audio and video tracks. Best for interview-style webinars and podcasts.',
    price: 'Free plan available',
    commission: '15% recurring',
    affiliateUrl: 'https://riverside.fm',
    category: 'host',
    emoji: '🎬',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    tagline: 'Let attendees book your sessions instantly',
    description: 'No more back-and-forth emails scheduling your webinars and coaching sessions. Share your link, attendees pick a time that works.',
    price: 'Free plan available',
    commission: '20% recurring',
    affiliateUrl: 'https://calendly.com',
    category: 'host',
    emoji: '📅',
  },
  {
    id: 'zohoone',
    name: 'Zoho One',
    tagline: 'Complete business suite made in India',
    description: '45+ apps in one: CRM, email, meetings, invoicing, analytics. Built for Indian businesses with INR pricing and India-based support.',
    price: '₹1,530/user/mo',
    commission: '15% one-time',
    affiliateUrl: 'https://www.zoho.com/one/',
    category: 'host',
    badge: 'India',
    emoji: '🇮🇳',
  },
  {
    id: 'instamojo',
    name: 'Instamojo',
    tagline: 'Sell your courses and workshops in India',
    description: 'Accept payments, sell digital products, and create a storefront for your webinar recordings. Built for Indian creators with UPI, NetBanking support.',
    price: '0% setup fee',
    commission: '10% of sales',
    affiliateUrl: 'https://www.instamojo.com',
    category: 'host',
    badge: 'India',
    emoji: '💸',
  },
  // FOR PODCASTERS
  {
    id: 'buzzsprout',
    name: 'Buzzsprout',
    tagline: 'Host, distribute & grow your podcast',
    description: 'Upload once, distribute to Spotify, Apple Podcasts, Google Podcasts and more automatically. Detailed analytics on every episode.',
    price: 'Free plan available',
    commission: '20% recurring',
    affiliateUrl: 'https://www.buzzsprout.com/?referrer_id=webinx',
    category: 'podcaster',
    badge: 'Top Pick',
    emoji: '🎙',
  },
  {
    id: 'descript',
    name: 'Descript',
    tagline: 'Edit audio by editing text',
    description: 'AI-powered podcast editor. Transcribes your recording, then lets you cut audio by deleting words. Removes filler words automatically.',
    price: 'Free plan available',
    commission: '15% recurring',
    affiliateUrl: 'https://www.descript.com',
    category: 'podcaster',
    emoji: '✂️',
  },
  {
    id: 'podcastle',
    name: 'Podcastle',
    tagline: 'Record, edit and publish from your browser',
    description: 'Studio-quality recording in your browser. AI noise cancellation, remote recording with guests, one-click episode publishing.',
    price: 'Free plan available',
    commission: '20% recurring',
    affiliateUrl: 'https://podcastle.ai',
    category: 'podcaster',
    emoji: '🏰',
  },
  {
    id: 'beehiiv',
    name: 'Beehiiv',
    tagline: 'Turn your podcast into a newsletter empire',
    description: 'The newsletter platform built for growth. Monetize with paid subscriptions, ads, and boosts. Used by the fastest-growing newsletters.',
    price: 'Free up to 2,500 subs',
    commission: '25% recurring',
    affiliateUrl: 'https://www.beehiiv.com',
    category: 'podcaster',
    emoji: '🐝',
  },
  // DESIGN & MARKETING
  {
    id: 'canva',
    name: 'Canva Pro',
    tagline: 'Design everything: banners, thumbnails, certificates',
    description: 'Create webinar promotional graphics, event banners, social posts and certificates in minutes. 1M+ templates, drag-and-drop simple.',
    price: '₹3,999/year',
    commission: '25% on first payment',
    affiliateUrl: 'https://www.canva.com/affiliates/',
    category: 'design',
    badge: 'Top Pick',
    emoji: '🎨',
  },
  {
    id: 'mailmodo',
    name: 'Mailmodo',
    tagline: 'Interactive email for Indian businesses',
    description: 'Send AMP emails with forms, polls and booking widgets inside the email itself. Built in India, INR pricing, excellent deliverability for Indian inboxes.',
    price: 'Free plan available',
    commission: '20% recurring',
    affiliateUrl: 'https://www.mailmodo.com',
    category: 'marketing',
    badge: 'India',
    emoji: '📧',
  },
  {
    id: 'kit',
    name: 'Kit (ConvertKit)',
    tagline: 'Email marketing built for creators',
    description: 'Build your webinar subscriber list, send automated sequences, sell digital products. Trusted by 600,000+ creators worldwide.',
    price: 'Free up to 1,000 subs',
    commission: '30% recurring',
    affiliateUrl: 'https://convertkit.com',
    category: 'marketing',
    emoji: '✉️',
  },
  // FOR LEARNERS
  {
    id: 'coursera',
    name: 'Coursera',
    tagline: 'Learn from the world\'s top universities',
    description: 'Online courses from IIT, IIM, Google, Meta, IBM. Earn certificates to advance your career. Perfect for webinar attendees who want to go deeper.',
    price: '₹1,500–₹5,000/course',
    commission: '45% on first month',
    affiliateUrl: 'https://www.coursera.org',
    category: 'learner',
    badge: 'Top Pick',
    emoji: '🎓',
  },
  {
    id: 'udemy',
    name: 'Udemy Business',
    tagline: '213,000+ courses on every skill',
    description: 'Lifetime access to practical courses on Python, finance, marketing, design and more. India\'s most popular online learning platform.',
    price: 'From ₹449/course',
    commission: '15% per sale',
    affiliateUrl: 'https://www.udemy.com',
    category: 'learner',
    emoji: '📚',
  },
  {
    id: 'linkedin-learning',
    name: 'LinkedIn Learning',
    tagline: 'Professional skills that get you hired',
    description: 'Courses taught by real-world experts, completion certificates that appear on your LinkedIn profile automatically.',
    price: '₹1,455/mo',
    commission: '25% recurring',
    affiliateUrl: 'https://www.linkedin.com/learning/',
    category: 'learner',
    emoji: '💼',
  },
  {
    id: 'graphy',
    name: 'Graphy',
    tagline: 'Create and sell your own courses',
    description: 'Indian platform to host and monetize your own courses, communities and live sessions. Built for Indian knowledge creators.',
    price: 'Free to start',
    commission: '20% recurring',
    affiliateUrl: 'https://graphy.com',
    category: 'learner',
    badge: 'India',
    emoji: '📖',
  },
];

// ── Category Config ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'all',        label: 'All Tools',       emoji: '🛠',  desc: 'Every tool we recommend' },
  { key: 'host',       label: 'For Hosts',        emoji: '🎤',  desc: 'Run better webinars & events' },
  { key: 'podcaster',  label: 'For Podcasters',   emoji: '🎙',  desc: 'Record, edit & grow your podcast' },
  { key: 'design',     label: 'Design',           emoji: '🎨',  desc: 'Look professional every time' },
  { key: 'marketing',  label: 'Email Marketing',  emoji: '📧',  desc: 'Build and grow your audience' },
  { key: 'learner',    label: 'For Learners',     emoji: '🎓',  desc: 'Keep learning after the webinar' },
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];

// ── Card Component ─────────────────────────────────────────────────────────────

function GearCard({ item }: { item: GearItem }): JSX.Element {
  const badgeColor: Record<string, string> = {
    'Top Pick': '#0D4F6B',
    'India': '#15803d',
    'Free Trial': '#7c3aed',
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(13,79,107,0.12)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>
          {item.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{item.name}</span>
            {item.badge && (
              <span style={{
                background: badgeColor[item.badge] ?? '#6b7280',
                color: '#fff', fontSize: 10, fontWeight: 700,
                padding: '2px 7px', borderRadius: 5,
              }}>
                {item.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>{item.tagline}</div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6, margin: 0 }}>
        {item.description}
      </p>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          background: '#f9fafb', border: '1px solid #E5E7EB',
          fontSize: 12, fontWeight: 600, color: '#374151',
          padding: '4px 10px', borderRadius: 7,
        }}>
          {item.price}
        </span>
        <span style={{ fontSize: 11, color: '#9CA3AF', flex: 1 }}>
          Affiliate: {item.commission}
        </span>
        <a
          href={item.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            background: '#0D4F6B', color: '#fff',
            fontSize: 12, fontWeight: 700,
            padding: '7px 14px', borderRadius: 9,
            textDecoration: 'none', flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0a3d54')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0D4F6B')}
        >
          Try Free →
        </a>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GearPage(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const filtered = activeCategory === 'all'
    ? GEAR_ITEMS
    : GEAR_ITEMS.filter(item => item.category === activeCategory);

  const handleCategory = useCallback((key: CategoryKey): void => {
    setActiveCategory(key);
  }, []);

  const activeCat = CATEGORIES.find(c => c.key === activeCategory)!;

  return (
    <>
      <Helmet>
        <title>Best Tools for Webinar Hosts & Podcasters in India | WeBinX</title>
        <meta
          name="description"
          content="Curated tools for Indian webinar hosts, podcasters and knowledge creators. Best webcam, mic, recording, email marketing and learning platforms — hand-picked by WeBinX."
        />
        <link rel="canonical" href="https://webinx.in/gear" />
        <meta property="og:title" content="Best Webinar & Podcast Tools in India | WeBinX Gear" />
        <meta property="og:description" content="Hand-picked tools for Indian knowledge creators — from recording gear to email marketing." />
        <meta property="og:url" content="https://webinx.in/gear" />
      </Helmet>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D4F6B 0%, #0a3d54 100%)',
        padding: '48px 40px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#7dd3fc', letterSpacing: '0.1em', marginBottom: 12 }}>
            🛠 WEBINX GEAR
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 12 }}>
            Best Tools for Indian Knowledge Creators
          </h1>
          <p style={{ fontSize: 16, color: '#bae6fd', lineHeight: 1.6, marginBottom: 0 }}>
            Hand-picked tools for webinar hosts, podcasters and learners in India.
            Every recommendation is tested and used by our community.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ background: '#f9fafb', borderBottom: '1px solid #E5E7EB', padding: '16px 40px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => handleCategory(cat.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 9,
                border: activeCategory === cat.key ? '2px solid #0D4F6B' : '1.5px solid #E5E7EB',
                background: activeCategory === cat.key ? '#0D4F6B' : '#fff',
                color: activeCategory === cat.key ? '#fff' : '#374151',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 40px 80px' }}>
        {/* Section header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            {activeCat.emoji} {activeCat.label}
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280' }}>
            {activeCat.desc} — {filtered.length} tools
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(item => (
            <GearCard key={item.id} item={item} />
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 48,
          padding: '16px 20px',
          background: '#f9fafb',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          fontSize: 12.5,
          color: '#9CA3AF',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: '#6B7280' }}>Disclosure:</strong> Some links on this page are affiliate links.
          If you purchase through them, WeBinX earns a small commission at no extra cost to you.
          This helps us keep the platform free. We only recommend tools we genuinely believe in.
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 32,
          background: 'linear-gradient(135deg, #E1F5EE 0%, #f0fdf4 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: 16,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 4 }}>
              🎤 Ready to host your first webinar?
            </div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>
              List your event on WeBinX — India's knowledge events marketplace. It's free.
            </div>
          </div>
          <Link href="/submit-webinar">
            <button style={{
              background: '#0D4F6B', color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '12px 24px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}>
              List Your Event Free →
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
