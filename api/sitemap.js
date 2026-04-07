export default async function handler(req, res) {
  try {
    const response = await fetch("https://webinx-backend.onrender.com/api/events");
    const data = await response.json();

    const grouped = {};

    const getRootSlug = (slug) => slug.replace(/-\d+$/, "");
    const isDuplicate = (slug) => /-\d+$/.test(slug);

    // STEP 1: GROUP BY ROOT
    data.forEach(event => {
      if (!event.slug) return;

      const root = getRootSlug(event.slug);

      if (!grouped[root]) {
        grouped[root] = [];
      }

      grouped[root].push(event);
    });

    // STEP 2: PICK BEST (CLEAN SLUG FIRST)
    const finalEvents = Object.values(grouped).map(group => {
      const clean = group.find(e => !isDuplicate(e.slug));
      return clean || group[0]; // fallback if only duplicates exist
    });

    // STEP 3: BUILD XML
    const urls = finalEvents.map(event => `
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
