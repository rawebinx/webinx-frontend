import { Helmet } from "react-helmet";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { WebinarCard } from "@/components/webinar-card";
import { ChevronLeft, Globe, ExternalLink } from "lucide-react";

export default function HostDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch host
  const { data: host, isLoading, isError } = useQuery({
    queryKey: ["host", id],
    queryFn: async () => {
      const res = await fetch(`/api/hosts/${id}`);
      if (!res.ok) throw new Error("Host not found");
      return res.json();
    },
  });

  // Fetch webinars
  const { data: webinars = [] } = useQuery({
    queryKey: ["host-webinars", id],
    queryFn: async () => {
      const res = await fetch(`/api/hosts/${id}/webinars`);
      return res.json();
    },
    enabled: !!host,
  });

  // Error state
  if (isError) {
    return (
      <main className="text-center py-20">
        <h2 className="text-xl font-bold">Host not found</h2>
        <Link href="/webinars">
          <Button className="mt-4">Browse Webinars</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      <Helmet>
        <title>{host?.name || "Host"} | WebinX</title>
        <meta
          name="description"
          content={host?.bio || "Explore webinars by expert hosts on WebinX"}
        />
      </Helmet>

      {/* Back */}
      <Link href="/webinars">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Webinars
        </Button>
      </Link>

      {/* Loading */}
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
            
            <Avatar className="h-24 w-24">
              <AvatarImage src={host?.avatar} />
              <AvatarFallback>
                {host?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{host?.name}</h1>
              <p className="text-muted-foreground text-sm">
                {host?.role} {host?.company ? `at ${host.company}` : ""}
              </p>

              {host?.website && (
                <a href={host.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="mt-3">
                    <Globe className="w-4 h-4 mr-1" />
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          {host?.bio && (
            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-2">About</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {host.bio}
              </p>
            </div>
          )}

          <Separator className="mb-8" />

          {/* Webinars */}
          <h2 className="text-xl font-semibold mb-6">
            Webinars by {host?.name?.split(" ")[0]}
          </h2>

          {webinars.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No webinars available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {webinars.map((w: any) => (
                <WebinarCard key={w.id} webinar={w} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
