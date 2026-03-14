import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Calendar, Clock, Users, ChevronLeft, Globe, CheckCircle2,
  Share2, Bookmark, Tag, Building, ArrowRight
} from "lucide-react";
import type { WebinarWithHost } from "@shared/schema";
import { format, parseISO, formatDistanceToNow } from "date-fns";

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

const registerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

function RegisterDialog({ webinar, open, onOpenChange }: {
  webinar: WebinarWithHost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      apiRequest("POST", `/api/webinars/${webinar.id}/register`, values),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/webinars", webinar.id] });
    },
    onError: (err: any) => {
      const msg = err?.message ?? "Something went wrong";
      if (msg.includes("409") || msg.includes("Already")) {
        toast({ title: "Already registered", description: "You're already registered for this webinar.", variant: "destructive" });
      } else {
        toast({ title: "Registration failed", description: "Please try again.", variant: "destructive" });
      }
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setSuccess(false); form.reset(); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-register">
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <DialogHeader>
              <DialogTitle>You're registered!</DialogTitle>
              <DialogDescription>
                A confirmation email will be sent to your inbox. See you at the webinar!
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handleClose} data-testid="button-close-success">Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Register for Webinar</DialogTitle>
              <DialogDescription>
                {webinar.isFree
                  ? "This is a free webinar. Register to reserve your spot."
                  : `Register for $${webinar.price}. You'll receive access details via email.`}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/50 rounded-md p-3 text-sm">
              <p className="font-medium line-clamp-2">{webinar.title}</p>
              <p className="text-muted-foreground mt-1">
                {format(parseISO(webinar.date), "EEEE, MMM d, yyyy · h:mm a")} · {webinar.duration} min
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} data-testid="input-reg-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@example.com" {...field} data-testid="input-reg-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                  data-testid="button-submit-register"
                >
                  {mutation.isPending ? "Registering..." : webinar.isFree ? "Register Free" : `Register · $${webinar.price}`}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function WebinarDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [registerOpen, setRegisterOpen] = useState(false);

  const { data: webinar, isLoading, isError } = useQuery<WebinarWithHost & { registrationCount: number }>({
    queryKey: ["/api/webinars", id],
    queryFn: async () => {
      const res = await fetch(`/api/webinars/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-72 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </main>
    );
  }

  if (isError || !webinar) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Webinar not found</h2>
        <p className="text-muted-foreground">This webinar may have been removed or doesn't exist.</p>
        <Link href="/webinars">
          <Button variant="secondary" data-testid="button-back-webinars">Browse Webinars</Button>
        </Link>
      </main>
    );
  }

  const gradient = IMAGE_GRADIENTS[webinar.category] ?? "from-blue-500 via-indigo-600 to-violet-700";
  const dateObj = parseISO(webinar.date);
  const attendeePct = Math.round((webinar.attendees / webinar.maxAttendees) * 100);
  const timeUntil = formatDistanceToNow(dateObj, { addSuffix: true });

  return (
    <main className="min-h-screen pb-16">
      {/* Hero image */}
      <div className={`w-full h-64 md:h-80 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {webinar.category}
              </span>
              {webinar.isTrending && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/90 text-white">
                  Trending
                </span>
              )}
              {webinar.isFree ? (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/90 text-white">
                  Free
                </span>
              ) : (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  ${webinar.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="py-4">
          <Link href="/webinars">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2 text-muted-foreground" data-testid="button-back">
              <ChevronLeft className="w-4 h-4" /> Back to Browse
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight" data-testid="text-webinar-title">
                {webinar.title}
              </h1>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(dateObj, "EEEE, MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {format(dateObj, "h:mm a")} · {webinar.duration} minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {webinar.attendees.toLocaleString()} registered
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-2 font-medium">{timeUntil}</p>
            </div>

            <Separator />

            {/* Host card */}
            <div>
              <h2 className="font-semibold mb-4">Your Host</h2>
              <Link href={`/hosts/${webinar.host.id}`}>
                <Card className="hover-elevate cursor-pointer border-card-border" data-testid={`card-host-${webinar.host.id}`}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={webinar.host.avatar} alt={webinar.host.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                        {webinar.host.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold" data-testid="text-host-name">{webinar.host.name}</p>
                      <p className="text-sm text-muted-foreground">{webinar.host.role}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5" />
                        {webinar.host.company}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {webinar.host.expertise.slice(0, 3).map(e => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-3">About this Webinar</h2>
              <p className="text-muted-foreground leading-relaxed text-sm" data-testid="text-description">
                {webinar.description}
              </p>
            </div>

            {/* Tags */}
            {webinar.tags.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Topics Covered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {webinar.tags.map(tag => (
                    <Badge key={tag} variant="secondary" data-testid={`badge-tag-${tag}`}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="border-card-border sticky top-24">
              <CardContent className="p-5 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {webinar.isFree ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                    ) : (
                      <span>${webinar.price}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {webinar.maxAttendees - webinar.attendees} spots remaining
                  </p>
                </div>

                {/* Attendee progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{webinar.attendees.toLocaleString()} registered</span>
                    <span>{attendeePct}% full</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${attendeePct > 80 ? "bg-orange-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(attendeePct, 100)}%` }}
                    />
                  </div>
                  {attendeePct > 80 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Almost full — register soon!
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{format(dateObj, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{format(dateObj, "h:mm a")} · {webinar.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span>Online · Zoom</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    <span>{webinar.sector}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="default"
                  onClick={() => setRegisterOpen(true)}
                  data-testid="button-register"
                >
                  {webinar.isFree ? "Register Free" : `Register · $${webinar.price}`}
                </Button>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 gap-1" data-testid="button-share">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 gap-1" data-testid="button-save">
                    <Bookmark className="w-3.5 h-3.5" /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RegisterDialog
        webinar={webinar}
        open={registerOpen}
        onOpenChange={setRegisterOpen}
      />
    </main>
  );
}
