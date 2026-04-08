import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Legal & Static Pages
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contact from "@/pages/contact";
import About from "@/pages/about";

// Core Pages
import HomePage from "@/pages/home";
import WebinarsPage from "@/pages/webinars";
import WebinarPage from "@/pages/webinar";

// ✅ FIXED IMPORTS
import HostLanding from "@/pages/host";
import HostPage from "@/pages/host-detail";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Core */}
      <Route path="/" component={HomePage} />
      <Route path="/webinars" component={WebinarsPage} />
      <Route path="/browse" component={WebinarsPage} />

      {/* Static / SEO Pages */}
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      {/* ✅ HOST LANDING */}
      <Route path="/host" component={HostLanding} />

      {/* ✅ HOST PROFILE */}
      <Route path="/hosts/:id" component={HostPage} />

      {/* Dynamic */}
      <Route path="/webinar/:slug" component={WebinarPage} />

      {/* Fallback */}
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
