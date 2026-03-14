import { normalizeEvent } from "./normalizeEvent";

export async function fetchEvents() {
  const res = await fetch(
    "https://webinx-backend.onrender.com/api/events"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await res.json();

  return data
    .map(normalizeEvent)
    .sort(
      (a: any, b: any) =>
        new Date(a.startTime).getTime() -
        new Date(b.startTime).getTime()
    );
}
