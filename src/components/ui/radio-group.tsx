import React from "react";

export function RadioGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3">{children}</div>;
}

export function RadioGroupItem(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="radio" {...props} />;
}
