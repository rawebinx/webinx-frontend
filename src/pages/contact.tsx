import { Helmet } from "react-helmet";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | WebinX</title>
        <meta name="description" content="Contact WebinX for support, partnerships, or webinar listings." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <p className="mb-4">
          For inquiries, partnerships, or support, reach out to us:
        </p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="mb-2"><strong>Email:</strong> support@webinx.in</p>
          <p className="mb-2"><strong>Location:</strong> India</p>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">For Webinar Hosts</h2>
        <p>
          Submit your webinar via our upcoming host submission form.
        </p>
      </div>
    </>
  );
}
