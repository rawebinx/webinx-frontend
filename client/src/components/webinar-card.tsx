import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Users } from "lucide-react";
import type { WebinarWithHost } from "@shared/schema";
import { format } from "date-fns";

interface Props {
  webinar: WebinarWithHost;
  size?: "default" | "featured";
}

export function WebinarCard({ webinar, size = "default" }: Props) {

  // ---------- SAFE DEFAULTS ----------
  const category = webinar.category ?? "Technology";
  const attendees = webinar.attendees ?? 0;
  const maxAttendees = webinar.maxAttendees ?? 100;
  const isFree = webinar.isFree ?? true;
  const price = webinar.price ?? 0;
  const isTrending = webinar.isTrending ?? false;

  const hostName = webinar.host?.name ?? "WebinX";
  const hostAvatar = webinar.host?.avatar ?? "";
  const hostCompany = webinar.host?.company ?? "WebinX";

  const attendeePct = Math.round((attendees / maxAttendees) * 100);

  // ---------- DATE SAFE PARSING ----------
  const dateObj = webinar.startTime
    ? new Date(webinar.startTime)
    : new Date();

  return (
    <Card
      className="flex flex-col hover:shadow-md transition-all cursor-pointer"
      data-testid={`card-webinar-${webinar.id}`}
    >

      <Link href={`/webinars/${webinar.id}`}>
        <div className="relative h-40 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 rounded-t-lg overflow-hidden">

          <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/20 text-white">
            {category}
          </div>

          <div className="absolute bottom-3 right-3">
            {isFree ? (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500 text-white">
                Free
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full bg-black/50 text-white">
                ${price}
              </span>
            )}
          </div>

        </div>
      </Link>

      <CardContent className="flex flex-col gap-3 p-4 flex-1">

        <Link href={`/webinars/${webinar.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
            {webinar.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={hostAvatar} />
            <AvatarFallback>
              {hostName.split(" ").map(n => n[0]).join("").slice(0,2)}
            </AvatarFallback>
          </Avatar>

          <span className="text-xs text-muted-foreground truncate">
            {hostName}
          </span>

          <span className="text-xs text-muted-foreground/60 hidden sm:inline">
            · {hostCompany}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">

          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(dateObj, "MMM d, yyyy")}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {format(dateObj, "h:mm a")}
          </span>

          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {attendees.toLocaleString()} registered
          </span>

        </div>

        <div className="space-y-1">

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{attendeePct}% full</span>
            <span>{(maxAttendees - attendees).toLocaleString()} spots left</span>
          </div>

          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(attendeePct,100)}%` }}
            />
          </div>

        </div>

      </CardContent>

      <CardFooter className="p-4 pt-0">

        <Link href={`/webinars/${webinar.id}`} className="w-full">

          <Button
            className="w-full"
            variant={isFree ? "default" : "secondary"}
            size="sm"
          >
            {isFree ? "Register Free" : `Register · $${price}`}
          </Button>

        </Link>

      </CardFooter>

    </Card>
  );
}
