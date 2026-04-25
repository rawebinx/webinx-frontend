// api/rss.js — WebinX RSS 2.0 Feed
// Route: /rss.xml → /api/rss (via vercel.json rewrite)
// Serves upcoming webinars as a valid RSS 2.0 feed.
// Never returns 500 — always returns valid XML.

export default async function handler(req, res) {
  const BASE_URL = "https://www.webinx.in";
  const BACKEND  = "https://webinx-backend.onrender.com";

  const escapeXml = (str) =>
    String(str || "")
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&apos;");

  const toRfc822 = (val) => {
    if (!val) return new Date().toUTCString();
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
  };

  let events = [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(
      `${BACKEND}/api/events?limit=50&offset=0`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        events = data
          .filter((e) => e.slug && e.title)
          .slice(0, 50);
      }
    }
  } catch (err) {
    console.error("RSS backend fetch failed:", err?.message);
    // Still return valid (empty) feed — never 500
  }

  const buildDate = new Date().toUTCString();

  const items = events
    .map((e) => {
      const link = `${BASE_URL}/webinar/${escapeXml(e.slug)}`;
      const desc = escapeXml(
        (e.description || e.title || "").replace(/<[^>]+>/g, "").slice(0, 300)
      );
      const sector = escapeXml(e.sector_name || "General");
      const host   = escapeXml(e.host_name || "WebinX");

      return `
  <item>
    <title>${escapeXml(e.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <description>${desc} — Hosted by ${host} | Sector: ${sector}</description>
    <pubDate>${toRfc822(e.start_time)}</pubDate>
    <category>${sector}</category>
    <author>contact@webinx.in (${host})</author>
  </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WebinX — Free Webinars in India</title>
    <link>${BASE_URL}</link>
    <description>Discover free online webinars and professional development events in India. Updated daily.</description>
    <language>en-in</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/og-default.jpg</url>
      <title>WebinX</title>
      <link>${BASE_URL}</link>
    </image>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800");
  res.status(200).send(xml);
}
