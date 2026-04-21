import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/home";
import WebinarDetailPage from "./pages/webinar";
import WebinarsPage from "./pages/webinars";
import CategoryPage from "./pages/category";
import SeoPage from "./pages/seo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function Router() {
  const path = window.location.pathname;

  if (path === "/webinars") return <WebinarsPage />;
  if (path.startsWith("/webinar/")) return <WebinarDetailPage />;
  if (path.startsWith("/category/")) return <CategoryPage />;

  // Programmatic SEO — single-segment paths that aren't root
  if (path.split("/").filter(Boolean).length === 1) return <SeoPage />;

  return <Home />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
