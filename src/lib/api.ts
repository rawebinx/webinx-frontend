const API_BASE = "https://webinx-backend.onrender.com";

// ✅ ADD THIS
export async function getEvents(sector?: string) {
  try {
    const url = sector
      ? `${API_BASE}/api/events?sector=${sector}`
      : `${API_BASE}/api/events`;

    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("Events API error:", err);
    return [];
  }
}

// EXISTING (keep)
export async function getHost(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${slug}`);
    return await res.json();
  } catch (err) {
    console.error("Host API error:", err);
    return null;
  }
}

export async function getHostEvents(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/hosts/${slug}/events`);
    return await res.json();
  } catch (err) {
    console.error("Host events API error:", err);
    return [];
  }
}
