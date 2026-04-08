import { Helmet } from "react-helmet";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | WebinX</title>
        <meta name="description" content="Privacy Policy of WebinX - Webinar discovery platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          WebinX ("we", "our", "us") respects your privacy. This policy explains how we collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Basic user data (if submitted voluntarily)</li>
          <li>Usage data (pages visited, clicks)</li>
          <li>Cookies and analytics data</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Data</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Improve platform performance</li>
          <li>Show relevant webinars</li>
          <li>Analyze traffic and trends</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Third-Party Services</h2>
        <p className="mb-4">
          We may use tools like analytics providers or external webinar sources. We are not responsible for third-party policies.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p className="mb-4">
          We take reasonable steps to protect your data but cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. User Rights</h2>
        <p className="mb-4">
          Users may request removal of their data by contacting us.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Updates</h2>
        <p>
          This policy may be updated periodically.
        </p>
      </div>
    </>
  );
}
