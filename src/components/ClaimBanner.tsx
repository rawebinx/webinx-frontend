// src/components/ClaimBanner.tsx
// Shows on event cards/pages when host hasn't registered yet.
// Usage: <ClaimBanner hostName="NASSCOM Community" />

import { useState, useCallback } from "react";
import { apiFetch } from "../lib/api";

interface Props { hostName: string; }

export function ClaimBanner({ hostName }: Props): JSX.Element | null {
  const [step, setStep]   = useState<"idle"|"form"|"done"|"err">("idle");
  const [email, setEmail] = useState("");
  const [busy,  setBusy]  = useState(false);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await apiFetch("/api/hosts/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: hostName, email: email.trim(), plan_tier: "free" }),
      });
      setStep("done");
    } catch {
      setStep("err");
    } finally { setBusy(false); }
  }, [email, hostName]);

  if (step === "idle") return (
    <div style={{ background:"#FEF3C7", border:"1px solid #E8B44A", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
      <p style={{ margin:0, fontSize:13, color:"#92400E", fontWeight:600 }}>
        🏷️ Are you <strong>{hostName}</strong>? Claim this listing free.
      </p>
      <button onClick={() => setStep("form")}
        style={{ padding:"6px 16px", background:"#E8B44A", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", color:"#fff", whiteSpace:"nowrap" }}>
        Claim →
      </button>
    </div>
  );

  if (step === "done") return (
    <div style={{ background:"#D1FAE5", border:"1px solid #10B981", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#065F46", fontWeight:600 }}>
      ✅ Claimed! Check your email to activate your free host account.
    </div>
  );

  if (step === "err") return (
    <div style={{ background:"#FEE2E2", border:"1px solid #EF4444", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#991B1B" }}>
      Something went wrong. Email <a href="mailto:contact@webinx.in" style={{ color:"#991B1B" }}>contact@webinx.in</a> to claim manually.
    </div>
  );

  // step === "form"
  return (
    <form onSubmit={submit} style={{ background:"#FFFBEB", border:"1px solid #E8B44A", borderRadius:10, padding:"12px 14px" }}>
      <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#92400E" }}>
        🏷️ Claim <strong>{hostName}</strong> listing
      </p>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"8px 12px", border:"1px solid #D1D5DB", borderRadius:8, fontSize:13 }} />
        <button type="submit" disabled={busy}
          style={{ padding:"8px 18px", background:"#0D4F6B", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          {busy ? "Sending…" : "Claim Free"}
        </button>
        <button type="button" onClick={() => setStep("idle")}
          style={{ padding:"8px 12px", background:"none", border:"1px solid #D1D5DB", borderRadius:8, fontSize:13, cursor:"pointer", color:"#6B7280" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
