import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Sparkles,
  TrendingUp,
  MapPin,
  ArrowRight,
  Video,
  Mic,
  CalendarDays,
  Users,
  Star,
  ChevronRight,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import WebinarCard from '../components/webinar-card';
import {
  getStats, getFeaturedEvents, getTrendingEvents, getSectors,
  captureLead,
} from '../lib/api';
import type { WebinarEvent, Sector, PlatformStats } from '../lib/api';
import { TodaySection } from "../components/TodaySection";
// Then inside JSX, after the stats bar (before Featured Events):
<TodaySection />



/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
interface HomeData {
  stats: PlatformStats | null;
  featured: WebinarEvent[];
  trending: WebinarEvent[];
  sectors: Sector[];
}

/* ─────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────── */
const SECTOR_ICONS: Record<string, string> = {
  ai: '🤖', technology: '💻', finance: '💹', marketing: '📣',
  startup: '🚀', hr: '🤝', healthcare: '🏥', education: '🎓',
  general: '📋', government: '🏛️', manufacturing: '🏭', msme: '🏪',
  spirituality: '🪔', sports: '🏏', politics: '🗳️',
};

const SECTOR_COLORS: Record<string, string> = {
  ai: '#6366f1', technology: '#3b82f6', finance: '#10b981', marketing: '#f97316',
  startup: '#8b5cf6', hr: '#f43f5e', healthcare: '#14b8a6', education: '#f59e0b',
  general: '#6b7280', government: '#64748b', manufacturing: '#d97706',
  msme: '#0891b2', spirituality: '#b45309', sports: '#16a34a', politics: '#dc2626',
};

const CITIES = [
  { name: 'Mumbai', slug: 'mumbai', emoji: '🌊' },
  { name: 'Delhi', slug: 'delhi', emoji: '🏛️' },
  { name: 'Bengaluru', slug: 'bengaluru', emoji: '🌳' },
  { name: 'Hyderabad', slug: 'hyderabad', emoji: '💎' },
  { name: 'Chennai', slug: 'chennai', emoji: '🌴' },
  { name: 'Pune', slug: 'pune', emoji: '🎭' },
  { name: 'Kolkata', slug: 'kolkata', emoji: '🎨' },
  { name: 'Ahmedabad', slug: 'ahmedabad', emoji: '🦁' },
];

const FALLBACK_SECTORS = [
  { id:1,  slug:'ai',           name:'AI & Machine Learning', event_count:68 },
  { id:3,  slug:'finance',      name:'Finance & Investing',   event_count:22 },
  { id:4,  slug:'hr',           name:'HR & People',           event_count:19 },
  { id:5,  slug:'startup',      name:'Startup',               event_count:16 },
  { id:6,  slug:'marketing',    name:'Marketing & Growth',    event_count:12 },
  { id:7,  slug:'healthcare',   name:'Healthcare',            event_count:8  },
  { id:8,  slug:'technology',   name:'Technology',            event_count:7  },
  { id:9,  slug:'education',    name:'Education',             event_count:6  },
  { id:10, slug:'spirituality', name:'Spirituality & Dharma', event_count:0  },
  { id:11, slug:'sports',       name:'Sports',                event_count:0  },
  { id:12, slug:'politics',     name:'Politics & Policy',     event_count:0  },
  { id:13, slug:'general',      name:'General',               event_count:8  },
];

const PLACEHOLDER_PHRASES = [
  'AI webinars this week…',
  'finance for startups…',
  'marketing masterclass…',
  'growth hacking tactics…',
  'product management…',
];

/* ─────────────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────────────── */
function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }): JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    // Cancel any running animation
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const runAnimation = (): void => {
      const start = performance.now();
      const from = 0;
      const tick = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.floor(from + eased * (target - from)));
        if (progress < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          setCurrent(target);
        }
      };
      animRef.current = requestAnimationFrame(tick);
    };

    // Use IntersectionObserver if element is in DOM, else run immediately
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            runAnimation();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(ref.current);
      return () => { observer.disconnect(); if (animRef.current) cancelAnimationFrame(animRef.current); };
    } else {
      runAnimation();
    }
  }, [target, duration]); // Re-run whenever target changes (data loads)

  return <span ref={ref}>{current.toLocaleString('en-IN')}</span>;
}

/* ─────────────────────────────────────────────────────
   Search bar
───────────────────────────────────────────────────── */
function HeroSearch(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>(PLACEHOLDER_PHRASES[0]);
  const [phIndex, setPhIndex] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhIndex((i) => {
        const next = (i + 1) % PLACEHOLDER_PHRASES.length;
        setPlaceholder(PLACEHOLDER_PHRASES[next]);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();
      if (query.trim()) {
        window.location.href = `/webinars?q=${encodeURIComponent(query.trim())}`;
      }
    },
    [query],
  );

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div
        className="flex items-center gap-2 p-2 rounded-2xl"
        style={{
          background: 'var(--wx-white)',
          border: '1.5px solid var(--wx-border)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
        }}
        onFocus={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--wx-teal)';
          el.style.boxShadow = '0 0 0 3px rgb(13 79 107 / 0.08), var(--shadow-lg)';
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--wx-border)';
          el.style.boxShadow = 'var(--shadow-lg)';
        }}
      >
        <Search size={18} className="ml-2 flex-shrink-0" style={{ color: 'var(--wx-muted)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${placeholder}`}
          className="flex-1 bg-transparent outline-none text-base"
          style={{
            color: 'var(--wx-ink)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9375rem',
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm flex-shrink-0 transition-all"
          style={{
            background: 'var(--wx-teal)',
            color: 'var(--wx-white)',
            boxShadow: '0 2px 8px rgb(13 79 107 / 0.2)',
          }}
        >
          Search
          <ArrowRight size={15} />
        </button>
      </div>

      {/* AI Search shortcut */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-xs" style={{ color: 'var(--wx-muted)' }}>or try</span>
        <Link
          href="/ai-search"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--wx-teal-pale), var(--wx-gold-pale))',
            color: 'var(--wx-teal)',
            border: '1px solid rgb(13 79 107 / 0.12)',
            textDecoration: 'none',
          }}
        >
          <Sparkles size={12} />
          Ask AI in plain English
          <ArrowRight size={11} />
        </Link>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────────────
   Stats bar
───────────────────────────────────────────────────── */
function StatsBar({ stats }: { stats: PlatformStats | null }): JSX.Element {
  const items = useMemo(
    () => [
      { label: 'Total Events', value: stats?.total_events ?? 0, icon: <CalendarDays size={14} /> },
      { label: 'Upcoming', value: stats?.upcoming_events ?? 0, icon: <TrendingUp size={14} /> },
      { label: 'This Week', value: stats?.this_week ?? 0, icon: <Zap size={14} /> },
      { label: 'Topics', value: stats?.sector_count ?? 0, icon: <Globe size={14} /> },
    ],
    [stats],
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="hidden sm:block w-1 h-1 rounded-full mr-4" style={{ background: 'var(--wx-border)' }} />
          )}
          <span style={{ color: 'var(--wx-teal)' }}>{item.icon}</span>
          <span className="font-bold text-sm" style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)' }}>
            <AnimatedCounter target={item.value} />
          </span>
          <span className="text-xs" style={{ color: 'var(--wx-muted)' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────────────── */
function SkeletonCard(): JSX.Element {
  return (
    <div className="wx-card p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Newsletter section
───────────────────────────────────────────────────── */
function NewsletterSection(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!email.trim() || status === 'loading') return;
      setStatus('loading');
      try {
        const res = await captureLead({ email: email.trim(), utm_source: 'homepage-newsletter' });
        setStatus(res.status === 'ok' ? 'success' : 'error');
      } catch {
        setStatus('error');
      }
    },
    [email, status],
  );

  return (
    <section
      className="wx-section"
      style={{
        background: 'linear-gradient(135deg, var(--wx-teal) 0%, var(--wx-teal-mid) 60%, #0a3d56 100%)',
      }}
    >
      <div className="wx-container text-center">
        <div className="max-w-xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgb(255 255 255 / 0.12)', color: 'rgb(255 255 255 / 0.9)' }}
          >
            <Zap size={12} />
            Weekly Knowledge Digest
          </span>

          <h2
            className="text-3xl md:text-4xl font-light mb-3"
            style={{ color: 'var(--wx-white)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}
          >
            Never miss a great webinar
          </h2>

          <p className="text-base mb-8" style={{ color: 'rgb(255 255 255 / 0.72)' }}>
            Get curated events in your inbox every Monday. No spam — just India's best knowledge events.
          </p>

          {status === 'success' ? (
            <div
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl"
              style={{ background: 'rgb(255 255 255 / 0.12)', color: 'var(--wx-white)' }}
            >
              <span className="text-lg">🎉</span>
              <span className="font-medium">You're in! Expect your first digest Monday.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  background: 'rgb(255 255 255 / 0.12)',
                  color: 'var(--wx-white)',
                  border: '1px solid rgb(255 255 255 / 0.2)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
                style={{
                  background: 'var(--wx-gold)',
                  color: 'var(--wx-ink)',
                  boxShadow: 'var(--shadow-gold)',
                  opacity: status === 'loading' ? 0.7 : 1,
                  cursor: status === 'loading' ? 'wait' : 'pointer',
                }}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-sm mt-2" style={{ color: 'rgb(255 100 100 / 0.9)' }}>
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────── */
export default function HomePage(): JSX.Element {
  const [data, setData] = useState<HomeData>({
    stats: null,
    featured: [],
    trending: [],
    sectors: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const [stats, featured, trending, sectors] = await Promise.all([
        getStats().catch(() => null),
        getFeaturedEvents().catch(() => []),
        getTrendingEvents().catch(() => []) .then(t => t.length > 0 ? t : getFeaturedEvents().catch(() => [])),
        getSectors().catch(() => FALLBACK_SECTORS),
      ]);
      setData({
        stats: stats ?? null,
        featured: featured ?? [],
        trending: trending ?? [],
        sectors: (sectors && sectors.length > 0) ? sectors : FALLBACK_SECTORS,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <>
      <Helmet>
        <title>WeBinX · India's Knowledge Events Marketplace</title>
        <meta
          name="description"
          content="Discover India's best webinars, podcasts & live events. Updated daily across AI, finance, marketing, startup & more. Free to join."
        />
        <meta property="og:title" content="WeBinX · India's Knowledge Events Marketplace" />
        <meta
          property="og:description"
          content="India's #1 platform for webinars, podcasts & live knowledge events."
        />
        <meta property="og:image" content="https://webinx.in/og-default.jpg" />
        <link rel="canonical" href="https://webinx.in" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="has-bottom-nav">

        {/* ─── Hero ─── */}
        <section
          className="wx-hero-bg relative overflow-hidden"
          style={{ paddingTop: 'clamp(3rem, 8vw, 6rem)', paddingBottom: 'clamp(3rem, 8vw, 5rem)' }}
        >
          {/* Subtle decorative elements */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--wx-gold-pale) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--wx-teal-pale) 0%, transparent 70%)',
              transform: 'translate(-30%, 30%)',
            }}
          />

          <div className="wx-container relative">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-5 animate-fade-up">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full"
                  style={{
                    background: 'var(--wx-teal-pale)',
                    color: 'var(--wx-teal)',
                    border: '1px solid rgb(13 79 107 / 0.15)',
                  }}
                >
                  🇮🇳 India's #1 Knowledge Events Platform
                </span>
              </div>

              {/* Logo — img loads in production; h1 is hidden by default, shown if img 404s */}
              <div className="flex justify-center mb-5 animate-fade-up animate-delay-100">
                <img
                  src="/logo-wordmark.png"
                  alt="WeBinX"
                  className="h-14 md:h-16 w-auto object-contain"
                  onError={(e): void => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const fallback = img.nextSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                {/* Fallback wordmark — hidden until img fails */}
                <h1
                  className="text-5xl md:text-7xl font-bold tracking-tight"
                  style={{ color: 'var(--wx-teal)', fontFamily: 'var(--font-display)', lineHeight: 1, display: 'none' }}
                >
                  WeBin<span style={{ color: 'var(--wx-gold)' }}>X</span>
                </h1>
              </div>

              {/* Tagline */}
              <p
                className="text-base md:text-lg mb-2 animate-fade-up animate-delay-200"
                style={{ color: 'var(--wx-muted)', lineHeight: 1.7 }}
              >
                Discover. Learn. Connect.
              </p>
              <p
                className="text-sm md:text-base mb-8 animate-fade-up animate-delay-200"
                style={{ color: 'var(--wx-muted)' }}
              >
                Webinars · Podcasts · Live Events — updated daily across India
              </p>

              {/* Search */}
              <div className="animate-fade-up animate-delay-300">
                <HeroSearch />
              </div>

              {/* Stats bar */}
              <div className="animate-fade-up animate-delay-400">
                <StatsBar stats={data.stats} />
              </div>

              {/* Content type pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-up animate-delay-500">
                {[
                  { icon: <Video size={14} />, label: 'Webinars', href: '/webinars', color: 'var(--wx-teal)' },
                  { icon: <Mic size={14} />, label: 'Podcasts', href: '/podcasts', color: '#7c3aed', isNew: true },
                  { icon: <MapPin size={14} />, label: 'Live Events', href: '/live-events', color: '#dc2626', isNew: true },
                ].map((pill) => (
                  <Link
                    key={pill.href}
                    href={pill.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: 'var(--wx-white)',
                      color: pill.color,
                      border: `1.5px solid ${pill.color}22`,
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {pill.icon}
                    {pill.label}
                    {pill.isNew && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5"
                        style={{ background: 'var(--wx-gold-pale)', color: '#92610A' }}
                      >
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Featured Events ─── */}
        {(loading || data.featured.length > 0) && (
          <section className="wx-section" style={{ background: 'var(--wx-surface)' }}>
            <div className="wx-container">
              <div className="wx-section-header">
                <div className="flex items-center gap-2">
                  <Star size={18} fill="var(--wx-gold)" stroke="none" />
                  <h2 className="wx-section-title">Featured Events</h2>
                </div>
                <Link href="/webinars?featured=true" className="wx-section-link">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                  : data.featured.slice(0, 6).map((event) => (
                      <WebinarCard key={event.id} event={event} variant="featured" />
                    ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Sector Pills ─── */}
        <section className="wx-section">
          <div className="wx-container">
            <div className="wx-section-header">
              <h2 className="wx-section-title">Browse by Topic</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(loading ? Array.from({ length: 8 }) : 
                [...data.sectors].sort((a, b) => (b.event_count ?? 0) - (a.event_count ?? 0))
                .filter(s => s.slug)  // show all valid sectors
              ).map((sector, i) => {
                if (loading) {
                  return <div key={i} className="skeleton h-16 rounded-xl" />;
                }
                const s = sector as Sector;
                const color = SECTOR_COLORS[s.slug] ?? '#6b7280';
                const icon = SECTOR_ICONS[s.slug] ?? '📚';
                return (
                  <Link
                    key={s.slug}
                    href={`/sector/${s.slug}`}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all group"
                    style={{
                      background: `${color}0d`,
                      border: `1.5px solid ${color}22`,
                      textDecoration: 'none',
                    }}
                  >
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <div
                        className="font-semibold text-sm capitalize truncate"
                        style={{ color, fontFamily: 'var(--font-sans)' }}
                      >
                        {s.name}
                      </div>
                      {s.event_count !== undefined && (
                        <div className="text-xs mt-0.5" style={{ color: 'var(--wx-muted)' }}>
                          {s.event_count} events
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      size={14}
                      className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Trending Now ─── */}
        <section className="wx-section" style={{ background: 'var(--wx-surface)' }}>
          <div className="wx-container">
            <div className="wx-section-header">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} style={{ color: 'var(--wx-teal)' }} />
                <h2 className="wx-section-title">Trending Now</h2>
              </div>
              <Link href="/webinars" className="wx-section-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                : data.trending.map((event) => <WebinarCard key={event.id} event={event} />)}
            </div>

            {!loading && data.trending.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--wx-muted)' }}>
                <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No trending events yet</p>
                <Link href="/webinars" className="wx-section-link mt-2 inline-flex">
                  Browse all events <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── City Explorer ─── */}
        <section className="wx-section">
          <div className="wx-container">
            <div className="wx-section-header">
              <div className="flex items-center gap-2">
                <MapPin size={18} style={{ color: 'var(--wx-teal)' }} />
                <h2 className="wx-section-title">Events by City</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/city/${city.slug}`}
                  className="wx-card flex items-center gap-3 p-4 group"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="text-2xl">{city.emoji}</span>
                  <div className="min-w-0">
                    <div
                      className="font-semibold text-sm truncate"
                      style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)' }}
                    >
                      {city.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--wx-muted)' }}>
                      View events →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── AI Search CTA ─── */}
        <section className="wx-section" style={{ background: 'var(--wx-surface)' }}>
          <div className="wx-container">
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, var(--wx-teal-pale) 0%, var(--wx-gold-pale) 100%)',
                border: '1.5px solid rgb(13 79 107 / 0.12)',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              <div
                aria-hidden
                className="absolute top-0 right-0 text-[200px] leading-none pointer-events-none select-none opacity-5"
                style={{ color: 'var(--wx-teal)', fontFamily: 'var(--font-display)' }}
              >
                AI
              </div>

              <div className="relative flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Sparkles size={20} style={{ color: 'var(--wx-teal)' }} />
                    <span className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--wx-teal)' }}>
                      AI-Powered Search
                    </span>
                  </div>
                  <h2
                    className="font-light mb-2"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                      color: 'var(--wx-ink)',
                      lineHeight: 1.2,
                    }}
                  >
                    Ask in plain English
                  </h2>
                  <p style={{ color: 'var(--wx-muted)', fontSize: '0.9375rem' }}>
                    "Find me free AI webinars happening this week" — Claude understands what you mean.
                  </p>
                </div>

                <Link
                  href="/ai-search"
                  className="flex items-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all flex-shrink-0"
                  style={{
                    background: 'var(--wx-teal)',
                    color: 'var(--wx-white)',
                    boxShadow: '0 4px 16px rgb(13 79 107 / 0.25)',
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                  }}
                >
                  <Sparkles size={16} />
                  Try AI Search
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── For Hosts ─── */}
        <section className="wx-section">
          <div className="wx-container">
            <div className="grid md:grid-cols-2 gap-5">
              {/* List Free */}
              <div
                className="rounded-2xl p-8 flex flex-col"
                style={{
                  background: 'var(--wx-teal-pale)',
                  border: '1.5px solid rgb(13 79 107 / 0.12)',
                }}
              >
                <Video size={28} style={{ color: 'var(--wx-teal)', marginBottom: '1rem' }} />
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)' }}
                >
                  List your event for free
                </h3>
                <p className="text-sm mb-6 flex-1" style={{ color: 'var(--wx-muted)', lineHeight: 1.7 }}>
                  Reach thousands of Indian learners. Submit your webinar, podcast episode, or live event in under 2 minutes.
                </p>
                <Link
                  href="/submit-webinar"
                  className="self-start flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: 'var(--wx-teal)',
                    color: 'var(--wx-white)',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgb(13 79 107 / 0.2)',
                  }}
                >
                  Submit Event
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Get Featured */}
              <div
                className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0a3d56 0%, var(--wx-teal) 100%)',
                }}
              >
                <div
                  aria-hidden
                  className="absolute top-0 right-0 text-[120px] leading-none opacity-10 pointer-events-none select-none"
                  style={{ color: 'var(--wx-gold)', fontFamily: 'var(--font-display)' }}
                >
                  ★
                </div>
                <Star size={28} fill="var(--wx-gold)" stroke="none" style={{ marginBottom: '1rem' }} />
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--wx-white)', fontFamily: 'var(--font-sans)' }}
                >
                  Get Featured
                </h3>
                <p className="text-sm mb-6 flex-1" style={{ color: 'rgb(255 255 255 / 0.72)', lineHeight: 1.7 }}>
                  Stand out from the crowd. Featured events appear at the top across all pages, sector feeds, and email digests.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  {[
                    { label: '7 days', price: '₹299' },
                    { label: '30 days', price: '₹799' },
                    { label: '90 days', price: '₹1999' },
                  ].map((plan) => (
                    <div
                      key={plan.label}
                      className="flex flex-col items-center px-3 py-2 rounded-lg text-center"
                      style={{ background: 'rgb(255 255 255 / 0.1)' }}
                    >
                      <span className="font-bold text-sm" style={{ color: 'var(--wx-gold)' }}>{plan.price}</span>
                      <span className="text-xs mt-0.5" style={{ color: 'rgb(255 255 255 / 0.7)' }}>{plan.label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/get-featured"
                  className="self-start flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: 'var(--wx-gold)',
                    color: 'var(--wx-ink)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-gold)',
                  }}
                >
                  <Star size={14} fill="currentColor" stroke="none" />
                  Get Featured
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Platform Stats ─── */}
        {data.stats && (
          <section
            className="wx-section"
            style={{ background: 'linear-gradient(135deg, var(--wx-teal) 0%, #0a3d56 100%)' }}
          >
            <div className="wx-container">
              <div className="text-center mb-10">
                <h2
                  className="font-light"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    color: 'var(--wx-white)',
                  }}
                >
                  India's growing knowledge hub
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Events', value: data.stats.total_events, icon: <CalendarDays size={20} /> },
                  { label: 'Active Hosts', value: data.stats.host_count ?? 0, icon: <Users size={20} /> },
                  { label: 'Topics Covered', value: data.stats.sector_count, icon: <Globe size={20} /> },
                  { label: 'Events This Week', value: data.stats.this_week, icon: <Award size={20} /> },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                      style={{ background: 'rgb(255 255 255 / 0.12)', color: 'var(--wx-gold)' }}
                    >
                      {stat.icon}
                    </div>
                    <div
                      className="text-3xl font-bold mb-1"
                      style={{ color: 'var(--wx-white)', fontFamily: 'var(--font-sans)' }}
                    >
                      {stat.value > 0 ? stat.value.toLocaleString('en-IN') : '…'}
                    </div>
                    <div className="text-sm" style={{ color: 'rgb(255 255 255 / 0.65)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ─── Explore WebinX ─── */}
        <section className="wx-section" style={{ background: 'var(--wx-surface)', borderTop: '1px solid var(--wx-border)' }}>
          <div className="wx-container">
            <div className="text-center mb-8">
              <h2 className="wx-section-title">Explore WebinX</h2>
              <p style={{ fontSize: 14, color: 'var(--wx-muted)', marginTop: 6 }}>
                Everything we've built for India's knowledge creators
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { emoji: "🛠", title: "Tools & Gear", desc: "17 hand-picked tools for Indian creators", href: '/gear', color: '#0D4F6B' },
                { emoji: "🚀", title: "Our Roadmap", desc: "33+ features we're building next", href: '/upcoming', color: '#7c3aed' },
                { emoji: "📊", title: "Live Metrics", desc: "Real numbers, no spin. Fully public.", href: '/metrics', color: '#15803d' },
                { emoji: "✨", title: "AI Search", desc: "Ask anything in plain English", href: '/ai-search', color: '#d97706' },
                { emoji: "🎤", title: "Host Tools", desc: "AI tools to grow your audience", href: '/host-tools', color: '#dc2626' },
                { emoji: "⭐", title: "Get Featured", desc: "Reach thousands of learners", href: '/get-featured', color: '#E8B44A' },
              ].map((item) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1.5px solid var(--wx-border)',
                      borderRadius: 14,
                      padding: '16px 18px',
                      transition: 'all 0.18s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = item.color;
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${item.color}22`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--wx-border)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--wx-muted)', lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Newsletter ─── */}
        <NewsletterSection />

        {/* Error state */}
        {error && (
          <div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium"
            style={{
              background: '#FEE2E2',
              color: '#991B1B',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {error} —{' '}
            <button onClick={() => void loadData()} className="underline font-semibold">
              retry
            </button>
          </div>
        )}
      </main>
    </>
  );
}
