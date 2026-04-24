// src/pages/get-featured.tsx — WebinX Featured Listing Purchase
// Razorpay payment integration. Falls back gracefully if keys not set.

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const PLANS = [
  {
    id:       "week",
    name:     "7 Days",
    price:    "₹299",
    paise:    29900,
    per:      "per week",
    badge:    "Starter",
    features: ["Featured badge on listing", "Top placement in search", "Priority in trending"],
    color:    "#7c3aed",
  },
  {
    id:       "month",
    name:     "30 Days",
    price:    "₹799",
    paise:    79900,
    per:      "per month",
    badge:    "Popular ⭐",
    features: ["Everything in 7 Days", "Homepage featured section", "Email digest inclusion"],
    color:    "#059669",
    highlight: true,
  },
  {
    id:       "quarter",
    name:     "90 Days",
    price:    "₹1,999",
    paise:    199900,
    per:      "per quarter",
    badge:    "Best Value",
    features: ["Everything in 30 Days", "Analytics dashboard", "Sponsor match alerts"],
    color:    "#d97706",
  },
];

declare global {
  interface Window { Razorpay: any; }
}

export default function GetFeaturedPage() {
  const [eventSlug,    setEventSlug]    = useState("");
  const [hostEmail,    setHostEmail]    = useState("");
  const [selectedPlan, setSelectedPlan] = useState("month");
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState("");
  const [rzpReady,     setRzpReady]     = useState(false);

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";
  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  // Load Razorpay SDK
  useEffect(() => {
    if (window.Razorpay) { setRzpReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRzpReady(true);
    document.body.appendChild(script);
  }, []);

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!eventSlug.trim()) { setError("Please enter your event slug"); return; }
    if (!hostEmail.trim() || !hostEmail.includes("@")) { setError("Valid email required"); return; }
    if (!rzpReady) { setError("Payment loading… please wait a moment"); return; }

    setLoading(true);
    try {
      // Step 1: Create order
      const orderRes = await fetch(`${API}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_slug: eventSlug.trim(), plan: selectedPlan, host_email: hostEmail.trim() }),
      });
      const order = await orderRes.json();

      if (order.error) {
        // Payment not configured yet — show contact option
        setError(order.error);
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key:         order.key,
        amount:      order.amount,
        currency:    order.currency,
        name:        "WebinX",
        description: `${order.plan_name} for /${order.event_slug}`,
        order_id:    order.order_id,
        prefill:     { email: hostEmail },
        theme:       { color: "#7c3aed" },
        handler: async (response: any) => {
          // Step 3: Verify payment
          const verifyRes = await fetch(`${API}/api/razorpay/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verify = await verifyRes.json();
          if (verify.status === "ok") {
            setSuccess(true);
          } else {
            setError("Payment verification failed. Email contact@webinx.in with your payment ID.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      new window.Razorpay(options).open();
    } catch {
      setError("Something went wrong. Please try again or email contact@webinx.in");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Get Featured on WebinX — Boost Your Webinar</title>
        <meta
          name="description"
          content="Feature your webinar on WebinX — India's top webinar discovery platform. Get top placement, badge, and email digest inclusion."
        />
        <link rel="canonical" href="https://www.webinx.in/get-featured" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">⭐</div>
          <h1 className="text-2xl font-bold text-gray-900">Get Your Webinar Featured</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Reach thousands of professionals actively looking for webinars on WebinX. Featured events get 3–5× more registrations.
          </p>
        </div>

        {/* Success */}
        {success ? (
          <div className="text-center py-10 px-6 border border-green-100 rounded-2xl bg-green-50">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Featured Listing Activated!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Your webinar now has the ⭐ Featured badge and top placement. Your listing is live immediately.
            </p>
            <a href="/webinars" className="text-sm font-medium bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
              View Your Webinar →
            </a>
          </div>
        ) : (
          <>
            {/* Plan selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlan(p.id)}
                  className={`text-left p-5 rounded-xl border-2 transition relative ${
                    selectedPlan === p.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  } ${p.highlight ? "ring-2 ring-green-200" : ""}`}
                >
                  {p.highlight && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-2xl font-bold mb-0.5" style={{ color: p.color }}>
                    {p.price}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{p.per}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">{p.name}</div>
                  <ul className="space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* What featured means */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[
                { icon: "🏅", label: "Featured badge", sub: "on your listing" },
                { icon: "📈", label: "3–5× more", sub: "registrations" },
                { icon: "📧", label: "Email digest", sub: "to all leads" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-semibold text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handlePayment} className="space-y-4 border border-gray-100 rounded-2xl p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                {plan.name} Featured — {plan.price}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Slug *
                  <span className="font-normal text-gray-400 ml-1">(from your webinar URL)</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <span className="px-3 py-2.5 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">
                    webinx.in/webinar/
                  </span>
                  <input
                    type="text"
                    required
                    value={eventSlug}
                    onChange={(e) => setEventSlug(e.target.value)}
                    placeholder="your-event-slug"
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={hostEmail}
                  onChange={(e) => setHostEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                />
              </div>

              {error && (
                <div className="text-sm bg-red-50 border border-red-100 text-red-700 px-3 py-2.5 rounded-lg">
                  {error}
                  {error.includes("Contact") && (
                    <a href="mailto:contact@webinx.in" className="ml-1 underline">
                      contact@webinx.in
                    </a>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Processing…</>
                ) : (
                  <>Pay {plan.price} → Get Featured for {plan.name}</>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Secure payment via Razorpay · UPI, Cards, Net Banking accepted · Instant activation
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
