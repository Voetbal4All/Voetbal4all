import fs from "fs";
import Parser from "rss-parser";

const parser = new Parser();

// 1. Config inladen
const config = JSON.parse(
  fs.readFileSync("data/feeds.json", "utf-8")
);

const feeds = config.feeds || [];
const maxItems = config.maxItems || 20;

const allItems = [];

// 2. RSS-feeds ophalen
for (const feed of feeds) {
  try {
    const result = await parser.parseURL(feed.url);

    // Max 5 items per feed
    result.items.slice(0, 5).forEach(item => {
      allItems.push({
        source: feed.name,
        title: item.title || "",
        link: item.link || "",
        summary: item.contentSnippet || item.content || "",
        publishedAt: item.pubDate || null
      });
    });

  } catch (err) {
    console.error("Fout bij feed:", feed.name, err.message);
  }
}

// 3. Sorteren op datum (nieuwste eerst)
allItems.sort(
  (a, b) =>
    new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
);

// 4. Max totaal items afdwingen (20)
const limitedItems = allItems.slice(0, maxItems);

// 5. Data-map verzekeren
fs.mkdirSync("data", { recursive: true });

// 6. news.json schrijven
fs.writeFileSync(
  "data/news.json",
  JSON.stringify({ items: limitedItems }, null, 2)
);

// 7. Log
console.log(
  "news.json gegenereerd:",
  limitedItems.length,
  "items (max",
  maxItems + ")"
);
