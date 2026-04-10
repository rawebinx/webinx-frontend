import Home from "./pages/home";
import HostDetail from "./pages/host-detail";
import About from "./pages/about";
import Contact from "./pages/contact";
import WebinarDetailPage from "./pages/webinar-detail";

function App() {
  const path = window.location.pathname;

  // ✅ WEBINAR ROUTE (ADD THIS FIRST)
  if (path.startsWith("/webinar/")) {
    return <WebinarDetailPage />;
  }

  // ✅ HOST ROUTE
  if (path.startsWith("/hosts/")) {
    return <HostDetail />;
  }

  if (path === "/about") return <About />;
  if (path === "/contact") return <Contact />;

  return <Home />;
}

export default App;
