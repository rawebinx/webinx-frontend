import { Helmet } from "react-helmet";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      <Helmet>
        <title>About WebinX | Webinar Discovery Platform</title>
        <meta name="description" content="WebinX is India's leading webinar discovery platform. Find, explore, and join webinars across categories." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">About WebinX</h1>

      <p className="mb-4 text-muted-foreground">
        WebinX is an AI-powered webinar discovery platform built to help users find the best webinars across categories like marketing, finance, technology, and career growth.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Our Mission</h2>
      <p className="text-muted-foreground mb-4">
        To become the “Google of Webinars” by organizing and making webinar knowledge accessible to everyone.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What We Do</h2>
      <ul className="list-disc ml-6 text-muted-foreground space-y-2">
        <li>Aggregate webinars from multiple sources</li>
        <li>Provide clean and structured discovery</li>
        <li>Enable hosts to reach targeted audiences</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">For Users</h2>
      <p className="text-muted-foreground mb-4">
        Discover relevant webinars based on your interests, career goals, and learning needs.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">For Hosts</h2>
      <p className="text-muted-foreground mb-4">
        Get visibility, traffic, and targeted users for your webinars.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-muted-foreground">
        Email: support@webinx.in
      </p>
    </main>
  );
}
