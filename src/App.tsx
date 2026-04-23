import { Router, Switch, Route } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import Home from "./pages/home";
import WebinarsPage from "./pages/webinars";
import WebinarDetailPage from "./pages/webinar";
import CategoryPage from "./pages/category";
import SeoPage from "./pages/seo";
import HostPage from "./pages/host";
import HostDetailPage from "./pages/host-detail";

// Static pages — MUST be declared before the /:slug catch-all
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import PrivacyPage from "./pages/privacy";
import TermsPage from "./pages/terms";

import NotFoundPage from "./pages/not-found";

/**
 * Route order is significant in wouter's <Switch>: first match wins.
 *
 * Rule: every exact static path (/about, /contact, /privacy, /terms)
 * must appear BEFORE the catch-all /:slug — otherwise wouter matches
 * them as a slug and hands them to SeoPage.
 */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Switch>
            {/* ── Core ───────────────────────────────── */}
            <Route path="/"                component={Home} />
            <Route path="/webinars"        component={WebinarsPage} />
            <Route path="/webinar/:slug"   component={WebinarDetailPage} />
            <Route path="/category/:slug"  component={CategoryPage} />
            <Route path="/host"            component={HostPage} />
            <Route path="/hosts/:slug"     component={HostDetailPage} />

            {/* ── Static pages ───────────────────────── */}
            <Route path="/about"           component={AboutPage} />
            <Route path="/contact"         component={ContactPage} />
            <Route path="/privacy"         component={PrivacyPage} />
            <Route path="/terms"           component={TermsPage} />

            {/* ── Programmatic SEO catch-all ─────────── */}
            {/* Must be LAST before 404 */}
            <Route path="/:slug"           component={SeoPage} />
            <Route                         component={NotFoundPage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
