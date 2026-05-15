import { Link } from 'wouter';

const CURRENT_YEAR = new Date().getFullYear();

const SECTOR_LINKS = [
  { label: 'Technology',          href: '/sector/technology' },
  { label: 'Finance',             href: '/sector/finance' },
  { label: 'AI & Machine Learning', href: '/sector/ai' },
  { label: 'Marketing',           href: '/sector/marketing' },
  { label: 'Healthcare',          href: '/sector/healthcare' },
  { label: 'Startup',             href: '/sector/startup' },
];

const PLATFORM_LINKS = [
  { label: '✨ AI Search',         href: '/ai-search' },
  { label: '🏆 Top Hosts',         href: '/top-hosts' },
  { label: '❤️ Saved Events',      href: '/wishlist' },
  { label: '📈 Trending Topics',   href: '/trending-topics' },
  { label: 'Browse Hosts',         href: '/host' },
  { label: 'Browse Webinars',      href: '/webinars' },
];

const FOR_HOSTS_LINKS = [
  { label: '⭐ Get Featured',         href: '/get-featured' },
  { label: '🎤 Claim Mention Reward', href: '/mention-webinx' },
  { label: '🛠️ Host Tools',           href: '/host-tools' },
  { label: '🎖️ Speaker Certificate',  href: '/certificate' },
  { label: '📋 Submit Event',         href: '/submit-webinar' },
];

const COMPANY_LINKS = [
  { label: 'About',          href: '/about' },
  { label: 'Contact',        href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer(): JSX.Element {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--wx-border)',
        background: 'var(--wx-white)',
        marginTop: 'auto',
      }}
    >
      {/* Main footer grid */}
      <div className="wx-container" style={{ paddingTop: '3rem', paddingBottom: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>
              {/* Logo image — falls back to styled text */}
              <img
                src="/logo-wordmark.png"
                alt="WeBinX"
                style={{ height: 24, width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--wx-muted)',
                lineHeight: 1.6,
                maxWidth: 180,
                marginBottom: '1rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              India's Knowledge Events Marketplace — Webinars, Podcasts & Live Events, updated daily.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <a
                href="mailto:contact@webinx.in"
                style={{ fontSize: '0.72rem', color: 'var(--wx-muted)', textDecoration: 'none' }}
              >
                📧 contact@webinx.in
              </a>
              <span style={{ fontSize: '0.72rem', color: 'var(--wx-muted)' }}>🇮🇳 India-first</span>
            </div>

            {/* Content type badges */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: '🎥 Webinars', href: '/webinars' },
                { label: '🎙️ Podcasts', href: '/podcasts' },
                { label: '📍 Live Events', href: '/live-events' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 99,
                    background: 'var(--wx-teal-pale)',
                    color: 'var(--wx-teal)',
                    border: '1px solid rgba(13,79,107,0.12)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sector links */}
          <nav aria-label="Browse by sector">
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--wx-muted)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Browse by Sector
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SECTOR_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--wx-muted)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sans)',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--wx-ink)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--wx-muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform links */}
          <nav aria-label="Platform">
            <p
              style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--wx-muted)',
                marginBottom: '1rem', fontFamily: 'var(--font-sans)',
              }}
            >
              Platform
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: '0.8125rem', color: 'var(--wx-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--wx-ink)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--wx-muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For Hosts */}
          <nav aria-label="For hosts">
            <p
              style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--wx-muted)',
                marginBottom: '1rem', fontFamily: 'var(--font-sans)',
              }}
            >
              For Hosts
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {FOR_HOSTS_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: '0.8125rem', color: 'var(--wx-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--wx-ink)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--wx-muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p
              style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--wx-muted)',
                marginBottom: '1rem', fontFamily: 'var(--font-sans)',
              }}
            >
              Company
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: '0.8125rem', color: 'var(--wx-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--wx-ink)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--wx-muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--wx-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.72rem', color: 'var(--wx-muted)', fontFamily: 'var(--font-sans)' }}>
            © {CURRENT_YEAR}{' '}
            <span style={{ color: 'var(--wx-teal)', fontWeight: 600 }}>WeBinX</span>
            {' '}· India's Knowledge Events Marketplace · Built with ✨ AI
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Contact', href: '/contact' },
              { label: 'Sitemap', href: '/sitemap.xml' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: '0.72rem', color: 'var(--wx-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wx-ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wx-muted)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
