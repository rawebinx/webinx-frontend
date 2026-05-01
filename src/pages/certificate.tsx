// src/pages/certificate.tsx — WebinX Speaker Certificate
// v2: API_BASE from @/lib/api (no import.meta as any), async/await, JSX.Element return type.
// The certificate card keeps its gold/purple design — it is a printable document
// with its own branded visual identity. Non-cert UI controls use teal.

import { useEffect, useState, useCallback } from 'react';
import { useRoute } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '@/lib/api';

interface CertData {
  title:       string;
  host_name:   string;
  start_time:  string | null;
  sector_name: string;
}

function formatCertDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
    });
  } catch { return ''; }
}

export default function CertificatePage(): JSX.Element {
  const [, params]              = useRoute('/certificate/:slug');
  const slug                    = params?.slug ?? '';
  const [cert, setCert]         = useState<CertData | null>(null);
  const [loading, setLoading]   = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  const loadCert = useCallback(async (): Promise<void> => {
    if (!slug) return;
    try {
      const res = await fetch(`${API_BASE}/api/certificate/${slug}`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error('not found');
      setCert(await res.json() as CertData);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect((): void => { void loadCert(); }, [loadCert]);

  const certUrl = `https://www.webinx.in/certificate/${slug}`;
  const liUrl   = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
  const dateStr = cert ? formatCertDate(cert.start_time) : '';

  return (
    <>
      <Helmet>
        <title>{cert ? `${cert.host_name} — Speaker Certificate` : 'Certificate'} — WebinX</title>
        <meta name="description" content={cert ? `${cert.host_name} hosted "${cert.title}" on WebinX.` : 'Speaker certificate from WebinX.'} />
        {cert && <meta property="og:title" content={`${cert.host_name} — WebinX Speaker Certificate`} />}
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <style>{`@media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Controls */}
        <div className="no-print flex items-center justify-between mb-6">
          <a href="/webinars" style={{ fontSize: 14, color: '#0D4F6B' }}>← Back</a>
          <div className="flex gap-3">
            <a href={liUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: '1px solid #0077b5', color: '#0077b5', textDecoration: 'none' }}>
              💼 Share on LinkedIn
            </a>
            <button onClick={(): void => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', color: '#374151', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              🖨️ Download / Print
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <div className="skeleton h-96 rounded-2xl" />}

        {/* Not found */}
        {notFound && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6B7280' }}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>Certificate not found.</p>
            <a href="/webinars" style={{ color: '#0D4F6B', fontWeight: 600, fontSize: 14 }}>Browse webinars →</a>
          </div>
        )}

        {/* Certificate — printable card keeps gold/purple brand */}
        {cert && (
          <div id="certificate" style={{ background: 'white', border: '2px solid #7c3aed', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(124,58,237,0.12)', fontFamily: 'Georgia, serif' }}>
            <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', padding: '32px 48px 24px', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.85, marginBottom: 6 }}>WebinX</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>India's Premier Webinar Discovery Platform</div>
            </div>
            <div style={{ height: 4, background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)' }} />
            <div style={{ padding: '40px 48px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 20 }}>Certificate of Achievement</div>
              <div style={{ fontSize: 15, color: '#6b7280', marginBottom: 16 }}>This certifies that</div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#111827', marginBottom: 16, borderBottom: '2px solid #e9d5ff', paddingBottom: 16, lineHeight: 1.2 }}>
                {cert.host_name}
              </div>
              <div style={{ fontSize: 15, color: '#6b7280', marginBottom: 12 }}>successfully hosted the webinar</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#7c3aed', marginBottom: 8, lineHeight: 1.3 }}>"{cert.title}"</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, marginTop: 8 }}>
                {cert.sector_name && (
                  <span style={{ fontSize: 12, background: '#f3f0ff', color: '#7c3aed', padding: '4px 12px', borderRadius: 20, fontFamily: 'sans-serif', fontWeight: 600 }}>{cert.sector_name}</span>
                )}
                {dateStr && <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'sans-serif' }}>📅 {dateStr}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(245,158,11,0.4)', border: '3px solid #fef3c7' }}>
                  <div style={{ fontSize: 24 }}>🏆</div>
                  <div style={{ fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', color: '#92400e', fontFamily: 'sans-serif', fontWeight: 700 }}>WebinX</div>
                </div>
              </div>
              <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'sans-serif' }}>Issued by</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'sans-serif' }}>WebinX Platform</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'sans-serif' }}>webinx.in</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'sans-serif' }}>Verify at</div>
                  <div style={{ fontSize: 12, color: '#7c3aed', fontFamily: 'sans-serif' }}>webinx.in/certificate/{slug}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share prompt — teal brand */}
        {cert && (
          <div className="no-print mt-6 p-4 rounded-xl text-center" style={{ background: '#E1F5EE', border: '1px solid rgba(13,79,107,0.15)' }}>
            <p className="text-sm text-gray-700 mb-3">🎉 Share your achievement with your network!</p>
            <a href={liUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#fff', padding: '10px 24px', borderRadius: 8, background: '#0077b5', textDecoration: 'none' }}>
              Share on LinkedIn →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
