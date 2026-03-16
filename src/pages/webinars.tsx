import { fetchEvents } from "@/lib/api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { WebinarCard } from "@/components/webinar-card";
import { ExternalEventCard, type ExternalEvent } from "@/components/external-event-card";

import { Search, SlidersHorizontal, X, AlertCircle, Zap } from "lucide-react";

function WebinarSkeleton() {
  return (
    <div className="rounded-lg border border-card-border overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}


export default function WebinarsPage() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sector, setSector] = useState("All");
  const [date, setDate] = useState("all");
  const [searchInput, setSearchInput] = useState("");


  /*
  =========================
  CURATED WEBINARS (YOUR DB)
  =========================
  */

  const { data: webinars = [], isLoading } = useQuery({
  queryKey: ["events"],
  queryFn: async () => {
    const res = await fetch("https://webinx-backend.onrender.com/api/events");
    const data = await res.json();
    return data;
  }
});


  /*
  =========================
  EXTERNAL LIVE EVENTS
  =========================
  */

  const externalEvents: ExternalEvent[] = [];
  const externalLoading = false;
  const externalError = false;
  const totalCount = webinars.length + externalEvents.length;
  const trending = webinars.slice(0, 4);
  const rest = webinars.slice(4);


  return (
    <main className="min-h-screen">

      {/* HEADER */}

      <div className="border-b bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            Browse Webinars
          </h1>

          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${totalCount} webinars found`}
          </p>

        </div>
      </div>



      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 py-8">

        <Tabs defaultValue="all">

          <TabsList>
            <TabsTrigger value="all">
              All Webinars
            </TabsTrigger>

            <TabsTrigger value="live">
              <Zap className="w-4 h-4 mr-1" />
              Live Events
            </TabsTrigger>
          </TabsList>



          {/* ALL WEBINARS */}

          <TabsContent value="all">

            {externalError && (
              <div className="flex items-center gap-2 text-muted-foreground p-4 border rounded-lg mb-6">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Could not load live events.
              </div>
            )}



            {/* CURATED WEBINARS */}
<div className="mb-10">
  <h2 className="text-lg font-semibold mb-4">
    Explore by Topic
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

    <button className="p-4 rounded-lg border hover:bg-muted">
      🚀 AI & Tech
    </button>

    <button className="p-4 rounded-lg border hover:bg-muted">
      📈 Business
    </button>

    <button className="p-4 rounded-lg border hover:bg-muted">
      🎨 Design
    </button>

    <button className="p-4 rounded-lg border hover:bg-muted">
      💻 Programming
    </button>

    <button className="p-4 rounded-lg border hover:bg-muted">
      🌍 Marketing
    </button>

    <button className="p-4 rounded-lg border hover:bg-muted">
      🧠 Personal Growth
    </button>

  </div>
</div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔥 Trending This Week
            </h2>

           {isLoading ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <WebinarSkeleton key={i} />
              ))}
            </div>

          ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {trending.map((webinar: any) => (
              <WebinarCard
                key={webinar.id}
                webinar={webinar}
              />
            ))}

          </div>

        )}

          </TabsContent>



          {/* LIVE EVENTS */}

          <TabsContent value="live">

            {externalLoading ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <WebinarSkeleton key={i} />
                ))}
              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                {externalEvents.map((e, i) => (
                  <ExternalEventCard key={e.id} event={e} index={i} />
                ))}

              </div>

            )}

          </TabsContent>

        </Tabs>

      </div>

    </main>
  );
}
