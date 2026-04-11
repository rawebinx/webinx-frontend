import Home from "./pages/home";
import WebinarDetailPage from "./pages/webinar";
import CategoryPage from "./pages/category";

function App() {
  const path = window.location.pathname;

  if (path.startsWith("/webinar/")) return <WebinarDetailPage />;
  if (path.startsWith("/category/")) return <CategoryPage />;

  return <Home />;
}

export default App;
