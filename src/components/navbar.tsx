import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Video, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/webinars", label: "Browse" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Video className="w-4 h-4 text-primary-foreground" />
              </div>

              {/* ✅ FIXED BETA LABEL */}
              <span className="text-xl font-bold tracking-tight">
                Webin<span className="text-primary">X</span>{" "}
                <span style={{ fontSize: "12px" }}>(Beta)</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}>
                <Button
                  variant={location === l.href ? "secondary" : "ghost"}
                  size="sm"
                >
                  {l.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t py-3 flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location === l.href ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  {l.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}