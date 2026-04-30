// src/pages/host-tools.tsx — WebinX AI Host Tools
// v2: uses optimizeTitle + enhanceDescription from api.ts (no raw fetch for those),
// API_BASE from api.ts for ContentGenerator (different schema), explicit return types,
// no any, teal brand throughout (purple removed).

import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { optimizeTitle, enhanceDescription, API_BASE } from '@/lib/api';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function useCopyToClipboard(): [number | boolean, (text: string, idx?: number) => void] {
  const [copied, setCopied] = useState<number | boolean>(false);
  const copy = useCallback((text: string, idx: number | undefined = true): void => {
    void navigator.clipboard.writeText(text).then((): void => {
      setCopied(idx);
      setTimeout((): void => setCopied(false), 1600);
    });
  }, []);
  return [copied, copy];
}

const SECTORS = ['AI', 'Finance', 'Marketing', 'Startup', 'Technology', 'HR', 'Healthcare', 'Education'];

// ─── Tool card wrapper ────────────────────────────────────────────────────────

function ToolCard({
  icon,
  title,
  subtitle,
  aiPowered = true,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  aiPowered?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 16,
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '1.25rem' }}>
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h2>
            {aiPowered && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#E1F5EE',
                  color: '#0D4F6B',
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                }}
              >
                <Sparkles size={10} />
                AI
              </span>
            )}
          </div>
          <p style={{ fontSize: 12.5, color: '#6B7280', margin: '2px 0 0' }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
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
  color: '#111827',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: '#0D4F6B',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  transition: 'opacity 0.15s',
  flexShrink: 0,
  whiteSpace: 'nowrap',
};

// ─── Tool 1: Title Optimizer ──────────────────────────────────────────────────

function TitleOptimizer(): JSX.Element {
  const [title,   setTitle]   = useState<string>('');
  const [sector,  setSector]  = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error,   setError]   = useState<string>('');
  const [copied, copy] = useCopyToClipboard();

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!title.trim()) return;
      setLoading(true);
      setResults([]);
      setError('');
      try {
        // Uses optimizeTitle from api.ts — no raw fetch
        const data = await optimizeTitle({ title: title.trim(), sector: sector || undefined });
        setResults(data.titles ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to optimize. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [title, sector],
  );

  return (
    <ToolCard icon="✍️" title="Title Optimizer" subtitle="Turn a basic title into 5 SEO-optimized versions">
      <form onSubmit={(e): void => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="e.g. Marketing Webinar for Startups"
          value={title}
          onChange={(e): void => setTitle(e.target.value)}
          required
          style={inputStyle}
          onFocus={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#0D4F6B'; }}
          onBlur={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={sector}
            onChange={(e): void => setSector(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="">Topic / sector (optional)</option>
            {SECTORS.map((s) => (
              <option key={s} value={s.toLowerCase()}>{s}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            style={{ ...primaryBtnStyle, opacity: (loading || !title.trim()) ? 0.55 : 1 }}
          >
            {loading ? '…' : 'Optimize →'}
          </button>
        </div>
      </form>

      {error && (
        <p style={{ fontSize: 12.5, color: '#DC2626', marginTop: 10 }}>{error}</p>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {results.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: '#F8FAFC',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#E1F5EE',
                  color: '#0D4F6B',
                  fontSize: 10.5,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 13.5, color: '#1F2937', lineHeight: 1.4 }}>{t}</span>
              <button
                onClick={(): void => copy(t, i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  color: copied === i ? '#0D4F6B' : '#9CA3AF',
                  fontSize: 11.5,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  flexShrink: 0,
                  transition: 'color 0.15s',
                }}
              >
                {copied === i ? <Check size={12} /> : <Copy size={12} />}
                {copied === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}

// ─── Tool 2: Description Enhancer ────────────────────────────────────────────

function DescriptionEnhancer(): JSX.Element {
  const [title,   setTitle]   = useState<string>('');
  const [notes,   setNotes]   = useState<string>('');
  const [result,  setResult]  = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error,   setError]   = useState<string>('');
  const [copied, copy] = useCopyToClipboard();

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!notes.trim()) return;
      setLoading(true);
      setResult('');
      setError('');
      try {
        // Uses enhanceDescription from api.ts — no raw fetch.
        // Title is prepended to notes for context since api.ts takes { notes, sector? }.
        const contextNotes = title.trim()
          ? `Webinar title: ${title.trim()}\n\n${notes.trim()}`
          : notes.trim();
        const data = await enhanceDescription({ notes: contextNotes });
        setResult(data.description ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to enhance. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [title, notes],
  );

  return (
    <ToolCard icon="📝" title="Description Enhancer" subtitle="Paste rough notes → polished 200-word event description">
      <form onSubmit={(e): void => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Webinar title (optional)"
          value={title}
          onChange={(e): void => setTitle(e.target.value)}
          style={inputStyle}
          onFocus={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#0D4F6B'; }}
          onBlur={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
        />
        <textarea
          placeholder="Paste rough notes — what you'll cover, who it's for, what attendees will learn…"
          value={notes}
          onChange={(e): void => setNotes(e.target.value)}
          rows={5}
          required
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={(e): void => { (e.target as HTMLTextAreaElement).style.borderColor = '#0D4F6B'; }}
          onBlur={(e): void => { (e.target as HTMLTextAreaElement).style.borderColor = '#E5E7EB'; }}
        />
        <button
          type="submit"
          disabled={loading || !notes.trim()}
          style={{ ...primaryBtnStyle, opacity: (loading || !notes.trim()) ? 0.55 : 1 }}
        >
          {loading ? 'Enhancing…' : 'Enhance Description →'}
        </button>
      </form>

      {error && <p style={{ fontSize: 12.5, color: '#DC2626', marginTop: 10 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Enhanced description:</span>
            <button
              onClick={(): void => copy(result)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: copied === true ? '#0D4F6B' : '#6B7280',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'color 0.15s',
              }}
            >
              {copied === true ? <Check size={12} /> : <Copy size={12} />}
              {copied === true ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            style={{
              padding: '14px 16px',
              background: '#F8FAFC',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              fontSize: 13.5,
              color: '#374151',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {result}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// ─── Tool 3: Post-Event Content Generator ────────────────────────────────────
// Note: this endpoint sends { title, transcript } and returns
// { summary, takeaways, blog_intro, meta_description } — a different schema
// from api.ts generateContent. We use API_BASE from api.ts but keep raw fetch
// with a properly typed result interface.

interface ContentOutput {
  summary?:          string;
  takeaways?:        string[];
  blog_intro?:       string;
  meta_description?: string;
}

function ContentGenerator(): JSX.Element {
  const [title,      setTitle]      = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [result,     setResult]     = useState<ContentOutput | null>(null);
  const [loading,    setLoading]    = useState<boolean>(false);
  const [error,      setError]      = useState<string>('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!transcript.trim()) return;
      setLoading(true);
      setResult(null);
      setError('');
      try {
        // This endpoint returns a multi-field bundle not covered by api.ts
        // generateContent (which generates one content type). Keep raw fetch
        // but use API_BASE from api.ts (no import.meta as any).
        const res = await fetch(`${API_BASE}/api/tools/generate-content`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ title: title.trim(), transcript: transcript.trim() }),
          signal:  AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResult(await res.json() as ContentOutput);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [title, transcript],
  );

  return (
    <ToolCard icon="🚀" title="Post-Event Content Generator" subtitle="Transcript/notes → summary + takeaways + blog intro + meta description">
      <form onSubmit={(e): void => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Webinar title (optional)"
          value={title}
          onChange={(e): void => setTitle(e.target.value)}
          style={inputStyle}
          onFocus={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#0D4F6B'; }}
          onBlur={(e): void => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
        />
        <textarea
          placeholder="Paste transcript, recording notes, or key points from your webinar…"
          value={transcript}
          onChange={(e): void => setTranscript(e.target.value)}
          rows={6}
          required
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={(e): void => { (e.target as HTMLTextAreaElement).style.borderColor = '#0D4F6B'; }}
          onBlur={(e): void => { (e.target as HTMLTextAreaElement).style.borderColor = '#E5E7EB'; }}
        />
        <button
          type="submit"
          disabled={loading || !transcript.trim()}
          style={{ ...primaryBtnStyle, opacity: (loading || !transcript.trim()) ? 0.55 : 1 }}
        >
          {loading ? 'Generating…' : 'Generate Content →'}
        </button>
      </form>

      {error && <p style={{ fontSize: 12.5, color: '#DC2626', marginTop: 10 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {result.summary && (
            <OutputBlock label="📌 Summary" content={result.summary} />
          )}
          {(result.takeaways?.length ?? 0) > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>🎯 Key Takeaways</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(result.takeaways ?? []).map((t, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>
                    <Check size={14} strokeWidth={2.5} style={{ color: '#0D4F6B', marginTop: 2, flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.blog_intro && (
            <OutputBlock label="📖 Blog Intro" content={result.blog_intro} />
          )}
          {result.meta_description && (
            <OutputBlock label="🔍 SEO Meta Description" content={result.meta_description} small />
          )}
        </div>
      )}
    </ToolCard>
  );
}

function OutputBlock({ label, content, small = false }: { label: string; content: string; small?: boolean }): JSX.Element {
  const [copied, copy] = useCopyToClipboard();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>{label}</span>
        <button
          onClick={(): void => copy(content)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: copied === true ? '#0D4F6B' : '#9CA3AF',
            fontSize: 11.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 3,
            transition: 'color 0.15s',
          }}
        >
          {copied === true ? <Check size={11} /> : <Copy size={11} />}
          {copied === true ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        style={{
          padding: '12px 14px',
          background: '#F8FAFC',
          border: '1px solid #E5E7EB',
          borderRadius: 10,
          fontSize: small ? 12.5 : 13.5,
          color: '#374151',
          lineHeight: 1.65,
        }}
      >
        {content}
      </div>
    </div>
  );
}

// ─── Tool 4: Embed Widget Helper ─────────────────────────────────────────────

function EmbedHelper(): JSX.Element {
  const [slug, setSlug] = useState<string>('');
  const [copied, copy] = useCopyToClipboard();

  const embedUrl = slug ? `https://www.webinx.in/embed/${slug}` : '';
  const iframeCode = embedUrl
    ? `<iframe src="${embedUrl}" width="100%" height="420" frameborder="0" style="border-radius:12px;"></iframe>`
    : '';

  return (
    <ToolCard icon="🔲" title="Embed Widget" subtitle="Show your WebinX events on your own website" aiPowered={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Your Host Slug
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
                fontSize: 12,
                color: '#9CA3AF',
                background: '#F8FAFC',
                borderRight: '1px solid #E5E7EB',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              webinx.in/hosts/
            </span>
            <input
              type="text"
              placeholder="your-host-slug"
              value={slug}
              onChange={(e): void => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              style={{ flex: 1, padding: '10px 12px', fontSize: 13.5, border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', minWidth: 0 }}
            />
          </div>
        </div>

        {iframeCode && (
          <>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#374151' }}>Embed Code</label>
                <button
                  onClick={(): void => copy(iframeCode)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: copied === true ? '#0D4F6B' : '#6B7280',
                    fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'color 0.15s',
                  }}
                >
                  {copied === true ? <Check size={12} /> : <Copy size={12} />}
                  {copied === true ? 'Copied!' : 'Copy code'}
                </button>
              </div>
              <code
                style={{
                  display: 'block',
                  fontSize: 11.5,
                  background: '#0f172a',
                  color: '#4ade80',
                  padding: '12px 14px',
                  borderRadius: 10,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {iframeCode}
              </code>
            </div>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12.5,
                color: '#0D4F6B',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Preview widget
              <ArrowRight size={13} />
            </a>
          </>
        )}
      </div>
    </ToolCard>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HostToolsPage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>AI Tools for Webinar Hosts — WebinX</title>
        <meta
          name="description"
          content="Free AI tools for webinar hosts — optimize titles, enhance descriptions, generate post-event content, embed widgets. Powered by Claude AI on WebinX."
        />
        <link rel="canonical" href="https://www.webinx.in/host-tools" />
        <meta property="og:title" content="AI Tools for Webinar Hosts — WebinX" />
      </Helmet>

      <main className="has-bottom-nav">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1rem 3rem' }}>

          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#E1F5EE',
                border: '1px solid rgba(13,79,107,0.15)',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                color: '#0D4F6B',
                marginBottom: 16,
              }}
            >
              <Sparkles size={13} />
              Powered by Claude AI
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 400,
                color: '#0D4F6B',
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              AI Tools for Hosts
            </h1>
            <p style={{ fontSize: 14.5, color: '#6B7280', maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
              Write better titles, descriptions, and post-event content — powered by AI, free to use.
            </p>
          </div>

          {/* Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <TitleOptimizer />
            <DescriptionEnhancer />
            <ContentGenerator />
            <EmbedHelper />
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #E1F5EE 0%, #fff 100%)',
              border: '1.5px solid rgba(13,79,107,0.15)',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 12,
            }}
          >
            <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>
              Want to reach thousands of professionals actively discovering events?
            </p>
            <a
              href="/get-featured"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 24px',
                background: '#0D4F6B',
                color: '#fff',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13.5,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(13,79,107,0.25)',
              }}
            >
              ⭐ Get Featured
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
