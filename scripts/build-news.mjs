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

function metaFromSource(sourceName) {
  const s = (sourceName || "").trim().toLowerCase();

  // België
  if (s.includes("sporza")) return { country: "BE", flag: "🇧🇪" };
  if (s.includes("hln")) return { country: "BE", flag: "🇧🇪" };

  // Nederland
  if (s.includes("voetbal international")) return { country: "NL", flag: "🇳🇱" };
  if (s.includes("nos")) return { country: "NL", flag: "🇳🇱" };

  // Internationaal
  if (s.includes("bbc")) return { country: "INT", flag: "🌍" };
  if (s.includes("the guardian")) return { country: "INT", flag: "🌍" };
  if (s.includes("sky sports")) return { country: "INT", flag: "🌍" };
  if (s.includes("espn")) return { country: "INT", flag: "🌍" };
  if (s.includes("uefa")) return { country: "INT", flag: "🌍" };
  if (s.includes("fifa")) return { country: "INT", flag: "🌍" };

  // Default
  return { country: "INT", flag: "🌍" };
}

const allItems = [];

function countryFromSourceName(name) {
  const n = (name || "").toLowerCase();

  // België
  if (n.includes("sporza") || n.includes("hln")) return "BE";

  // Nederland
  if (n.includes("voetbal international") || n.includes("nos")) return "NL";

  // UK
  if (n.includes("bbc") || n.includes("guardian") || n.includes("sky sports")) return "UK";

  // US
  if (n.includes("espn")) return "US";

  // Internationaal
  if (n.includes("uefa") || n.includes("fifa")) return "INT";

  return "INT";
}

function flagFromCountry(code) {
  switch (code) {
    case "BE": return "🇧🇪";
    case "NL": return "🇳🇱";
    case "UK": return "🇬🇧";
    case "US": return "🇺🇸";
    default: return "🌍";
  }
}
for (const feed of feeds) {
  try {
    const result = await parser.parseURL(feed.url);

    const perFeedLimit = feed.limit || 5;
    const items = (result.items || []).slice(0, perFeedLimit);

items.forEach((item) => {
  const title = cleanText(item.title);
  const link = item.link || item.guid || null;

  const sourceSlug = feed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const country = countryFromSourceName(feed.name);
  const flag = flagFromCountry(country);

  allItems.push({
    type: "rss",
    source: feed.name,
    sourceSlug,
    country,
    flag,
    title: title || "Zonder titel",
    link,
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
