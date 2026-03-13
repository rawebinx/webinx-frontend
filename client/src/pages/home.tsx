import { useState, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { WebinarCard } from "@/components/webinar-card";
import { ExternalEventCard, type ExternalEvent } from "@/components/external-event-card";
import {
  Search, Cpu, TrendingUp, Palette, DollarSign, Heart, Users,
  BarChart2, Lightbulb, Rocket, ChevronRight, Zap, ArrowRight,
  AlertCircle
} from "lucide-react";
import type { WebinarWithHost } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string }> = {
  "Technology": { icon: Cpu, color: "text-blue-500" },
  "Marketing": { icon: TrendingUp, color: "text-orange-500" },
  "Finance": { icon: DollarSign, color: "text-green-500" },
  "Health & Wellness": { icon: Heart, color: "text-pink-500" },
  "Design": { icon: Palette, color: "text-purple-500" },
  "Leadership": { icon: Users, color: "text-amber-500" },
  "AI & Machine Learning": { icon: Zap, color: "text-cyan-500" },
  "Entrepreneurship": { icon: Rocket, color: "text-red-500" },
  "Data Science": { icon: BarChart2, color: "text-indigo-500" },
  "Product": { icon: Lightbulb, color: "text-teal-500" },
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Technology": "from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 border-blue-200 dark:border-blue-800/50",
  "Marketing": "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30 border-orange-200 dark:border-orange-800/50",
  "Finance": "from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/30 border-green-200 dark:border-green-800/50",
  "Health & Wellness": "from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/30 border-pink-200 dark:border-pink-800/50",
  "Design": "from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30 border-purple-200 dark:border-purple-800/50",
  "Leadership": "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30 border-amber-200 dark:border-amber-800/50",
  "AI & Machine Learning": "from-cyan-50 to-cyan-100 dark:from-cyan-950/40 dark:to-cyan-900/30 border-cyan-200 dark:border-cyan-800/50",
  "Entrepreneurship": "from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30 border-red-200 dark:border-red-800/50",
  "Data Science": "from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/30 border-indigo-200 dark:border-indigo-800/50",
  "Product": "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30 border-teal-200 dark:border-teal-800/50",
};

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
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

function sortByDate(events: ExternalEvent[]) {
  const now = new Date();
  const upcoming = events
    .filter(e => new Date(e.start_time) >= now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const past = events
    .filter(e => new Date(e.start_time) < now)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  return [...upcoming, ...past];
}

export default function HomePage() {
  
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const trackClick = async (slug: string) => {
  try {
    await fetch(`https://webinx-backend.onrender.com/api/events/click/${slug}`, {
      method: "POST"
    });
  } catch (err) {
    console.error("Click tracking failed", err);
  }
};
  const { data: externalEvents, isLoading: externalLoading, isError: externalError } = useQuery<ExternalEvent[]>({
    queryKey: ["/api/external/events"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: trending = [], isLoading: trendingLoading } = useQuery<WebinarWithHost[]>({
    queryKey: ["/api/webinars/trending"],
  });

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setLocation(`/webinars?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      setLocation("/webinars");
    }
  }, [searchValue, setLocation]);

  const handleCategoryClick = (category: string) => {
    setLocation(`/webinars?category=${encodeURIComponent(category)}`);
  };

  const sorted = externalEvents ? sortByDate(externalEvents) : [];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/30 border-b">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20">
              <Zap className="w-3.5 h-3.5" />
              Discover world-class webinars
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Learn from the <span className="text-primary">best minds</span> in your industry
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Thousands of live and on-demand webinars across technology, business, design, and more. Find your next breakthrough.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search topics, speakers, or categories..."
                  className="pl-10 h-11 text-base"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Button type="submit" size="default" className="h-11 px-6" data-testid="button-search">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-3 pt-1">
              {["AI & Machine Learning", "Marketing", "Design", "Entrepreneurship"].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  data-testid={`button-quick-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
            {[
              { label: "Live Webinars", value: "2,400+" },
              { label: "Expert Hosts", value: "850+" },
              { label: "Learners", value: "180K+" },
            ].map(stat => (
              <div key={stat.label} className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
            <p className="text-muted-foreground text-sm mt-1">Explore webinars across every topic area</p>
          </div>
          <Link href="/webinars">
            <Button variant="ghost" size="sm" className="gap-1" data-testid="button-browse-all-cats">
              View all <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat];
            const Icon = meta?.icon ?? Cpu;
            const gradient = CATEGORY_GRADIENTS[cat] ?? "from-muted to-muted/50 border-border";
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-lg border bg-gradient-to-br ${gradient} hover-elevate transition-all duration-200 text-center cursor-pointer`}
                data-testid={`button-category-${cat}`}
              >
                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-white/60 dark:bg-white/10">
                  <Icon className={`w-5 h-5 ${meta?.color ?? "text-primary"}`} />
                </div>
                <span className="text-xs font-medium leading-tight text-foreground">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Events from External API */}
      <section className="bg-muted/30 border-y py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Upcoming Events
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Live events from our platform</p>
            </div>
            <Link href="/webinars">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-events">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {externalError ? (
            <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 rounded-lg p-4 border">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
              <p className="text-sm">Could not load live events right now. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {externalLoading
                ? Array.from({ length: 4 }).map((_, i) => <WebinarSkeleton key={i} />)
                : sorted.slice(0, 4).map((e, i) => <ExternalEventCard key={e.id} event={e} index={i} />)
              }
            </div>
          )}
        </div>
      </section>

      {/* Trending Webinars (local seed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trending Webinars
            </h2>
            <p className="text-muted-foreground text-sm mt-1">The most popular sessions this week</p>
          </div>
          <Link href="/webinars">
            <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-trending">
              View all <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingLoading
            ? Array.from({ length: 4 }).map((_, i) => <WebinarSkeleton key={i} />)
            : trending.slice(0, 4).map(w => (
              <div
                key={w.id}
                onClick={() => trackClick(w.slug)}
              >
                <WebinarCard webinar={w} />
          </div>
          ))
        }
      </div>
        <div className="mt-10 text-center">
          <Link href="/webinars">
            <Button size="default" variant="outline" className="gap-2" data-testid="button-explore-all">
              Explore all webinars
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Are you an expert? Share your knowledge.
          </h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto">
            Reach thousands of engaged learners by hosting your own webinar on WebinX.
          </p>
          <Button variant="secondary" size="default" className="mt-2" data-testid="button-become-host">
            Become a Host
          </Button>
        </div>
      </section>
    </main>
  );
}
