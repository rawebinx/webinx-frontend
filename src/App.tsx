import { Router, Switch, Route } from "wouter";

// pages/ — all confirmed present in repo
import Home             from "./pages/home";
import WebinarsPage     from "./pages/webinars";
import WebinarPage      from "./pages/webinar";
import CategoryPage     from "./pages/category";
import SeoPage          from "./pages/seo";
import AboutPage        from "./pages/about";
import ContactPage      from "./pages/contact";
import PrivacyPage      from "./pages/privacy";
import TermsPage        from "./pages/terms";

// footer.tsx lives in pages/ (not components/) in this repo
import { Footer } from "./pages/footer";

// Inline 404 — no not-found.tsx in repo
function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-600 hover:underline text-sm">
        ← Back to home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Switch>
            {/* Core routes */}
            <Route path="/"               component={Home} />
            <Route path="/webinars"       component={WebinarsPage} />
            <Route path="/webinar/:slug"  component={WebinarPage} />
            <Route path="/category/:slug" component={CategoryPage} />

            {/* Static pages — must be before /:slug catch-all */}
            <Route path="/about"          component={AboutPage} />
            <Route path="/contact"        component={ContactPage} />
            <Route path="/privacy"        component={PrivacyPage} />
            <Route path="/terms"          component={TermsPage} />

            {/* Programmatic SEO catch-all */}
            <Route path="/:slug"          component={SeoPage} />

            {/* 404 fallback */}
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
