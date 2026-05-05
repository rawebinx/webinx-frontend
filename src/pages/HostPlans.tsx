import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Plan {
  id: "free" | "pro" | "scale" | "agency";
  name: string;
  price: number;
  period: string;
  razorpayPlanId: string | null;
  tagline: string;
  badge?: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface SubscribeResponse {
  subscription_id: string;
  razorpay_key_id: string;
}

interface VerifyResponse {
  status: string;
  plan_tier: string;
  message: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  image: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

// ── Plan Data ─────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    razorpayPlanId: null,
    tagline: "Get discovered",
    features: [
      "List up to 3 events",
      "Basic event page",
      "WebinX directory listing",
      "Email support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    period: "month",
    razorpayPlanId: "plan_SiSCYOPw71rhfV",
    tagline: "Grow your audience",
    badge: "Launch Offer",
    features: [
      "Unlimited event listings",
      "Priority search placement",
      "Featured badge on listings",
      "Analytics dashboard",
      "Email digest inclusion",
      "Host profile page",
    ],
    cta: "Get Pro",
    highlighted: false,
  },
  {
    id: "scale",
    name: "Scale",
    price: 799,
    period: "month",
    razorpayPlanId: "plan_SiSD5gjqmaSGpa",
    tagline: "Built for serious hosts",
    badge: "Most Popular",
    features: [
      "Everything in Pro",
      "Homepage featured section",
      "AI Promotion tools",
      "Embed widget licensing",
      "Sponsor match alerts",
      "Priority support",
    ],
    cta: "Get Scale",
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 1999,
    period: "month",
    razorpayPlanId: "plan_SiSDbwxhLMC2Sa",
    tagline: "For teams & enterprises",
    badge: "Best Value",
    features: [
      "Everything in Scale",
      "Multiple team seats",
      "White-label embed",
      "Custom analytics reports",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Get Agency",
    highlighted: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onSelect,
  loading,
}: {
  plan: Plan;
  onSelect: (plan: Plan) => void;
  loading: boolean;
}): JSX.Element {
  const isFree = plan.id === "free";

  return (
    <div
      style={{
        position: "relative",
        background: plan.highlighted ? "#0D4F6B" : "#ffffff",
        border: plan.highlighted ? "2px solid #E8B44A" : "1.5px solid #e5e7eb",
        borderRadius: 16,
        padding: "32px 28px 28px",
        display: "flex",
        flexDirection: "column",
        boxShadow: plan.highlighted
          ? "0 8px 40px rgba(13,79,107,0.25)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = plan.highlighted
          ? "0 16px 48px rgba(13,79,107,0.3)"
          : "0 8px 24px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = plan.highlighted
          ? "0 8px 40px rgba(13,79,107,0.25)"
          : "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          style={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            background: plan.highlighted ? "#E8B44A" : "#0D4F6B",
            color: plan.highlighted ? "#0D4F6B" : "#ffffff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "4px 14px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          {plan.id === "agency" ? "★ " : plan.id === "scale" ? "⭐ " : "🚀 "}{plan.badge}
        </div>
      )}

      {/* Plan name + tagline */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: plan.highlighted ? "#E8B44A" : "#0D4F6B", marginBottom: 4 }}>
          {plan.name.toUpperCase()}
        </div>
        <div style={{ fontSize: 15, color: plan.highlighted ? "rgba(255,255,255,0.75)" : "#6b7280" }}>
          {plan.tagline}
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        {isFree ? (
          <span style={{ fontSize: 36, fontWeight: 800, color: plan.highlighted ? "#fff" : "#111827" }}>
            Free
          </span>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: plan.highlighted ? "rgba(255,255,255,0.7)" : "#6b7280", marginBottom: 6 }}>
              ₹
            </span>
            <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, color: plan.highlighted ? "#ffffff" : "#111827" }}>
              {plan.price.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 14, color: plan.highlighted ? "rgba(255,255,255,0.6)" : "#9ca3af", marginBottom: 6 }}>
              /mo
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1 }}>
        {plan.features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 10,
              fontSize: 14,
              color: plan.highlighted ? "rgba(255,255,255,0.88)" : "#374151",
            }}
          >
            <span style={{ color: plan.highlighted ? "#E8B44A" : "#0D4F6B", fontSize: 15, marginTop: 1, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        style={{
          width: "100%",
          padding: "13px 0",
          borderRadius: 10,
          border: plan.highlighted ? "none" : isFree ? "1.5px solid #0D4F6B" : "none",
          background: plan.highlighted
            ? "#E8B44A"
            : isFree
            ? "transparent"
            : "#0D4F6B",
          color: plan.highlighted ? "#0D4F6B" : isFree ? "#0D4F6B" : "#ffffff",
          fontSize: 15,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.2s",
          letterSpacing: "0.02em",
        }}
      >
        {plan.cta} {!isFree && "→"}
      </button>
    </div>
  );
}

// ── Checkout Modal ─────────────────────────────────────────────────────────────

function CheckoutModal({
  plan,
  onClose,
  onSuccess,
}: {
  plan: Plan;
  onClose: () => void;
  onSuccess: (tier: string) => void;
}): JSX.Element {
  const [name, setName]   = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]    = useState<string>("");

  const handlePay = useCallback(async (): Promise<void> => {
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load payment gateway. Please refresh and try again.");

      const data = await apiFetch<SubscribeResponse>("/api/host/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id:   plan.razorpayPlanId,
          plan_tier: plan.id,
          name:      name.trim(),
          email:     email.trim(),
        }),
      });

      const rzp = new window.Razorpay({
        key:             data.razorpay_key_id,
        subscription_id: data.subscription_id,
        name:            "WebinX",
        description:     `${plan.name} Plan — ₹${plan.price}/month`,
        image:           "https://www.webinx.in/logo-wordmark.png",
        prefill:         { name: name.trim(), email: email.trim() },
        theme:           { color: "#0D4F6B" },
        handler: async (response: RazorpayResponse): Promise<void> => {
          try {
            const verify = await apiFetch<VerifyResponse>("/api/host/subscribe/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id:      response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature:       response.razorpay_signature,
                email:                    email.trim(),
                plan_tier:                plan.id,
              }),
            });
            if (verify.status === "ok") {
              onSuccess(plan.id);
            } else {
              setError("Payment received but verification failed. Email us at contact@webinx.in.");
            }
          } catch {
            setError("Payment received but verification failed. Email us at contact@webinx.in.");
          }
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again or use a different payment method.");
        setLoading(false);
      });

      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [name, email, plan, onSuccess]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: 18, padding: "36px 32px",
          width: "100%", maxWidth: 440,
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0D4F6B", letterSpacing: "0.08em", marginBottom: 4 }}>
              UPGRADING TO
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>
              {plan.name} Plan
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>
              ₹{plan.price.toLocaleString("en-IN")}/month · billed monthly
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, color: "#6b7280" }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rajesh Agraval"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#0D4F6B"; }}
              onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#0D4F6B"; }}
              onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; }}
            />
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 10,
              background: loading ? "#9ca3af" : "#0D4F6B",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4, letterSpacing: "0.02em",
            }}
          >
            {loading ? "Processing…" : `Pay ₹${plan.price.toLocaleString("en-IN")}/mo — Secure Checkout →`}
          </button>

          <div style={{ textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
            🔒 Powered by Razorpay · Cancel anytime · No hidden fees
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────────

function SuccessScreen({ tier }: { tier: string }): JSX.Element {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
        You're on {tier.charAt(0).toUpperCase() + tier.slice(1)}!
      </h2>
      <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
        Your plan is now active. Submit your events and reach thousands of Indian knowledge seekers.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a
          href="/submit-webinar"
          style={{
            display: "inline-block", padding: "13px 28px",
            background: "#0D4F6B", color: "#fff", borderRadius: 10,
            fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}
        >
          Submit Your First Event →
        </a>
        <a
          href="/host"
          style={{
            display: "inline-block", padding: "13px 28px",
            background: "#f3f4f6", color: "#374151", borderRadius: 10,
            fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}
        >
          View Host Dashboard
        </a>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HostPlans(): JSX.Element {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [successTier, setSuccessTier]   = useState<string>("");
  const [payLoading, setPayLoading]     = useState<boolean>(false);

  // Pre-load Razorpay script in background on page mount
  useEffect(() => { loadRazorpayScript(); }, []);

  const handleSelect = useCallback((plan: Plan): void => {
    if (plan.id === "free") {
      window.location.href = "/submit-webinar";
      return;
    }
    setSelectedPlan(plan);
  }, []);

  const handleSuccess = useCallback((tier: string): void => {
    setSelectedPlan(null);
    setSuccessTier(tier);
  }, []);

  if (successTier) return <SuccessScreen tier={successTier} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Hero */}
      <div style={{ background: "#0D4F6B", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", background: "rgba(232,180,74,0.15)",
          border: "1px solid rgba(232,180,74,0.4)", borderRadius: 20,
          padding: "5px 14px", fontSize: 12, fontWeight: 700,
          color: "#E8B44A", letterSpacing: "0.08em", marginBottom: 20,
        }}>
          🚀 LAUNCH OFFER — Save 40% until June 15, 2026
        </div>

        <h1 style={{
          fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900,
          color: "#ffffff", margin: "0 0 12px", lineHeight: 1.15,
        }}>
          Grow Your Events with WebinX
        </h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          India's knowledge events marketplace. Get featured in front of thousands of professionals actively looking for webinars, podcasts & live events.
        </p>

        {/* Trust bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(16px,4vw,40px)",
          marginTop: 36, flexWrap: "wrap",
        }}>
          {[["165+", "Events Listed"], ["81+", "Active Hosts"], ["85+", "Upcoming Events"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#E8B44A" }}>{num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 20,
          alignItems: "stretch",
        }}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelect}
              loading={payLoading}
            />
          ))}
        </div>

        {/* FAQ strip */}
        <div style={{
          marginTop: 52, display: "flex", flexWrap: "wrap",
          gap: 20, justifyContent: "center",
        }}>
          {[
            ["💳", "Cancel anytime", "No lock-in. Cancel from your dashboard before next billing date."],
            ["🔒", "Secure payments", "All payments processed by Razorpay. WebinX never stores card details."],
            ["⚡", "Instant activation", "Your plan goes live the moment payment is confirmed."],
            ["📧", "Questions?", "Email contact@webinx.in — we reply within 4 hours."],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              style={{
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
                padding: "16px 20px", maxWidth: 240, flex: "1 1 200px",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
