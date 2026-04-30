// src/pages/get-featured.tsx — WebinX Featured Listing Purchase
// v2: uses createRazorpayOrder + verifyRazorpayPayment from api.ts (no raw fetch),
// proper Razorpay types (no any), teal/gold brand (no purple), explicit return types.

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Check, ArrowRight, Zap, TrendingUp, Mail } from 'lucide-react';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/api';

// ─── Razorpay SDK types (replaces `Razorpay: any`) ───────────────────────────

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

interface RazorpayOptions {
  key:         string;
  amount:      number;
  currency:    string;
  name:        string;
  description: string;
  order_id:    string;
  prefill:     { email: string };
  theme:       { color: string };
  handler:     (response: RazorpayResponse) => void;
  modal:       { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new(options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window { Razorpay?: RazorpayConstructor; }
}

// ─── Plan config ─────────────────────────────────────────────────────────────

interface Plan {
  id:        string;
  name:      string;
  price:     string;
  paise:     number;
  per:       string;
  badge:     string;
  features:  string[];
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'week', name: '7 Days', price: '₹299', paise: 29900, per: 'per week',
    badge: 'Starter',
    features: ['Featured badge on listing', 'Top placement in search', 'Priority in trending'],
    highlight: false,
  },
  {
    id: 'month', name: '30 Days', price: '₹799', paise: 79900, per: 'per month',
    badge: 'Most Popular',
    features: ['Everything in 7 Days', 'Homepage featured section', 'Email digest inclusion'],
    highlight: true,
  },
  {
    id: 'quarter', name: '90 Days', price: '₹1,999', paise: 199900, per: 'per quarter',
    badge: 'Best Value',
    features: ['Everything in 30 Days', 'Analytics dashboard', 'Sponsor match alerts'],
    highlight: false,
  },
];

const BENEFITS = [
  { icon: <TrendingUp size={20} />, label: '3–5× more registrations',  sub: 'vs non-featured listings' },
  { icon: <Star size={20} />,       label: 'Featured badge',            sub: 'on your event card'       },
  { icon: <Mail size={20} />,       label: 'Email digest',              sub: 'sent to all subscribers'  },
  { icon: <Zap size={20} />,        label: 'Instant activation',        sub: 'goes live immediately'    },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GetFeaturedPage(): JSX.Element {
  const [eventSlug,    setEventSlug]    = useState<string>('');
  const [hostEmail,    setHostEmail]    = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('month');
  const [loading,      setLoading]      = useState<boolean>(false);
  const [success,      setSuccess]      = useState<boolean>(false);
  const [error,        setError]        = useState<string>('');
  const [rzpReady,     setRzpReady]     = useState<boolean>(false);

  const plan = PLANS.find((p) => p.id === selectedPlan) ?? PLANS[1];

  // Dynamically load Razorpay checkout.js
  useEffect((): void => {
    if (window.Razorpay) { setRzpReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = (): void => setRzpReady(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      setError('');

      if (!eventSlug.trim())              { setError('Please enter your event slug.'); return; }
      if (!hostEmail.includes('@'))       { setError('Please enter a valid email address.'); return; }
      if (!rzpReady || !window.Razorpay)  { setError('Payment SDK is loading — please wait a moment.'); return; }

      setLoading(true);
      try {
        // Step 1 — create Razorpay order via api.ts (no raw fetch)
        const order = await createRazorpayOrder({
          event_slug: eventSlug.trim(),
          plan:       selectedPlan,
          host_email: hostEmail.trim(),
        });

        // Step 2 — open Razorpay checkout
        const options: RazorpayOptions = {
          key:         order.key_id,
          amount:      order.amount,
          currency:    order.currency,
          name:        'WebinX',
          description: `${plan.name} Featured Listing`,
          order_id:    order.order_id,
          prefill:     { email: hostEmail.trim() },
          theme:       { color: '#0D4F6B' },
          handler: (response): void => {
            // Step 3 — verify payment; use async IIFE since handler is sync
            void (async (): Promise<void> => {
              try {
                const verify = await verifyRazorpayPayment({
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                });
                if (verify.status === 'ok') {
                  setSuccess(true);
                } else {
                  setError('Payment verification failed. Email contact@webinx.in with your payment ID.');
                }
              } catch {
                setError('Verification error. Email contact@webinx.in with your payment ID.');
              } finally {
                setLoading(false);
              }
            })();
          },
          modal: { ondismiss: (): void => setLoading(false) },
        };

        new window.Razorpay(options).open();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong';
        setError(`${msg}. Try again or email contact@webinx.in`);
        setLoading(false);
      }
    },
    [eventSlug, hostEmail, selectedPlan, plan.name, rzpReady],
  );

  return (
    <>
      <Helmet>
        <title>Get Featured on WebinX — Boost Your Webinar Visibility</title>
        <meta
          name="description"
          content="Feature your webinar on WebinX — India's top knowledge events platform. Get top placement, featured badge, and email digest inclusion."
        />
        <link rel="canonical" href="https://www.webinx.in/get-featured" />
        <meta property="og:title" content="Get Featured on WebinX" />
        <meta property="og:description" content="Featured events get 3–5× more registrations on WebinX." />
      </Helmet>

      <main className="has-bottom-nav">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1rem 3rem' }}>

          {/* ── Page header ── */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#FFFBEB',
                border: '1px solid rgba(232,180,74,0.3)',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#92400E',
                marginBottom: 16,
              }}
            >
              <Star size={13} fill="#E8B44A" stroke="none" />
              Featured Listings
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
                fontWeight: 400,
                color: '#0D4F6B',
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              Get Your Webinar Featured
            </h1>
            <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
              Reach thousands of professionals actively discovering events on WebinX.
            </p>
          </div>

          {/* ── Success screen ── */}
          {success ? (
            <div
              style={{
                background: 'linear-gradient(135deg, #0D4F6B 0%, #1a6e8f 100%)',
                borderRadius: 20,
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#fff',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                Featured Listing Activated!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}>
                Your webinar now has the ★ Featured badge and top placement across WebinX.
                Your listing is live immediately.
              </p>
              <a
                href="/webinars"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  background: '#E8B44A',
                  color: '#1a1a1a',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(232,180,74,0.35)',
                }}
              >
                View Your Webinar
                <ArrowRight size={15} />
              </a>
            </div>
          ) : (
            <>
              {/* ── Benefits row ── */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '2rem',
                }}
              >
                {BENEFITS.map((b) => (
                  <div
                    key={b.label}
                    style={{
                      background: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: 12,
                      padding: '14px 12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: '#E1F5EE',
                        color: '#0D4F6B',
                        marginBottom: 8,
                      }}
                    >
                      {b.icon}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                      {b.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{b.sub}</div>
                  </div>
                ))}
              </div>

              {/* ── Plan selector ── */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '0.875rem',
                  marginBottom: '2rem',
                }}
              >
                {PLANS.map((p) => {
                  const active = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={(): void => setSelectedPlan(p.id)}
                      style={{
                        position: 'relative',
                        textAlign: 'left',
                        padding: '1.25rem',
                        borderRadius: 14,
                        border: `2px solid ${active ? '#0D4F6B' : '#E5E7EB'}`,
                        background: active ? '#E1F5EE' : '#fff',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {p.highlight && (
                        <div
                          style={{
                            position: 'absolute',
                            top: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#E8B44A',
                            color: '#1a1a1a',
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 10px',
                            borderRadius: 20,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ★ {p.badge}
                        </div>
                      )}

                      {/* Price */}
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: active ? '#0D4F6B' : '#111827',
                          lineHeight: 1,
                          marginBottom: 2,
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {p.price}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#9CA3AF', marginBottom: 10 }}>{p.per}</div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: '#111827',
                          marginBottom: 10,
                        }}
                      >
                        {p.name}
                      </div>

                      {/* Features */}
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {p.features.map((f) => (
                          <li
                            key={f}
                            style={{
                              fontSize: 12,
                              color: '#4B5563',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 6,
                            }}
                          >
                            <Check
                              size={12}
                              strokeWidth={2.5}
                              style={{ color: '#0D4F6B', marginTop: 1, flexShrink: 0 }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Selected indicator */}
                      {active && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#0D4F6B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={11} strokeWidth={3} color="#fff" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Checkout form ── */}
              <form
                onSubmit={(e): void => { void handlePayment(e); }}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Star size={16} fill="#E8B44A" stroke="none" />
                  {plan.name} Featured — {plan.price}
                </h3>

                {/* Event slug input */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}
                  >
                    Event Slug
                    <span style={{ fontWeight: 400, color: '#9CA3AF', marginLeft: 6 }}>
                      (from your webinar URL)
                    </span>
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: '#fff',
                    }}
                  >
                    <span
                      style={{
                        padding: '10px 12px',
                        fontSize: 12.5,
                        color: '#9CA3AF',
                        background: '#F8FAFC',
                        borderRight: '1px solid #E5E7EB',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      webinx.in/webinar/
                    </span>
                    <input
                      type="text"
                      required
                      value={eventSlug}
                      onChange={(e): void => setEventSlug(e.target.value)}
                      placeholder="your-event-slug"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        fontSize: 13.5,
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        minWidth: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Email input */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={hostEmail}
                    onChange={(e): void => setHostEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 13.5,
                      border: '1.5px solid #E5E7EB',
                      borderRadius: 10,
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      background: '#fff',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#0D4F6B'; }}
                    onBlur={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 13,
                      color: '#991B1B',
                      marginBottom: '1rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Pay button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    background: loading ? '#9CA3AF' : '#0D4F6B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-sans)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'opacity 0.15s',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(13,79,107,0.25)',
                  }}
                >
                  {loading ? (
                    'Processing…'
                  ) : (
                    <>
                      Pay {plan.price} — Get Featured for {plan.name}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p style={{ fontSize: 11.5, color: '#9CA3AF', textAlign: 'center', marginTop: 10 }}>
                  🔒 Secure payment via Razorpay · UPI, Cards, Net Banking · Instant activation
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
