import { Route, Switch } from "wouter";
import Home from "./pages/home";
import Browse from "./pages/browse";
import Webinar from "./pages/webinar";
import HostDetail from "./pages/host-detail";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/webinar/:slug" component={Webinar} />
      <Route path="/hosts/:slug" component={HostDetail} />
    </Switch>
  );
}

export default App;
