import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  searchArticles,
  normalizeArabic,
  articleImage,
} from "../lib/article-utils.ts";
import * as THREE from "three";
import {
  createMathModel,
  createPhysicsModel,
  createComputingModel,
  createElectronicsModel,
  createBiologyModel,
} from "../lib/models/index.mjs";
const articles = JSON.parse(
  fs.readFileSync(new URL("../content/articles.json", import.meta.url), "utf8"),
);
const root = path.resolve(import.meta.dirname, "..");
test("Arabic search tolerates diacritics and alef variants and combines words", () => {
  assert.equal(normalizeArabic("أَمَانَـة"), "امانة");
  assert.ok(
    searchArticles(articles, "التُّفّاح").some(
      (a) => a.slug === "apple-browning",
    ),
  );
  assert.ok(
    searchArticles(articles, "أمانة مسؤولية").some(
      (a) => a.slug === "trust-beyond-money",
    ),
  );
  assert.equal(searchArticles(articles, "التفاح", "sports").length, 0);
  assert.equal(searchArticles(articles, "", "islamic").length, 4);
  assert.equal(searchArticles(articles, "zzzz-no-article").length, 0);
});
test("44 unique complete articles retain covers, source references and valid quizzes", () => {
  assert.equal(articles.length, 44);
  const slugs = new Set(articles.map((a) => a.slug));
  assert.equal(slugs.size, 44);
  for (const a of articles) {
    assert.equal(a.sections.length, 4);
    assert.ok(a.sections.every((s) => s.paragraphs.length >= 2));
    assert.ok(
      a.question.correctIndex >= 0 &&
        a.question.correctIndex < a.question.options.length,
    );
    assert.ok(a.related.every((s) => slugs.has(s)));
    for (const s of a.sections)
      for (const id of s.sourceIds || [])
        assert.ok(
          a.sources.some((x) => x.id === id),
          a.slug + " source " + id,
        );
    for (const image of a.cover.srcSet)
      assert.ok(
        fs.existsSync(path.join(root, "public", articleImage(image.src))),
        a.slug,
      );
    if (a.diagram)
      assert.ok(
        fs.existsSync(
          path.join(
            root,
            "public/assets/diagrams",
            path.basename(a.diagram.src),
          ),
        ),
      );
    assert.equal(a.author, null);
    assert.equal(a.publishedAt, null);
  }
});
for (const create of [
  createMathModel,
  createPhysicsModel,
  createComputingModel,
  createElectronicsModel,
  createBiologyModel,
])
  test(
    create.name + " has finite visible geometry and releases its scene",
    () => {
      const model = create(THREE);
      model.update(0);
      model.update(1);
      const bounds = new THREE.Box3().setFromObject(model.group);
      assert.ok(!bounds.isEmpty());
      assert.ok(
        Number.isFinite(bounds.getBoundingSphere(new THREE.Sphere()).radius),
      );
      let meshes = 0;
      model.group.traverse((o) => {
        if (o.isMesh) {
          meshes++;
          const vertices = o.geometry.attributes.position.array;
          assert.ok([...vertices].every(Number.isFinite));
        }
      });
      assert.ok(meshes > 3);
      model.dispose();
      model.dispose();
      model.update(2);
      assert.equal(model.group.children.length, 0);
    },
  );
