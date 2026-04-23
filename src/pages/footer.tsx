import { Link } from "wouter";

const CURRENT_YEAR = new Date().getFullYear();

const SECTOR_LINKS = [
  { label: "Technology", href: "/sector/technology" },
  { label: "Finance", href: "/sector/finance" },
  { label: "Healthcare", href: "/sector/healthcare" },
  { label: "Marketing", href: "/sector/marketing" },
  { label: "Data Science", href: "/sector/data-science" },
  { label: "Entrepreneurship", href: "/sector/entrepreneurship" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Webinx
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
              India's free webinar discovery platform. Find the best online events
              across every sector — no signup needed.
            </p>
          </div>

          {/* Sectors */}
          <nav aria-label="Sector links">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Browse by sector
            </p>
            <ul className="space-y-2">
              {SECTOR_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
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
                  <Link
                    href={href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
          <p>© {CURRENT_YEAR} Webinx. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
