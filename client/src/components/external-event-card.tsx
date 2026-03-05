import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Video } from "lucide-react";
import { format, parseISO } from "date-fns";

export interface ExternalEvent {
  id: string;
  slug: string;
  title: string;
  start_time: string;
  host?: string;
  category?: string;
  registration_url?: string;
}

const SLUG_GRADIENTS = [
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-orange-500 via-red-500 to-pink-600",
  "from-purple-500 via-violet-600 to-indigo-600",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-500 to-red-500",
  "from-indigo-500 via-purple-600 to-pink-600",
  "from-teal-500 via-cyan-600 to-blue-600",
  "from-blue-500 via-indigo-600 to-violet-700",
];

function pickGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return SLUG_GRADIENTS[Math.abs(hash) % SLUG_GRADIENTS.length];
}

function parseDate(raw: string): Date | null {
  try {
    return new Date(raw);
  } catch {
    return null;
  }
}

interface Props {
  event: ExternalEvent;
  index: number;
}

export function ExternalEventCard({ event, index }: Props) {
  const gradient = pickGradient(event.slug);
  const dateObj = parseDate(event.start_time);
  const registrationUrl = event.registration_url ?? `https://webinx-backend.onrender.com/events/${event.slug}`;

  return (
    <Card
      className="flex flex-col hover-elevate transition-all duration-200 group border-card-border"
      data-testid={`card-event-${event.id}`}
    >
      <div className={`relative h-40 bg-gradient-to-br ${gradient} rounded-t-lg`}>
        <div className="absolute inset-0 bg-black/10 rounded-t-lg" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {event.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
              {event.category}
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Video className="w-10 h-10 text-white/30 group-hover:text-white/50 transition-colors" />
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/90 text-white">
            Free
          </span>
        </div>
      </div>

      <CardContent className="flex flex-col gap-3 p-4 flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-event-title-${event.id}`}>
          {event.title}
        </h3>

        {event.host && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
              {event.host[0]?.toUpperCase() ?? "H"}
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate" data-testid={`text-event-host-${event.id}`}>
              {event.host}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {dateObj && (
            <span className="flex items-center gap-1" data-testid={`text-event-date-${event.id}`}>
              <Calendar className="w-3.5 h-3.5" />
              {format(dateObj, "MMM d, yyyy")}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <a href={registrationUrl} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button
            className="w-full gap-1.5"
            size="sm"
            data-testid={`button-event-register-${event.id}`}
          >
            Register
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
