// Restricted Windows hosts can fail concurrent mkdir calls in Next's asset emitter.
// Prepare the generated output tree sequentially, then let Next write the build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.env.NEXT_DIST_DIR || ".next";
if (!/^\.next(?:-[a-z-]+)?$/.test(name))
  throw new Error("Expected a .next output directory inside this project");
const output = path.resolve(root, name);
if (path.dirname(output) !== root)
  throw new Error("Build output must stay inside the project");
fs.rmSync(output, { recursive: true, force: true });
const app = path.join(root, "app");
const routes = [
  "",
  "_not-found",
  ...fs
    .readdirSync(app, { recursive: true, withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.relative(app, path.join(d.parentPath, d.name))),
];
for (const base of ["server/app", "types/app", "static/chunks/app"]) {
  for (const route of routes)
    fs.mkdirSync(path.join(output, base, route), { recursive: true });
}
for (const base of [
  "server/pages",
  "server/chunks",
  "static/chunks/pages",
  "static/css",
  "static/media",
  "diagnostics",
  "cache",
  "export",
])
  fs.mkdirSync(path.join(output, base), { recursive: true });
const result = spawnSync(
  process.execPath,
  [path.join(root, "node_modules/next/dist/bin/next"), "build"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NEXT_PREPARED_OUTPUT: "1" },
  },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
