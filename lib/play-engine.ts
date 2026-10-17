export type RobotCommand = "up" | "down" | "left" | "right";
export type Point = { x: number; y: number };
export type RobotLevel = {
  start: Point;
  goal: Point;
  walls: Point[];
  size: number;
  max: number;
};
export const robotLevels: RobotLevel[] = [
  {
    size: 5,
    start: { x: 0, y: 4 },
    goal: { x: 4, y: 0 },
    walls: [
      { x: 1, y: 4 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
    ],
    max: 10,
  },
  {
    size: 5,
    start: { x: 0, y: 0 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ],
    max: 12,
  },
  {
    size: 6,
    start: { x: 0, y: 5 },
    goal: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 5 },
      { x: 1, y: 4 },
      { x: 1, y: 3 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 4 },
    ],
    max: 14,
  },
];
export function runRobot(level: RobotLevel, commands: RobotCommand[]) {
  const path: Point[] = [{ ...level.start }];
  if (commands.length > level.max)
    return { path, success: false, reason: "limit" };
  for (const command of commands) {
    const current = path[path.length - 1];
    const delta = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[
      command
    ];
    if (!delta) return { path, success: false, reason: "invalid" };
    const next = { x: current.x + delta[0], y: current.y + delta[1] };
    if (
      next.x < 0 ||
      next.y < 0 ||
      next.x >= level.size ||
      next.y >= level.size
    )
      return { path, success: false, reason: "edge" };
    if (level.walls.some((w) => w.x === next.x && w.y === next.y))
      return { path, success: false, reason: "wall" };
    path.push(next);
  }
  const last = path[path.length - 1];
  return {
    path,
    success: last.x === level.goal.x && last.y === level.goal.y,
    reason: "end",
  };
}
export function projectile(speed: number, angle: number) {
  const v = Math.min(20, Math.max(5, Number.isFinite(speed) ? speed : 10));
  const radians =
    (Math.min(80, Math.max(10, Number.isFinite(angle) ? angle : 45)) *
      Math.PI) /
    180;
  const g = 9.81,
    vx = v * Math.cos(radians),
    vy = v * Math.sin(radians),
    time = (2 * vy) / g;
  return {
    range: vx * time,
    height: (vy * vy) / (2 * g),
    time,
    points: Array.from({ length: 61 }, (_, i) => {
      const t = (time * i) / 60;
      return { x: vx * t, y: Math.max(0, vy * t - 0.5 * g * t * t) };
    }),
  };
}
export const cityFacilities = [
  {
    id: "library",
    name: "مكتبة",
    cost: 25,
    learning: 3,
    green: 0,
    health: 0,
    icon: "book",
  },
  {
    id: "garden",
    name: "حديقة",
    cost: 20,
    learning: 0,
    green: 3,
    health: 1,
    icon: "tree",
  },
  {
    id: "court",
    name: "ملعب",
    cost: 25,
    learning: 0,
    green: 0,
    health: 3,
    icon: "ball",
  },
  {
    id: "solar",
    name: "طاقة شمسية",
    cost: 30,
    learning: 1,
    green: 3,
    health: 0,
    icon: "sun",
  },
  {
    id: "cycle",
    name: "مسار دراجات",
    cost: 15,
    learning: 0,
    green: 1,
    health: 2,
    icon: "bike",
  },
  {
    id: "workshop",
    name: "ورشة تعلّم",
    cost: 20,
    learning: 2,
    green: 0,
    health: 0,
    icon: "tool",
  },
];
export function evaluateCity(ids: string[]) {
  const chosen = cityFacilities.filter((f) => ids.includes(f.id));
  const totals = chosen.reduce(
    (s, f) => ({
      cost: s.cost + f.cost,
      learning: s.learning + f.learning,
      green: s.green + f.green,
      health: s.health + f.health,
    }),
    { cost: 0, learning: 0, green: 0, health: 0 },
  );
  return {
    ...totals,
    success:
      totals.cost <= 100 &&
      totals.learning >= 3 &&
      totals.green >= 3 &&
      totals.health >= 3,
  };
}
export type PlayProgress = {
  version: 1;
  completed: Record<string, string>;
  drafts: Record<string, string>;
  vote: string | null;
};
export const emptyProgress = (): PlayProgress => ({
  version: 1,
  completed: {},
  drafts: {},
  vote: null,
});
export function parseProgress(raw: string | null): PlayProgress {
  if (!raw) return emptyProgress();
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1) return emptyProgress();
    const clean = (value: unknown, max: number) =>
      Object.fromEntries(
        Object.entries(
          value && typeof value === "object" && !Array.isArray(value)
            ? value
            : {},
        )
          .filter(
            ([k, v]) =>
              /^[a-z0-9-:]{1,100}$/.test(k) &&
              typeof v === "string" &&
              v.length <= max,
          )
          .slice(0, 300),
      );
    return {
      version: 1,
      completed: clean(data.completed, 40),
      drafts: clean(data.drafts, 4000),
      vote:
        typeof data.vote === "string" &&
        ["science", "stories", "sports", "values"].includes(data.vote)
          ? data.vote
          : null,
    };
  } catch {
    return emptyProgress();
  }
}
export function dailyIndex(date: Date, count: number) {
  return count > 0
    ? Math.floor(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) /
          86400000,
      ) % count
    : 0;
}
