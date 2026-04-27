// src/pages/pricing.tsx
// WebinX — Host SaaS Pricing Page
// Design: Editorial luxury × Indian startup energy. DM Serif Display headers,
// teal-to-indigo depth gradient, gold accents on PRO (recommended) card.
// Mobile-first, animated plan cards, feature comparison table, FAQ.

import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  Check, X, Zap, Crown, Building2, Sparkles,
  ChevronDown, ChevronUp, ArrowRight, Star,
} from 'lucide-react';
import { apiFetch } from '../lib/api';

// ─── Plan Data ────────────────────────────────────────────────────────────────

interface Plan {
  id: 'free' | 'pro' | 'scale' | 'agency';
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  highlight: boolean;
  badge?: string;
  cta: string;
  features: string[];
  notIncluded: string[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    priceLabel: 'Free forever',
    tagline: 'List your events, get discovered.',
    icon: <Star size={20} />,
    color: '#6B7280',
    highlight: false,
    cta: 'Get Started Free',
    features: [
      'List unlimited webinars & events',
      'Public host profile',
      '2 AI tool calls per day',
      'Basic analytics (views, clicks)',
      'Wishlist & alert system for attendees',
      'WebinX verified applicant status',
    ],
    notIncluded: [
      'Verified ✓ badge on profile',
      'Email blast to followers',
      'Embed widget for your website',
      'Attendee CSV export',
      'Priority search ranking',
      'Dedicated support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    priceLabel: '₹299/month',
    tagline: 'For hosts serious about growing their audience.',
    icon: <Zap size={20} />,
    color: '#0D4F6B',
    highlight: true,
    badge: 'Most Popular',
    cta: 'Start Pro — ₹299/mo',
    features: [
      'Everything in Starter',
      '✓ Verified badge on your profile',
      '30 AI tool calls per day',
      'Full analytics dashboard',
      'Email blast to alert subscribers',
      'Embed widget for your website',
      'Attendee CSV export',
      'Priority customer support',
    ],
    notIncluded: [
      'Custom certificate branding',
      'Priority search ranking',
      'Free featured listing/month',
      'API access',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 799,
    priceLabel: '₹799/month',
    tagline: 'For power hosts & growing communities.',
    icon: <Crown size={20} />,
    color: '#E8B44A',
    highlight: false,
    cta: 'Start Scale — ₹799/mo',
    features: [
      'Everything in Pro',
      'Unlimited AI tool calls',
      'Custom certificate branding',
      'Priority search ranking boost',
      '1 free featured listing per month',
      'API access (100 req/day)',
      'Advanced analytics + CSV reports',
      'Early access to new features',
    ],
    notIncluded: [
      'Multiple host accounts',
      'White-label embed',
      'Bulk event import',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 1999,
    priceLabel: '₹1,999/month',
    tagline: 'For agencies, communities & training companies.',
    icon: <Building2 size={20} />,
    color: '#7C3AED',
    highlight: false,
    cta: 'Start Agency — ₹1,999/mo',
    features: [
      'Everything in Scale',
      '5 host accounts under one org',
      'White-label embed (remove WebinX badge)',
      'Bulk event import via CSV/API',
      'Dedicated account manager',
      'Priority SLA (4h response)',
      'Custom analytics dashboard',
      'Co-marketing opportunities',
    ],
    notIncluded: [],
  },
];

// ─── Feature Comparison Matrix ────────────────────────────────────────────────

interface Feature {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  scale: string | boolean;
  agency: string | boolean;
  tooltip?: string;
}

const FEATURE_MATRIX: Feature[] = [
  { name: 'Event listings',       free: 'Unlimited', pro: 'Unlimited', scale: 'Unlimited', agency: 'Unlimited' },
  { name: 'AI tool calls/day',    free: '2',         pro: '30',         scale: 'Unlimited', agency: 'Unlimited' },
  { name: 'Verified badge',       free: false,       pro: true,         scale: true,        agency: true },
  { name: 'Analytics dashboard',  free: 'Basic',     pro: 'Full',       scale: 'Advanced',  agency: 'Custom' },
  { name: 'Email blast to followers', free: false,   pro: true,         scale: true,        agency: true },
  { name: 'Embed widget',         free: false,       pro: true,         scale: true,        agency: 'White-label' },
  { name: 'Attendee CSV export',  free: false,       pro: true,         scale: true,        agency: true },
  { name: 'Certificate branding', free: false,       pro: false,        scale: true,        agency: true },
  { name: 'Priority search rank', free: false,       pro: false,        scale: true,        agency: true },
  { name: 'Free featured/month',  free: false,       pro: false,        scale: '1/month',   agency: '2/month' },
  { name: 'API access',           free: false,       pro: false,        scale: '100 req/day', agency: 'Unlimited' },
  { name: 'Host accounts',        free: '1',         pro: '1',          scale: '1',         agency: '5' },
  { name: 'Support',              free: 'Community', pro: 'Email',      scale: 'Priority',  agency: 'Dedicated 4h SLA' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Can I change my plan at any time?',
    a: 'Yes. Upgrade instantly — your new plan activates immediately after payment. Downgrades take effect at the end of your billing cycle.',
  },
  {
    q: 'What happens to my events if I downgrade?',
    a: 'Your events stay live. You simply lose access to Pro/Scale features like the verified badge, email blasts, and AI call quota. All your data is preserved.',
  },
  {
    q: 'Is there an annual discount?',
    a: 'Yes! Pay annually and get 2 months free. Annual plans are available — contact contact@webinx.in and we\'ll set it up manually while we build the self-serve flow.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'All major Indian payment methods via Razorpay: UPI (GPay, PhonePe, Paytm), net banking, credit/debit cards, and EMI on cards above ₹3,000.',
  },
  {
    q: 'What are "AI tool calls"?',
    a: 'Each time you use an AI tool (title optimizer, description enhancer, content generator) counts as 1 call. Free users get 2/day. Pro gets 30/day. Scale and Agency get unlimited calls.',
  },
  {
    q: 'Do I need a credit card for the free plan?',
    a: 'No. The free plan requires only a name and email. No card, no trial expiry.',
  },
  {
    q: 'Is GST included in the pricing?',
    a: 'Prices shown are exclusive of GST. 18% GST applies as per Indian tax law. Your invoice will show the full breakdown.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingPage(): React.ReactElement {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = useCallback(async (plan: Plan): Promise<void> => {
    if (plan.id === 'free') {
      navigate('/host');
      return;
    }

    setLoading(plan.id);
    setError(null);

    try {
      const email = window.prompt('Enter your host email to continue:');
      if (!email || !email.includes('@')) {
        setLoading(null);
        return;
      }
      const name = window.prompt('Your name / organisation:') || '';

      const res = await apiFetch<{
        subscription_id: string;
        short_url: string;
        key: string;
        tier: string;
        message: string;
        error?: string;
      }>('/api/razorpay/create-subscription', {
        method: 'POST',
        body: JSON.stringify({ tier: plan.id, email, name }),
      });

      if (res.error) {
        // Plans not yet configured in Razorpay — show contact fallback
        setError(
          `To activate ${plan.name} plan, email us at contact@webinx.in or WhatsApp +91-XXXXXXXXXX. ` +
          `We'll set it up manually within 2 hours.`
        );
        setLoading(null);
        return;
      }

      if (res.short_url) {
        window.location.href = res.short_url;
      } else {
        // Fallback: open Razorpay checkout
        const { Razorpay } = window as unknown as {
          Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
        };
        if (!Razorpay) {
          setError('Payment system loading. Please refresh and try again.');
          setLoading(null);
          return;
        }
        const rzp = new Razorpay({
          key: res.key,
          subscription_id: res.subscription_id,
          name: 'WebinX',
          description: `${plan.name} Plan — ₹${plan.price}/month`,
          prefill: { email, name },
          theme: { color: '#0D4F6B' },
          handler: () => {
            navigate('/host-tools?plan_activated=1');
          },
        });
        rzp.open();
      }
    } catch {
      setError('Something went wrong. Email contact@webinx.in and we\'ll help you upgrade.');
    }
    setLoading(null);
  }, [navigate]);

  const toggleFaq = useCallback((i: number): void => {
    setOpenFaq(prev => prev === i ? null : i);
  }, []);

  return (
    <>
      <Helmet>
        <title>Pricing — WebinX Host Plans | ₹299/mo to grow your webinar audience</title>
        <meta
          name="description"
          content="WebinX host plans from Free to Agency. Verified badge, AI tools, email blasts, analytics. India's knowledge events platform."
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </Helmet>

      <div style={{ background: '#fafbfc', minHeight: '100vh' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #0D4F6B 0%, #155e75 40%, #1e3a5f 100%)',
          padding: '72px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative dots */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'radial-gradient(circle, #E8B44A 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(232,180,74,0.15)', border: '1px solid rgba(232,180,74,0.3)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 24,
            }}>
              <Sparkles size={14} color="#E8B44A" />
              <span style={{ fontSize: 13, color: '#E8B44A', fontWeight: 600 }}>
                Host SaaS — Launch Special Pricing
              </span>
            </div>

            <h1 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: '#fff',
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 18,
            }}>
              Grow your audience<br />
              <em style={{ color: '#E8B44A' }}>10× faster</em> with WebinX
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 0 }}>
              AI-powered tools, verified badge, and email blasts to thousands of learners —
              built for India's best knowledge hosts.
            </p>
          </div>
        </div>

        {/* ── Error Banner ────────────────────────────────────── */}
        {error && (
          <div style={{
            background: '#FEF3C7', border: '1px solid #E8B44A',
            borderRadius: 12, padding: '14px 20px', maxWidth: 680,
            margin: '24px auto 0', textAlign: 'center', fontSize: 14, color: '#92400e',
          }}>
            {error}
          </div>
        )}

        {/* ── Plan Cards ──────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            alignItems: 'start',
          }}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                loading={loading === plan.id}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9CA3AF' }}>
            All plans include: 100% data ownership · GDPR-compliant · Cancel anytime · No setup fee
          </p>
        </div>

        {/* ── Feature Comparison Table ─────────────────────────── */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 16px 48px' }}>
          <h2 style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 28, fontWeight: 400, textAlign: 'center',
            color: '#0f1923', marginBottom: 32,
          }}>
            Compare all features
          </h2>

          <div style={{
            border: '1px solid #E5E7EB', borderRadius: 16,
            overflow: 'hidden', background: '#fff',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              background: '#f8fafc', borderBottom: '2px solid #E5E7EB',
              padding: '14px 20px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</div>
              {(['Starter', 'Pro', 'Scale', 'Agency'] as const).map((name, i) => (
                <div key={name} style={{
                  textAlign: 'center', fontSize: 13, fontWeight: 700,
                  color: i === 1 ? '#0D4F6B' : '#374151',
                }}>
                  {name}
                  {i === 1 && (
                    <span style={{
                      display: 'block', fontSize: 10, color: '#0D4F6B',
                      background: '#E1F5EE', borderRadius: 6, padding: '1px 6px',
                      marginTop: 3, fontWeight: 700,
                    }}>POPULAR</span>
                  )}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {FEATURE_MATRIX.map((feature, i) => (
              <div key={feature.name} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                padding: '13px 20px',
                background: i % 2 === 0 ? '#fff' : '#f9fafb',
                borderBottom: i < FEATURE_MATRIX.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{feature.name}</div>
                {(['free', 'pro', 'scale', 'agency'] as const).map((tier, j) => {
                  const val = feature[tier];
                  return (
                    <div key={tier} style={{ textAlign: 'center' }}>
                      {typeof val === 'boolean' ? (
                        val
                          ? <Check size={16} color="#10b981" style={{ margin: '0 auto' }} />
                          : <X size={14} color="#D1D5DB" style={{ margin: '0 auto' }} />
                      ) : (
                        <span style={{
                          fontSize: 12, fontWeight: j === 1 ? 700 : 500,
                          color: j === 1 ? '#0D4F6B' : '#374151',
                        }}>{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── Social Proof Strip ──────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #0D4F6B, #1A6B8A)',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 22, color: '#fff', margin: '0 0 16px',
            fontStyle: 'italic',
          }}>
            "WebinX put my webinar in front of 3,000+ learners in under a week."
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              ['₹0 to ₹40L ARR', 'Target at 500 hosts'],
              ['144+ pages', 'Indexed on Google'],
              ['8 cities', 'Pan-India reach'],
              ['AI-powered', 'Search & tools'],
            ].map(([stat, label]) => (
              <div key={stat} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#E8B44A' }}>{stat}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 16px 48px' }}>
          <h2 style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 28, fontWeight: 400, textAlign: 'center',
            color: '#0f1923', marginBottom: 32,
          }}>
            Frequently asked questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                border: '1px solid #E5E7EB', borderRadius: 12,
                background: '#fff', overflow: 'hidden',
              }}>
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none',
                    border: 'none', padding: '16px 20px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#0f1923', lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp size={18} color="#6B7280" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={18} color="#6B7280" style={{ flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 20px 16px', fontSize: 14, color: '#6B7280', lineHeight: 1.7,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <div style={{
          textAlign: 'center', padding: '40px 24px 64px',
          background: '#f8fafc', borderTop: '1px solid #F3F4F6',
        }}>
          <h3 style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 26, fontWeight: 400, color: '#0f1923', marginBottom: 12,
          }}>
            Ready to grow your audience?
          </h3>
          <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 24 }}>
            Start free. Upgrade when you're ready. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/host" style={{
              background: '#0D4F6B', color: '#fff', textDecoration: 'none',
              padding: '13px 28px', borderRadius: 10, fontWeight: 700,
              fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Start for Free <ArrowRight size={16} />
            </a>
            <a href="mailto:contact@webinx.in" style={{
              background: 'transparent', color: '#0D4F6B', textDecoration: 'none',
              padding: '13px 28px', borderRadius: 10, fontWeight: 600,
              fontSize: 15, border: '1.5px solid #0D4F6B',
            }}>
              Talk to us
            </a>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Plan Card Component ──────────────────────────────────────────────────────

interface PlanCardProps {
  plan: Plan;
  loading: boolean;
  onSelect: (plan: Plan) => void;
}

function PlanCard({ plan, loading, onSelect }: PlanCardProps): React.ReactElement {
  return (
    <div style={{
      background: '#fff',
      border: plan.highlight ? `2px solid #0D4F6B` : '1.5px solid #E5E7EB',
      borderRadius: 18,
      padding: '28px 24px',
      position: 'relative',
      boxShadow: plan.highlight ? '0 8px 32px rgba(13,79,107,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'transform 0.15s, box-shadow 0.15s',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = plan.highlight
          ? '0 16px 48px rgba(13,79,107,0.18)'
          : '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = plan.highlight
          ? '0 8px 32px rgba(13,79,107,0.12)'
          : '0 1px 4px rgba(0,0,0,0.04)';
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -12, left: '50%',
          transform: 'translateX(-50%)',
          background: '#0D4F6B', color: '#fff',
          padding: '4px 14px', borderRadius: 20,
          fontSize: 11, fontWeight: 800,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {plan.badge}
        </div>
      )}

      {/* Icon + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: plan.id === 'free' ? '#F3F4F6' : `${plan.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: plan.color,
        }}>
          {plan.icon}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923' }}>{plan.name}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{plan.tagline}</div>
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        {plan.price === 0 ? (
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f1923' }}>
            Free
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: plan.highlight ? '#0D4F6B' : '#0f1923' }}>
              ₹{plan.price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 14, color: '#9CA3AF' }}>/month</span>
          </div>
        )}
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
          {plan.price === 0 ? 'No credit card required' : 'Billed monthly · Cancel anytime'}
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        style={{
          width: '100%',
          background: plan.highlight ? '#0D4F6B' : plan.id === 'free' ? 'transparent' : plan.color,
          color: plan.id === 'free' ? '#0D4F6B' : '#fff',
          border: plan.id === 'free' ? '1.5px solid #0D4F6B' : 'none',
          borderRadius: 10,
          padding: '12px',
          fontSize: 14,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          opacity: loading ? 0.7 : 1,
          marginBottom: 22,
          transition: 'opacity 0.15s, background 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff', animation: 'spin 0.8s linear infinite',
              display: 'inline-block',
            }} />
            Setting up...
          </>
        ) : (
          <>{plan.cta}</>
        )}
      </button>

      {/* Features */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plan.features.map((f) => (
          <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Check
              size={15}
              color={plan.highlight ? '#0D4F6B' : '#10b981'}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
        {plan.notIncluded.map((f) => (
          <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', opacity: 0.5 }}>
            <X size={15} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
