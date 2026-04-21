import { useState, useEffect } from "react";

import { WebinarCard, type Webinar } from "@/components/webinar-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Zap, RefreshCw } from "lucide-react";

const API_BASE = "https://webinx-backend.onrender.com";

function normalizeEvent(e: any): Webinar {
  return {
    id: e.id || undefined,
    slug: e.slug || "",
    title: e.title || "Untitled",
    host_name: e.host_name || "Unknown",
    start_time: e.start_time || "",
    url: e.url || "#",
    registration_url: e.registration_url || undefined,
    sector_name: e.sector_name || "General",
    category_name: e.category_name || undefined,
  };
}

function WebinarSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export default function WebinarsPage() {
  const [events, setEvents] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/api/events`;
      console.log("[WebinX] Fetching:", url);

      const res = await fetch(url);
      console.log("[WebinX] API STATUS:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("[WebinX] API ERROR BODY:", text);
        throw new Error(`API returned ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      console.log("[WebinX] Events API response:", data);

      if (!Array.isArray(data)) {
        console.warn("[WebinX] Expected array, got:", typeof data);
        setEvents([]);
        return;
      }

      const normalized = data
        .filter((e: any) => e && e.slug && e.title)
        .map(normalizeEvent);

      console.log(`[WebinX] Rendered ${normalized.length} events`);
      setEvents(normalized);
    } catch (err: any) {
      console.error("[WebinX] Fetch failed:", err);
      setError(err?.message || "Failed to load webinars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ HARD FAIL UI — no blank screen ever
  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="border-b bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Browse Webinars</h1>
            <p className="text-muted-foreground mt-1">Loading webinars...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <WebinarSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="border-b bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Browse Webinars</h1>
            <p className="text-muted-foreground mt-1 text-red-500">Failed to load webinars</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-700">Could not load webinars</p>
              <p className="text-red-600 text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={fetchEvents}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!events.length) {
    return (
      <main className="min-h-screen">
        <div className="border-b bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Browse Webinars</h1>
            <p className="text-muted-foreground mt-1">No webinars found</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center py-16">
          <p className="text-lg font-medium text-muted-foreground">No webinars available right now</p>
          <p className="text-sm mt-1 text-muted-foreground">Check back soon or try refreshing.</p>
          <button
            onClick={fetchEvents}
            className="mt-4 flex items-center gap-2 mx-auto text-sm text-primary hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </main>
    );
  }

  const trending = events.slice(0, 6);
  const rest = events.slice(6);
  const upcoming = events.filter(
    (w) => w.start_time && !isNaN(new Date(w.start_time).getTime()) && new Date(w.start_time) > new Date()
  );

  return (
    <main className="min-h-screen">

      {/* HEADER */}
      <div className="border-b bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Browse Webinars</h1>
          <p className="text-muted-foreground mt-1">
            {events.length} webinar{events.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="all">

          <TabsList className="mb-6">
            <TabsTrigger value="all">All Webinars</TabsTrigger>
            <TabsTrigger value="upcoming">
              <Zap className="w-4 h-4 mr-1" />
              Upcoming
            </TabsTrigger>
          </TabsList>

          {/* ALL WEBINARS */}
          <TabsContent value="all">

            {/* CATEGORIES */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4">Explore by Topic</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  ["🚀", "AI & Tech"],
                  ["📈", "Business"],
                  ["🎨", "Design"],
                  ["💻", "Programming"],
                  ["🌍", "Marketing"],
                  ["🧠", "Personal Growth"],
                ].map(([icon, label]) => (
                  <button
                    key={label as string}
                    className="p-4 rounded-lg border hover:bg-muted text-sm font-medium transition"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* TRENDING */}
            <h2 className="text-lg font-semibold mb-4">🔥 Trending This Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
              {trending.map((webinar) => (
                <WebinarCard key={webinar.slug} webinar={webinar} />
              ))}
            </div>

            {/* REST */}
            {rest.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-4">All Webinars</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {rest.map((webinar) => (
                    <WebinarCard key={webinar.slug} webinar={webinar} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* UPCOMING */}
          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-medium">No upcoming events right now</p>
                <p className="text-sm mt-1">Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {upcoming.map((webinar) => (
                  <WebinarCard key={webinar.slug} webinar={webinar} />
                ))}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
}
