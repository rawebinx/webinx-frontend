// src/pages/submit-webinar.tsx — WebinX Host Event Submission
// Any host can list their webinar. Registration URL must be external.

import { useState } from "react";
import { Helmet } from "react-helmet-async";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

const SECTORS = [
  "Technology", "AI & Machine Learning", "Finance", "Marketing",
  "Healthcare", "Startup", "HR", "Education", "Legal", "Sales",
  "Product Management", "Design", "Data Science", "Cybersecurity", "Other",
];

const PLATFORMS = [
  { label: "Zoom",       hint: "https://zoom.us/webinar/register/..." },
  { label: "Google Meet", hint: "https://meet.google.com/..." },
  { label: "Eventbrite",  hint: "https://www.eventbrite.com/e/..." },
  { label: "Lu.ma",       hint: "https://lu.ma/..." },
  { label: "LinkedIn",    hint: "https://www.linkedin.com/events/..." },
  { label: "YouTube Live", hint: "https://www.youtube.com/live/..." },
  { label: "Microsoft Teams", hint: "https://teams.microsoft.com/..." },
  { label: "Other",       hint: "https://your-platform.com/event/..." },
];

interface FormState {
  title: string;
  host_name: string;
  host_email: string;
  start_date: string;
  start_time: string;
  registration_url: string;
  platform: string;
  sector: string;
  description: string;
}

const EMPTY: FormState = {
  title: "", host_name: "", host_email: "",
  start_date: "", start_time: "18:00",
  registration_url: "", platform: "Zoom",
  sector: "Technology", description: "",
};

function urlHint(platform: string): string {
  return PLATFORMS.find(p => p.label === platform)?.hint ?? "https://your-platform.com/event/...";
}

function isExternalUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      url.startsWith("https://") &&
      !host.includes("webinx.in") &&
      !host.includes("example.com") &&
      host.length > 3
    );
  } catch { return false; }
}

export default function SubmitWebinarPage() {
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormState>>({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState<{ slug: string; title: string } | null>(null);
  const [serverErr, setServerErr] = useState("");

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
    setServerErr("");
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.title.trim() || form.title.trim().length < 8)
      e.title = "Title must be at least 8 characters.";
    if (!form.host_name.trim())
      e.host_name = "Host name is required.";
    if (!form.host_email.trim() || !form.host_email.includes("@"))
      e.host_email = "Valid email is required.";
    if (!form.start_date)
      e.start_date = "Event date is required.";
    if (!form.registration_url.trim())
      e.registration_url = "Registration URL is required.";
    else if (!isExternalUrl(form.registration_url.trim()))
      e.registration_url = "Must be a valid https:// URL on an external platform (not webinx.in).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerErr("");

    const startISO = form.start_date && form.start_time
      ? `${form.start_date}T${form.start_time}:00+05:30`
      : "";

    try {
      const res = await fetch(`${API_BASE}/api/events/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:            form.title.trim(),
          host_name:        form.host_name.trim(),
          host_email:       form.host_email.trim().toLowerCase(),
          start_time:       startISO,
          registration_url: form.registration_url.trim(),
          event_url:        form.registration_url.trim(),
          sector:           form.sector,
          description:      form.description.trim(),
          source:           "host-submit",
          platform:         form.platform,
        }),
      });

      const data = await res.json();
      if (res.ok && data.slug) {
        setSuccess({ slug: data.slug, title: form.title });
        setForm(EMPTY);
      } else {
        setServerErr(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setServerErr("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>List Your Webinar Free — WebinX</title>
        <meta
          name="description"
          content="Submit your webinar to WebinX for free. Reach thousands of professionals across India. Any platform — Zoom, Eventbrite, Lu.ma, Google Meet."
        />
        <link rel="canonical" href="https://www.webinx.in/submit-webinar" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">
            For Hosts
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            List Your Webinar — Free
          </h1>
          <p className="text-gray-500 text-sm">
            Submit your webinar and reach thousands of professionals across India.
            Works with any platform — Zoom, Eventbrite, Lu.ma, Google Meet, and more.
            Your registration link goes directly to your platform.
          </p>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap gap-4 mb-8 text-xs text-gray-500">
          {["✅ Free listing", "🔗 Links to your platform", "🚀 Live within 24 hours", "📧 No account needed"].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Success state */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-800 font-semibold mb-1">🎉 Webinar submitted!</p>
            <p className="text-green-700 text-sm mb-3">
              "{success.title}" will be live on WebinX within 24 hours after review.
            </p>
            <a
              href={`/webinar/${success.slug}`}
              className="text-sm text-purple-600 hover:underline"
            >
              Preview your listing →
            </a>
            <button
              onClick={() => setSuccess(null)}
              className="ml-4 text-sm text-gray-500 hover:underline"
            >
              Submit another
            </button>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webinar Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="e.g. Advanced Python for Data Science — Live Workshop"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Host name + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host / Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.host_name}
                  onChange={e => set("host_name", e.target.value)}
                  placeholder="e.g. NASSCOM, IIM Bangalore"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {errors.host_name && <p className="text-red-500 text-xs mt-1">{errors.host_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.host_email}
                  onChange={e => set("host_email", e.target.value)}
                  placeholder="you@yourorg.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {errors.host_email && <p className="text-red-500 text-xs mt-1">{errors.host_email}</p>}
              </div>
            </div>

            {/* Date + time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={e => set("start_date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (IST)
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={e => set("start_time", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>

            {/* Platform + URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PLATFORMS.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => set("platform", p.label)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.platform === p.label
                        ? "bg-purple-600 text-white border-purple-600"
                        : "text-gray-600 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={form.registration_url}
                onChange={e => set("registration_url", e.target.value)}
                placeholder={urlHint(form.platform)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">
                The URL where attendees register on your platform. This is where "Register Now" will link.
              </p>
              {errors.registration_url && (
                <p className="text-red-500 text-xs mt-1">{errors.registration_url}</p>
              )}
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector / Topic
              </label>
              <select
                value={form.sector}
                onChange={e => set("sector", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              >
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="What will attendees learn? Who should attend? Any prerequisites?"
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              />
            </div>

            {/* Server error */}
            {serverErr && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{serverErr}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition text-sm"
            >
              {loading ? "Submitting…" : "Submit Webinar — Free →"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you confirm the registration URL links to your own event on an external platform.
              WebinX does not host webinars — we only list them.
            </p>
          </form>
        )}

        {/* FAQ */}
        <div className="mt-12 border-t border-gray-100 pt-8 space-y-4">
          {[
            ["Is listing free?", "Yes, always. WebinX is free for hosts to list their events."],
            ["How long does approval take?", "Most submissions go live within 24 hours. We verify the registration URL is valid and external."],
            ["Which platforms are supported?", "Any platform with a public registration URL — Zoom, Eventbrite, Lu.ma, Google Meet, LinkedIn Events, Microsoft Teams, YouTube Live, and more."],
            ["Can I edit my listing?", "Email contact@webinx.in with your event slug and the change you need. Admin dashboard coming soon."],
            ["What is the affiliate programme?", "We're building an affiliate model for event-related products. Email contact@webinx.in to be notified when it launches."],
          ].map(([q, a]) => (
            <div key={q}>
              <p className="text-sm font-medium text-gray-800">{q}</p>
              <p className="text-sm text-gray-500 mt-0.5">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
