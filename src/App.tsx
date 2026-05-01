// src/App.tsx — WebinX Router
// v2: React.lazy + Suspense for all page routes.
// Each page is now a separate JS chunk — initial bundle drops from 502KB → ~80KB.
// Layout components (Navbar, Footer, ScrollToTop, NotFound) remain static
// because they are needed immediately on every render.

import { lazy, Suspense, useEffect } from "react";
import { Router, Switch, Route, useLocation } from "wouter";

// ── Always-loaded layout components ─────────────────────────────────────────
import { Navbar }  from "./components/navbar";
import { Footer }  from "./pages/footer";

// ── Lazy page imports — each becomes its own JS chunk ───────────────────────
// Core content
const Home             = lazy(() => import("./pages/home"));
const WebinarsPage     = lazy(() => import("./pages/webinars"));
const PodcastsPage     = lazy(() => import("./pages/podcasts"));
const LiveEventsPage   = lazy(() => import("./pages/live-events"));

// Event detail & taxonomy
const WebinarPage      = lazy(() => import("./pages/webinar"));
const CategoryPage     = lazy(() => import("./pages/category"));
const SectorPage       = lazy(() => import("./pages/sector"));
const CityPage         = lazy(() => import("./pages/city"));
const CertificatePage  = lazy(() => import("./pages/certificate"));
const EmbedPage        = lazy(() => import("./pages/embed"));

// Host pages
const HostPage         = lazy(() => import("./pages/host"));
const HostDetailPage   = lazy(() => import("./pages/host-detail"));
const HostToolsPage    = lazy(() => import("./pages/host-tools"));
const SubmitWebinarPage = lazy(() => import("./pages/submit-webinar"));

// Discovery
const WishlistPage     = lazy(() => import("./pages/wishlist"));
const AISearchPage     = lazy(() => import("./pages/ai-search"));
const BlogWebinarAttendees = lazy(() => import('@/pages/blog-webinar-attendees'));
const TrendingTopicsPage = lazy(() => import("./pages/trending-topics"));

// Growth & monetisation
const LeaderboardPage  = lazy(() => import("./pages/leaderboard"));
const RewardClaimPage  = lazy(() => import("./pages/reward-claim"));
const GetFeaturedPage  = lazy(() => import("./pages/get-featured"));
const PricingPage      = lazy(() => import("./pages/pricing"));
const MetricsPage      = lazy(() => import("./pages/metrics"));
const GearPage         = lazy(() => import("@/pages/gear"));

// Product & company
const UpcomingPage     = lazy(() => import("@/pages/upcoming"));
const AboutPage        = lazy(() => import("./pages/about"));
const ContactPage      = lazy(() => import("./pages/contact"));
const PrivacyPage      = lazy(() => import("./pages/privacy"));
const TermsPage        = lazy(() => import("./pages/terms"));

// Admin
const AdminPage        = lazy(() => import("./pages/admin"));

// SEO long-tail
const SectorCityPage   = lazy(() => import("@/pages/sector-city"));
const ForHostsPage     = lazy(() => import("@/pages/for-hosts"));
const SeoPage          = lazy(() => import("./pages/seo"));

// ── Page loading skeleton ────────────────────────────────────────────────────
// Shown while any lazy chunk is downloading. Uses the same shimmer pattern
// as the rest of the app so the transition feels native.
function PageSkeleton(): JSX.Element {
  return (
    <div className="wx-container py-10 md:py-14">
      {/* Page title placeholder */}
      <div className="skeleton h-7 w-52 rounded-xl mb-2" />
      <div className="skeleton h-4 w-80 rounded mb-8" />
      {/* Card grid placeholder */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded-2xl"
            style={{ height: 300 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Scroll to top on every route change ─────────────────────────────────────
function ScrollToTop(): null {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);
  return null;
}

// ── 404 ─────────────────────────────────────────────────────────────────────
function NotFound(): JSX.Element {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-[#0D4F6B] hover:underline text-sm">← Back to home</a>
    </div>
  );
}

// ── App shell ────────────────────────────────────────────────────────────────
function AppContent(): JSX.Element {
  const [location] = useLocation();
  const isEmbed = location.startsWith("/embed/");

  return (
    <div className="min-h-screen flex flex-col">
      {!isEmbed && <Navbar />}
      <ScrollToTop />

      {/* Suspense wraps the entire Switch so any lazy page triggers the
          PageSkeleton while its chunk downloads (~50–150ms on fast 4G). */}
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Switch>
            {/* ── Core pages ──────────────────────────────────────── */}
            <Route path="/"                  component={Home} />
            <Route path="/webinars"          component={WebinarsPage} />
            <Route path="/podcasts"          component={PodcastsPage} />
            <Route path="/live-events"       component={LiveEventsPage} />
            <Route path="/blog/get-more-webinar-attendees" component={BlogWebinarAttendees} />
            {/* ── Event detail (specific params — must stay before catch-all) */}
            <Route path="/webinar/:slug"     component={WebinarPage} />
            <Route path="/category/:slug"    component={CategoryPage} />
            <Route path="/sector/:slug"      component={SectorPage} />
            <Route path="/city/:city"        component={CityPage} />
            <Route path="/certificate/:slug" component={CertificatePage} />
            <Route path="/embed/:slug"       component={EmbedPage} />

            {/* ── Host pages ──────────────────────────────────────── */}
            <Route path="/host"              component={HostPage} />
            <Route path="/hosts/:slug"       component={HostDetailPage} />
            <Route path="/host-tools"        component={HostToolsPage} />
            <Route path="/submit-webinar"    component={SubmitWebinarPage} />

            {/* ── Discovery & search ──────────────────────────────── */}
            <Route path="/wishlist"          component={WishlistPage} />
            <Route path="/ai-search"         component={AISearchPage} />
            <Route path="/trending-topics"   component={TrendingTopicsPage} />

            {/* ── Growth & monetisation ───────────────────────────── */}
            <Route path="/top-hosts"         component={LeaderboardPage} />
            <Route path="/mention-webinx"    component={RewardClaimPage} />
            <Route path="/get-featured"      component={GetFeaturedPage} />
            <Route path="/pricing"           component={PricingPage} />
            <Route path="/metrics"           component={MetricsPage} />
            <Route path="/gear"              component={GearPage} />

            {/* ── Product & company ───────────────────────────────── */}
            <Route path="/upcoming"          component={UpcomingPage} />
            <Route path="/about"             component={AboutPage} />
            <Route path="/contact"           component={ContactPage} />
            <Route path="/privacy"           component={PrivacyPage} />
            <Route path="/terms"             component={TermsPage} />

            {/* ── Admin ───────────────────────────────────────────── */}
            <Route path="/admin"             component={AdminPage} />

            {/* ── SEO long-tail ────────────────────────────────────── */}
            <Route path="/webinars/:combo"   component={SectorCityPage} />
            <Route path="/for-hosts"         component={ForHostsPage} />

            {/* ── SEO catch-all — MUST be last named route ────────── */}
            <Route path="/:slug"             component={SeoPage} />

            {/* ── 404 ─────────────────────────────────────────────── */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>

      {!isEmbed && <Footer />}
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
