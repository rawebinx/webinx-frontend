const API_BASE = "https://webinx-backend.onrender.com";

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

export async function getEventBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${slug}`);
    return await res.json();
  } catch (err) {
    console.error("Event API error:", err);
    return null;
  }
}
