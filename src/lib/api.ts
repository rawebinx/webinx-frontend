const API_BASE = "https://webinx-backend.onrender.com";

export type WebinarEvent = {
  id?: string;
  slug: string;
  title: string;
  host_name?: string;
  start_time?: string;
  url?: string;
  registration_url?: string;
  sector_name?: string;
  category_name?: string;
};

function normalizeEvent(e: any): WebinarEvent {
  return {
    id: e.id || undefined,
    slug: e.slug || "",
    title: e.title || "Untitled",
    host_name: e.host_name || "Unknown",
    start_time: e.start_time || "",
    url: e.url || "#",
    registration_url: e.registration_url || undefined,
    sector_name: e.sector_name || "General",
    category_name: e.category_name || undefined,
  };
}

// =========================
// EVENTS LIST
// =========================
export async function getEvents(sector?: string): Promise<WebinarEvent[]> {
  try {
    const url = sector
      ? `${API_BASE}/api/events?sector=${encodeURIComponent(sector)}`
      : `${API_BASE}/api/events`;

    console.log("[WebinX] Fetching events from:", url);

    const res = await fetch(url);
    console.log("[WebinX] API STATUS:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("[WebinX] API ERROR BODY:", text);
      return [];
    }

    const data = await res.json();
    console.log("[WebinX] Events API response:", data);

    if (!Array.isArray(data)) {
      console.warn("[WebinX] Unexpected shape — expected array, got:", typeof data, data);
      return [];
    }

    const normalized = data
      .filter((e: any) => e && e.slug && e.title)
      .map(normalizeEvent);

    console.log(`[WebinX] Loaded ${normalized.length} events`);
    return normalized;
  } catch (err) {
    console.error("[WebinX] Events API error:", err);
    return [];
  }
}

// =========================
// SINGLE EVENT
// =========================
export async function getEventBySlug(slug: string): Promise<WebinarEvent | null> {
  try {
    const url = `${API_BASE}/api/events/${encodeURIComponent(slug)}`;
    console.log("[WebinX] Fetching single event:", url);

    const res = await fetch(url);
    console.log("[WebinX] Event API STATUS:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("[WebinX] Event API ERROR BODY:", text);
      return null;
    }

    const data = await res.json();
    console.log("[WebinX] Single event response:", data);

    if (data && data.title) return normalizeEvent(data);

    console.warn("[WebinX] Event API: missing title", data);
    return null;
  } catch (err) {
    console.error("[WebinX] Event API error:", err);
    return null;
  }
}

// =========================
// HOST
// =========================
export async function getHost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${encodeURIComponent(slug)}`);
    console.log("[WebinX] Host API STATUS:", res.status);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[WebinX] Host API error:", err);
    return null;
  }
}

export async function getHostEvents(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${encodeURIComponent(slug)}/events`);
    console.log("[WebinX] Host events API STATUS:", res.status);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("[WebinX] Host events API error:", err);
    return [];
  }
}
