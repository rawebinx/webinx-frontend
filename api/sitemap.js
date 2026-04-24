// api/sitemap.js — WebinX Sitemap
// Always returns valid XML — never 500.

export default async function handler(req, res) {
  const BASE_URL = "https://www.webinx.in";
  const BACKEND  = "https://webinx-backend.onrender.com";

  const escapeXml = (str) =>
    String(str)
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&apos;");

  const toIso = (val) => {
    if (!val) return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const d = new Date(val);
    return isNaN(d.getTime())
      ? new Date().toISOString().replace(/\.\d{3}Z$/, "Z")
      : d.toISOString().replace(/\.\d{3}Z$/, "Z");
  };

  // Static pages
  const staticPages = [
    { loc: BASE_URL,                  priority: "1.0", changefreq: "daily"   },
    { loc: `${BASE_URL}/webinars`,    priority: "0.9", changefreq: "daily"   },
    { loc: `${BASE_URL}/about`,       priority: "0.5", changefreq: "monthly" },
    { loc: `${BASE_URL}/contact`,     priority: "0.5", changefreq: "monthly" },
    { loc: `${BASE_URL}/rss.xml`,     priority: "0.3", changefreq: "daily"   },
  ];

  // SEO city pages
  const CITIES = [
    "mumbai", "delhi", "bangalore", "hyderabad",
    "chennai", "pune", "kolkata", "ahmedabad",
  ];
  const cityPages = CITIES.map((city) => ({
    loc: `${BASE_URL}/city/${city}`,
    priority: "0.7",
    changefreq: "daily",
  }));

  let eventPages = [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(`${BACKEND}/api/sitemap/events`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (response.ok) {
      const events = await response.json();
      if (Array.isArray(events)) {
        const seen = new Set();
        for (const event of events) {
          if (!event.slug || seen.has(event.slug)) continue;
          seen.add(event.slug);
          eventPages.push({
            loc: `${BASE_URL}/webinar/${escapeXml(event.slug)}`,
            lastmod: toIso(event.updated_at || event.start_time),
            priority: "0.8",
            changefreq: "daily",
          });
        }
      }
    }
  } catch (err) {
    console.error("Sitemap backend fetch failed:", err?.message);
  }

  const allPages = [...staticPages, ...cityPages, ...eventPages];

  const urlTags = allPages
    .map((p) => `
  <url>
    <loc>${p.loc}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
}
