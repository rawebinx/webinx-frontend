// src/components/TodaySection.tsx
// "Happening Today" section for homepage.
// Add to home.tsx after the hero stats bar.
// Import: import { TodaySection } from "../components/TodaySection";

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { apiFetch } from "../lib/api";
import type { WebinarEvent } from "../lib/api";

function Countdown({ startTime }: { startTime: string }): JSX.Element {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function tick() {
      const diff = new Date(startTime).getTime() - Date.now();
      if (diff <= 0) { setLabel("Live now 🔴"); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setLabel(h > 0 ? `in ${h}h ${m}m` : `in ${m}m`);
    }
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [startTime]);

  return <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{label}</span>;
}

export function TodaySection(): JSX.Element | null {
  const [events, setEvents] = useState<WebinarEvent[]>([]);

  useEffect(() => {
    apiFetch<WebinarEvent[]>("/api/events?upcoming_only=true&limit=6&today_only=true")
      .catch(() => apiFetch<WebinarEvent[]>("/api/events?upcoming_only=true&limit=6"))
      .then(d => { if (Array.isArray(d) && d.length) setEvents(d.slice(0, 6)); })
      .catch(() => {});
  }, []);

  if (!events.length) return null;

  return (
    <section style={{ margin:"2rem 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#111827", display:"flex", alignItems:"center", gap:8 }}>
          <span>☀️</span> Today on WebinX
        </h2>
        <Link href="/webinars?upcoming=true" style={{ fontSize:13, color:"#0D4F6B", fontWeight:600 }}>View all →</Link>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {events.map(ev => (
          <a key={ev.slug} href={ev.external_url || "#"} target="_blank" rel="noopener noreferrer"
            style={{ display:"block", background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"14px 16px", textDecoration:"none", transition:"border-color .15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor="#0D4F6B")}
            onMouseLeave={e => (e.currentTarget.style.borderColor="#E5E7EB")}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#0D4F6B", background:"#E1F5EE", padding:"2px 8px", borderRadius:20 }}>
                {ev.sector || ev.content_type || "webinar"}
              </span>
              {ev.start_time && <Countdown startTime={ev.start_time} />}
            </div>
            <p style={{ margin:"0 0 6px", fontSize:14, fontWeight:700, color:"#111827", lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
              {ev.title}
            </p>
            <p style={{ margin:0, fontSize:12, color:"#6B7280" }}>{ev.host_name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
