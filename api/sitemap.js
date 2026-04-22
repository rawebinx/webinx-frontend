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
      const rawDate = event.updated_at || event.created_at || event.start_time;
      const date = new Date(rawDate);

      if (!rawDate || isNaN(date.getTime())) {
        return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
      }

      return date.toISOString().replace(/\.\d{3}Z$/, "Z");
    };

    // -----------------------------
    // DEDUP USING EXACT FULL SLUG
    // -----------------------------
    const seen = new Set();
    const uniqueEvents = [];

    for (const event of events) {
      if (!event.slug) continue;

      if (!seen.has(event.slug)) {
        seen.add(event.slug);
        uniqueEvents.push(event);
      }
    }

    // -----------------------------
    // BUILD XML
    // -----------------------------
    const escapeXml = (str) => String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const baseUrl = "https://www.webinx.in";

    const urls = uniqueEvents.map(event => `
      <url>
        <loc>${baseUrl}/webinar/${escapeXml(event.slug)}</loc>
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
