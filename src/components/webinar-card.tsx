import { Link } from "wouter";

export type Webinar = {
  id?: string;
  slug?: string;
  title?: string;
  host?: string;
  start_time?: string;
  url?: string;
};

export function WebinarCard({ webinar }: { webinar: Webinar }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">

      {/* CLICKABLE CARD */}
      {webinar?.slug ? (
        <Link href={`/webinar/${webinar.slug}`}>
          <div className="cursor-pointer hover:opacity-90">

            <h3 className="font-semibold text-lg">
              {webinar?.title}
            </h3>

            <p className="text-sm text-gray-500">
              {webinar?.host}
            </p>

            <p className="text-sm">
              {webinar?.start_time}
            </p>

          </div>
        </Link>
      ) : (
        <div>
          <h3 className="font-semibold text-lg">
            {webinar?.title}
          </h3>
        </div>
      )}

      {/* EXTERNAL LINK */}
      {webinar?.url && (
        <a
          href={webinar.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline mt-2 inline-block"
        >
          Visit Source
        </a>
      )}

    </div>
  );
}
