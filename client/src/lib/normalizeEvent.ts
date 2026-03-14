export function normalizeEvent(e: any) {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,

    startTime: e.start_time,
    date: e.start_time,

    category: "Technology",

    attendees: 0,
    maxAttendees: 100,

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
