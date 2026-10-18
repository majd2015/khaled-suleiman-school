// Exercises a disposable local server and storage directory, never school records.
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes, scryptSync } from "node:crypto";
const directory = await fs.mkdtemp(
  path.join(os.tmpdir(), "school-calendar-http-"),
);
const password = randomBytes(24).toString("hex"),
  salt = randomBytes(20).toString("hex");
await fs.writeFile(
  path.join(directory, "auth.json"),
  JSON.stringify({
    salt,
    hash: scryptSync(password, salt, 64).toString("hex"),
    secret: randomBytes(48).toString("hex"),
  }),
);
const base = "http://127.0.0.1:3113";
let server,
  logs = "";
async function start() {
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "-p",
      "3113",
      "-H",
      "127.0.0.1",
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_DIST_DIR: ".next-calendar-build",
        CALENDAR_DATA_DIR: directory,
        CALENDAR_TRUST_PROXY_IP: "0",
      },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout.on("data", (d) => (logs += d));
  server.stderr.on("data", (d) => (logs += d));
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(base + "/api/calendar");
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Test server did not start: " + logs);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const processToStop = server;
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 8000);
    processToStop.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    processToStop.kill();
  });
}
async function login() {
  const r = await fetch(base + "/api/calendar/session", {
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  assert.equal(r.status, 200, await r.clone().text());
  const header = r.headers
    .getSetCookie()
    .find((value) => value.startsWith("school-calendar-session="));
  assert.ok(header.includes("HttpOnly"));
  assert.ok(header.includes("SameSite=strict"));
  return header.split(";")[0];
}
try {
  await start();
  assert.equal(
    (
      await fetch(base + "/api/calendar", {
        method: "POST",
        headers: { Origin: base, "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await fetch(base + "/api/calendar", {
        method: "POST",
        headers: { Origin: "https://other.example" },
        body: "{}",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await fetch(base + "/api/calendar/session", {
        method: "POST",
        headers: { Origin: base, "Content-Type": "application/json" },
        body: JSON.stringify({ password: "wrong" }),
      })
    ).status,
    401,
  );
  const bad = () => ({
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({ password: "wrong" }),
  });
  const firstBad = await fetch(base + "/api/calendar/session", bad());
  const client = firstBad.headers
    .getSetCookie()
    .find((value) => value.startsWith("school-calendar-client="))
    .split(";")[0];
  for (let i = 0; i < 9; i++)
    assert.equal(
      (
        await fetch(base + "/api/calendar/session", {
          ...bad(),
          headers: { ...bad().headers, Cookie: client },
        })
      ).status,
      401,
    );
  const blocked = await fetch(base + "/api/calendar/session", {
    ...bad(),
    headers: {
      ...bad().headers,
      Cookie: client,
      "X-Forwarded-For": "203.0.113.9",
      "X-Real-IP": "203.0.113.9",
    },
  });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
  let cookie = await login(); // A different browser must still be able to authenticate.

  const write = (value, method = "POST") =>
    fetch(base + "/api/calendar", {
      method,
      headers: {
        Origin: base,
        Cookie: cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
  const event = {
    title: "HTTP calendar persistence fixture",
    description: "Integration test, temporary only",
    date: "2026-10-20",
    endDate: "2026-10-21",
    allDay: false,
    startTime: "08:00",
    endTime: "09:00",
    type: "نشاط",
    status: "draft",
    sample: false,
    grades: [8],
    location: "Test lab",
    attachmentUrl: "",
    attachmentLabel: "",
    repeat: "weekly",
    repeatUntil: "2026-11-03",
  };
  let r = await write(event);
  assert.equal(r.status, 201, await r.clone().text());
  let saved = (await r.json()).event;
  assert.ok(
    !(await (await fetch(base + "/api/calendar")).json()).events.some(
      (e) => e.id === saved.id,
    ),
  );
  assert.equal(
    (await fetch(base + "/calendar.ics?event=" + saved.id)).status,
    404,
  );
  const stale = { ...saved };
  r = await write({ ...saved, status: "confirmed" }, "PUT");
  assert.equal(r.status, 200);
  saved = (await r.json()).event;
  assert.ok(
    (await (await fetch(base + "/api/calendar")).json()).events.some(
      (e) => e.id === saved.id,
    ),
  );
  assert.equal((await write(stale, "PUT")).status, 409);
  assert.equal((await write({ ...event, date: "2026-02-30" })).status, 400);
  const exported = await (
    await fetch(base + "/calendar.ics?event=" + saved.id)
  ).text();
  assert.equal((exported.match(/BEGIN:VEVENT/g) || []).length, 3);
  assert.ok(exported.includes("DTSTART:20261020T050000Z"));
  assert.ok(exported.includes("DTSTART:20261027T060000Z"));
  const home = await (await fetch(base + "/")).text();
  assert.ok(
    home.includes(event.title),
    "Home should use live calendar records",
  );
  const grade = await (await fetch(base + "/grades/8")).text();
  assert.ok(
    grade.includes(event.title),
    "Grade page should use live calendar records",
  );
  const otherGrade = await (await fetch(base + "/grades/7")).text();
  assert.ok(
    !otherGrade.includes(event.title),
    "Grade filter should exclude other grades",
  );
  await stop();
  await start();
  cookie = await login();
  assert.ok(
    (await (await fetch(base + "/api/calendar")).json()).events.some(
      (e) => e.id === saved.id,
    ),
    "Event survives a server restart",
  );
  r = await write({ ...saved, sample: true }, "PUT");
  assert.equal(r.status, 200);
  saved = (await r.json()).event;
  assert.equal(
    (await fetch(base + "/calendar.ics?event=" + saved.id)).status,
    404,
  );
  r = await write({ ...saved, sample: false, status: "cancelled" }, "PUT");
  assert.equal(r.status, 200);
  assert.equal(
    (await fetch(base + "/calendar.ics?event=" + saved.id)).status,
    404,
  );
  const logout = await fetch(base + "/api/calendar/session", {
    method: "DELETE",
    headers: { Origin: base, Cookie: cookie },
  });
  assert.equal(logout.status, 200);
  assert.ok(logout.headers.get("set-cookie").includes("Max-Age=0"));
  console.log(
    JSON.stringify(
      {
        login: true,
        isolatedLoginLimit: true,
        spoofedForwardingIgnored: true,
        unauthorized: 401,
        crossOrigin: 403,
        draftsPrivate: true,
        createAndUpdate: true,
        conflicts: 409,
        invalidDates: 400,
        weeklyExportAcrossDST: true,
        homeAndGradesLive: true,
        restartPersistence: true,
        sampleAndCancelledExcluded: true,
        logout: true,
      },
      null,
      2,
    ),
  );
} finally {
  await stop();
  if (
    path.dirname(directory) === os.tmpdir() &&
    path.basename(directory).startsWith("school-calendar-http-")
  )
    await fs.rm(directory, { recursive: true, force: true });
}
