// src/pages/host-tools.tsx — WebinX AI Host Tools
// Title optimizer, description enhancer, post-event blog generator.

import { useState } from "react";
import { Helmet } from "react-helmet-async";

const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

// ── Title Optimizer ───────────────────────────────────────────────
function TitleOptimizer() {
  const [title,   setTitle]   = useState("");
  const [sector,  setSector]  = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiUsed,  setAiUsed]  = useState(false);
  const [copied,  setCopied]  = useState(-1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`${API}/api/tools/optimize-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), sector }),
      });
      const data = await res.json();
      setResults(data.titles || []);
      setAiUsed(data.ai_used ?? false);
    } catch { setResults([]); }
    setLoading(false);
  }

  function copyTitle(t: string, idx: number) {
    navigator.clipboard.writeText(t).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(-1), 1500);
    });
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✍️</span>
        <div>
          <h2 className="font-bold text-gray-900">Title Optimizer</h2>
          <p className="text-xs text-gray-500">Turn a basic title into 5 SEO-optimized versions</p>
        </div>
        {aiUsed && <span className="ml-auto text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">✨ AI</span>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="e.g. Marketing Webinar"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <div className="flex gap-2">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="">Select sector (optional)</option>
            {["AI","Finance","Marketing","Startup","Technology","HR","Healthcare","Education"].map(s => (
              <option key={s} value={s.toLowerCase()}>{s}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "…" : "Optimize →"}
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((t, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100 group">
              <span className="text-xs font-bold text-purple-600 w-5 shrink-0">{i+1}</span>
              <span className="flex-1 text-sm text-gray-800">{t}</span>
              <button
                onClick={() => copyTitle(t, i)}
                className="text-xs text-gray-400 hover:text-purple-600 transition opacity-0 group-hover:opacity-100"
              >
                {copied === i ? "✓ Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Description Enhancer ─────────────────────────────────────────
function DescriptionEnhancer() {
  const [title,   setTitle]   = useState("");
  const [notes,   setNotes]   = useState("");
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/tools/enhance-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, notes }),
      });
      const data = await res.json();
      setResult(data.description || "");
    } catch { setResult(""); }
    setLoading(false);
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📝</span>
        <div>
          <h2 className="font-bold text-gray-900">Description Enhancer</h2>
          <p className="text-xs text-gray-500">Paste rough notes → get a polished 200-word description</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Webinar title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <textarea
          placeholder="Paste your rough notes here — what topics you'll cover, who it's for, what attendees will learn..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          required
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
        />
        <button
          type="submit"
          disabled={loading || !notes.trim()}
          className="w-full text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Enhancing…" : "Enhance Description →"}
        </button>
      </form>
      {result && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Enhanced description:</span>
            <button
              onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="text-xs text-purple-600 hover:text-purple-800 transition font-medium"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Content Generator ────────────────────────────────────────────
function ContentGenerator() {
  const [title,      setTitle]      = useState("");
  const [transcript, setTranscript] = useState("");
  const [result,     setResult]     = useState<any>(null);
  const [loading,    setLoading]    = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/tools/generate-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, transcript }),
      });
      setResult(await res.json());
    } catch { setResult(null); }
    setLoading(false);
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🚀</span>
        <div>
          <h2 className="font-bold text-gray-900">Post-Event Content Generator</h2>
          <p className="text-xs text-gray-500">Transcript/notes → summary + key takeaways + blog intro</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Webinar title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <textarea
          placeholder="Paste your transcript, recording notes, or key points from the webinar..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={6}
          required
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
        />
        <button
          type="submit"
          disabled={loading || !transcript.trim()}
          className="w-full text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Content →"}
        </button>
      </form>
      {result && (
        <div className="mt-5 space-y-4">
          {result.summary && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">📌 Summary</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{result.summary}</p>
            </div>
          )}
          {result.takeaways?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">🎯 Key Takeaways</p>
              <ul className="space-y-1.5">
                {result.takeaways.map((t: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-purple-500 shrink-0">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.blog_intro && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">📖 Blog Intro</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed">{result.blog_intro}</p>
            </div>
          )}
          {result.meta_description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">🔍 SEO Meta Description</p>
              <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">{result.meta_description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Embed Widget Helper ──────────────────────────────────────────
function EmbedHelper() {
  const [slug, setSlug] = useState("");
  const embedUrl = slug ? `https://www.webinx.in/embed/${slug}` : "";
  const iframeCode = embedUrl ? `<iframe src="${embedUrl}" width="100%" height="420" frameborder="0" style="border-radius:12px;"></iframe>` : "";
  const [copied, setCopied] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔲</span>
        <div>
          <h2 className="font-bold text-gray-900">Embed Widget</h2>
          <p className="text-xs text-gray-500">Show your WebinX events on your own website</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Your Host Slug</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <span className="px-3 py-2.5 text-xs text-gray-400 bg-gray-50 border-r border-gray-200">webinx.in/hosts/</span>
            <input
              type="text"
              placeholder="your-host-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g,"-"))}
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>
        {iframeCode && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Embed Code</label>
                <button
                  onClick={() => { navigator.clipboard.writeText(iframeCode); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="text-xs text-purple-600 font-medium hover:text-purple-800 transition"
                >
                  {copied ? "✓ Copied!" : "Copy code"}
                </button>
              </div>
              <code className="block text-xs bg-gray-900 text-green-400 px-4 py-3 rounded-lg overflow-x-auto whitespace-nowrap">
                {iframeCode}
              </code>
            </div>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:underline"
            >
              Preview widget →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function HostToolsPage() {
  return (
    <>
      <Helmet>
        <title>AI Host Tools — WebinX</title>
        <meta name="description" content="Free AI tools for webinar hosts — optimize titles, enhance descriptions, generate post-event content. Powered by Claude AI on WebinX." />
        <link rel="canonical" href="https://www.webinx.in/host-tools" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 mb-4">
            ✨ Powered by Claude AI
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Tools for Hosts</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Free tools to help you write better webinar titles, descriptions, and post-event content — powered by AI.
          </p>
        </div>

        <div className="space-y-6">
          <TitleOptimizer />
          <DescriptionEnhancer />
          <ContentGenerator />
          <EmbedHelper />
        </div>

        <div className="mt-8 p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
          <p className="text-sm text-gray-700 mb-3">Want your webinar featured to thousands of professionals?</p>
          <a href="/get-featured" className="inline-block text-sm font-semibold bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
            ⭐ Get Featured →
          </a>
        </div>
      </div>
    </>
  );
}
