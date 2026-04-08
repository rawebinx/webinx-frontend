import { Helmet } from "react-helmet";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | WebinX</title>
        <meta name="description" content="Terms and Conditions for using WebinX platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

        <p className="mb-4">
          By using WebinX, you agree to these terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Platform Usage</h2>
        <p className="mb-4">
          WebinX provides webinar discovery. We do not host or control third-party webinars.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Accuracy</h2>
        <p className="mb-4">
          We strive for accuracy but do not guarantee correctness of event details.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Third-Party Links</h2>
        <p className="mb-4">
          Users may be redirected to external platforms. We are not responsible for their content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Liability</h2>
        <p className="mb-4">
          WebinX is not liable for any loss arising from webinar participation.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes</h2>
        <p>
          We may update these terms anytime without prior notice.
        </p>
      </div>
    </>
  );
}
