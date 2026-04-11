import Home from "./pages/home";
import WebinarDetailPage from "./pages/webinar";
import CategoryPage from "./pages/category";
import SeoPage from "./pages/seo";

function App() {
  const path = window.location.pathname;

  if (path.startsWith("/webinar/")) return <WebinarDetailPage />;
  if (path.startsWith("/category/")) return <CategoryPage />;

  // ✅ PROGRAMMATIC SEO ROUTE
  if (path.split("/").length === 2 && path !== "/") {
    return <SeoPage />;
  }

  return <Home />;
}

export default App;
