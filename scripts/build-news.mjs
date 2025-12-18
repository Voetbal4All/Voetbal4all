import fs from "fs";
import path from "path";
import crypto from "crypto";
import Parser from "rss-parser";

const ROOT = process.cwd();
const FEEDS_PATH = path.join(ROOT, "data", "feeds.json");
const OUT_PATH = path.join(ROOT, "data", "news.json");

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent": "Voetbal4AllRSSBot/1.0 (+GitHub Actions)"
  }
});

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toISO(d) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString();
  } catch {
    return null;
  }
}

function makeId(source, link, title) {
  const raw = `${source}__${link || ""}__${title || ""}`;
  return crypto.createHash("sha1").update(raw).digest("hex");
}

async function main() {
  if (!fs.existsSync(FEEDS_PATH)) {
    throw new Error(`feeds.json ontbreekt: ${FEEDS_PATH}`);
  }

  const cfg = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf-8"));
  const maxItems = Number(cfg.maxItems || 20);
  const feeds = Array.isArray(cfg.feeds) ? cfg.feeds : [];

  const all = [];
  const errors = [];

  for (const f of feeds) {
    if (!f?.url) continue;

    try {
      const feed = await parser.parseURL(f.url);

      for (const item of (feed.items || [])) {
        const title = (item.title || "").trim();
        const link = (item.link || item.guid || "").trim();
        const publishedAt =
          toISO(item.isoDate) || toISO(item.pubDate) || toISO(item.published) || null;

        const summaryRaw = item.contentSnippet || item.summary || item.content || "";
        const summary = stripHtml(summaryRaw).slice(0, 240); // professioneel: kort & scanbaar

        if (!title || !link) continue;

        all.push({
          id: makeId(f.name || feed.title || "Nieuws", link, title),
          source: (f.name || feed.title || "Nieuws").trim(),
          title,
          link,
          summary,
          publishedAt
        });
      }
    } catch (e) {
      errors.push({ feed: f.name || f.url, error: String(e?.message || e) });
    }
  }

  // Deduplicate op id
  const map = new Map();
  for (const it of all) {
    if (!map.has(it.id)) map.set(it.id, it);
  }
  const deduped = Array.from(map.values());

  // Sort: newest first (null dates last)
  deduped.sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : -1;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : -1;
    return db - da;
  });

  const items = deduped.slice(0, maxItems);

  const out = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    errors,
    items
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf-8");

  console.log(`OK: geschreven naar ${OUT_PATH} (${items.length} items)`);
  if (errors.length) {
    console.log(`Let op: ${errors.length} feed(s) met fout.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
