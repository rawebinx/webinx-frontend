/**
 * UpgradeBanner.tsx — wouter v2 compatible (no useSearch)
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro", scale: "Scale", agency: "Agency",
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
  const [, navigate]          = useLocation();
  const [visible, setVisible] = useState(false);
  const [plan,    setPlan]    = useState<string>("pro");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      setPlan(params.get("plan") ?? "pro");
      setVisible(true);
      window.history.replaceState({}, "", "/host-tools");
    }
  }, []);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, 12_000);
    return () => clearTimeout(t);
  }, [visible, dismiss]);

  if (!visible) return null;

  const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES["pro"];
  const label    = PLAN_LABELS[plan]   ?? "Pro";

  return (
    <div role="alert" style={{ marginBottom:"2rem", borderRadius:16, border:"1px solid #6EE7B7", background:"linear-gradient(135deg,#ECFDF5 0%,#fff 100%)", overflow:"hidden", boxShadow:"0 1px 4px rgba(13,79,107,.08)" }}>
      <div style={{ height:4, background:"linear-gradient(90deg,#0D4F6B,#10B981)" }} />
      <div style={{ padding:"1.25rem 1.5rem" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#D1FAE5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎉</div>
            <div>
              <p style={{ margin:0, fontWeight:700, fontSize:15, color:"#064E3B" }}>Welcome to WebinX {label}!</p>
              <p style={{ margin:"2px 0 0", fontSize:12.5, color:"#047857" }}>Payment confirmed · Your plan is active right now</p>
            </div>
          </div>
          <button onClick={dismiss} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#6EE7B7", lineHeight:1, padding:0, flexShrink:0 }} aria-label="Dismiss">×</button>
        </div>
        <div style={{ marginTop:"1rem", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:8 }}>
          {features.map((f) => (
            <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:8, background:"rgba(255,255,255,.7)", borderRadius:8, padding:"6px 10px" }}>
              <span style={{ color:"#10B981", fontSize:12, marginTop:2, flexShrink:0 }}>✓</span>
              <span style={{ fontSize:12.5, color:"#374151" }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:".875rem", display:"flex", gap:16, alignItems:"center" }}>
          <a href="mailto:contact@webinx.in" style={{ fontSize:12.5, color:"#0D4F6B", textDecoration:"underline", fontWeight:600 }}>Questions? Email us →</a>
          <button onClick={dismiss} style={{ fontSize:12, color:"#9CA3AF", background:"none", border:"none", cursor:"pointer" }}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}
