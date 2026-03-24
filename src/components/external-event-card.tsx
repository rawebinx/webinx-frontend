import React from "react";

export type ExternalEvent = {
  title?: string;
  host?: string;
  source?: string;
  start_time?: string;
  url?: string;
};

export function ExternalEventCard({ event }: { event: ExternalEvent }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{event?.title}</h3>

      <p className="text-sm text-gray-500">
        {event?.host || event?.source}
      </p>

      <p className="text-sm">{event?.start_time}</p>

      {event?.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline"
        >
          View Event
        </a>
      )}
    </div>
  );
}
