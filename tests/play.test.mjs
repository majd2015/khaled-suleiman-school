import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  projectile,
  runRobot,
  robotLevels,
  evaluateCity,
  cityFacilities,
  parseProgress,
  dailyIndex,
} from "../lib/play-engine.ts";
import { games, questions } from "../content/games.ts";
test("every robot mission has a reachable solution within its command budget", () => {
  for (const level of robotLevels) {
    const queue = [[]],
      seen = new Set();
    let solution;
    while (queue.length) {
      const route = queue.shift();
      const r = runRobot(level, route);
      if (r.success) {
        solution = route;
        break;
      }
      if (r.reason !== "end" || route.length >= level.max) continue;
      const p = r.path.at(-1),
        key = `${p.x}:${p.y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      for (const command of ["up", "down", "left", "right"])
        queue.push([...route, command]);
    }
    assert.ok(solution);
    assert.ok(solution.length <= level.max);
    assert.equal(runRobot(level, solution).success, true);
  }
});
test("robot never walks through a wall or outside the board and enforces max commands", () => {
  assert.equal(runRobot(robotLevels[0], ["right"]).reason, "wall");
  assert.equal(runRobot(robotLevels[0], ["down"]).reason, "edge");
  assert.equal(runRobot(robotLevels[0], Array(11).fill("up")).reason, "limit");
  assert.deepEqual(runRobot(robotLevels[0], ["up", "right", "up"]).path, [
    { x: 0, y: 4 },
    { x: 0, y: 3 },
  ]);
});
test("ideal projectile agrees with known ranges and complementary angles", () => {
  const a = projectile(10, 45),
    b = projectile(10, 30),
    c = projectile(10, 60);
  assert.ok(Math.abs(a.range - 100 / 9.81) < 1e-8);
  assert.ok(Math.abs(b.range - c.range) < 1e-8);
  assert.ok(a.range > b.range);
  assert.ok(c.height > b.height);
  assert.equal(a.points[0].y, 0);
  assert.ok(a.points.at(-1).y < 1e-10);
  assert.ok(
    projectile(NaN, Infinity).points.every(
      (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
    ),
  );
});
test("city accepts balanced affordable plans, rejects overspend and cannot double count facilities", () => {
  // The easy trio no longer passes; a real trade-off is needed at target 4.
  assert.equal(evaluateCity(["library", "garden", "court"]).success, false);
  assert.equal(evaluateCity(["library", "garden", "court"]).cost, 70);
  assert.equal(evaluateCity(["library", "court", "solar", "cycle"]).success, true);
  assert.equal(evaluateCity(["library", "garden", "court", "solar"]).success, true);
  assert.equal(evaluateCity(cityFacilities.map((f) => f.id)).success, false);
  assert.equal(evaluateCity(["library", "library", "unknown"]).cost, 25);
  assert.equal(evaluateCity(["garden", "court"]).success, false);
});
test("stored progress tolerates corrupt and old data and strips invalid entries", () => {
  assert.equal(parseProgress("{").version, 1);
  assert.deepEqual(parseProgress(null).completed, {});
  assert.deepEqual(
    parseProgress(JSON.stringify({ version: 9, completed: { a: "today" } }))
      .completed,
    {},
  );
  const data = parseProgress(
    JSON.stringify({
      version: 1,
      completed: { "escape-lab": "2026-10-17", "invalid key": "x", bad: 32 },
      drafts: { "story-reflection": "مسودتي", overflow: "x".repeat(4001) },
      vote: "fake",
    }),
  );
  assert.deepEqual(data.completed, { "escape-lab": "2026-10-17" });
  assert.equal(data.drafts["story-reflection"], "مسودتي");
  assert.equal(data.vote, null);
  assert.equal(data.drafts.overflow, undefined);
});
test("daily suggestion is stable during one local day and changes across days", () => {
  assert.equal(
    dailyIndex(new Date(2026, 9, 17, 1), 12),
    dailyIndex(new Date(2026, 9, 17, 23), 12),
  );
  assert.notEqual(
    dailyIndex(new Date(2026, 9, 17), 12),
    dailyIndex(new Date(2026, 9, 18), 12),
  );
});
test("twelve activities have playable engines, valid answers and responsive generated assets", () => {
  assert.equal(games.length, 12);
  assert.equal(new Set(games.map((g) => g.slug)).size, 12);
  for (const game of games) {
    assert.ok(
      [
        "quiz",
        "experiment",
        "robot",
        "city",
        "story",
        "creative",
        "article",
      ].includes(game.kind),
    );
    for (const width of [480, 800, 1440])
      assert.ok(
        fs.existsSync(
          new URL(
            `../public/assets/play/${game.image}-${width}.webp`,
            import.meta.url,
          ),
        ),
      );
    if (game.kind === "quiz") {
      assert.ok(questions[game.slug].length >= 3);
      for (const q of questions[game.slug]) {
        assert.ok(q.answer >= 0 && q.answer < q.options.length);
        assert.equal(new Set(q.options).size, q.options.length);
        assert.ok(q.explanation.length > 30);
      }
    }
  }
});
