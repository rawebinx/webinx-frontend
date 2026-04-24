// src/pages/certificate.tsx — WebinX Speaker Certificate
// Beautiful printable certificate. Share on LinkedIn / Download as PDF.

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Helmet } from "react-helmet-async";

interface CertData {
  title:       string;
  host_name:   string;
  start_time:  string | null;
  sector_name: string;
}

function formatCertDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  } catch { return ""; }
}

export default function CertificatePage() {
  const [, params]  = useRoute("/certificate/:slug");
  const slug        = params?.slug || "";
  const [cert, setCert]     = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const API = (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/api/certificate/${slug}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { setCert(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const certUrl  = `https://www.webinx.in/certificate/${slug}`;
  const liUrl    = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
  const dateStr  = cert ? formatCertDate(cert.start_time) : "";

  return (
    <>
      <Helmet>
        <title>{cert ? `${cert.host_name} — Speaker Certificate` : "Certificate"} — WebinX</title>
        <meta name="description" content={cert ? `${cert.host_name} hosted "${cert.title}" on WebinX — India's leading webinar discovery platform.` : ""} />
        {cert && <meta property="og:title" content={`${cert.host_name} — WebinX Speaker Certificate`} />}
        <meta property="og:image" content="https://www.webinx.in/og-default.jpg" />
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Controls */}
        <div className="no-print flex items-center justify-between mb-6">
          <a href="/webinars" className="text-sm text-gray-500 hover:text-gray-900">← Back</a>
          <div className="flex gap-3">
            <a
              href={liUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition hover:bg-blue-50"
              style={{ borderColor: "#0077b5", color: "#0077b5" }}
            >
              💼 Share on LinkedIn
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              🖨️ Download / Print
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="h-96 rounded-2xl border bg-gray-50 animate-pulse" />
        )}

        {/* Not found */}
        {notFound && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Certificate not found.</p>
            <a href="/webinars" className="text-purple-600 hover:underline text-sm">Browse webinars</a>
          </div>
        )}

        {/* Certificate */}
        {cert && (
          <div
            id="certificate"
            style={{
              background: "white",
              border: "2px solid #7c3aed",
              borderRadius: "16px",
              padding: "0",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(124,58,237,0.12)",
              fontFamily: "Georgia, serif",
            }}
          >
            {/* Header band */}
            <div style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
              padding: "32px 48px 24px",
              textAlign: "center",
              color: "white",
            }}>
              <div style={{ fontSize: "13px", letterSpacing: "4px", textTransform: "uppercase", opacity: 0.85, marginBottom: "6px" }}>
                WebinX
              </div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.7 }}>
                India's Premier Webinar Discovery Platform
              </div>
            </div>

            {/* Gold divider */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)" }} />

            {/* Body */}
            <div style={{ padding: "40px 48px", textAlign: "center" }}>

              {/* Certificate title */}
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#9ca3af", marginBottom: "20px" }}>
                Certificate of Achievement
              </div>

              <div style={{ fontSize: "15px", color: "#6b7280", marginBottom: "16px" }}>
                This certifies that
              </div>

              {/* Host name */}
              <div style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "16px",
                borderBottom: "2px solid #e9d5ff",
                paddingBottom: "16px",
                lineHeight: 1.2,
              }}>
                {cert.host_name}
              </div>

              <div style={{ fontSize: "15px", color: "#6b7280", marginBottom: "12px" }}>
                successfully hosted the webinar
              </div>

              {/* Event title */}
              <div style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#7c3aed",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}>
                "{cert.title}"
              </div>

              {/* Sector + date */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "32px", marginTop: "8px" }}>
                {cert.sector_name && (
                  <span style={{
                    fontSize: "12px",
                    background: "#f3f0ff",
                    color: "#7c3aed",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontFamily: "sans-serif",
                    fontWeight: 600,
                  }}>
                    {cert.sector_name}
                  </span>
                )}
                {dateStr && (
                  <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "sans-serif" }}>
                    📅 {dateStr}
                  </span>
                )}
              </div>

              {/* Gold seal */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 12px rgba(245,158,11,0.4)",
                  border: "3px solid #fef3c7",
                }}>
                  <div style={{ fontSize: "24px" }}>🏆</div>
                  <div style={{ fontSize: "7px", letterSpacing: "1px", textTransform: "uppercase", color: "#92400e", fontFamily: "sans-serif", fontWeight: 700 }}>
                    WebinX
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                borderTop: "1px dashed #e5e7eb",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "sans-serif" }}>Issued by</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151", fontFamily: "sans-serif" }}>WebinX Platform</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "sans-serif" }}>webinx.in</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "sans-serif" }}>Verify at</div>
                  <div style={{ fontSize: "12px", color: "#7c3aed", fontFamily: "sans-serif" }}>
                    webinx.in/certificate/{slug}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share prompt */}
        {cert && (
          <div className="no-print mt-6 p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
            <p className="text-sm text-gray-700 mb-3">
              🎉 Share your achievement with your network — let them know you hosted on WebinX!
            </p>
            <a
              href={liUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-white px-6 py-2.5 rounded-lg transition"
              style={{ background: "#0077b5" }}
            >
              Share on LinkedIn →
            </a>
          </div>
        )}
      </div>
    </>
  );
}
