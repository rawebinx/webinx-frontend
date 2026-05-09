import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service — WebinX</title>
        <meta name="description" content="WebinX Terms of Service — rules for using India's Knowledge Events Marketplace." />
        <link rel="canonical" href="https://www.webinx.in/terms" />
      </Helmet>
      <main className="max-w-2xl mx-auto px-4 py-16">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/">Home</Link><span className="mx-2">/</span><span className="text-gray-900">Terms</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 9, 2026</p>
        <div className="space-y-8 text-gray-700 leading-relaxed text-sm">

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">1. Acceptance</h2>
          <p>By using webinx.in ("WebinX", "we", "the platform"), you agree to these terms. If you do not agree, do not use the platform.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">2. What WebinX is</h2>
          <p>WebinX is an aggregation and discovery platform for webinars, podcasts, and live events in India. We do not host, produce, or guarantee any event listed. All registrations happen on the original host's platform.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">3. Host accounts and plans</h2>
          <p>Hosts may list events free or subscribe to paid plans (Pro ₹299/month, Scale ₹799/month, Agency ₹1,999/month). Subscriptions are billed monthly via Razorpay and auto-renew unless cancelled. You may cancel at any time from your account. Refunds are not issued for partial billing periods. Founding member rates are locked for the life of the subscription as long as billing is continuous.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">4. AI tools</h2>
          <p>Host tools (Title Optimizer, Description Enhancer, Content Generator) are powered by Anthropic's Claude API. Output is AI-generated and may contain errors. You are responsible for reviewing all AI-generated content before publishing. Usage is subject to fair-use limits by plan tier.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">5. Featured listings and payments</h2>
          <p>Featured event placements (₹299/7d, ₹799/30d, ₹1,999/90d) are purchased via Razorpay. Payments are non-refundable once the featured slot is activated. Featured placement does not guarantee event attendance or registration numbers.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">6. Affiliate program</h2>
          <p>Affiliates earn 20% recurring commission on referred host subscriptions. Commissions are calculated monthly and paid within 15 days of month end. WebinX reserves the right to withhold commissions for fraudulent referrals. The affiliate program may be modified or discontinued with 30 days' notice.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">7. Newsletter sponsorships</h2>
          <p>Sponsored placements in the WebinX weekly digest are clearly labelled "Sponsored." Sponsors are responsible for the accuracy of their advertising content. WebinX reserves the right to reject any sponsorship that violates our content guidelines.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">8. Content and conduct</h2>
          <p>Hosts must not list events that are misleading, fraudulent, or illegal. WebinX may remove any listing at our discretion. You retain ownership of content you submit; you grant us a licence to display and index it.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">9. Limitation of liability</h2>
          <p>WebinX is provided "as is." We are not liable for event cancellations, registration failures, or any damages arising from your use of the platform. Our maximum liability in any case is the amount you paid us in the 30 days preceding the claim.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">10. Governing law</h2>
          <p>These terms are governed by the laws of India. Disputes shall be resolved in courts of Gujarat, India.</p></section>

          <section><h2 className="text-base font-semibold text-gray-900 mb-2">11. Contact</h2>
          <p>Questions about these terms: <a href="mailto:contact@webinx.in" className="text-teal-700 hover:underline">contact@webinx.in</a></p></section>
        </div>
      </main>
    </>
  );
}
