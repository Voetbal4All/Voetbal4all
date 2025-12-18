import fs from "fs";
import Parser from "rss-parser";

const parser = new Parser();

const config = JSON.parse(
  fs.readFileSync("data/feeds.json", "utf-8")
);

const feeds = config.feeds || [];
const maxItems = config.maxItems || 20;

const allItems = [];

for (const feed of feeds) {
  try {
    const result = await parser.parseURL(feed.url);

    result.items.slice(0, 5).forEach(item => {
      allItems.push({
        source: feed.name,
        title: item.title,
        link: item.link,
        summary: item.contentSnippet || item.content || "",
        publishedAt: item.pubDate || null
      });
    });
  } catch (err) {
    console.error("Fout bij feed:", feed.name, err.message);
  }
}

allItems.sort(
  (a, b) =>
    new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
);

const limitedItems = allItems.slice(0, maxItems);

fs.mkdirSync("data", { recursive: true });

fs.writeFileSync(
  "data/news.json",
  JSON.stringify({ items: allItems }, null, 2)
);

console.log("news.json gegenereerd:", allItems.length, "items");
