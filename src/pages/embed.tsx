// src/pages/embed.tsx — WebinX Embed Widget
// Minimal layout for embedding on host websites via iframe.
// No navbar/footer — standalone display.

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { formatShortDate, isUpcoming } from "../lib/api";
import type { WebinarEvent } from "../lib/api";

interface EmbedData {
  host: { slug: string; name: string } | null;
  events: WebinarEvent[];
}

export default function EmbedPage() {
  const [, params]    = useRoute("/embed/:slug");
  const slug          = params?.slug || "";
  const [data, setData]     = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(true);

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/api/embed/${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#ffffff",
      padding: "0",
      margin: "0",
      minHeight: "100%",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #7c3aed, #6366f1)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: "#e0d9ff", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
            {data?.host?.name || "Upcoming Webinars"}
          </div>
          <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600, marginTop: "1px" }}>
            Upcoming Events
          </div>
        </div>
        <a
          href="https://www.webinx.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#c4b5fd", fontSize: "10px", textDecoration: "none" }}
        >
          Powered by WebinX ↗
        </a>
      </div>

      {/* Events */}
      <div style={{ padding: "8px 0" }}>
        {loading && (
          <div style={{ padding: "20px 16px", color: "#9ca3af", fontSize: "13px", textAlign: "center" }}>
            Loading…
          </div>
        )}

        {!loading && (!data?.events || data.events.length === 0) && (
          <div style={{ padding: "20px 16px", textAlign: "center" }}>
            <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "8px" }}>
              No upcoming webinars yet.
            </div>
            <a
              href="https://www.webinx.in/webinars"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#7c3aed", fontSize: "12px", textDecoration: "none" }}
            >
              Browse all webinars →
            </a>
          </div>
        )}

        {data?.events?.map((event, i) => {
          const dateStr = formatShortDate(event.start_time);
          const upcoming = isUpcoming(event.start_time);
          const url = event.registration_url || event.url || event.event_url || "#";
          const detailUrl = `https://www.webinx.in/webinar/${event.slug}`;

          return (
            <div key={event.slug || i} style={{
              padding: "12px 16px",
              borderBottom: i < (data.events.length - 1) ? "1px solid #f3f4f6" : "none",
            }}>
              {/* Sector badge */}
              {event.sector_name && event.sector_name !== "General" && (
                <div style={{
                  display: "inline-block",
                  background: "#f3f0ff",
                  color: "#7c3aed",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: "10px",
                  marginBottom: "5px",
                }}>
                  {event.sector_name}
                </div>
              )}

              {/* Title */}
              <a
                href={detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#111827",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  lineHeight: "1.3",
                  marginBottom: "4px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                } as any}
              >
                {event.title}
              </a>

              {/* Host + Date */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                {event.host_name && (
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>👤 {event.host_name}</span>
                )}
                {dateStr && (
                  <span style={{ color: "#9ca3af", fontSize: "11px" }}>📅 {dateStr}</span>
                )}
              </div>

              {/* CTA */}
              {url && url !== "#" && upcoming && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: "#7c3aed",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "5px 12px",
                    borderRadius: "6px",
                    textDecoration: "none",
                  }}
                >
                  Register →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {data?.host && (
        <div style={{
          padding: "8px 16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <a
            href={`https://www.webinx.in/hosts/${data.host.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#7c3aed", fontSize: "11px", textDecoration: "none" }}
          >
            View all events →
          </a>
          <a
            href="https://www.webinx.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#d1d5db", fontSize: "10px", textDecoration: "none" }}
          >
            WebinX.in
          </a>
        </div>
      )}
    </div>
  );
}
