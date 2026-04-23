import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Webinx — Free Webinar Discovery for India</title>
        <meta
          name="description"
          content="Webinx is India's webinar discovery platform. We aggregate free online events across tech, finance, marketing, healthcare, and more so you never miss what matters."
        />
        <link rel="canonical" href="https://www.webinx.in/about" />
        <meta property="og:title" content="About Webinx" />
        <meta
          property="og:description"
          content="India's free webinar discovery platform — all events in one place."
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About Webinx</h1>
          <p className="text-gray-500 text-sm mb-10">
            India's free webinar discovery platform
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What we do</h2>
              <p>
                Webinx aggregates free online webinars, workshops, and virtual events from
                across India and makes them searchable in one place. Whether you are a
                student, a working professional, or a founder, we surface the events most
                relevant to you — no signup required.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Why we built it</h2>
              <p>
                Great learning events happen every day in India, but they are scattered
                across dozens of platforms — Eventbrite, Meetup, LinkedIn, KonfHub, and
                many more. We built Webinx to solve the discovery problem: one search bar,
                every sector, always up to date.
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
                <li>Design &amp; Product</li>
                <li>Data Science &amp; AI</li>
                <li>Law, Policy &amp; Government</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Host or organise events?
              </h2>
              <p>
                If you run webinars and want them listed on Webinx,{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 hover:underline"
                >
                  get in touch
                </Link>
                . We welcome partnerships with platforms, colleges, and communities.
              </p>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
