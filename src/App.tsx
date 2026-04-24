// src/App.tsx — WebinX Router (Step 3: leaderboard, rewards, featured, certificate)
import { Router, Switch, Route } from "wouter";

import { Navbar }          from "./components/navbar";
import { Footer }          from "./pages/footer";

import Home                from "./pages/home";
import WebinarsPage        from "./pages/webinars";
import WebinarPage         from "./pages/webinar";
import CategoryPage        from "./pages/category";
import SectorPage          from "./pages/sector";
import HostPage            from "./pages/host";
import HostDetailPage      from "./pages/host-detail";
import SeoPage             from "./pages/seo";
import AboutPage           from "./pages/about";
import ContactPage         from "./pages/contact";
import PrivacyPage         from "./pages/privacy";
import TermsPage           from "./pages/terms";
import WishlistPage        from "./pages/wishlist";
import LeaderboardPage     from "./pages/leaderboard";
import RewardClaimPage     from "./pages/reward-claim";
import GetFeaturedPage     from "./pages/get-featured";
import CertificatePage     from "./pages/certificate";

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-purple-600 hover:underline text-sm">← Back to home</a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Switch>
            {/* Core */}
            <Route path="/"                  component={Home} />
            <Route path="/webinars"          component={WebinarsPage} />
            <Route path="/webinar/:slug"     component={WebinarPage} />
            <Route path="/category/:slug"    component={CategoryPage} />
            <Route path="/sector/:slug"      component={SectorPage} />
            <Route path="/host"              component={HostPage} />
            <Route path="/hosts/:slug"       component={HostDetailPage} />

            {/* Static — must be before /:slug catch-all */}
            <Route path="/wishlist"          component={WishlistPage} />
            <Route path="/top-hosts"         component={LeaderboardPage} />
            <Route path="/mention-webinx"    component={RewardClaimPage} />
            <Route path="/get-featured"      component={GetFeaturedPage} />
            <Route path="/certificate/:slug" component={CertificatePage} />
            <Route path="/about"             component={AboutPage} />
            <Route path="/contact"           component={ContactPage} />
            <Route path="/privacy"           component={PrivacyPage} />
            <Route path="/terms"             component={TermsPage} />

            {/* Programmatic SEO catch-all */}
            <Route path="/:slug"             component={SeoPage} />

            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
