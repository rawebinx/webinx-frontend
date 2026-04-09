const API_BASE = "https://webinx-backend.onrender.com";

export async function getHost(slug: string) {
  const res = await fetch(`${API_BASE}/api/hosts/${slug}`);
  return res.json();
}

export async function getHostEvents(slug: string) {
  const res = await fetch(`${API_BASE}/api/hosts/${slug}/events`);
  return res.json();
}
