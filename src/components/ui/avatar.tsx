import React from "react";

export function Avatar({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
          ?
        </div>
      )}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src?: string; alt?: string }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
      {children}
    </div>
  );
}
