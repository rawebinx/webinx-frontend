import React from "react";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute mt-2 bg-white border rounded shadow-md p-2">
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">
      {children}
    </div>
  );
}
