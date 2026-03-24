import React from "react";

export function Sheet({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SheetTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SheetContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4">
      {children}
    </div>
  );
}
