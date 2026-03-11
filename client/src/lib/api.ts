export async function fetchEvents() {
  const res = await fetch("https://webinx-backend.onrender.com/api/events");
  const data = await res.json();
  return data.map(normalizeEvent);
}
