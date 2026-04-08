import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HostLanding() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-center">

      <Helmet>
        <title>Host Your Webinar | WebinX</title>
        <meta name="description" content="Promote your webinar on WebinX and reach targeted audience across India." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">
        Host Your Webinar on WebinX
      </h1>

      <p className="text-muted-foreground mb-8">
        Reach thousands of learners and professionals. Promote your webinars, increase registrations, and grow your audience.
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <Button size="lg">
          Submit Webinar (Coming Soon)
        </Button>

        <Link href="/contact">
          <Button variant="outline" size="lg">
            Contact Us
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-left">
        <h2 className="text-xl font-semibold mb-4">Why WebinX?</h2>

        <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
          <li>Targeted webinar audience</li>
          <li>SEO visibility for your events</li>
          <li>Lead generation opportunities</li>
          <li>Featured placement options</li>
        </ul>
      </div>

    </main>
  );
}
