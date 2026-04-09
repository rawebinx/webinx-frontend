import { Route, Switch } from "wouter";

import Home from "./pages/home";
import HostDetail from "./pages/host-detail";
import About from "./pages/about";
import Contact from "./pages/contact";

function App() {
  return (
    <Switch>
      {/* ✅ SPECIFIC ROUTES FIRST */}
      <Route path="/hosts/:slug" component={HostDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      {/* ✅ HOME MUST BE LAST */}
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
