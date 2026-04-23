import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

const LAST_UPDATED = "1 April 2025";

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service — Webinx</title>
        <meta
          name="description"
          content="Webinx terms of service: the rules governing use of India's free webinar discovery platform."
        />
        <link rel="canonical" href="https://www.webinx.in/terms" />
        <meta property="og:title" content="Terms of Service — Webinx" />
        <meta property="og:url" content="https://www.webinx.in/terms" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Terms of Service</span>
        </nav>

        <article>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                1. Acceptance of terms
              </h2>
              <p>
                By accessing or using <span className="font-medium">www.webinx.in</span>{" "}
                (&quot;the Site&quot;), you agree to be bound by these Terms of Service
                (&quot;Terms&quot;). If you do not agree, please do not use the Site.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                2. Description of service
              </h2>
              <p>
                Webinx is a free event discovery platform that aggregates publicly
                available webinar and workshop listings. We do not organise, host, or
                endorse any event listed on the Site. All event details are provided by
                third-party organisers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                3. Accuracy of information
              </h2>
              <p>
                Event listings are sourced automatically and may contain errors,
                outdated information, or broken links. Webinx makes no warranty regarding
                the accuracy, completeness, or availability of any listed event. Always
                verify event details on the organiser&apos;s official page before
                registering.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                4. Acceptable use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Scrape, crawl, or harvest data from the Site without permission</li>
                <li>Use the Site for any unlawful purpose</li>
                <li>
                  Attempt to interfere with, disrupt, or gain unauthorised access to the
                  Site or its servers
                </li>
                <li>Reproduce or redistribute Webinx content without attribution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                5. Third-party links
              </h2>
              <p>
                The Site contains links to third-party platforms. We are not responsible
                for the content, privacy practices, or availability of those sites. Links
                do not imply endorsement.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                6. Intellectual property
              </h2>
              <p>
                The Webinx name, logo, and platform design are the property of Webinx.
                Event titles, descriptions, and images belong to their respective
                organisers. You may not reproduce Webinx branding without prior written
                consent.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                7. Disclaimer of warranties
              </h2>
              <p>
                The Site is provided &quot;as is&quot; and &quot;as available&quot;
                without warranties of any kind. We do not warrant that the Site will be
                uninterrupted, error-free, or free from viruses or other harmful
                components.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                8. Limitation of liability
              </h2>
              <p>
                To the maximum extent permitted by law, Webinx shall not be liable for
                any indirect, incidental, or consequential damages arising from your use
                of, or inability to use, the Site or any event listed on it.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                9. Governing law
              </h2>
              <p>
                These Terms are governed by the laws of India. Any dispute arising from
                these Terms shall be subject to the exclusive jurisdiction of the courts
                located in India.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                10. Changes to these terms
              </h2>
              <p>
                We may revise these Terms at any time. Continued use of the Site after
                changes are posted constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                11. Contact
              </h2>
              <p>
                Questions about these Terms?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact us
                </Link>{" "}
                or email{" "}
                <a href="mailto:hello@webinx.in" className="text-blue-600 hover:underline">
                  hello@webinx.in
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
