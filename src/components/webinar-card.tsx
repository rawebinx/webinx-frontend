import { Link } from "wouter";

export type Webinar = {
  id?: string;
  slug?: string;
  title?: string;
  host?: string;
  start_time?: string;
  url?: string;
  registration_url?: string; // ✅ IMPORTANT
};

export function WebinarCard({ webinar }: { webinar: Webinar }) {
  
  // ✅ FORMAT DATE SAFELY
  const formattedDate =
    webinar?.start_time &&
    !isNaN(new Date(webinar.start_time).getTime())
      ? new Date(webinar.start_time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      : "Date not available";

  // ✅ HANDLE URL CORRECTLY
  const eventUrl = webinar?.registration_url || webinar?.url;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">

      {/* CLICKABLE CARD */}
      {webinar?.slug ? (
        <Link href={`/webinar/${webinar.slug}`}>
          <div className="cursor-pointer hover:opacity-90">

            <h3 className="font-semibold text-lg">
              {webinar?.title || "Untitled Webinar"}
            </h3>

            {webinar?.host && (
              <p className="text-sm text-gray-500">
                {webinar.host}
              </p>
            )}

            <p className="text-sm text-gray-600">
              📅 {formattedDate}
            </p>

          </div>
        </Link>
      ) : (
        <div>
          <h3 className="font-semibold text-lg">
            {webinar?.title || "Untitled Webinar"}
          </h3>
        </div>
      )}

      {/* EXTERNAL LINK */}
      {eventUrl && (
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline mt-2 inline-block"
        >
          Visit Source →
        </a>
      )}

    </div>
  );
}
