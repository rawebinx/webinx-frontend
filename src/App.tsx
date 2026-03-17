import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Pages
import HomePage from "@/pages/home";
import WebinarsPage from "@/pages/webinars";
import WebinarPage from "@/pages/webinar";
import HostPage from "@/pages/host";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>

      {/* Home */}
      <Route path="/" component={HomePage} />

      {/* Webinars Listing */}
      <Route path="/webinars" component={WebinarsPage} />

      {/* Webinar Detail (CRITICAL ROUTE) */}
      <Route path="/webinar/:slug" component={WebinarPage} />

      {/* Host Page */}
      <Route path="/hosts/:id" component={HostPage} />

      {/* 404 */}
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
