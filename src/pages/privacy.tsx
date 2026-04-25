import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

const LAST_UPDATED = "1 April 2025";

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Webinx</title>
        <meta
          name="description"
          content="Webinx privacy policy: what data we collect, how we use it, and your rights as a visitor to India's webinar discovery platform."
        />
        <link rel="canonical" href="https://www.webinx.in/privacy" />
        <meta property="og:title" content="Privacy Policy — Webinx" />
        <meta property="og:url" content="https://www.webinx.in/privacy" />
        {/* Tell crawlers this is a policy page */}
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        <article className="prose prose-sm prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Overview</h2>
              <p>
                Webinx (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates{" "}
                <span className="font-medium">www.webinx.in</span>. This Privacy Policy
                explains what information we collect, how we use it, and the choices you
                have. By using Webinx you agree to the practices described here.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                2. Information we collect
              </h2>
              <p className="mb-3">
                We collect information in two ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  <span className="font-medium text-gray-800">Usage data</span> — pages
                  visited, search queries entered, browser type, and referring URL. This
                  is collected automatically via server logs and analytics tools.
                </li>
                <li>
                  <span className="font-medium text-gray-800">Contact data</span> — name
                  and email address when you use the{" "}
                  <Link href="/contact" className="text-blue-600 hover:underline">
                    contact form
                  </Link>
                  .
                </li>
              </ul>
              <p className="mt-3">
                We do not require account creation and do not store passwords.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                3. How we use your information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>To operate and improve the Webinx platform</li>
                <li>To respond to messages you send us</li>
                <li>To understand which content is most useful</li>
                <li>To detect and prevent abuse</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                4. Cookies &amp; analytics
              </h2>
              <p>
                Webinx uses minimal cookies for analytics (e.g. Vercel Analytics or a
                privacy-friendly alternative). We do not use advertising cookies or
                cross-site tracking. You can disable cookies in your browser settings at
                any time.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                5. Third-party links
              </h2>
              <p>
                Event listings link out to third-party platforms such as Eventbrite,
                Meetup, and KonfHub. We are not responsible for their privacy practices.
                Please review their policies before registering for an event.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                6. Data retention
              </h2>
              <p>
                Contact form submissions are retained for up to 12 months. Server logs
                are rotated every 30 days. You may request deletion of your data by
                emailing{" "}
                <a href="mailto:privacy@webinx.in" className="text-blue-600 hover:underline">
                  privacy@webinx.in
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                7. Your rights
              </h2>
              <p>
                Under applicable Indian data protection law you have the right to access,
                correct, or delete personal data we hold about you. Contact us at{" "}
                <a href="mailto:privacy@webinx.in" className="text-blue-600 hover:underline">
                  privacy@webinx.in
                </a>{" "}
                to make a request.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                8. Changes to this policy
              </h2>
              <p>
                We may update this policy from time to time. When we do, we will revise
                the &quot;last updated&quot; date at the top of this page. Continued use
                of Webinx after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">9. Contact</h2>
              <p>
                Questions about this policy?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact us
                </Link>{" "}
                or email{" "}
                <a href="mailto:privacy@webinx.in" className="text-blue-600 hover:underline">
                  privacy@webinx.in
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
