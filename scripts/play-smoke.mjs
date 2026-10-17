import assert from "node:assert/strict";
import fs from "node:fs";
import { games } from "../content/games.ts";
const base = process.argv[2] || "http://127.0.0.1:3101";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname))
  throw new Error("Use a local preview");
const pages = [
  "/play",
  "/play/passport",
  "/play/community",
  ...games.map((g) => "/play/" + g.slug),
];
const assets = fs
  .readdirSync(new URL("../public/assets/play/", import.meta.url))
  .filter((f) => f.endsWith(".webp"))
  .map((f) => "/assets/play/" + f);
for (const pathname of [...pages, ...assets]) {
  const response = await fetch(base + pathname);
  assert.equal(response.status, 200, pathname);
  if (pages.includes(pathname)) {
    const html = await response.text();
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, pathname);
    assert.ok(html.includes('dir="rtl"'));
  }
}
assert.equal((await fetch(base + "/play/not-a-game")).status, 404);
const articles = JSON.parse(
  fs.readFileSync(new URL("../content/articles.json", import.meta.url), "utf8"),
);
for (const a of articles) {
  const html = await (await fetch(base + "/articles/" + a.slug)).text();
  assert.ok(html.includes("/play/article-quest?article=" + a.slug), a.slug);
}
console.log(
  JSON.stringify(
    {
      gamePages: pages.length,
      images: assets.length,
      articleChallengeLinks: articles.length,
      unknownGame: 404,
      failures: [],
    },
    null,
    2,
  ),
);
