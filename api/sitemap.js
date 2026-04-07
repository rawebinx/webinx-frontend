export default async function handler(req, res) {
  try {
    const response = await fetch("https://webinx-backend.onrender.com/api/events");
    const data = await response.json();

    const unique = new Map();

    const getRootSlug = (slug) => slug.replace(/-\d+$/, "");
    const isDuplicateSlug = (slug) => /-\d+$/.test(slug);

    data.forEach(event => {
      if (!event.slug) return;

      const root = getRootSlug(event.slug);

      if (!unique.has(root)) {
        unique.set(root, event);
      } else {
        const existing = unique.get(root);

        // ✅ Prefer CLEAN slug over -1/-2
        if (isDuplicateSlug(existing.slug) && !isDuplicateSlug(event.slug)) {
          unique.set(root, event);
        }
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
