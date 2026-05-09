/**
 * HostPlans.tsx
 * ─────────────────────────────────────────────────────────────────
 * Pricing page for host SaaS plans.
 * After successful Razorpay subscription, redirects to:
 *   /host-tools?upgraded=true&plan=<tier>
 *
 * Uses apiFetch (3-retry, 20s timeout) — never raw fetch.
 */

import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "wouter";
import { apiFetch } from "../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface Plan {
  id:          "free" | "pro" | "scale" | "agency";
  name:        string;
  price:       number;          // INR/month, 0 = free
  badge:       string;
  description: string;
  features:    string[];
  razorpayPlanId: string | null;
  highlight:   boolean;
}

interface SubscriptionResponse {
  subscription_id: string;
  razorpay_key:    string;
  plan_tier:       string;
}

// ── Plan definitions ───────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id:          "free",
    name:        "Free",
    price:       0,
    badge:       "🌱",
    description: "Get discovered by India's knowledge community.",
    razorpayPlanId: null,
    highlight:   false,
    features: [
      "List unlimited events",
      "Basic profile page",
      "Standard search placement",
      "Community support",
    ],
  },
  {
    id:          "pro",
    name:        "Pro",
    price:       299,
    badge:       "⚡",
    description: "For active hosts who want more reach and tools.",
    razorpayPlanId: "plan_SiSCYOPw71rhfV",
    highlight:   true,
    features: [
      "Everything in Free",
      "Priority placement in search",
      "AI Title Optimizer",
      "AI Description Enhancer",
      "Weekly digest inclusion",
      "Event analytics dashboard",
      "Founding rate — locked for life",
    ],
  },
  {
    id:          "scale",
    name:        "Scale",
    price:       799,
    badge:       "🚀",
    description: "For organizations running multiple events monthly.",
    razorpayPlanId: "plan_SiSD5gjqmaSGpa",
    highlight:   false,
    features: [
      "Everything in Pro",
      "Branded events section",
      "Up to 10 team members",
      "Bulk event submission API",
      "Custom email digest slot",
      "Dedicated account support",
    ],
  },
  {
    id:          "agency",
    name:        "Agency",
    price:       1999,
    badge:       "🏢",
    description: "For platforms and agencies managing multiple brands.",
    razorpayPlanId: "plan_SiSDbwxhLMC2Sa",
    highlight:   false,
    features: [
      "Everything in Scale",
      "Unlimited team members",
      "White-label embed widget",
      "Revenue share on ticket sales",
      "B2B intelligence reports",
      "Priority feature requests",
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function HostPlans() {
  const [, navigate]     = useLocation();
  const [loading, setLoading]   = useState<string | null>(null);
  const [error,   setError]     = useState<string | null>(null);

  const handleUpgrade = useCallback(async (plan: Plan) => {
    if (!plan.razorpayPlanId) return;

    setError(null);
    setLoading(plan.id);

    const token = localStorage.getItem("host_token");
    if (!token) {
      navigate("/host-login");
      return;
    }

    try {
      // 1. Create subscription on backend
      const data = await apiFetch<SubscriptionResponse>("/api/host/subscribe", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: plan.razorpayPlanId }),
      });

      // 2. Open Razorpay checkout
      const rzp = new (window as any).Razorpay({
        key:             data.razorpay_key,
        subscription_id: data.subscription_id,
        name:            "WebinX",
        description:     `${plan.name} Plan — ₹${plan.price}/month`,
        image:           "https://www.webinx.in/logo-wordmark.png",
        theme:           { color: "#0D4F6B" },

        handler: (_response: unknown) => {
          // 3. Payment success → redirect with context
          navigate(`/host-tools?upgraded=true&plan=${plan.id}`);
        },

        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      });

      rzp.open();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(null);
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Host Plans — WebinX</title>
        <meta
          name="description"
          content="Choose a WebinX host plan. List events free or upgrade for priority placement, AI tools, analytics, and weekly digest inclusion."
        />
        <link rel="canonical" href="https://www.webinx.in/host-plans" />
      </Helmet>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest
                           text-teal-700 bg-teal-50 border border-teal-200 rounded-full
                           px-4 py-1.5 mb-4">
            Founding Member Pricing — expires June 15
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Grow your events on WebinX
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            India's only dedicated knowledge events marketplace.
            Start free — upgrade when you're ready.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 max-w-xl mx-auto bg-red-50 border border-red-200
                          rounded-lg px-4 py-3 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6
                ${plan.highlight
                  ? "border-teal-500 shadow-lg shadow-teal-500/10 bg-white ring-2 ring-teal-500"
                  : "border-gray-200 bg-white hover:border-gray-300"
                } transition-all`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-600 text-white text-xs font-bold
                                   px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-2xl">{plan.badge}</span>
                <h2 className="mt-2 text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <span className="text-3xl font-bold text-gray-900">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                    {plan.highlight && (
                      <p className="text-xs text-teal-600 font-medium mt-1">
                        ↑ ₹499/month after June 15
                      </p>
                    )}
                  </>
                )}
              </div>

              <ul className="flex-1 space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <Link
                  href="/host"
                  className="block text-center py-3 px-4 rounded-xl border-2
                             border-gray-200 text-gray-700 font-semibold text-sm
                             hover:border-teal-500 hover:text-teal-700 transition-colors"
                >
                  Get Started Free
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm
                              transition-all disabled:opacity-60 disabled:cursor-not-allowed
                    ${plan.highlight
                      ? "bg-teal-700 hover:bg-teal-800 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                >
                  {loading === plan.id ? "Opening checkout…" : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-sm text-gray-400 mt-10">
          Payments secured by Razorpay · Cancel anytime · No hidden fees
        </p>
      </main>
    </>
  );
}
