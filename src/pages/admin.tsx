// src/pages/admin.tsx — WebinX Admin Dashboard v2
// Tabs: Overview · Subscribers · Hosts · Rewards · Pipeline

import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";

interface Stats {
  total_events: number; upcoming: number; total_leads: number;
  active_alerts: number; total_saves: number;
  pending_rewards: number; paid_featured: number; revenue_inr: number;
}
interface Lead { id: number; email: string; name: string; event_slug: string; utm_source: string; created_at: string; }
interface Host { id: number; name: string; email: string; slug: string; plan_tier: string; is_verified: boolean; created_at: string; }
interface PipelineRun { run_at: string; events_added: number; events_updated: number; events_skipped: number; events_failed: number; duration_seconds: number; }
interface Reward { id: number; host_name: string; host_email: string; mention_type: string; webinar_title: string; evidence_url: string; reward_tier: string; reward_days: number; status: string; created_at: string; }

type Tab = "overview" | "subscribers" | "hosts" | "rewards" | "pipeline";

const PLAN_COLORS: Record<string,string> = { free:"#6B7280", pro:"#0D4F6B", scale:"#7C3AED", agency:"#065F46" };
const PLAN_BG: Record<string,string>     = { free:"#F3F4F6", pro:"#E1F5EE", scale:"#EDE9FE", agency:"#D1FAE5" };
const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed,   setAuthed]   = useState(false);
  const [authErr,  setAuthErr]  = useState("");
  const [tab,      setTab]      = useState<Tab>("overview");
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [leads,    setLeads]    = useState<Lead[]>([]);
  const [hosts,    setHosts]    = useState<Host[]>([]);
  const [rewards,  setRewards]  = useState<Reward[]>([]);
  const [pipeline, setPipeline] = useState<PipelineRun[]>([]);
  const [loading,  setLoading]  = useState(false);

  const aFetch = useCallback(async (path: string, opts?: RequestInit) => {
    const res = await fetch(`${API}${path}`, { ...opts, headers: { "X-Admin-Key": password, "Content-Type": "application/json", ...(opts?.headers ?? {}) } });
    if (res.status === 401) { setAuthed(false); return null; }
    return res.json();
  }, [password]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const d = await aFetch("/api/admin/stats");
    setLoading(false);
    if (d && !d.error) { setAuthed(true); setStats(d); } else setAuthErr("Wrong password");
  }

  useEffect(() => {
    if (!authed) return;
    if (tab === "overview" && !stats) aFetch("/api/admin/stats").then(d => d && setStats(d));
    if (tab === "subscribers" && leads.length === 0) aFetch("/api/admin/leads").then(d => Array.isArray(d) && setLeads(d));
    if (tab === "hosts" && hosts.length === 0) aFetch("/api/hosts?limit=200").then(d => { const a = Array.isArray(d) ? d : d?.hosts ?? []; setHosts(a); });
    if (tab === "rewards" && rewards.length === 0) aFetch("/api/admin/rewards").then(d => Array.isArray(d) && setRewards(d));
    if (tab === "pipeline" && pipeline.length === 0) aFetch("/api/pipeline/status").then(d => Array.isArray(d) && setPipeline(d));
  }, [authed, tab]);

  const card: React.CSSProperties = { background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"1.25rem" };
  const th: React.CSSProperties   = { textAlign:"left", fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", padding:"8px 12px", borderBottom:"1px solid #F3F4F6" };
  const td: React.CSSProperties   = { padding:"10px 12px", fontSize:13, color:"#374151", borderBottom:"1px solid #F9FAFB" };

  if (!authed) return (
    <>
      <Helmet><title>Admin — WebinX</title></Helmet>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F9FAFB" }}>
        <form onSubmit={handleLogin} style={{ ...card, width:340, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🔐</div>
          <h1 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:"0 0 1.5rem" }}>WebinX Admin</h1>
          <input type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width:"100%", padding:"10px 14px", border:"1px solid #D1D5DB", borderRadius:8, fontSize:14, marginBottom:8, boxSizing:"border-box" }} />
          {authErr && <p style={{ color:"#EF4444", fontSize:12, margin:"0 0 8px" }}>{authErr}</p>}
          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:11, background:"#0D4F6B", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </>
  );

  const TABS: {id:Tab; label:string; emoji:string}[] = [
    {id:"overview", label:"Overview", emoji:"📊"},
    {id:"subscribers", label:"Subscribers", emoji:"📧"},
    {id:"hosts", label:"Hosts", emoji:"🏢"},
    {id:"rewards", label:"Rewards", emoji:"🎖"},
    {id:"pipeline", label:"Pipeline", emoji:"🔄"},
  ];

  return (
    <>
      <Helmet><title>Admin — WebinX</title></Helmet>
      <div style={{ minHeight:"100vh", background:"#F9FAFB" }}>
        <div style={{ background:"#0D4F6B", color:"#fff", padding:"1rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, fontSize:16 }}>⚡ WebinX Admin</span>
          <a href="/" style={{ color:"#93C5FD", fontSize:13 }}>← Site</a>
        </div>
        <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"0 1rem", display:"flex", gap:4, overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:"12px 14px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:400, color:tab===t.id?"#0D4F6B":"#6B7280", borderBottom:tab===t.id?"2px solid #0D4F6B":"2px solid transparent", whiteSpace:"nowrap" }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"1.5rem 1rem" }}>

          {tab === "overview" && stats && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
              {[
                {label:"Total Events",   value:stats.total_events,  icon:"📅"},
                {label:"Upcoming",       value:stats.upcoming,       icon:"🔜"},
                {label:"Subscribers",   value:stats.total_leads,    icon:"📧"},
                {label:"Saves",         value:stats.total_saves,    icon:"❤️"},
                {label:"Pending Rewards",value:stats.pending_rewards,icon:"🎖"},
                {label:"Revenue (₹)",   value:`₹${Math.round(stats.revenue_inr||0).toLocaleString()}`,icon:"💰"},
              ].map(s => (
                <div key={s.label} style={card}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#0D4F6B" }}>{s.value}</div>
                  <div style={{ fontSize:11, color:"#6B7280", fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "subscribers" && (
            <div style={card}>
              <p style={{ margin:"0 0 12px", fontWeight:700, fontSize:15 }}>📧 Subscribers ({leads.length})</p>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Email","Name","Source","Event","Joined"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {leads.length===0 && <tr><td colSpan={5} style={{...td,textAlign:"center",color:"#9CA3AF"}}>Loading…</td></tr>}
                  {leads.map(l=>(
                    <tr key={l.id}>
                      <td style={td}><a href={`mailto:${l.email}`} style={{color:"#0D4F6B",fontWeight:600}}>{l.email}</a></td>
                      <td style={td}>{l.name||"—"}</td>
                      <td style={td}>{l.utm_source||"direct"}</td>
                      <td style={{...td,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.event_slug||"—"}</td>
                      <td style={{...td,whiteSpace:"nowrap"}}>{l.created_at?new Date(l.created_at).toLocaleDateString("en-IN"):"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "hosts" && (
            <div style={card}>
              <p style={{ margin:"0 0 12px", fontWeight:700, fontSize:15 }}>🏢 Hosts ({hosts.length})</p>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Name","Email","Plan","Verified","Joined"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {hosts.length===0 && <tr><td colSpan={5} style={{...td,textAlign:"center",color:"#9CA3AF"}}>Loading…</td></tr>}
                  {hosts.map(h=>(
                    <tr key={h.id}>
                      <td style={{...td,fontWeight:600}}><a href={`/hosts/${h.slug}`} target="_blank" rel="noopener noreferrer" style={{color:"#0D4F6B"}}>{h.name}</a></td>
                      <td style={td}>{h.email?<a href={`mailto:${h.email}`} style={{color:"#0D4F6B"}}>{h.email}</a>:<span style={{color:"#9CA3AF"}}>—</span>}</td>
                      <td style={td}><span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:PLAN_BG[h.plan_tier]??"#F3F4F6",color:PLAN_COLORS[h.plan_tier]??"#374151"}}>{(h.plan_tier??"free").toUpperCase()}</span></td>
                      <td style={td}>{h.is_verified?"✅":"—"}</td>
                      <td style={{...td,whiteSpace:"nowrap"}}>{h.created_at?new Date(h.created_at).toLocaleDateString("en-IN"):"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "rewards" && (
            <div style={card}>
              <p style={{ margin:"0 0 12px", fontWeight:700, fontSize:15 }}>🎖 Rewards ({rewards.filter(r=>r.status==="pending").length} pending)</p>
              {rewards.length===0 ? <p style={{color:"#9CA3AF",fontSize:13}}>No rewards yet.</p>
                : rewards.map(r=>(
                  <div key={r.id} style={{border:"1px solid #E5E7EB",borderRadius:10,padding:"12px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div>
                      <p style={{margin:0,fontWeight:600,fontSize:13}}>{r.host_name} — <span style={{color:"#6B7280"}}>{r.host_email}</span></p>
                      <p style={{margin:"4px 0 0",fontSize:12,color:"#374151"}}>{r.webinar_title}</p>
                      <a href={r.evidence_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#0D4F6B"}}>View evidence →</a>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,background:r.status==="pending"?"#FEF3C7":"#D1FAE5",color:r.status==="pending"?"#92400E":"#065F46"}}>{r.status}</span>
                      {r.status==="pending" && <div style={{marginTop:8}}><button onClick={async()=>{ await aFetch(`/api/admin/rewards/${r.id}/approve`,{method:"POST"}); setRewards(x=>x.map(y=>y.id===r.id?{...y,status:"approved"}:y)); }} style={{padding:"5px 12px",background:"#0D4F6B",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>Approve</button></div>}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {tab === "pipeline" && (
            <div style={card}>
              <p style={{ margin:"0 0 12px", fontWeight:700, fontSize:15 }}>🔄 Pipeline Runs</p>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Run At (IST)","Added","Updated","Skipped","Failed","Duration"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {pipeline.length===0 && <tr><td colSpan={6} style={{...td,textAlign:"center",color:"#9CA3AF"}}>Loading…</td></tr>}
                  {pipeline.map((r,i)=>{
                    const ist = new Date(r.run_at).toLocaleString("en-IN",{timeZone:"Asia/Kolkata",dateStyle:"short",timeStyle:"short"});
                    return <tr key={i}>
                      <td style={{...td,whiteSpace:"nowrap"}}>{ist}</td>
                      <td style={{...td,color:r.events_added>0?"#065F46":"#374151",fontWeight:r.events_added>0?700:400}}>+{r.events_added}</td>
                      <td style={td}>{r.events_updated}</td>
                      <td style={td}>{r.events_skipped}</td>
                      <td style={{...td,color:r.events_failed>0?"#EF4444":"#374151"}}>{r.events_failed}</td>
                      <td style={td}>{Math.round(r.duration_seconds)}s</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
