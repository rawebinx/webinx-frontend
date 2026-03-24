import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { WebinarCard } from "@/components/webinar-card";
import {
  ChevronLeft, Users, Globe, ExternalLink, Briefcase, Star, Video
} from "lucide-react";
import type { Host, WebinarWithHost } from "@shared/schema";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center space-y-1">
      <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function HostPage() {
  const { id } = useParams<{ id: string }>();

  const { data: host, isLoading: hostLoading, isError } = useQuery<Host>({
    queryKey: ["/api/hosts", id],
    queryFn: async () => {
      const res = await fetch(`/api/hosts/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  const { data: webinars = [], isLoading: webinarsLoading } = useQuery<WebinarWithHost[]>({
    queryKey: ["/api/hosts", id, "webinars"],
    queryFn: async () => {
      const res = await fetch(`/api/hosts/${id}/webinars`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!host,
  });

  if (isError) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Host not found</h2>
        <p className="text-muted-foreground">This host doesn't exist or has been removed.</p>
        <Link href="/webinars">
          <Button variant="secondary" data-testid="button-back-webinars">Browse Webinars</Button>
        </Link>
      </main>
    );
  }

  const totalAttendees = webinars.reduce((acc, w) => acc + w.attendees, 0);

  return (
    <main className="min-h-screen pb-16">
      {/* Header Banner */}
      <div className="w-full h-40 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 border-b" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="pt-4 pb-2">
          <Link href="/webinars">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2 text-muted-foreground" data-testid="button-back">
              <ChevronLeft className="w-4 h-4" /> Back to Browse
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-8">
          {hostLoading ? (
            <Skeleton className="h-28 w-28 rounded-full" />
          ) : (
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              <AvatarImage src={host?.avatar} alt={host?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {host?.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1 space-y-2">
            {hostLoading ? (
              <>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-host-name">
                    {host?.name}
                  </h1>
                  <Badge variant="secondary" className="gap-1">
                    <Star className="w-3 h-3" /> Top Host
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {host?.role}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{host?.company}</span>
                </div>
              </>
            )}
          </div>

          {!hostLoading && host?.website && (
            <a href={host.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-host-website">
                <Globe className="w-4 h-4" />
                Website
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>

        {/* Stats */}
        {!hostLoading && (
          <div className="grid grid-cols-3 gap-6 py-6 border-y mb-8">
            <StatCard label="Followers" value={host?.followers ?? 0} />
            <StatCard label="Total Attendees" value={totalAttendees} />
            <StatCard label="Webinars" value={webinars.length} />
          </div>
        )}

        {/* Bio + Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">About</h2>
            {hostLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-host-bio">
                {host?.bio}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Expertise</h2>
            {hostLoading ? (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {host?.expertise.map(e => (
                  <Badge key={e} variant="secondary" data-testid={`badge-expertise-${e}`}>{e}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Webinars by host */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">
              {hostLoading ? <Skeleton className="h-6 w-40" /> : `Webinars by ${host?.name?.split(" ")[0]}`}
            </h2>
          </div>

          {webinarsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-card-border overflow-hidden">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : webinars.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Video className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No webinars yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {webinars.map(w => (
                <WebinarCard key={w.id} webinar={w} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
