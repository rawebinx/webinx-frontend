// src/pages/reward-claim.tsx — Mention WebinX Reward Claim
// v2: API_BASE from @/lib/api (no import.meta as any), typed RewardResponse,
// useCallback on handleSubmit, teal brand, JSX.Element return type.

import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '@/lib/api';

interface RewardResponse {
  status:  string;
  tier?:   string;
  message?: string;
  error?:  string;
}

interface MentionType {
  value:   string;
  label:   string;
  reward:  string;
  tier:    string;
  color:   string;
  bg:      string;
  icon:    string;
}

const MENTION_TYPES: MentionType[] = [
  { value: 'verbal', label: 'Mentioned WebinX verbally during webinar',    reward: '7-day Featured listing',                  tier: 'Bronze',   color: '#92400e', bg: '#fef3c7', icon: '🎙️' },
  { value: 'screen', label: 'Showed WebinX URL on screen / slide',         reward: '30-day Featured + Priority placement',    tier: 'Silver',   color: '#374151', bg: '#f3f4f6', icon: '🖥️' },
  { value: 'link',   label: 'Shared my WebinX profile link with attendees', reward: '30-day Featured + Analytics access',     tier: 'Gold',     color: '#78350f', bg: '#fef9c3', icon: '🔗' },
  { value: 'embed',  label: 'Embedded WebinX widget on my website',         reward: '90-day Featured + Revenue share',        tier: 'Platinum', color: '#312e81', bg: '#eef2ff', icon: '⭐' },
];

export default function RewardClaimPage(): JSX.Element {
  const [mentionType,   setMentionType]   = useState<string>('verbal');
  const [hostName,      setHostName]      = useState<string>('');
  const [hostEmail,     setHostEmail]     = useState<string>('');
  const [webinarTitle,  setWebinarTitle]  = useState<string>('');
  const [evidenceUrl,   setEvidenceUrl]   = useState<string>('');
  const [notes,         setNotes]         = useState<string>('');
  const [loading,       setLoading]       = useState<boolean>(false);
  const [result,        setResult]        = useState<{ tier: string; message: string } | null>(null);
  const [error,         setError]         = useState<string>('');

  const selected = MENTION_TYPES.find((m) => m.value === mentionType) ?? MENTION_TYPES[0];

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/rewards/claim`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host_name: hostName.trim(), host_email: hostEmail.trim(),
            mention_type: mentionType, webinar_title: webinarTitle.trim(),
            evidence_url: evidenceUrl.trim(), notes: notes.trim(),
          }),
          signal: AbortSignal.timeout(15_000),
        });
        const data = await res.json() as RewardResponse;
        if (data.status === 'ok') {
          setResult({ tier: data.tier ?? selected.tier, message: data.message ?? 'Your reward is being reviewed!' });
        } else {
          setError(data.error ?? 'Submission failed. Please try again.');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [loading, hostName, hostEmail, mentionType, webinarTitle, evidenceUrl, notes, selected.tier],
  );

  // Shared input style
  const inputStyle: React.CSSProperties = {
    width: '100%', fontSize: 13.5, border: '1.5px solid #E5E7EB',
    borderRadius: 10, padding: '10px 12px', outline: 'none',
    fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
    background: '#fff',
  };

  return (
    <>
      <Helmet>
        <title>Claim Your Mention-WebinX Reward — WebinX</title>
        <meta name="description" content="Mentioned WebinX during your webinar? Claim your free Featured listing reward and grow your audience." />
        <link rel="canonical" href="https://www.webinx.in/mention-webinx" />
      </Helmet>

      <main className="has-bottom-nav">
        <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3rem) 1rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎤</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 400, color: '#0D4F6B', marginBottom: 10 }}>
              Claim Your Mention Reward
            </h1>
            <p style={{ fontSize: 14.5, color: '#6B7280', maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
              Mentioned WebinX during your webinar? Select what you did — we'll reward you with a Featured listing.
            </p>
          </div>

          {/* Success */}
          {result ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '1px solid #A7F3D0', borderRadius: 16, background: '#ECFDF5' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8, textTransform: 'capitalize' }}>
                {result.tier} Tier Claimed!
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>{result.message}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/top-hosts" style={{ fontSize: 13.5, fontWeight: 600, background: '#0D4F6B', color: '#fff', padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                  View Leaderboard
                </a>
                <a href="/webinars" style={{ fontSize: 13.5, fontWeight: 600, border: '1.5px solid #E5E7EB', color: '#374151', padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                  Browse Webinars
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Tier selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
                {MENTION_TYPES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={(): void => setMentionType(m.value)}
                    style={{
                      textAlign: 'left', padding: 16, borderRadius: 14,
                      border: `2px solid ${mentionType === m.value ? '#0D4F6B' : '#E5E7EB'}`,
                      background: mentionType === m.value ? '#E1F5EE' : '#fff',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: m.bg, color: m.color }}>{m.tier}</span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>{m.label}</p>
                    <p style={{ fontSize: 12.5, color: '#0D4F6B', margin: 0, fontWeight: 600 }}>→ {m.reward}</p>
                  </button>
                ))}
              </div>

              {/* Selected tier callout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, marginBottom: '1.5rem', background: selected.bg, color: selected.color, fontSize: 14, fontWeight: 600 }}>
                <span style={{ fontSize: 20 }}>{selected.icon}</span>
                <span>{selected.tier} reward: {selected.reward}</span>
              </div>

              {/* Form */}
              <form onSubmit={(e): void => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your Name / Org <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" required value={hostName} onChange={(e): void => setHostName(e.target.value)} placeholder="e.g. Priya Sharma / GrowthLabs" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your Email <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="email" required value={hostEmail} onChange={(e): void => setHostEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Webinar Title</label>
                  <input type="text" value={webinarTitle} onChange={(e): void => setWebinarTitle(e.target.value)} placeholder="e.g. AI Tools for Marketing Teams 2026" style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Evidence URL <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(screenshot, recording, or slide link)</span>
                  </label>
                  <input type="url" value={evidenceUrl} onChange={(e): void => setEvidenceUrl(e.target.value)} placeholder="https://drive.google.com/... or YouTube link" style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12.5 }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Notes <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e): void => setNotes(e.target.value)}
                    placeholder="Anything else you'd like us to know..."
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: 13.5, color: '#B91C1C', background: '#FEF2F2', padding: '10px 14px', borderRadius: 10, margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12,
                    background: loading ? '#9CA3AF' : '#0D4F6B',
                    color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer',
                    fontSize: 14.5, fontWeight: 700, fontFamily: 'inherit',
                    boxShadow: loading ? 'none' : '0 4px 16px rgba(13,79,107,0.25)',
                  }}
                >
                  {loading ? 'Submitting…' : `Claim My ${selected.tier} Reward →`}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                  Claims are reviewed within 24 hours. No fake submissions — we verify.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
