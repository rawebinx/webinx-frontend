import { useState, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { WebinarCard } from "@/components/webinar-card";
import { ExternalEventCard, type ExternalEvent } from "@/components/external-event-card";

import {
  Search,
  Cpu,
  TrendingUp,
  Palette,
  DollarSign,
  Heart,
  Users,
  BarChart2,
  Lightbulb,
  Rocket,
  ChevronRight,
  Zap,
  ArrowRight,
  AlertCircle
} from "lucide-react";


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
  "Product": { icon: Lightbulb, color: "text-teal-500" }
};


const CATEGORY_GRADIENTS: Record<string, string> = {
  "Technology": "from-blue-50 to-blue-100 border-blue-200",
  "Marketing": "from-orange-50 to-orange-100 border-orange-200",
  "Finance": "from-green-50 to-green-100 border-green-200",
  "Health & Wellness": "from-pink-50 to-pink-100 border-pink-200",
  "Design": "from-purple-50 to-purple-100 border-purple-200",
  "Leadership": "from-amber-50 to-amber-100 border-amber-200",
  "AI & Machine Learning": "from-cyan-50 to-cyan-100 border-cyan-200",
  "Entrepreneurship": "from-red-50 to-red-100 border-red-200",
  "Data Science": "from-indigo-50 to-indigo-100 border-indigo-200",
  "Product": "from-teal-50 to-teal-100 border-teal-200"
};


const CATEGORIES = [
  "Technology",
  "Marketing",
  "Finance",
  "Design",
  "AI & Machine Learning",
  "Entrepreneurship"
];


function WebinarSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
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
    } catch {
      console.log("click tracking failed");
    }
  };


  const { data: externalEvents, isLoading: externalLoading, isError: externalError } =
    useQuery<ExternalEvent[]>({
      queryKey: ["/api/events"]
    });


  const { data: trending = [], isLoading: trendingLoading } =
    useQuery<any[]>({
      queryKey: ["api/events/trending"]
    });


  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue.trim()) {
      setLocation(`/webinars?search=${encodeURIComponent(searchValue)}`);
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

      {/* HERO */}

      <section className="border-b py-20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">

          <h1 className="text-4xl font-bold">
            Discover World-Class Webinars
          </h1>

          <p className="text-muted-foreground">
            Learn from experts across technology, business, design and more.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">

            <Input
              placeholder="Search webinars..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />

            <Button type="submit">
              Search
            </Button>

          </form>

        </div>
      </section>


      {/* CATEGORIES */}

      <section className="max-w-6xl mx-auto px-4 py-16">

        <h2 className="text-2xl font-bold mb-6">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {CATEGORIES.map(cat => {

            const meta = CATEGORY_META[cat];
            const Icon = meta?.icon ?? Cpu;
            const gradient = CATEGORY_GRADIENTS[cat] ?? "border";

            return (

              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`p-4 border rounded-lg bg-gradient-to-br ${gradient}`}
              >

                <Icon className={`w-6 h-6 mb-2 ${meta?.color ?? "text-primary"}`} />

                <div className="text-sm font-medium">
                  {cat}
                </div>

              </button>

            );

          })}

        </div>

      </section>


      {/* LIVE EVENTS */}

      <section className="bg-muted/30 border-y py-16">

        <div className="max-w-6xl mx-auto px-4">

          <h2 className="text-2xl font-bold mb-6">
            Upcoming Events
          </h2>

          {externalError ? (

            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              Could not load live events
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {externalLoading
                ? Array.from({ length: 4 }).map((_, i) => <WebinarSkeleton key={i} />)
                : sorted.slice(0, 4).map((e, i) =>
                    <ExternalEventCard key={e.id} event={e} index={i} />
                  )
              }

            </div>

          )}

        </div>

      </section>


      {/* TRENDING */}

      <section className="max-w-6xl mx-auto px-4 py-16">

        <h2 className="text-2xl font-bold mb-6">
          Trending Webinars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

          {trendingLoading
            ? Array.from({ length: 4 }).map((_, i) => <WebinarSkeleton key={i} />)
            : trending.slice(0, 4).map((w: any) => (

              <div
                key={w.id}
                onClick={() => trackClick(w.slug)}
              >
                <WebinarCard webinar={w} />
              </div>

          ))}

        </div>

        <div className="text-center mt-10">

          <Link href="/webinars">

            <Button variant="outline">
              Explore all webinars
              <ArrowRight className="w-4 h-4 ml-2"/>
            </Button>

          </Link>

        </div>

      </section>

    </main>
  );
}
