import test from "node:test";
import assert from "node:assert/strict";
import { games, questions } from "../content/games.ts";
import { story } from "../content/story.ts";
import { parseProgress } from "../lib/play-engine.ts";

test("all story branches resolve after multiple decisions, without loops or missing scenes", () => {
  const endings = new Set(),
    visited = new Set();
  function walk(key, trail = []) {
    assert.ok(story[key], `Missing scene ${key}`);
    assert.ok(!trail.includes(key), "Story must not loop");
    const scene = story[key],
      path = [...trail, key];
    visited.add(key);
    if (scene.ending) {
      assert.ok(path.length >= 5, "Ending needs at least four decisions");
      assert.ok(scene.takeaway.length > 40);
      endings.add(key);
      return;
    }
    assert.ok(scene.choices.length >= 2);
    for (const choice of scene.choices) walk(choice.next, path);
  }
  walk("start");
  assert.equal(endings.size, 4);
  assert.equal(visited.size, Object.keys(story).length);
});

test("retired activities are absent and existing personal drafts remain exportable", () => {
  for (const slug of ["creative-studio", "what-if"])
    assert.ok(!games.some((g) => g.slug === slug));
  const saved = parseProgress(
    JSON.stringify({
      version: 1,
      completed: { "what-if": "2026-10-18" },
      drafts: {
        "creative-title": "عنوان محفوظ",
        "project-title": "فكرة قديمة",
      },
      vote: "science",
    }),
  );
  assert.equal(saved.drafts["creative-title"], "عنوان محفوظ");
  assert.equal(saved.drafts["project-title"], "فكرة قديمة");
});

test("news uses evidence and both reviewed quizzes explain each alternative", () => {
  for (const id of ["news-detective", "living-values"]) {
    assert.equal(questions[id].length, 5);
    for (const q of questions[id]) {
      assert.equal(q.feedback.length, q.options.length);
      assert.ok(q.feedback.every((text) => text.length > 20));
    }
  }
  assert.ok(
    questions["news-detective"].filter((q) => q.evidence?.length >= 2).length >=
      3,
  );
});
