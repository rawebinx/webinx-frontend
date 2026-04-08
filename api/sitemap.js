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
    // SAFE DATE FUNCTION
    // -----------------------------
    const getValidDate = (event) => {
      const rawDate = event.updated_at || event.created_at;
      const date = new Date(rawDate);

      if (!rawDate || isNaN(date.getTime())) {
        return new Date().toISOString();
      }

      return date.toISOString();
    };

    // -----------------------------
    // FORCE ROOT SLUG (CRITICAL FIX)
    // -----------------------------
    const seen = new Set();
    const uniqueEvents = [];

    for (const event of events) {
      if (!event.slug) continue;

      const rootSlug = event.slug.replace(/-\d+$/, "");

      if (!seen.has(rootSlug)) {
        seen.add(rootSlug);

        // override slug → CLEAN VERSION
        uniqueEvents.push({
          ...event,
          slug: rootSlug
        });
      }
    }

    // -----------------------------
    // BUILD XML
    // -----------------------------
    const baseUrl = "https://www.webinx.in";

    const urls = uniqueEvents.map(event => `
      <url>
        <loc>${baseUrl}/webinar/${event.slug}</loc>
        <lastmod>${getValidDate(event)}</lastmod>
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
