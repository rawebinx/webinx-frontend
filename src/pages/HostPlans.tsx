import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../lib/api";

async function hostFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastError ?? new Error("Request failed");
}

// ── Plan data ─────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    razorpayPlanId: null as string | null,
    tagline: "Get discovered",
    badge: null as string | null,
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
    id: "pro" as const,
    name: "Pro",
    price: 299,
    razorpayPlanId: "plan_SiSCYOPw71rhfV" as string | null,
    tagline: "Grow your audience",
    badge: "Launch Offer" as string | null,
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
    id: "scale" as const,
    name: "Scale",
    price: 799,
    razorpayPlanId: "plan_SiSD5gjqmaSGpa" as string | null,
    tagline: "Built for serious hosts",
    badge: "Most Popular" as string | null,
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
    id: "agency" as const,
    name: "Agency",
    price: 1999,
    razorpayPlanId: "plan_SiSDbwxhLMC2Sa" as string | null,
    tagline: "For teams & enterprises",
    badge: "Best Value" as string | null,
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

type Plan = typeof PLANS[number];

// ── Razorpay loader (no global declaration needed) ────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({ plan, onSelect, loading }: {
  plan: Plan;
  onSelect: (p: Plan) => void;
  loading: boolean;
}) {
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
    >
      {plan.badge && (
        <div style={{
          position: "absolute", top: -13, left: "50%",
          transform: "translateX(-50%)",
          background: plan.highlighted ? "#E8B44A" : "#0D4F6B",
          color: plan.highlighted ? "#0D4F6B" : "#ffffff",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
          padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap",
        }}>
          {plan.badge}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: plan.highlighted ? "#E8B44A" : "#0D4F6B", marginBottom: 4 }}>
          {plan.name.toUpperCase()}
        </div>
        <div style={{ fontSize: 15, color: plan.highlighted ? "rgba(255,255,255,0.75)" : "#6b7280" }}>
          {plan.tagline}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        {isFree ? (
          <span style={{ fontSize: 36, fontWeight: 800, color: plan.highlighted ? "#fff" : "#111827" }}>Free</span>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: plan.highlighted ? "rgba(255,255,255,0.7)" : "#6b7280", marginBottom: 6 }}>₹</span>
            <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, color: plan.highlighted ? "#ffffff" : "#111827" }}>
              {plan.price.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 14, color: plan.highlighted ? "rgba(255,255,255,0.6)" : "#9ca3af", marginBottom: 6 }}>/mo</span>
          </div>
        )}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1 }}>
        {plan.features.map((f) => (
          <li key={f} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            marginBottom: 10, fontSize: 14,
            color: plan.highlighted ? "rgba(255,255,255,0.88)" : "#374151",
          }}>
            <span style={{ color: plan.highlighted ? "#E8B44A" : "#0D4F6B", fontSize: 15, marginTop: 1, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        style={{
          width: "100%", padding: "13px 0", borderRadius: 10,
          border: isFree && !plan.highlighted ? "1.5px solid #0D4F6B" : "none",
          background: plan.highlighted ? "#E8B44A" : isFree ? "transparent" : "#0D4F6B",
          color: plan.highlighted ? "#0D4F6B" : isFree ? "#0D4F6B" : "#ffffff",
          fontSize: 15, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          letterSpacing: "0.02em",
        }}
      >
        {plan.cta}{!isFree && " →"}
      </button>
    </div>
  );
}

// ── Checkout Modal ─────────────────────────────────────────────────────────────

function CheckoutModal({ plan, onClose, onSuccess }: {
  plan: Plan;
  onClose: () => void;
  onSuccess: (tier: string) => void;
}) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handlePay = useCallback(async () => {
    if (!name.trim() || !email.trim()) { setError("Please enter your name and email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email."); return; }

    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load payment gateway. Please refresh.");

      const data = await hostFetch<{ subscription_id: string; razorpay_key_id: string }>(
        "/api/host/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_id: plan.razorpayPlanId, plan_tier: plan.id, name: name.trim(), email: email.trim() }),
        }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key:             data.razorpay_key_id,
        subscription_id: data.subscription_id,
        name:            "WebinX",
        description:     `${plan.name} Plan — ₹${plan.price}/month`,
        image:           "https://www.webinx.in/logo-wordmark.png",
        prefill:         { name: name.trim(), email: email.trim() },
        theme:           { color: "#0D4F6B" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            const verify = await hostFetch<{ status: string; plan_tier: string }>(
              "/api/host/subscribe/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id:      response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature:       response.razorpay_signature,
                  email: email.trim(), plan_tier: plan.id,
                }),
              }
            );
            if (verify.status === "ok") onSuccess(plan.id);
            else setError("Payment received but verification failed. Email contact@webinx.in.");
          } catch {
            setError("Payment received but verification failed. Email contact@webinx.in.");
          }
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [name, email, plan, onSuccess]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 18, padding: "36px 32px",
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0D4F6B", letterSpacing: "0.08em", marginBottom: 4 }}>UPGRADING TO</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{plan.name} Plan</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>₹{plan.price.toLocaleString("en-IN")}/month · billed monthly</div>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, color: "#6b7280" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(["Your Name", "Email Address"] as const).map((label) => {
            const isEmail = label === "Email Address";
            return (
              <div key={label}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
                <input
                  type={isEmail ? "email" : "text"}
                  value={isEmail ? email : name}
                  onChange={(e) => isEmail ? setEmail(e.target.value) : setName(e.target.value)}
                  placeholder={isEmail ? "you@company.com" : "Your name"}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10,
                    border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            );
          })}

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
              cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
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

// ── Success ───────────────────────────────────────────────────────────────────

function SuccessScreen({ tier }: { tier: string }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
        You're on {tier.charAt(0).toUpperCase() + tier.slice(1)}!
      </h2>
      <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 380, margin: "0 auto 32px" }}>
        Your plan is now active. Submit your events and reach thousands of Indian knowledge seekers.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/submit-webinar" style={{ display: "inline-block", padding: "13px 28px", background: "#0D4F6B", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
          Submit Your First Event →
        </a>
        <a href="/host" style={{ display: "inline-block", padding: "13px 28px", background: "#f3f4f6", color: "#374151", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
          View Host Dashboard
        </a>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HostPlans() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [successTier, setSuccessTier]   = useState("");

  useEffect(() => { loadRazorpayScript(); }, []);

  const handleSelect = useCallback((plan: Plan) => {
    if (plan.id === "free") { window.location.href = "/submit-webinar"; return; }
    setSelectedPlan(plan);
  }, []);

  const handleSuccess = useCallback((tier: string) => {
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
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: "#ffffff", margin: "0 0 12px", lineHeight: 1.15 }}>
          Grow Your Events with WebinX
        </h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          India's knowledge events marketplace. Get featured in front of thousands of professionals actively looking for webinars, podcasts & live events.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px,4vw,40px)", marginTop: 36, flexWrap: "wrap" }}>
          {[["165+", "Events Listed"], ["81+", "Active Hosts"], ["85+", "Upcoming Events"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#E8B44A" }}>{num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} loading={false} />
          ))}
        </div>

        {/* Trust strip */}
        <div style={{ marginTop: 52, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
          {[
            ["💳", "Cancel anytime", "No lock-in. Cancel before next billing date."],
            ["🔒", "Secure payments", "Processed by Razorpay. We never store card details."],
            ["⚡", "Instant activation", "Plan goes live the moment payment is confirmed."],
            ["📧", "Questions?", "Email contact@webinx.in — reply within 4 hours."],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", maxWidth: 240, flex: "1 1 200px" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
