export default async function handler(req, res) {
  try {
    const API_URL = "https://webinx-backend.onrender.com/api/events";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Backend API failed");
    }

    const events = await response.json();

    if (!Array.isArray(events)) {
      throw new Error("Invalid API response");
    }

    // -----------------------------
    // GROUP BY ROOT SLUG
    // -----------------------------
    const groups = {};

    for (const event of events) {
      if (!event.slug) continue;

      const rootSlug = event.slug.replace(/-\d+$/, "");

      if (!groups[rootSlug]) {
        groups[rootSlug] = [];
      }

      groups[rootSlug].push(event);
    }

    // -----------------------------
    // PICK CANONICAL
    // -----------------------------
    const uniqueEvents = [];

    for (const root in groups) {
      const group = groups[root];

      let canonical = group.find(e => !/-\d+$/.test(e.slug));

      if (!canonical) {
        canonical = group.sort((a, b) => a.slug.length - b.slug.length)[0];
      }

      uniqueEvents.push(canonical);
    }

    // -----------------------------
    // BUILD XML
    // -----------------------------
    const baseUrl = "https://www.webinx.in";

    const urls = uniqueEvents.map(event => `
      <url>
        <loc>${baseUrl}/webinar/${event.slug}</loc>
        <lastmod>${new Date(event.updated_at || event.created_at).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    `).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
    </urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);

  } catch (error) {
    console.error("SITEMAP ERROR:", error);

    res.status(500).send(`
      <h1>Sitemap Error</h1>
      <pre>${error.message}</pre>
    `);
  }
}
