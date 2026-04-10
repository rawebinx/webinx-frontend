import { Route } from "wouter";

import Home from "./pages/home";
import HostDetail from "./pages/host-detail";
import About from "./pages/about";
import Contact from "./pages/contact";

function App() {
  const path = window.location.pathname;

  // ✅ HARD ROUTING (NO WOUTER SWITCH BUG)
  if (path.startsWith("/hosts/")) {
    return <HostDetail />;
  }

  if (path === "/about") return <About />;
  if (path === "/contact") return <Contact />;

  return <Home />;
}

export default App;
