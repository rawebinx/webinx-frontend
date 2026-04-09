const API_BASE = "https://webinx-backend.onrender.com";

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
    const data = await res.json();

    console.log("API RAW RESPONSE:", data);

    return data;
  } catch (err) {
    console.error("Host events API error:", err);
    return { events: [] };
  }
}
