export function normalizeEvent(e: any) {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,

    startTime: e.start_time,
    date: e.start_time,

    category: e.category ?? "Technology",

    attendees: e.attendees ?? 0,
    maxAttendees: e.max_attendees ?? 100,

    isFree: e.is_free ?? true,
    price: e.price ?? 0,

    isTrending: e.is_trending ?? false,

    host: {
      id: e.host_id ?? "webinx",
      name: e.host_name ?? "WebinX",
      avatar: e.host_avatar ?? "",
      company: e.host_company ?? "WebinX"
    }
  };
}
