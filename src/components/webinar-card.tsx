// src/components/webinar-card.tsx — WebinX Webinar Card v2
// Full redesign: sector colour accent, featured badge, countdown, register CTA.

import { Link } from "wouter";
import type { WebinarEvent } from "../lib/api";
import { formatShortDate, daysUntil, isUpcoming } from "../lib/api";

// ── Sector accent colours ──────────────────────────────────────────
const SECTOR_COLOR: Record<string, string> = {
  ai:         "#6366f1",  // indigo
  technology: "#3b82f6",  // blue
  finance:    "#10b981",  // emerald
  marketing:  "#f97316",  // orange
  startup:    "#8b5cf6",  // violet
  hr:         "#f43f5e",  // rose
  healthcare: "#14b8a6",  // teal
  education:  "#f59e0b",  // amber
  general:    "#94a3b8",  // slate
};

function sectorColor(slug: string): string {
  const key = (slug || "general").toLowerCase();
  return SECTOR_COLOR[key] ?? SECTOR_COLOR.general;
}

// ── Host initials avatar ───────────────────────────────────────────
function HostAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.03em" }}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 shrink-0"
    >
      {initials || "?"}
    </span>
  );
}

// ── Countdown badge ────────────────────────────────────────────────
function CountdownBadge({ startTime }: { startTime: string | null | undefined }) {
  if (!startTime) return null;
  const days = daysUntil(startTime);
  const upcoming = isUpcoming(startTime);

  if (!upcoming) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
        Ended
      </span>
    );
  }
  if (days === null) return null;
  if (days === 0) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
        Today
      </span>
    );
  }
  if (days === 1) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
        Tomorrow
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
        In {days} days
      </span>
    );
  }
  return null;
}

// ── Main card component ───────────────────────────────────────────
interface WebinarCardProps {
  webinar: Partial<WebinarEvent>;
  compact?: boolean;
}

export function WebinarCard({ webinar, compact = false }: WebinarCardProps) {
  const title        = webinar.title       || "Untitled Webinar";
  const slug         = webinar.slug        || "";
  const hostName     = webinar.host_name   || "Unknown Host";
  const startTime    = webinar.start_time  ?? null;
  const url          = webinar.registration_url || webinar.url || webinar.event_url || "#";
  const sectorName   = webinar.sector_name || "General";
  const sectorSlug   = webinar.sector_slug || "general";
  const isFeatured   = Boolean(webinar.is_featured);
  const isSponsored  = Boolean(webinar.is_sponsored);
  const sponsorCta   = webinar.sponsor_cta || "Register Now";
  const accent       = sectorColor(sectorSlug);
  const dateStr      = formatShortDate(startTime);
  const upcoming     = isUpcoming(startTime);

  // Clean tags — strip any HTML artifacts that slipped past pipeline
  const cleanTags = (webinar.tags || [])
    .filter((t) => t && typeof t === "string" && !t.startsWith("<") && !t.includes("="))
    .slice(0, 3);

  return (
    <div
      className={`relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${compact ? "text-xs" : ""}`}
      style={{ borderLeftWidth: "3px", borderLeftColor: accent }}
    >
      {/* Featured ribbon */}
      {isFeatured && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "#fef3c7", color: "#92400e" }}
        >
          <span style={{ fontSize: "11px" }}>⭐</span> Featured
        </div>
      )}

      {/* Sponsored label */}
      {isSponsored && !isFeatured && (
        <div className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
          Sponsored
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Sector + countdown row */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`/sector/${sectorSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium px-2 py-0.5 rounded-full transition-colors hover:opacity-80"
            style={{ background: `${accent}18`, color: accent }}
          >
            {sectorName}
          </a>
          <CountdownBadge startTime={startTime} />
        </div>

        {/* Title */}
        {slug ? (
          <Link href={`/webinar/${slug}`}>
            <h3
              className={`font-semibold text-gray-900 leading-snug line-clamp-2 cursor-pointer hover:text-purple-700 transition-colors ${compact ? "text-sm" : "text-base"}`}
            >
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className={`font-semibold text-gray-900 leading-snug line-clamp-2 ${compact ? "text-sm" : "text-base"}`}>
            {title}
          </h3>
        )}

        {/* Host + date */}
        <div className="flex flex-col gap-1 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <HostAvatar name={hostName} />
            <span className="truncate">{hostName}</span>
          </div>
          {dateStr && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-400">📅</span>
              <span>{dateStr}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {cleanTags.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1">
            {cleanTags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA footer */}
      {url && url !== "#" && (
        <div className="px-4 pb-4">
          {isSponsored ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-semibold py-2 px-3 rounded-lg transition-colors text-white"
              style={{ background: accent }}
            >
              {sponsorCta}
            </a>
          ) : slug ? (
            <Link href={`/webinar/${slug}`}>
              <span
                className="block w-full text-center text-sm font-medium py-2 px-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50"
                style={{ borderColor: `${accent}60`, color: accent }}
              >
                {upcoming ? "View & Register →" : "View Details →"}
              </span>
            </Link>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-medium py-2 px-3 rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: `${accent}60`, color: accent }}
            >
              {upcoming ? "Register →" : "View Details →"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
