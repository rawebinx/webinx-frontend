import React from "react";

export default function WebinarCard({ webinar }: any) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{webinar?.title}</h3>
      <p className="text-sm text-gray-500">{webinar?.host}</p>
      <p className="text-sm">{webinar?.start_time}</p>
    </div>
  );
}
