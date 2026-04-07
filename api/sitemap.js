export default async function handler(req, res) {
  try {
    const response = await fetch("https://webinx-backend.onrender.com/api/events");
    const data = await response.json();

    const unique = new Map();

    // ✅ BEST: slug root deduplication
    const getRootSlug = (slug) => {
      return slug.replace(/-\d+$/, "");
    };

    data.forEach(event => {
      if (!event.slug) return;

      const key = getRootSlug(event.slug);

      if (!unique.has(key)) {
        unique.set(key, event);
      }
    });

    const events = Array.from(unique.values());

    const urls = events.map(event => `
      <url>
        <loc>https://webinx.in/webinar/${event.slug}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
        <priority>0.8</priority>
      </url>
    `).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://webinx.in/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://webinx.in/browse</loc>
    <priority>0.9</priority>
  </url>
  ${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
}
