import { Helmet } from "react-helmet";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { WebinarCard } from "@/components/webinar-card";
import {
  ChevronLeft, Globe, ExternalLink, Briefcase, Star, Video
} from "lucide-react";
import type { Host, WebinarWithHost } from "@shared/schema";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center space-y-1">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function HostPage() {
  const { id } = useParams<{ id: string }>();

  const { data: host, isLoading, isError } = useQuery<Host>({
    queryKey: ["/api/hosts", id],
    queryFn: async () => {
      const res = await fetch(`/api/hosts/${id}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const { data: webinars = [] } = useQuery<WebinarWithHost[]>({
    queryKey: ["/api/hosts", id, "webinars"],
    queryFn: async () => {
      const res = await fetch(`/api/hosts/${id}/webinars`);
      return res.json();
    },
    enabled: !!host,
  });

  if (isError) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Host not found</h2>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      <Helmet>
        <title>{host?.name || "Host"} | WebinX</title>
        <meta name="description" content={host?.bio || "Host webinars on WebinX"} />
      </Helmet>

      <Link href="/webinars">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft /> Back
        </Button>
      </Link>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <>
          <div className="flex gap-6 items-center mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={host?.avatar} />
              <AvatarFallback>{host?.name?.[0]}</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold">{host?.name}</h1>
              <p className="text-sm text-muted-foreground">{host?.role} at {host?.company}</p>
            </div>
          </div>

          <p className="mb-6">{host?.bio}</p>

          <Separator className="my-6" />

          <h2 className="text-xl font-semibold mb-4">Webinars</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {webinars.map(w => (
              <WebinarCard key={w.id} webinar={w} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
