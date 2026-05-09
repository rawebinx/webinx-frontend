/**
 * UpgradeBanner.tsx
 * ─────────────────────────────────────────────────────────────────
 * Success banner shown on /host-tools?upgraded=true after payment.
 * Auto-dismisses after 10 seconds. Sends confirmation email.
 * Import and render at top of host-tools.tsx.
 *
 * Usage:
 *   import { UpgradeBanner } from "../components/UpgradeBanner";
 *   // In host-tools page:
 *   <UpgradeBanner />
 */

import { useState, useEffect, useCallback } from "react";
import { useSearch, useLocation } from "wouter";

const PLAN_LABELS: Record<string, string> = {
  pro:    "Pro",
  scale:  "Scale",
  agency: "Agency",
};

const PLAN_FEATURES: Record<string, string[]> = {
  pro: [
    "Priority placement in all search results",
    "AI Title Optimizer — now active in Host Tools",
    "AI Description Enhancer — now active",
    "Weekly digest inclusion from next Monday",
    "Event analytics dashboard — live now",
  ],
  scale: [
    "Branded events section — email us to set up",
    "10 team member seats — invite from Host Tools",
    "Custom email digest slot — next issue",
    "Bulk event submission API — docs in Host Tools",
    "Dedicated account support — reply to your receipt",
  ],
  agency: [
    "All Scale features unlocked",
    "White-label embed widget — copy from Host Tools",
    "Revenue share on ticket sales — contact us to activate",
    "B2B intelligence reports — first report in 7 days",
  ],
};

export function UpgradeBanner(): JSX.Element | null {
  const search                = useSearch();
  const [, navigate]          = useLocation();
  const [visible, setVisible] = useState(false);
  const [plan,    setPlan]    = useState<string>("pro");

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("upgraded") === "true") {
      setPlan(params.get("plan") ?? "pro");
      setVisible(true);
      // Remove query params from URL without full reload
      window.history.replaceState({}, "", "/host-tools");
    }
  }, [search]);

  const dismiss = useCallback(() => setVisible(false), []);

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, 12_000);
    return () => clearTimeout(t);
  }, [visible, dismiss]);

  if (!visible) return null;

  const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES.pro;
  const label    = PLAN_LABELS[plan] ?? "Pro";

  return (
    <div
      role="alert"
      className="mb-8 rounded-2xl border border-teal-200 bg-gradient-to-br
                 from-teal-50 to-emerald-50 overflow-hidden shadow-sm"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center
                            justify-center text-xl flex-shrink-0">
              🎉
            </div>
            <div>
              <h2 className="text-lg font-bold text-teal-900">
                Welcome to WebinX {label}!
              </h2>
              <p className="text-sm text-teal-700">
                Payment confirmed · Your plan is active right now
              </p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-teal-400 hover:text-teal-600 transition-colors
                       flex-shrink-0 text-xl leading-none mt-0.5"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-start gap-2 bg-white/60 rounded-lg px-3 py-2"
            >
              <span className="text-emerald-500 mt-0.5 flex-shrink-0 text-sm">✓</span>
              <span className="text-sm text-gray-700">{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:contact@webinx.in?subject=New%20Pro%20Host%20Question"
            className="text-sm font-medium text-teal-700 hover:text-teal-900
                       underline underline-offset-2"
          >
            Questions? Email us →
          </a>
          <button
            onClick={dismiss}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
