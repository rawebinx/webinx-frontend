import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>WebinX – Discover Top Webinars in India</title>
        <meta
          name="description"
          content="Discover and join the best webinars in India across AI, marketing, finance, and business."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover & Join Top Webinars in India
        </h1>

        <p className="text-lg md:text-xl mb-6">
          Discover & Join the Best Webinars in India
        </p>

        <a
          href="/webinars"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Explore Webinars →
        </a>

        <div className="mt-6 text-sm opacity-90">
          AI • Marketing • Finance • Business
        </div>

        <div className="mt-2 text-sm opacity-75">
          100+ webinars • Updated daily • Free learning
        </div>
      </div>
    </>
  );
}
