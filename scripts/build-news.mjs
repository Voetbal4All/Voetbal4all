import fs from "fs";
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 15000,
  customFields: {
    item: [
      ["dc:date", "dcDate"],
      ["published", "published"],
      ["updated", "updated"],
    ],
  },
});

const config = JSON.parse(fs.readFileSync("data/feeds.json", "utf-8"));
const feeds = config.feeds || [];
const maxItems = config.maxItems || 20;

function pickDate(item) {
  const raw =
    item.isoDate ||
    item.pubDate ||
    item.dcDate ||
    item.published ||
    item.updated ||
    null;

  const d = raw ? new Date(raw) : null;
  return d && !isNaN(d.getTime()) ? d.toISOString() : null;
}

function cleanText(str) {
  return (str || "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeKey(obj) {
  // Eerst link, anders titel+bron
  if (obj.link) return `link:${obj.link}`;
  return `title:${obj.source}|${obj.title}`.toLowerCase();
}

const allItems = [];

for (const feed of feeds) {
  try {
    const result = await parser.parseURL(feed.url);

    const perFeedLimit = feed.limit || 5;
    const items = (result.items || []).slice(0, perFeedLimit);

    items.forEach((item) => {
      const title = cleanText(item.title);
      const link = item.link || item.guid || null;

      allItems.push({
        source: feed.name,
        title: title || "Zonder titel",
        link: link,
        summary: cleanText(item.contentSnippet || item.content || ""),
        publishedAt: pickDate(item),
      });
    });
  } catch (err) {
    console.error("Fout bij feed:", feed.name, err.message);
  }
}

// Sort newest first (items zonder datum gaan naar onder)
allItems.sort((a, b) => {
  const ad = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const bd = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  return bd - ad;
});

// Deduplicate (link/title)
const seen = new Set();
const unique = [];
for (const it of allItems) {
  const key = makeKey(it);
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(it);
}

// Globale limiet toepassen
const finalItems = unique.slice(0, maxItems);

fs.mkdirSync("data", { recursive: true });

fs.writeFileSync(
  "data/news.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), items: finalItems }, null, 2)
);

console.log("news.json gegenereerd:", finalItems.length, "items (unique)");
