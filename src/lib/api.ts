const API_BASE = "https://webinx-backend.onrender.com";

// =========================
// EVENTS LIST
// =========================
export async function getEvents(sector?: string) {
  try {
    const url = sector
      ? `${API_BASE}/api/events?sector=${sector}`
      : `${API_BASE}/api/events`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("Events API failed:", res.status);
      return [];
    }

    const data = await res.json();

    // ✅ STRICT NORMALIZATION (IMPORTANT)
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (err) {
    console.error("Events API error:", err);
    return [];
  }
}

// =========================
// SINGLE EVENT
// =========================
export async function getEventBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${slug}`);

    if (!res.ok) {
      console.error("Event API failed:", res.status);
      return null;
    }

    const data = await res.json();

    // ✅ STRICT NORMALIZATION
    if (data && data.title) {
      return data;
    }

    return null;
  } catch (err) {
    console.error("Event API error:", err);
    return null;
  }
}

// =========================
// HOST (OPTIONAL - KEEP SAFE)
// =========================
export async function getHost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${slug}`);

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("Host API error:", err);
    return null;
  }
}

export async function getHostEvents(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${slug}/events`);

    if (!res.ok) return [];

    return await res.json();
  } catch (err) {
    console.error("Host events API error:", err);
    return [];
  }
}
