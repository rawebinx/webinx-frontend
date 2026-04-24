// src/components/navbar.tsx — WebinX Navbar v2
// Wishlist count, leaderboard, hosts, AI search link.

import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { getWishlist } from "../lib/api";

export function Navbar() {
  const [location]         = useLocation();
  const [open, setOpen]    = useState(false);
  const [wishCount, setWishCount] = useState(0);

  // Update wishlist count from localStorage
  useEffect(() => {
    function updateCount() {
      setWishCount(getWishlist().length);
    }
    updateCount();
    // Re-check on focus (user may have changed wishlist on another tab)
    window.addEventListener("focus", updateCount);
    return () => window.removeEventListener("focus", updateCount);
  }, []);

  const isActive = (href: string) =>
    location === href ? "text-purple-600" : "text-gray-600 hover:text-gray-900";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-purple-600 tracking-tight shrink-0">
          WebinX
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/webinars" className={`text-sm font-medium transition-colors ${isActive("/webinars")}`}>
            Webinars
          </Link>
          <Link href="/top-hosts" className={`text-sm font-medium transition-colors ${isActive("/top-hosts")}`}>
            🏆 Leaderboard
          </Link>
          <Link href="/host" className={`text-sm font-medium transition-colors ${isActive("/host")}`}>
            Hosts
          </Link>
          <Link href="/about" className={`text-sm font-medium transition-colors ${isActive("/about")}`}>
            About
          </Link>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1"
            title="Saved webinars"
          >
            <svg viewBox="0 0 24 24" width="16" height="16"
              fill={wishCount > 0 ? "#ef4444" : "none"}
              stroke={wishCount > 0 ? "#ef4444" : "currentColor"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishCount > 0 && (
              <span className="text-xs font-bold text-red-500">{wishCount}</span>
            )}
          </Link>

          {/* AI Search */}
          <Link
            href="/ai-search"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition ${
              location === "/ai-search"
                ? "border-purple-400 bg-purple-50 text-purple-700"
                : "border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700"
            }`}
          >
            🔍 AI Search
          </Link>

          {/* CTA */}
          <Link
            href="/get-featured"
            className="text-sm font-semibold bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
          >
            Get Featured →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
          {[
            { label: "Webinars",        href: "/webinars"       },
            { label: "🏆 Leaderboard",  href: "/top-hosts"      },
            { label: "Hosts",           href: "/host"           },
            { label: "🔍 AI Search",    href: "/ai-search"      },
            { label: `❤️ Saved (${wishCount})`, href: "/wishlist" },
            { label: "⭐ Get Featured", href: "/get-featured"   },
            { label: "🎤 Claim Reward", href: "/mention-webinx" },
            { label: "About",           href: "/about"          },
            { label: "Contact",         href: "/contact"        },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-purple-600 transition py-0.5"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
