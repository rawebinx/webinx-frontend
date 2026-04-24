// src/pages/footer.tsx — WebinX Footer v2 — 4 columns, all features surfaced
import { Link } from "wouter";

const CURRENT_YEAR = new Date().getFullYear();

const SECTOR_LINKS = [
  { label: "Technology",      href: "/sector/technology"    },
  { label: "Finance",         href: "/sector/finance"       },
  { label: "AI & Machine Learning", href: "/sector/ai"      },
  { label: "Marketing",       href: "/sector/marketing"     },
  { label: "Healthcare",      href: "/sector/healthcare"    },
  { label: "Startup",         href: "/sector/startup"       },
];

const PLATFORM_LINKS = [
  { label: "🔍 AI Search",         href: "/ai-search"       },
  { label: "🏆 Top Hosts",         href: "/top-hosts"       },
  { label: "❤️ Saved Webinars",    href: "/wishlist"        },
  { label: "📈 Trending Topics",   href: "/trending-topics" },
  { label: "Browse All Hosts",     href: "/host"            },
  { label: "Browse All Webinars",  href: "/webinars"        },
];

const FOR_HOSTS_LINKS = [
  { label: "⭐ Get Featured",       href: "/get-featured"   },
  { label: "🎤 Claim Mention Reward", href: "/mention-webinx" },
  { label: "🛠️ Host Tools",         href: "/host-tools"     },
  { label: "🎖️ Speaker Certificate", href: "/certificate"   },
];

const COMPANY_LINKS = [
  { label: "About",            href: "/about"    },
  { label: "Contact",          href: "/contact"  },
  { label: "Privacy Policy",   href: "/privacy"  },
  { label: "Terms of Service", href: "/terms"    },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">

          {/* Brand — spans 1 column */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-purple-600 tracking-tight">WebinX</span>
            </Link>
            <p className="mt-3 text-xs text-gray-500 leading-relaxed max-w-[180px]">
              India's AI-powered webinar discovery platform. Find, save, and get notified — free.
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <a href="mailto:contact@webinx.in"
                 className="text-xs text-gray-400 hover:text-gray-600 transition">
                📧 contact@webinx.in
              </a>
              <span className="text-xs text-gray-400">🇮🇳 India-first</span>
            </div>
          </div>

          {/* Browse by Sector */}
          <nav aria-label="Sector links">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Browse by sector
            </p>
            <ul className="space-y-2">
              {SECTOR_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform */}
          <nav aria-label="Platform links">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Platform
            </p>
            <ul className="space-y-2">
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For Hosts */}
          <nav aria-label="For hosts">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              For Hosts
            </p>
            <ul className="space-y-2">
              {FOR_HOSTS_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Company
            </p>
            <ul className="space-y-2">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-400">© {CURRENT_YEAR} WebinX. All rights reserved. Built with ✨ AI.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy"  className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms"    className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link href="/contact"  className="hover:text-gray-600 transition-colors">Contact</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-600 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
