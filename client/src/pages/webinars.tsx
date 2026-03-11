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
import type { WebinarWithHost } from "@shared/schema";
import { CATEGORIES, SECTORS } from "@shared/schema";

function WebinarSkeleton() {
  return (
    <div className="rounded-lg border border-card-border overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

function filterEvents(events: ExternalEvent[], search: string): ExternalEvent[] {
  if (!search.trim()) return events;
  const q = search.toLowerCase();
  return events.filter(e =>
    e.title.toLowerCase().includes(q) ||
    (e.host && e.host.toLowerCase().includes(q)) ||
    (e.category && e.category.toLowerCase().includes(q))
  );
}

export default function WebinarsPage() {
  const [search, setSearch] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("search") ?? "";
  });
  const [category, setCategory] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("category") ?? "All";
  });
  const [sector, setSector] = useState("All");
  const [date, setDate] = useState("all");
  const [searchInput, setSearchInput] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("search") ?? "";
  });

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (category && category !== "All") queryParams.set("category", category);
  if (sector && sector !== "All") queryParams.set("sector", sector);
  if (date && date !== "all") queryParams.set("date", date);

  const { data: webinars = [], isLoading } = useQuery({
  queryKey: ["events"],
  queryFn: async () => {
  const res = await fetch("https://webinx-backend.onrender.com/api/events");
  const data = await res.json();

  import { normalizeEvent } from "@/lib/normalizeEvent";
  return data.map(normalizeEvent);

  const { data: externalEvents = [], isLoading: externalLoading, isError: externalError } = useQuery<ExternalEvent[]>({
    queryKey: ["/api/external/events"],
    staleTime: 5 * 60 * 1000,
  });

  const filteredExternal = filterEvents(externalEvents, search).sort((a, b) =>
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const activeFilters = [
    category !== "All" && category,
    sector !== "All" && sector,
    date !== "all" && ({ all: "", today: "Today", this_week: "This Week", this_month: "This Month" }[date] || date),
    search && `"${search}"`,
  ].filter(Boolean) as string[];

  const clearFilter = (filter: string) => {
    if (filter === category) setCategory("All");
    else if (filter === sector) setSector("All");
    else if (["Today", "This Week", "This Month"].includes(filter)) setDate("all");
    else { setSearch(""); setSearchInput(""); }
  };

  const clearAll = () => {
    setCategory("All");
    setSector("All");
    setDate("all");
    setSearch("");
    setSearchInput("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const totalCount = webinars.length + filteredExternal.length;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Browse Webinars</h1>
              <p className="text-muted-foreground mt-1">
                {(isLoading || externalLoading) ? "Loading..." : `${totalCount} webinar${totalCount !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search webinars..."
                    className="pl-10"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    data-testid="input-search-webinars"
                  />
                </div>
                <Button type="submit" variant="secondary" data-testid="button-search-submit">
                  Search
                </Button>
              </form>

              <div className="flex gap-2 flex-wrap">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-44" data-testid="select-category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="w-36" data-testid="select-sector">
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Sectors</SelectItem>
                    {SECTORS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={date} onValueChange={setDate}>
                  <SelectTrigger className="w-36" data-testid="select-date">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Date</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters:
                </span>
                {activeFilters.map(f => (
                  <Badge
                    key={f}
                    variant="secondary"
                    className="gap-1 pr-1 cursor-pointer"
                    onClick={() => clearFilter(f)}
                    data-testid={`badge-filter-${f}`}
                  >
                    {f}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground underline cursor-pointer"
                  data-testid="button-clear-filters"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList data-testid="tabs-webinars">
            <TabsTrigger value="all" data-testid="tab-all">
              All Webinars
              {!isLoading && !externalLoading && (
                <span className="ml-2 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  {totalCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="live" data-testid="tab-live" className="gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Live Events
              {!externalLoading && (
                <span className="ml-1 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  {filteredExternal.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* All webinars tab */}
          <TabsContent value="all" className="space-y-10">
            {/* External live events */}
            {!externalError && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Live Platform Events
                  </h2>
                </div>
                {externalLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <WebinarSkeleton key={i} />)}
                  </div>
                ) : filteredExternal.length === 0 && search ? (
                  <p className="text-sm text-muted-foreground">No live events match your search.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredExternal.map((e, i) => (
                      <ExternalEventCard key={e.id} event={e} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {externalError && (
              <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 rounded-lg p-4 border">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <p className="text-sm">Could not load live events. Showing curated webinars below.</p>
              </div>
            )}

            {/* Curated webinars */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Curated Webinars
                </h2>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <WebinarSkeleton key={i} />)}
                </div>
              ) : webinars.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">No webinars found</h3>
                    <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                  <Button variant="secondary" onClick={clearAll} data-testid="button-clear-all">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {webinars.map((w: any) => (
                    <div key={w.id}>
                      {w.title} — {w.startTime}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Live events only tab */}
          <TabsContent value="live">
            {externalError ? (
              <div className="text-center py-24 space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Could not load live events</h3>
                  <p className="text-muted-foreground text-sm mt-1">The live events API is currently unavailable</p>
                </div>
              </div>
            ) : externalLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <WebinarSkeleton key={i} />)}
              </div>
            ) : filteredExternal.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No live events found</h3>
                  <p className="text-muted-foreground text-sm mt-1">Try adjusting your search</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredExternal.map((e, i) => (
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
