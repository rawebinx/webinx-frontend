import React from "react";

export function Form({ children }: { children: React.ReactNode }) {
  return <form className="space-y-4">{children}</form>;
}

export function FormField({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

export function FormMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}
