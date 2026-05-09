import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

// Badge images — all externally hosted, no assets needed
const BADGES = [
  {
    href: "https://www.producthunt.com/posts/webinx",
    src: "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=webinx&theme=light",
    alt: "WebinX - Featured on Product Hunt",
    label: "Product Hunt",
  },
  {
    href: "https://techbasedirectory.com/products/webinx",
    src: "https://techbasedirectory.com/badge-light.svg",
    alt: "Featured on TechBaseDirectory",
    label: "TechBaseDirectory",
  },
];

const BUILT_WITH = [
  { label: "Vercel",    logo: "⬡", href: "https://vercel.com" },
  { label: "Render",   logo: "⬡", href: "https://render.com" },
  { label: "Razorpay", logo: "⬡", href: "https://razorpay.com" },
  { label: "Claude AI",logo: "⬡", href: "https://anthropic.com" },
  { label: "PostgreSQL",logo:"⬡", href: "https://postgresql.org" },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About WebinX — India's Knowledge Events Marketplace</title>
        <meta
          name="description"
          content="WebinX is India's dedicated marketplace for webinars, podcasts, and live events — aggregated daily across 8 cities and 9 sectors. Free to discover, no signup required."
        />
        <link rel="canonical" href="https://www.webinx.in/about" />
        <meta property="og:title" content="About WebinX" />
        <meta
          property="og:description"
          content="India's Knowledge Events Marketplace — webinars, podcasts, live events, updated daily."
        />
        <meta property="og:url" content="https://www.webinx.in/about" />
      </Helmet>

      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">About</span>
        </nav>

        <article>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About WebinX</h1>
          <p className="text-gray-500 text-sm mb-10">
            India's Knowledge Events Marketplace — Webinars · Podcasts · Live Events
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What we do</h2>
              <p>
                WebinX aggregates webinars, podcasts, and live events from across India and
                makes them searchable in one place. Whether you are a student, a working
                professional, or a founder, we surface the events most relevant to you —
                no signup required.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Why we built it</h2>
              <p>
                Great learning events happen every day in India, but they are scattered
                across dozens of platforms — Eventbrite, Meetup, LinkedIn, KonfHub, and
                many more. We built WebinX to solve the discovery problem: one search bar,
                every sector, always up to date. Powered by AI that understands plain
                English — ask "free AI webinars this week in Bangalore" and get answers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What we cover</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Technology &amp; Engineering</li>
                <li>Finance &amp; Fintech</li>
                <li>Marketing &amp; Growth</li>
                <li>Healthcare &amp; Life Sciences</li>
                <li>Entrepreneurship &amp; Startups</li>
                <li>Data Science &amp; AI</li>
                <li>Human Resources &amp; Leadership</li>
                <li>Education &amp; EdTech</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Host or organise events?
              </h2>
              <p>
                If you run webinars, podcasts, or live events and want them listed on
                WebinX,{" "}
                <Link href="/host" className="text-teal-700 hover:underline font-medium">
                  list for free
                </Link>
                . We welcome partnerships with platforms, colleges, communities, and
                professional associations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Who made this</h2>
              <p>
                WebinX is built and maintained by{" "}
                <a
                  href="https://linkedin.com/in/ragraval"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:underline font-medium"
                >
                  Rajesh Agraval
                </a>
                , a solo founder based in Gujarat, India.
                Questions or partnerships:{" "}
                <a
                  href="mailto:contact@webinx.in"
                  className="text-teal-700 hover:underline"
                >
                  contact@webinx.in
                </a>
              </p>
            </section>
          </div>

          {/* ── Featured On Badges ─────────────────────────────────────── */}
          <div className="mt-14 pt-8 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
              Featured on
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {/* Product Hunt badge */}
              <a
                href="https://www.producthunt.com/posts/webinx"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=webinx&theme=light"
                  alt="WebinX - Featured on Product Hunt"
                  width={200}
                  height={43}
                  style={{ height: "43px", width: "auto" }}
                  onError={(e) => {
                    // Fallback text badge if image fails
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </a>

              {/* TechBaseDirectory badge */}
              <a
                href="https://techbasedirectory.com/products/webinx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200
                           bg-white text-gray-700 text-sm font-medium
                           opacity-80 hover:opacity-100 hover:border-gray-300 transition-all"
              >
                <span className="text-base">🔷</span>
                <span>TechBaseDirectory</span>
              </a>

              {/* SaasHunt badge — add once listed */}
              {/* <a href="https://saashunt.com/webinx" ...> */}
            </div>
          </div>

          {/* ── Built With ────────────────────────────────────────────── */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Built with
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Vercel",      href: "https://vercel.com",       emoji: "▲" },
                { label: "Render",      href: "https://render.com",       emoji: "⬡" },
                { label: "Razorpay",    href: "https://razorpay.com",     emoji: "💳" },
                { label: "Claude AI",   href: "https://anthropic.com",    emoji: "✦" },
                { label: "PostgreSQL",  href: "https://postgresql.org",   emoji: "🐘" },
                { label: "React",       href: "https://react.dev",        emoji: "⚛" },
              ].map(({ label, href, emoji }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-gray-50 border border-gray-200 text-gray-600 text-xs
                             hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
