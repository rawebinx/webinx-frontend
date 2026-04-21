import { Link } from "wouter";

export type Webinar = {
  id?: string;
  slug?: string;
  title?: string;
  host_name?: string;
  start_time?: string;
  url?: string;
  registration_url?: string;
  sector_name?: string;
  category_name?: string;
};

export function WebinarCard({ webinar }: { webinar: Webinar }) {
  const safeEvent = {
    title: webinar?.title || "Untitled",
    slug: webinar?.slug || "",
    host_name: webinar?.host_name || "Unknown Host",
    start_time: webinar?.start_time || "",
    url: webinar?.registration_url || webinar?.url || "#",
    sector_name: webinar?.sector_name || "General",
    category_name: webinar?.category_name || "",
  };

  const formattedDate =
    safeEvent.start_time && !isNaN(new Date(safeEvent.start_time).getTime())
      ? new Date(safeEvent.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Date not available";

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition bg-card">
      {safeEvent.slug ? (
        <Link href={`/webinar/${safeEvent.slug}`}>
          <div className="cursor-pointer hover:opacity-90 space-y-1">
            <h3 className="font-semibold text-base leading-snug line-clamp-2">
              {safeEvent.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              👤 {safeEvent.host_name}
            </p>
            <p className="text-sm text-muted-foreground">
              📅 {formattedDate}
            </p>
            {safeEvent.sector_name && (
              <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full">
                {safeEvent.sector_name}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <div className="space-y-1">
          <h3 className="font-semibold text-base">{safeEvent.title}</h3>
          <p className="text-sm text-muted-foreground">👤 {safeEvent.host_name}</p>
        </div>
      )}

      {safeEvent.url && safeEvent.url !== "#" && (
        <a
          href={safeEvent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline mt-3 inline-block"
        >
          Register / Visit →
        </a>
      )}
    </div>
  );
}
