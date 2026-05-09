import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — WebinX</title>
        <meta name="description" content="WebinX Privacy Policy — how we collect and use your data." />
        <link rel="canonical" href="https://www.webinx.in/privacy" />
      </Helmet>
      <main className="max-w-2xl mx-auto px-4 py-16">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/">Home</Link><span className="mx-2">/</span><span className="text-gray-900">Privacy</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 9, 2026</p>
        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">1. What we collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Email address</strong> — when you subscribe to the digest, register as a host, or set up alerts</li>
            <li><strong>Event interactions</strong> — events you view, click, or save (used to personalise your experience)</li>
            <li><strong>Payment data</strong> — processed entirely by Razorpay; we store only your plan tier and subscription status</li>
            <li><strong>Host profile data</strong> — name, organisation, events you submit</li>
            <li><strong>Affiliate data</strong> — name, email, referral code, and commission records if you join the affiliate program</li>
            <li><strong>Usage data</strong> — pages visited, search queries (anonymised, aggregated)</li>
          </ul></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">2. How we use your data</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Send you the weekly knowledge digest (if subscribed)</li>
            <li>Personalise event recommendations</li>
            <li>Process host subscriptions and featured placements</li>
            <li>Calculate and pay affiliate commissions</li>
            <li>Send event alerts you've set up</li>
            <li>Improve our AI tagging and search quality</li>
            <li>Send transactional emails (receipts, upgrade confirmations)</li>
          </ul></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">3. AI processing</h2>
          <p>Event titles and descriptions are processed by Anthropic's Claude API to extract skills, difficulty levels, and speaker names. No personal user data is sent to Anthropic. Event content submitted by hosts may be processed by AI tools for quality improvement.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">4. Data sharing</h2>
          <p>We do not sell your data. We share data only with:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
            <li><strong>Razorpay</strong> — payment processing</li>
            <li><strong>Anthropic</strong> — AI-powered host tools (event content only, no personal data)</li>
            <li><strong>Render / Vercel</strong> — infrastructure hosting</li>
            <li><strong>Hostinger</strong> — email delivery</li>
          </ul></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">5. Newsletter and digest</h2>
          <p>If you subscribe to our weekly digest, your email is stored in our database and used only to send you the digest. You can unsubscribe at any time by clicking the unsubscribe link in any digest email or emailing contact@webinx.in.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">6. Sponsored content</h2>
          <p>When you click a sponsored link in our digest or on the platform, the sponsor may set their own cookies. We do not control sponsor data practices. Sponsored placements are clearly labelled.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">7. Your rights</h2>
          <p>You may request deletion of your account and data at any time by emailing contact@webinx.in. We will respond within 7 working days.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">8. Cookies</h2>
          <p>We use only functional cookies (session tokens for host login). We do not use advertising or tracking cookies.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">9. Contact</h2>
          <p>Privacy queries: <a href="mailto:contact@webinx.in" className="text-teal-700 hover:underline">contact@webinx.in</a> — WebinX, Gujarat, India</p></section>
        </div>
      </main>
    </>
  );
}
