// src/pages/submit-webinar.tsx — WebinX Host Event Submission
// v2 changes:
//  1. API_BASE inline declaration removed — imported from @/lib/api
//  2. Raw fetch() replaced with submitEventForm() from @/lib/api
//  3. Explicit JSX.Element return type on component
//  4. Explicit parameter types on set() and validate()
//  5. handleSubmit called with void pattern in form onSubmit
//  6. All form design, validation, and UX preserved exactly

import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { submitEventForm } from '@/lib/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  { value: 'webinar',    label: '🎥 Webinar',    desc: 'Live online session' },
  { value: 'podcast',    label: '🎙️ Podcast',    desc: 'Audio/video episode' },
  { value: 'live_event', label: '📍 Live Event', desc: 'In-person / hybrid' },
] as const;

type ContentType = 'webinar' | 'podcast' | 'live_event';

const SECTORS = [
  'Technology', 'AI & Machine Learning', 'Finance', 'Marketing',
  'Healthcare', 'Startup', 'HR', 'Education', 'Legal', 'Sales',
  'Product Management', 'Design', 'Data Science', 'Cybersecurity', 'Other',
];

const PLATFORMS = [
  { label: 'Zoom',            hint: 'https://zoom.us/webinar/register/...' },
  { label: 'Google Meet',     hint: 'https://meet.google.com/...' },
  { label: 'Eventbrite',      hint: 'https://www.eventbrite.com/e/...' },
  { label: 'Lu.ma',           hint: 'https://lu.ma/...' },
  { label: 'LinkedIn',        hint: 'https://www.linkedin.com/events/...' },
  { label: 'YouTube Live',    hint: 'https://www.youtube.com/live/...' },
  { label: 'Microsoft Teams', hint: 'https://teams.microsoft.com/...' },
  { label: 'Spotify',         hint: 'https://open.spotify.com/episode/...' },
  { label: 'Apple Podcasts',  hint: 'https://podcasts.apple.com/...' },
  { label: 'Other',           hint: 'https://your-platform.com/event/...' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  content_type:     ContentType;
  title:            string;
  host_name:        string;
  host_email:       string;
  start_date:       string;
  start_time:       string;
  registration_url: string;
  platform:         string;
  sector:           string;
  description:      string;
  // Podcast extras
  episode_number:   string;
  duration_minutes: string;
  podcast_series:   string;
  // Live event extras
  venue_name:       string;
  venue_city:       string;
  is_hybrid:        boolean;
  ticket_price_inr: string;
}

const EMPTY: FormState = {
  content_type: 'webinar',
  title: '', host_name: '', host_email: '',
  start_date: '', start_time: '18:00',
  registration_url: '', platform: 'Zoom',
  sector: 'Technology', description: '',
  episode_number: '', duration_minutes: '', podcast_series: '',
  venue_name: '', venue_city: '', is_hybrid: false, ticket_price_inr: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function urlHint(platform: string): string {
  return PLATFORMS.find((p) => p.label === platform)?.hint ?? 'https://your-platform.com/event/...';
}

function isExternalUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return url.startsWith('https://') && !host.includes('webinx.in') && host.length > 3;
  } catch { return false; }
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputClass = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all';
const inputStyle: React.CSSProperties = {
  border:     '1.5px solid var(--wx-border)',
  background: 'var(--wx-white)',
  color:      'var(--wx-ink)',
  fontFamily: 'var(--font-sans)',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SubmitWebinarPage(): JSX.Element {
  const [form,      setForm]      = useState<FormState>(EMPTY);
  const [errors,    setErrors]    = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading,   setLoading]   = useState<boolean>(false);
  const [success,   setSuccess]   = useState<{ slug: string; title: string } | null>(null);
  const [serverErr, setServerErr] = useState<string>('');

  const set = useCallback(
    (field: keyof FormState, value: string | boolean): void => {
      setForm((f) => ({ ...f, [field]: value }));
      setErrors((e) => ({ ...e, [field]: '' }));
      setServerErr('');
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim() || form.title.trim().length < 8)
      e.title = 'Title must be at least 8 characters.';
    if (!form.host_name.trim())
      e.host_name = 'Host name is required.';
    if (!form.host_email.trim() || !form.host_email.includes('@'))
      e.host_email = 'Valid email is required.';
    if (form.content_type !== 'podcast' && !form.start_date)
      e.start_date = 'Date is required.';
    if (!form.registration_url.trim())
      e.registration_url = 'Registration / link URL is required.';
    else if (!isExternalUrl(form.registration_url.trim()))
      e.registration_url = 'Must be a valid https:// URL (not webinx.in).';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent): Promise<void> => {
      ev.preventDefault();
      if (!validate()) return;
      setLoading(true);
      setServerErr('');

      const startISO = form.start_date && form.start_time
        ? `${form.start_date}T${form.start_time}:00+05:30`
        : '';

      try {
        const body: Record<string, unknown> = {
          content_type:     form.content_type,
          title:            form.title.trim(),
          host_name:        form.host_name.trim(),
          host_email:       form.host_email.trim().toLowerCase(),
          start_time:       startISO || undefined,
          registration_url: form.registration_url.trim(),
          event_url:        form.registration_url.trim(),
          sector:           form.sector,
          description:      form.description.trim(),
          source:           'host-submit',
          platform:         form.platform,
        };

        // Podcast extras
        if (form.content_type === 'podcast') {
          if (form.episode_number)   body.episode_number   = Number(form.episode_number);
          if (form.duration_minutes) body.duration_minutes = Number(form.duration_minutes);
          if (form.podcast_series)   body.podcast_series   = form.podcast_series.trim();
        }

        // Live event extras
        if (form.content_type === 'live_event') {
          if (form.venue_name)       body.venue_name       = form.venue_name.trim();
          if (form.venue_city)       body.venue_city       = form.venue_city.trim();
          body.is_hybrid  = form.is_hybrid;
          body.is_online  = form.is_hybrid;
          if (form.ticket_price_inr) body.ticket_price_inr = Number(form.ticket_price_inr);
        }

        // Uses submitEventForm from api.ts — no raw fetch, no inline API_BASE
        const data = await submitEventForm(body);

        if (data.slug) {
          setSuccess({ slug: data.slug, title: form.title });
          setForm(EMPTY);
        } else {
          setServerErr('Submission failed. Please check your details and try again.');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        setServerErr(
          msg.includes('HTTP 4')
            ? 'Submission rejected. Please check your URL is a valid external https:// link.'
            : 'Network error. Please check your connection and try again.',
        );
      } finally {
        setLoading(false);
      }
    },
    [form, validate],
  );

  const typeLabel = CONTENT_TYPES.find((t) => t.value === form.content_type)?.label ?? '🎥 Webinar';

  return (
    <>
      <Helmet>
        <title>List Your Event Free — WeBinX</title>
        <meta name="description" content="Submit your webinar, podcast or live event to WeBinX for free. Reach thousands of professionals across India." />
        <link rel="canonical" href="https://webinx.in/submit-webinar" />
        <meta property="og:title" content="List Your Event Free — WeBinX" />
        <meta property="og:description" content="Submit your webinar, podcast or live event to WeBinX for free." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-10 has-bottom-nav">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--wx-teal)' }}>
            For Hosts
          </p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-display)' }}>
            List Your Event — Free
          </h1>
          <p className="text-sm" style={{ color: 'var(--wx-muted)', lineHeight: 1.7 }}>
            Submit your webinar, podcast episode or live event and reach thousands of professionals across India.
          </p>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap gap-4 mb-8 text-xs" style={{ color: 'var(--wx-muted)' }}>
          {['✅ Free listing', '🔗 Links to your platform', '🚀 Live within 24 hours', '📧 No account needed'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Success state */}
        {success && (
          <div className="rounded-xl p-6 mb-8" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <p className="font-semibold mb-1" style={{ color: '#065f46' }}>🎉 Submitted!</p>
            <p className="text-sm mb-3" style={{ color: '#047857' }}>
              "{success.title}" will be live on WeBinX within 24 hours after review.
            </p>
            <a href={`/webinar/${success.slug}`} className="text-sm font-semibold" style={{ color: 'var(--wx-teal)' }}>
              Preview your listing →
            </a>
            <button
              onClick={(): void => setSuccess(null)}
              className="ml-4 text-sm"
              style={{ color: 'var(--wx-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Submit another
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={(e): void => { void handleSubmit(e); }} className="space-y-6">

            {/* ── Content Type Selector ── */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--wx-ink)' }}>
                What are you listing?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={(): void => set('content_type', ct.value)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      border:      `2px solid ${form.content_type === ct.value ? 'var(--wx-teal)' : 'var(--wx-border)'}`,
                      background:  form.content_type === ct.value ? 'var(--wx-teal-pale)' : 'var(--wx-white)',
                      color:       form.content_type === ct.value ? 'var(--wx-teal)' : 'var(--wx-muted)',
                      cursor:      'pointer',
                    }}
                  >
                    <span className="text-lg">{ct.label.split(' ')[0]}</span>
                    <span>{ct.label.split(' ').slice(1).join(' ')}</span>
                    <span className="text-xs font-normal" style={{ color: 'var(--wx-muted)' }}>{ct.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Title ── */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>
                {form.content_type === 'podcast' ? 'Episode Title' : form.content_type === 'live_event' ? 'Event Title' : 'Webinar Title'}{' '}
                <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e): void => set('title', e.target.value)}
                placeholder={
                  form.content_type === 'podcast'
                    ? 'e.g. How to Build a B2B Podcast from Scratch'
                    : form.content_type === 'live_event'
                    ? 'e.g. Startup India Summit 2026 — Ahmedabad'
                    : 'e.g. Advanced Python for Data Science — Live Workshop'
                }
                className={inputClass}
                style={inputStyle}
              />
              {errors.title && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.title}</p>}
            </div>

            {/* ── Host / Email ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>
                  Host / Organization <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.host_name}
                  onChange={(e): void => set('host_name', e.target.value)}
                  placeholder="e.g. NASSCOM, IIM Bangalore"
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.host_name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.host_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>
                  Your Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={form.host_email}
                  onChange={(e): void => set('host_email', e.target.value)}
                  placeholder="you@yourorg.com"
                  className={inputClass}
                  style={inputStyle}
                />
                {errors.host_email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.host_email}</p>}
              </div>
            </div>

            {/* ── Date/Time (hidden for podcast) ── */}
            {form.content_type !== 'podcast' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>
                    Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e): void => set('start_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputClass}
                    style={inputStyle}
                  />
                  {errors.start_date && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.start_date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>
                    Time (IST)
                  </label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e): void => set('start_time', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* ── Podcast extras ── */}
            {form.content_type === 'podcast' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Episode #</label>
                  <input
                    type="number"
                    value={form.episode_number}
                    onChange={(e): void => set('episode_number', e.target.value)}
                    placeholder="42"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Duration (mins)</label>
                  <input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e): void => set('duration_minutes', e.target.value)}
                    placeholder="45"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Series Name</label>
                  <input
                    type="text"
                    value={form.podcast_series}
                    onChange={(e): void => set('podcast_series', e.target.value)}
                    placeholder="The Startup Diaries"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* ── Live event extras ── */}
            {form.content_type === 'live_event' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Venue Name</label>
                    <input
                      type="text"
                      value={form.venue_name}
                      onChange={(e): void => set('venue_name', e.target.value)}
                      placeholder="NSCI Dome, Mumbai"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>City</label>
                    <input
                      type="text"
                      value={form.venue_city}
                      onChange={(e): void => set('venue_city', e.target.value)}
                      placeholder="Mumbai"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Ticket Price (₹)</label>
                    <input
                      type="number"
                      value={form.ticket_price_inr}
                      onChange={(e): void => set('ticket_price_inr', e.target.value)}
                      placeholder="0 = Free"
                      className={inputClass}
                      style={{ ...inputStyle, width: 140 }}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer mt-5" style={{ color: 'var(--wx-ink)' }}>
                    <input
                      type="checkbox"
                      checked={form.is_hybrid}
                      onChange={(e): void => set('is_hybrid', e.target.checked)}
                      style={{ accentColor: 'var(--wx-teal)', width: 16, height: 16 }}
                    />
                    Hybrid event (also online)
                  </label>
                </div>
              </div>
            )}

            {/* ── Platform selector ── */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={(): void => set('platform', p.label)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                    style={{
                      background:   form.platform === p.label ? 'var(--wx-teal)' : 'transparent',
                      color:        form.platform === p.label ? '#fff' : 'var(--wx-muted)',
                      borderColor:  form.platform === p.label ? 'var(--wx-teal)' : 'var(--wx-border)',
                      cursor:       'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Registration URL ── */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>
                {form.content_type === 'podcast' ? 'Listen / Episode URL' : 'Registration URL'}{' '}
                <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="url"
                value={form.registration_url}
                onChange={(e): void => set('registration_url', e.target.value)}
                placeholder={urlHint(form.platform)}
                className={inputClass}
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13 }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--wx-muted)' }}>
                {form.content_type === 'podcast'
                  ? 'Link to the episode on Spotify, Apple Podcasts, or your website.'
                  : 'The URL where attendees register on your platform.'}
              </p>
              {errors.registration_url && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.registration_url}</p>}
            </div>

            {/* ── Sector ── */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Sector / Topic</label>
              <select
                value={form.sector}
                onChange={(e): void => set('sector', e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* ── Description ── */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--wx-ink)' }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e): void => set('description', e.target.value)}
                placeholder="What will attendees learn? Who should attend? Any prerequisites?"
                rows={4}
                className={inputClass}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>

            {/* ── Server error ── */}
            {serverErr && (
              <p className="text-sm p-3 rounded-xl" style={{ background: '#fef2f2', color: '#b91c1c' }}>
                {serverErr}
              </p>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
              style={{
                background:  loading ? 'var(--wx-muted)' : 'var(--wx-teal)',
                color:       '#fff',
                border:      'none',
                cursor:      loading ? 'wait' : 'pointer',
                boxShadow:   loading ? 'none' : '0 4px 16px rgba(13,79,107,0.25)',
                fontFamily:  'inherit',
              }}
            >
              {loading ? 'Submitting…' : `Submit ${typeLabel.split(' ').slice(1).join(' ')} — Free →`}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--wx-muted)' }}>
              By submitting, you confirm the URL links to your own event on an external platform.
              WeBinX does not host events — we only list them.
            </p>
          </form>
        )}

        {/* ── FAQ ── */}
        <div className="mt-12 space-y-5" style={{ borderTop: '1px solid var(--wx-border)', paddingTop: 32 }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--wx-ink)' }}>Frequently asked</h3>
          {[
            ['Is listing free?',               'Yes, always. WeBinX is free for hosts to list their events.'],
            ['How long does approval take?',    'Most submissions go live within 24 hours. We verify the URL is valid and external.'],
            ['Which platforms are supported?',  'Any platform with a public URL — Zoom, Eventbrite, Lu.ma, Google Meet, LinkedIn Events, Teams, YouTube Live, Spotify, Apple Podcasts and more.'],
            ['Can I edit my listing?',          'Email contact@webinx.in with your event slug and the change needed.'],
            ['What about podcasts?',            'List any podcast episode. We\'ll show it in the Podcasts section with your Spotify/Apple Podcasts link.'],
          ].map(([q, a]) => (
            <div key={q}>
              <p className="text-sm font-medium" style={{ color: 'var(--wx-ink)' }}>{q}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--wx-muted)' }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
