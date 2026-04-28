import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Video,
  Mic,
  MapPin,
  Users,
  Sparkles,
  Heart,
  ChevronRight,
  Menu,
  X,
  Star,
} from 'lucide-react';

/* ─── Wishlist count (reads localStorage) ─── */
function useWishlistCount(): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const read = (): void => {
      try {
        const raw = localStorage.getItem('webinx_wishlist');
        const arr: unknown[] = raw ? (JSON.parse(raw) as unknown[]) : [];
        setCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCount(0);
      }
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);

  return count;
}

/* ─── Nav link definition ─── */
interface NavLink {
  label: string;
  href: string;
  isNew?: boolean;
}

const CONTENT_TABS: NavLink[] = [
  { label: 'Webinars', href: '/webinars' },
  { label: 'Podcasts', href: '/podcasts', isNew: true },
  { label: 'Live Events', href: '/live-events', isNew: true },
];

const NAV_LINKS: NavLink[] = [
  { label: 'Hosts', href: '/host' },
];

/* ─── Mobile bottom tab definition ─── */
interface BottomTab {
  label: string;
  href: string;
  icon: React.ReactNode;
  matchPrefix?: string;
}

/* ─── Component ─── */
export default function Navbar(): JSX.Element {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const wishCount = useWishlistCount();

  /* Scroll shadow */
  useEffect(() => {
    const handler = (): void => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = useCallback(
    (href: string): boolean => {
      if (href === '/') return location === '/';
      return location === href || location.startsWith(href + '/');
    },
    [location],
  );

  const BOTTOM_TABS: BottomTab[] = [
    { label: 'Home', href: '/', icon: <Home size={20} strokeWidth={1.75} /> },
    { label: 'Explore', href: '/webinars', icon: <Video size={20} strokeWidth={1.75} />, matchPrefix: '/webinar' },
    { label: 'AI', href: '/ai-search', icon: <Sparkles size={20} strokeWidth={1.75} /> },
    {
      label: 'Saved',
      href: '/wishlist',
      icon: (
        <span className="relative inline-flex">
          <Heart size={20} strokeWidth={1.75} />
          {wishCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ background: 'var(--wx-gold)', color: 'var(--wx-ink)' }}
            >
              {wishCount > 9 ? '9+' : wishCount}
            </span>
          )}
        </span>
      ),
    },
    { label: 'Host', href: '/host', icon: <Users size={20} strokeWidth={1.75} /> },
  ];

  return (
    <>
      {/* ─── Desktop / Tablet Navbar ─── */}
      <header
        className="hidden md:block sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--wx-border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
        }}
      >
        <div className="wx-container">
          <nav className="flex items-center gap-6 h-16">
            {/* Logo — Beta badge removed */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <img
                src="/logo-wordmark.png"
                alt="WeBinX"
                height={32}
                className="h-8 w-auto object-contain"
                style={{ maxWidth: 120 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const next = (e.target as HTMLImageElement).nextSibling as HTMLElement | null;
                  if (next) next.style.display = 'flex';
                }}
              />
              {/* SVG fallback wordmark */}
              <span
                className="items-center gap-0.5 text-xl font-bold tracking-tight hidden"
                style={{ color: 'var(--wx-teal)', fontFamily: 'var(--font-display)' }}
              >
                WeBin
                <span style={{ color: 'var(--wx-gold)' }}>X</span>
              </span>
            </Link>

            {/* Content type tabs */}
            <div
              className="flex items-center gap-0.5 rounded-full p-1"
              style={{ background: 'var(--wx-surface)', border: '1px solid var(--wx-border)' }}
            >
              {CONTENT_TABS.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: active ? 'var(--wx-teal)' : 'transparent',
                      color: active ? '#fff' : 'var(--wx-muted)',
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {tab.label}
                    {tab.isNew && !active && (
                      <span
                        className="text-[9px] font-bold px-1 py-0.5 rounded"
                        style={{ background: 'var(--wx-gold-pale)', color: '#92610A', lineHeight: 1 }}
                      >
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Other nav links */}
            <div className="flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: isActive(link.href) ? 'var(--wx-teal)' : 'var(--wx-muted)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* AI Search */}
              <Link
                href="/ai-search"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isActive('/ai-search') ? 'var(--wx-teal)' : 'var(--wx-muted)',
                  textDecoration: 'none',
                }}
              >
                <Sparkles size={14} />
                AI Search
              </Link>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 rounded-full transition-colors hover:bg-gray-100">
                <Heart
                  size={18}
                  strokeWidth={1.75}
                  style={{ color: wishCount > 0 ? 'var(--wx-gold-dark)' : 'var(--wx-muted)' }}
                />
                {wishCount > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: 'var(--wx-gold)', color: 'var(--wx-ink)' }}
                  >
                    {wishCount > 9 ? '9+' : wishCount}
                  </span>
                )}
              </Link>

              {/* List Free */}
              <Link
                href="/submit-webinar"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                style={{
                  color: 'var(--wx-teal)',
                  border: '1.5px solid var(--wx-teal)',
                  textDecoration: 'none',
                }}
              >
                List Free →
              </Link>

              {/* Get Featured */}
              <Link
                href="/get-featured"
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                style={{
                  background: 'var(--wx-teal)',
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgb(13 79 107 / 0.2)',
                }}
              >
                <Star size={13} fill="var(--wx-gold)" stroke="none" />
                Get Featured
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Mobile Top Bar ─── */}
      <header
        className="md:hidden sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--wx-border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo — Beta badge removed */}
          <Link href="/" className="flex items-center gap-1.5">
            <img
              src="/logo-wordmark.png"
              alt="WeBinX"
              height={28}
              className="h-7 w-auto object-contain"
              style={{ maxWidth: 100 }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/get-featured" className="wx-btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
              <Star size={11} fill="var(--wx-gold)" stroke="none" />
              Feature
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--wx-ink)' }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileOpen && (
          <div
            className="absolute top-full left-0 right-0 z-50 p-4 space-y-1"
            style={{
              background: 'var(--wx-white)',
              borderBottom: '1px solid var(--wx-border)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {[...CONTENT_TABS, ...NAV_LINKS, { label: '✨ AI Search', href: '/ai-search' }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: isActive(link.href) ? 'var(--wx-teal-pale)' : 'transparent',
                  color: isActive(link.href) ? 'var(--wx-teal)' : 'var(--wx-ink)',
                  textDecoration: 'none',
                }}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {'isNew' in link && link.isNew && (
                    <span className="wx-badge wx-badge-gold" style={{ fontSize: '0.6rem' }}>NEW</span>
                  )}
                </span>
                <ChevronRight size={15} style={{ color: 'var(--wx-muted-light)' }} />
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--wx-border)' }}>
              <Link
                href="/submit-webinar"
                className="flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold"
                style={{
                  border: '1.5px solid var(--wx-teal)',
                  color: 'var(--wx-teal)',
                  textDecoration: 'none',
                }}
              >
                List Your Event Free →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--wx-border)',
          boxShadow: '0 -4px 20px rgb(0 0 0 / 0.06)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {BOTTOM_TABS.map((tab) => {
          const active =
            tab.matchPrefix
              ? location === tab.href || location.startsWith(tab.matchPrefix)
              : isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-all"
              style={{ textDecoration: 'none' }}
            >
              <span
                style={{
                  color: active ? 'var(--wx-teal)' : 'var(--wx-muted)',
                  transition: 'color 150ms ease, transform 150ms ease',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                  display: 'block',
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: active ? 'var(--wx-teal)' : 'var(--wx-muted)' }}
              >
                {tab.label}
              </span>
              {active && (
                <span
                  className="absolute top-0 h-0.5 w-8 rounded-full"
                  style={{ background: 'var(--wx-teal)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export { Navbar };
