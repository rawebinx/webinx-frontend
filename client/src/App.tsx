import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";
import Webinar from "@/pages/webinar";
import HomePage from "@/pages/home";
import WebinarsPage from "@/pages/webinars";
import WebinarDetailPage from "@/pages/webinar-detail";
import HostPage from "@/pages/host";

function Router() {
  return (
    <Switch>

      <Route path="/" component={HomePage} />

      <Route path="/webinars" component={WebinarsPage} />

      <Route path="/webinar/:slug">
        {(params) => <Webinar {...params} />}
      </Route>

      <Route path="/webinars/:id" component={WebinarDetailPage} />

      <Route path="/hosts/:id" component={HostPage} />

      <Route component={NotFound} />

    </Switch>
  );
}

function App() {
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

export default App;
