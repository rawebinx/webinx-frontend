// src/App.tsx — WebinX Router
import { Router, Switch, Route, useLocation } from "wouter";

import { Navbar }           from "./components/navbar";
import { Footer }           from "./pages/footer";

import Home                 from "./pages/home";
import WebinarsPage         from "./pages/webinars";
import WebinarPage          from "./pages/webinar";
import CategoryPage         from "./pages/category";
import SectorPage           from "./pages/sector";
import CityPage             from "./pages/city";
import HostPage             from "./pages/host";
import HostDetailPage       from "./pages/host-detail";
import SeoPage              from "./pages/seo";
import AboutPage            from "./pages/about";
import ContactPage          from "./pages/contact";
import PrivacyPage          from "./pages/privacy";
import TermsPage            from "./pages/terms";
import WishlistPage         from "./pages/wishlist";
import LeaderboardPage      from "./pages/leaderboard";
import RewardClaimPage      from "./pages/reward-claim";
import GetFeaturedPage      from "./pages/get-featured";
import CertificatePage      from "./pages/certificate";
import AISearchPage         from "./pages/ai-search";
import AdminPage            from "./pages/admin";
import HostToolsPage        from "./pages/host-tools";
import TrendingTopicsPage   from "./pages/trending-topics";
import EmbedPage            from "./pages/embed";
import SubmitWebinarPage    from "./pages/submit-webinar";
import PodcastsPage         from "./pages/podcasts";
import LiveEventsPage       from "./pages/live-events";

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-purple-600 hover:underline text-sm">← Back to home</a>
    </div>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isEmbed = location.startsWith("/embed/");

  return (
    <div className="min-h-screen flex flex-col">
      {!isEmbed && <Navbar />}
      <main className="flex-1">
        <Switch>
          <Route path="/"                     component={Home} />
          <Route path="/webinars"             component={WebinarsPage} />
          <Route path="/podcasts"             component={PodcastsPage} />
          <Route path="/live-events"          component={LiveEventsPage} />
          <Route path="/webinar/:slug"        component={WebinarPage} />
          <Route path="/category/:slug"       component={CategoryPage} />
          <Route path="/sector/:slug"         component={SectorPage} />
          <Route path="/city/:city"           component={CityPage} />
          <Route path="/submit-webinar"       component={SubmitWebinarPage} />
          <Route path="/host"                 component={HostPage} />
          <Route path="/hosts/:slug"          component={HostDetailPage} />
          <Route path="/wishlist"             component={WishlistPage} />
          <Route path="/top-hosts"            component={LeaderboardPage} />
          <Route path="/mention-webinx"       component={RewardClaimPage} />
          <Route path="/get-featured"         component={GetFeaturedPage} />
          <Route path="/certificate/:slug"    component={CertificatePage} />
          <Route path="/ai-search"            component={AISearchPage} />
          <Route path="/admin"                component={AdminPage} />
          <Route path="/host-tools"           component={HostToolsPage} />
          <Route path="/trending-topics"      component={TrendingTopicsPage} />
          <Route path="/embed/:slug"          component={EmbedPage} />
          <Route path="/about"                component={AboutPage} />
          <Route path="/contact"              component={ContactPage} />
          <Route path="/privacy"              component={PrivacyPage} />
          <Route path="/terms"               component={TermsPage} />
          <Route path="/:slug"               component={SeoPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
