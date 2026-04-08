import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Added pages (keep these)
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contact from "@/pages/contact";

// Pages
import HomePage from "@/pages/home";
import WebinarsPage from "@/pages/webinars";
import WebinarPage from "@/pages/webinar";
import HostPage from "@/pages/host";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/webinars" component={WebinarsPage} />
      <Route path="/browse" component={WebinarsPage} />

      {/* Added pages */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      <Route path="/webinar/:slug" component={WebinarPage} />

      <Route path="/webinar">
        <div className="p-6">
          <h1>Browse Webinars</h1>
        </div>
      </Route>

      <Route path="/hosts/:id" component={HostPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />

          <div className="flex-1">
            <Router />
          </div>

          <Footer />
        </div>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
