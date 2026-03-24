import React from "react";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="border rounded p-2 text-sm w-full">
      {props.children}
    </select>
  );
}
