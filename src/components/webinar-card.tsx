import React from "react";

export type Webinar = {
  id?: string;
  title?: string;
  host?: string;
  start_time?: string;
  url?: string;
};

export function WebinarCard({ webinar }: { webinar: Webinar }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      
      <h3 className="font-semibold text-lg">
        {webinar?.title}
      </h3>

      <p className="text-sm text-gray-500">
        {webinar?.host}
      </p>

      <p className="text-sm">
        {webinar?.start_time}
      </p>

      {webinar?.url && (
        <a
          href={webinar.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline"
        >
          View Webinar
        </a>
      )}

    </div>
  );
}
