import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Users, DollarSign } from "lucide-react";
import type { WebinarWithHost } from "@shared/schema";
import { format, parseISO } from "date-fns";

const CATEGORY_COLORS: Record<string, string> = {
  "Technology": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Marketing": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Finance": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Health & Wellness": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "Design": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Leadership": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "AI & Machine Learning": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Entrepreneurship": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Data Science": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Product": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

const IMAGE_GRADIENTS: Record<string, string> = {
  "AI & Machine Learning": "from-cyan-500 via-blue-600 to-indigo-700",
  "Entrepreneurship": "from-orange-500 via-red-500 to-pink-600",
  "Design": "from-purple-500 via-violet-600 to-indigo-600",
  "Finance": "from-emerald-500 via-teal-600 to-cyan-700",
  "Marketing": "from-amber-500 via-orange-500 to-red-500",
  "Leadership": "from-amber-400 via-yellow-500 to-orange-600",
  "Technology": "from-blue-500 via-indigo-600 to-violet-700",
  "Data Science": "from-indigo-500 via-purple-600 to-pink-600",
  "Health & Wellness": "from-pink-400 via-rose-500 to-red-500",
  "Product": "from-teal-500 via-cyan-600 to-blue-600",
};

interface Props {
  webinar: WebinarWithHost;
  size?: "default" | "featured";
}

export function WebinarCard({ webinar, size = "default" }: Props) {
  const gradient = IMAGE_GRADIENTS[webinar.category] ?? "from-blue-500 via-indigo-600 to-violet-700";
  const categoryColor = CATEGORY_COLORS[webinar.category] ?? "bg-muted text-muted-foreground";
  const attendeePct = Math.round((webinar.attendees / webinar.maxAttendees) * 100);
  const dateObj = parseISO(webinar.date);

  return (
    <Card
      className="flex flex-col hover-elevate transition-all duration-200 cursor-pointer group border-card-border"
      data-testid={`card-webinar-${webinar.id}`}
    >
      <Link href={`/webinars/${webinar.id}`}>
        <div className={`relative h-40 bg-gradient-to-br ${gradient} rounded-t-lg overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm`}>
              {webinar.category}
            </span>
            {webinar.isTrending && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/90 text-white">
                Trending
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            {webinar.isFree ? (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/90 text-white">
                Free
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                ${webinar.price}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white/90 text-sm font-medium bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
              View Details
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="flex flex-col gap-3 p-4 flex-1">
        <Link href={`/webinars/${webinar.id}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {webinar.title}
          </h3>
        </Link>

        <Link href={`/hosts/${webinar.host.id}`}>
          <div className="flex items-center gap-2 cursor-pointer" data-testid={`link-host-${webinar.host.id}`}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={webinar.host.avatar} alt={webinar.host.name} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {webinar.host.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground font-medium truncate">
              {webinar.host.name}
            </span>
            <span className="text-xs text-muted-foreground/60 truncate hidden sm:inline">
              · {webinar.host.company}
            </span>
          </div>
        </Link>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
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
            {webinar.attendees.toLocaleString()} registered
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{attendeePct}% full</span>
            <span>{(webinar.maxAttendees - webinar.attendees).toLocaleString()} spots left</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(attendeePct, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/webinars/${webinar.id}`} className="w-full">
          <Button
            className="w-full"
            variant={webinar.isFree ? "default" : "secondary"}
            size="sm"
            data-testid={`button-register-${webinar.id}`}
          >
            {webinar.isFree ? "Register Free" : `Register · $${webinar.price}`}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
