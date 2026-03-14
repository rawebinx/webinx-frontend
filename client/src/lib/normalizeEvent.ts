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

    isFree: true,
    price: 0,

    isTrending: false,

    host: {
      id: "webinx",
      name: "WebinX",
      avatar: "",
      company: "WebinX"
    }
  };
}
