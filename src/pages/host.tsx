import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HostLanding() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-center">

      <Helmet>
        <title>Host Your Webinar | WebinX</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">
        Host Your Webinar on WebinX
      </h1>

      <p className="text-muted-foreground mb-8">
        Promote your webinars and reach targeted audience across India.
      </p>

      <div className="flex justify-center gap-4">
        <Button size="lg">Submit Webinar</Button>

        <Link href="/contact">
          <Button variant="outline">Contact Us</Button>
        </Link>
      </div>

    </main>
  );
}
