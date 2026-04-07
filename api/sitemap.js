export default async function handler(req, res) {
  try {
    const API_URL = "https://webinx-backend.onrender.com/api/events";

    const response = await fetch(API_URL);
    const events = await response.json();

    // -----------------------------
    // STEP 1: Group by ROOT SLUG
    // -----------------------------
    const groups = {};

    for (const event of events) {
      if (!event.slug) continue;

      // Remove numeric suffix (-1, -2, etc.)
      const rootSlug = event.slug.replace(/-\d+$/, "");

      if (!groups[rootSlug]) {
        groups[rootSlug] = [];
      }

      groups[rootSlug].push(event);
    }

    // -----------------------------
    // STEP 2: Pick CANONICAL EVENT
    // -----------------------------
    const uniqueEvents = [];

    for (const rootSlug in groups) {
      const group = groups[rootSlug];

      // Prefer clean slug (no suffix)
      let canonical = group.find(e => !/-\d+$/.test(e.slug));

      // If no clean slug exists → fallback to shortest slug (more stable)
      if (!canonical) {
        canonical = group.sort((a, b) => a.slug.length - b.slug.length)[0];
      }

      uniqueEvents.push(canonical);
    }

    // -----------------------------
    // STEP 3: Build XML
    // -----------------------------
    const baseUrl = "https://www.webinx.in";

    const urls = uniqueEvents.map(event => {
      return `
        <url>
          <loc>${baseUrl}/webinar/${event.slug}</loc>
          <lastmod>${new Date(event.updated_at || event.created_at).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    }).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>
    `;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);

  } catch (error) {
    console.error("Sitemap Error:", error);
    res.status(500).send("Error generating sitemap");
  }
}
