import React from "react";

export function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b mb-4">{children}</div>;
}

export function TabsTrigger({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
      {children}
    </button>
  );
}

export function TabsContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-4">{children}</div>;
}
