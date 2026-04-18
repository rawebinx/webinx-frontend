const API_BASE = "https://webinx-backend.onrender.com";

// =========================
// GET ALL EVENTS
// =========================
export async function getEvents(sector?: string) {
  try {
    const url = sector
      ? `${API_BASE}/api/events?sector=${sector}`
      : `${API_BASE}/api/events`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch events");

    return await res.json();
  } catch (err) {
    console.error("Events API error:", err);
    return [];
  }
}

// =========================
// GET SINGLE EVENT (CRITICAL FIX)
// =========================
export async function getEventBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${slug}`);
    return await res.json();
  } catch (err) {
    console.error("Event API error:", err);
    return null;
  }
}

// =========================
// HOST APIs (KEEP SAFE)
// =========================
export async function getHost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${slug}`);

    if (!res.ok) throw new Error("Host fetch failed");

    return await res.json();
  } catch (err) {
    console.error("Host API error:", err);
    return null;
  }
}

export async function getHostEvents(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${slug}/events`);

    if (!res.ok) throw new Error("Host events failed");

    return await res.json();
  } catch (err) {
    console.error("Host events API error:", err);
    return [];
  }
}
