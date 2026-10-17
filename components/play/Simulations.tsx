"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bot,
  Flag,
  Play,
  RotateCcw,
  Trash2,
  Check,
  BookOpen,
  Trees,
  Sun,
  Bike,
  Wrench,
  Goal,
  Lightbulb,
} from "lucide-react";
import {
  projectile,
  robotLevels,
  runRobot,
  cityFacilities,
  evaluateCity,
  type RobotCommand,
  type Point,
} from "@/lib/play-engine";
type Finish = { onFinish: () => void };
export function Experiment({ onFinish }: Finish) {
  const [speed, setSpeed] = useState(12),
    [angle, setAngle] = useState(30),
    [prediction, setPrediction] = useState(""),
    [trials, setTrials] = useState<{ angle: number; range: number }[]>([]),
    [shot, setShot] = useState<{ speed: number; angle: number } | null>(null),
    [frame, setFrame] = useState(60),
    [answer, setAnswer] = useState(""),
    [notice, setNotice] = useState("");
  const sim = projectile(shot?.speed ?? speed, shot?.angle ?? angle),
    running = frame < 60;
  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(60);
      return;
    }
    const id = setInterval(() => setFrame((f) => Math.min(60, f + 2)), 30);
    return () => clearInterval(id);
  }, [running]);
  const launch = () => {
    setShot({ speed, angle });
    setFrame(0);
    setTrials((t) =>
      [...t, { angle, range: projectile(speed, angle).range }].slice(-12),
    );
    setNotice("");
  };
  const sufficient =
    new Set(trials.map((t) => t.angle)).size >= 3 &&
    trials.some((t) => t.angle === 45);
  const ball = sim.points[frame];
  return (
    <div>
      <div className="play-instructions">
        <strong>مهمتك: أي زاوية تعطي أبعد مدى؟</strong>
        <p>
          اختر توقعًا، وثبّت السرعة، ثم جرّب ثلاث زوايا مختلفة تشمل 45°. راقب
          الفرق بين الارتفاع والمدى.
        </p>
      </div>
      <div className="play-sim-layout">
        <div>
          <div className="play-chart">
            <svg
              viewBox="0 0 600 310"
              role="img"
              aria-label={`مسار الكرة بزاوية ${shot?.angle ?? angle} درجة. المدى ${sim.range.toFixed(1)} متر والارتفاع ${sim.height.toFixed(1)} متر.`}
            >
              <defs>
                <linearGradient id="trajectory" x1="0" x2="1">
                  <stop stopColor="#06B6D4" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <line
                    x1={40 + i * 120}
                    y1="20"
                    x2={40 + i * 120}
                    y2="260"
                    stroke="#cddbec"
                    strokeDasharray="4 6"
                  />
                  <text
                    x={40 + i * 120}
                    y="287"
                    textAnchor="middle"
                    fill="#53627A"
                    fontSize="14"
                  >
                    {i * 10}m
                  </text>
                </g>
              ))}
              <path
                d="M40 20V260H565"
                fill="none"
                stroke="#8da2bf"
                strokeWidth="2"
              />
              <polyline
                points={sim.points
                  .map((p) => `${40 + p.x * 12},${260 - p.y * 12}`)
                  .join(" ")}
                fill="none"
                stroke="url(#trajectory)"
                strokeWidth="4"
                strokeDasharray={shot ? undefined : "5 6"}
              />
              <circle
                cx={40 + ball.x * 12}
                cy={260 - ball.y * 12}
                r="10"
                fill="#EA580C"
                stroke="white"
                strokeWidth="3"
              />
              <text x="52" y="32" fill="#53627A" fontSize="13">
                الارتفاع
              </text>
            </svg>
          </div>
          <div className="play-metrics">
            <span>
              المدى<strong>{sim.range.toFixed(1)} م</strong>
            </span>
            <span>
              أعلى ارتفاع<strong>{sim.height.toFixed(1)} م</strong>
            </span>
            <span>
              زمن الرحلة<strong>{sim.time.toFixed(2)} ث</strong>
            </span>
          </div>
          <p className="play-caption">
            نموذج مثالي: دون مقاومة الهواء، وبنفس ارتفاع الانطلاق والهبوط،
            والجاذبية 9.81 م/ث². لا يمثّل جميع ظروف الرياضة الواقعية.
          </p>
        </div>
        <div className="play-controls">
          <label>
            توقّعي قبل التجربة
            <select
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            >
              <option value="">اختر توقعًا</option>
              <option value="30">30°</option>
              <option value="45">45°</option>
              <option value="60">60°</option>
            </select>
          </label>
          <label>
            زاوية الإطلاق <output>{angle}°</output>
            <input
              type="range"
              min="10"
              aria-label="زاوية الإطلاق بالدرجات"
              max="80"
              step="5"
              value={angle}
              disabled={running}
              onChange={(e) => setAngle(+e.target.value)}
            />
          </label>
          <div className="play-presets">
            {[30, 45, 60].map((a) => (
              <button
                className={angle === a ? "active" : ""}
                disabled={running}
                onClick={() => setAngle(a)}
                key={a}
              >
                {a}°
              </button>
            ))}
          </div>
          <label>
            السرعة <output>{speed} م/ث</output>
            <input
              type="range"
              min="5"
              aria-label="سرعة الإطلاق بالمتر في الثانية"
              max="20"
              step="1"
              value={speed}
              disabled={running}
              onChange={(e) => {
                setSpeed(+e.target.value);
                setTrials([]);
                setShot(null);
                setNotice("بدأت مقارنة جديدة بعد تغيير السرعة.");
              }}
            />
          </label>
          <small>تغيير السرعة يبدأ مقارنة جديدة.</small>
          <button
            className="btn"
            onClick={launch}
            disabled={!prediction || running}
          >
            <Play size={18} />
            {running ? "الكرة في الطريق…" : "أطلق الكرة"}
          </button>
        </div>
      </div>
      {trials.length > 0 && (
        <div className="play-observations">
          <h3>دفتر ملاحظاتك</h3>
          <div className="play-trial-list">
            {trials.map((t, i) => (
              <span key={i}>
                {t.angle}° <strong>{t.range.toFixed(1)} م</strong>
              </span>
            ))}
          </div>
          <p>
            {sufficient
              ? "اختبرت ثلاث زوايا تشمل 45°. حان وقت الاستنتاج."
              : "جرّب ثلاث زوايا مختلفة على الأقل، منها 45°، بنفس السرعة."}
          </p>
        </div>
      )}
      {sufficient && (
        <div className="play-conclusion">
          <label>
            عند ثبات السرعة وافتراضات النموذج، الزاوية صاحبة المدى الأكبر هي:
            <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
              <option value="">اختر الاستنتاج</option>
              <option value="30">30°</option>
              <option value="45">45°</option>
              <option value="60">60°</option>
            </select>
          </label>
          <button
            className="btn"
            disabled={!answer || running}
            onClick={() => {
              if (answer === "45") onFinish();
              else
                setNotice(
                  "قارن الأرقام في دفتر الملاحظات: في هذا النموذج يكون المدى الأكبر عند 45°. أعد اختيار الاستنتاج.",
                );
            }}
          >
            اعتمد استنتاجي
          </button>
        </div>
      )}
      <p role="status">{notice}</p>
    </div>
  );
}
const commandIcons = {
  up: ArrowUp,
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
};
const commandLabels = { up: "أعلى", down: "أسفل", left: "يسار", right: "يمين" };
export function RobotGame({ onFinish }: Finish) {
  const [levelIndex, setLevelIndex] = useState(0),
    [commands, setCommands] = useState<RobotCommand[]>([]),
    [position, setPosition] = useState<Point>(robotLevels[0].start),
    [path, setPath] = useState<Point[]>([]),
    [running, setRunning] = useState(false),
    [won, setWon] = useState(false),
    [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const level = robotLevels[levelIndex];
  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    setPosition(level.start);
    setPath([]);
    setWon(false);
    setMessage("");
  };
  const execute = () => {
    const result = runRobot(level, commands);
    setPosition(level.start);
    setPath([level.start]);
    setWon(false);
    setMessage("");
    setRunning(true);
    let i = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const end = () => {
      setPosition(result.path[result.path.length - 1]);
      setPath(result.path);
      setRunning(false);
      setWon(result.success);
      setMessage(
        result.success
          ? "وصل الروبوت! ترتيبك للأوامر نجح."
          : result.reason === "wall"
            ? "توقّف قبل عائق برتقالي. عدّل المسار ثم جرّب."
            : result.reason === "edge"
              ? "وصل إلى حافة الشبكة. عدّل الاتجاه."
              : "انتهت الأوامر قبل الوصول. أضف خطوات أو عدّلها.",
      );
    };
    if (reduced) {
      end();
      return;
    }
    timer.current = setInterval(() => {
      i++;
      if (i >= result.path.length) {
        if (timer.current) clearInterval(timer.current);
        end();
      } else {
        setPosition(result.path[i]);
        setPath(result.path.slice(0, i + 1));
      }
    }, 260);
  };
  const advance = () => {
    if (levelIndex === robotLevels.length - 1) {
      onFinish();
      return;
    }
    const next = levelIndex + 1;
    setLevelIndex(next);
    setCommands([]);
    setPosition(robotLevels[next].start);
    setPath([]);
    setWon(false);
    setMessage("");
  };
  return (
    <div>
      <div className="play-instructions">
        <strong>المهمة {levelIndex + 1} من 3: أوصل الروبوت إلى العلم.</strong>
        <p>
          أضف أوامر بالترتيب. الأسهم تتبع اتجاه الشاشة. اضغط أي أمر في الشريط
          لحذفه، ثم اختبر المسار.
        </p>
      </div>
      <div className="play-sim-layout">
        <div>
          <div
            className="play-robot-grid"
            role="img"
            aria-label={`شبكة ${level.size} في ${level.size}. الروبوت في العمود ${position.x + 1} والصف ${position.y + 1} من أعلى اليسار. الهدف في العمود ${level.goal.x + 1} والصف ${level.goal.y + 1}.`}
            style={{ gridTemplateColumns: `repeat(${level.size},1fr)` }}
            dir="ltr"
          >
            {Array.from({ length: level.size * level.size }, (_, i) => {
              const x = i % level.size,
                y = Math.floor(i / level.size),
                wall = level.walls.some((w) => w.x === x && w.y === y),
                robot = position.x === x && position.y === y,
                goal = level.goal.x === x && level.goal.y === y,
                visited = path.some((p) => p.x === x && p.y === y);
              return (
                <div
                  className={`play-cell ${wall ? "wall" : ""} ${visited ? "visited" : ""} ${goal ? "goal" : ""}`}
                  key={i}
                >
                  {robot ? (
                    <Bot size={32} />
                  ) : wall ? (
                    <span className="play-obstacle" />
                  ) : goal ? (
                    <Flag size={28} />
                  ) : (
                    <span className="play-grid-dot" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="play-grid-legend">
            <span>
              <Bot size={16} /> الروبوت
            </span>
            <span>
              <Flag size={16} /> الهدف
            </span>
            <span>
              <i /> العائق
            </span>
          </div>
          <details>
            <summary>وصف الشبكة نصيًا</summary>
            <p>
              نعدّ الصفوف من الأعلى والأعمدة من اليسار. البداية: عمود{" "}
              {level.start.x + 1}، صف {level.start.y + 1}. الهدف: عمود{" "}
              {level.goal.x + 1}، صف {level.goal.y + 1}.
            </p>
            <p>
              العوائق:{" "}
              {level.walls
                .map((w) => `عمود ${w.x + 1} صف ${w.y + 1}`)
                .join("؛ ")}
              .
            </p>
          </details>
        </div>
        <div className="play-controls">
          <h3>لوحة الأوامر</h3>
          <div className="play-direction-pad" dir="ltr">
            {(["up", "left", "down", "right"] as RobotCommand[]).map((c) => {
              const Icon = commandIcons[c];
              return (
                <button
                  key={c}
                  className={`direction-${c}`}
                  title={commandLabels[c]}
                  aria-label={`أضف أمر ${commandLabels[c]}`}
                  disabled={running || commands.length >= level.max || won}
                  onClick={() => {
                    setCommands((v) => [...v, c]);
                    setMessage("");
                  }}
                >
                  <Icon />
                  <small>{commandLabels[c]}</small>
                </button>
              );
            })}
          </div>
          <p>
            {commands.length} / {level.max} أوامر
          </p>
          <div
            className="play-command-strip"
            dir="ltr"
            aria-label="تسلسل الأوامر"
          >
            {commands.map((c, i) => {
              const Icon = commandIcons[c];
              return (
                <button
                  key={i}
                  disabled={running || won}
                  onClick={() =>
                    setCommands((v) => v.filter((_, j) => j !== i))
                  }
                  aria-label={`حذف الأمر ${i + 1}: ${commandLabels[c]}`}
                >
                  <small>{i + 1}</small>
                  <Icon size={17} />
                </button>
              );
            })}
            {commands.length === 0 && <span>أضف أول خطوة</span>}
          </div>
          <div className="actions">
            <button
              className="btn"
              disabled={commands.length === 0 || running || won}
              onClick={execute}
            >
              <Play size={17} />
              {running ? "ينفّذ…" : "شغّل البرنامج"}
            </button>
            <button
              className="btn ghost"
              disabled={running}
              onClick={() => {
                reset();
                setCommands([]);
              }}
            >
              <Trash2 size={16} />
              مسح
            </button>
          </div>
          <details>
            <summary>
              <Lightbulb size={16} /> تلميح
            </summary>
            <p>
              تخيّل المسار من البداية للنهاية قبل كتابة الأوامر. ابحث عن ممر حول
              المكعبات، ويمكنك استخدام الصفوف والأعمدة الفارغة.
            </p>
          </details>
        </div>
      </div>
      <p
        className={won ? "play-feedback success" : "play-feedback"}
        role="status"
      >
        {message || "لا توجد عقوبة للمحاولة. افحص، وعدّل، وأعد التشغيل."}
      </p>
      {won && (
        <button className="btn" onClick={advance}>
          {levelIndex === 2 ? "أنهِ مهمات الروبوت" : "انتقل للمهمة التالية"}
          <ArrowLeft size={18} />
        </button>
      )}
    </div>
  );
}
const facilityIcons = [BookOpen, Trees, Goal, Sun, Bike, Wrench];
export function CityGame({ onFinish }: Finish) {
  const [selected, setSelected] = useState<string[]>([]),
    [checked, setChecked] = useState(false);
  const total = evaluateCity(selected);
  return (
    <div>
      <div className="play-instructions">
        <strong>ابنِ حيًا متوازنًا بميزانية 100 وحدة.</strong>
        <p>
          اختر مرافق تحقق 3 نقاط على الأقل في كل مجال: التعلّم والبيئة والنشاط.
          هذه تكاليف ونقاط خيالية للّعبة، وليست تقديرًا اقتصاديًا حقيقيًا.
        </p>
      </div>
      <div className="play-city-budget">
        <span>
          المتبقّي<strong>{100 - total.cost}</strong> وحدة
        </span>
        <div>
          {[
            ["التعلّم", total.learning],
            ["البيئة", total.green],
            ["النشاط", total.health],
          ].map(([name, value]) => (
            <label key={String(name)}>
              {name}: {value} / 3
              <progress
                max={3}
                value={Math.min(3, +value)}
                aria-label={String(name)}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="play-city-map" aria-label="المرافق المختارة">
        {cityFacilities.map((f, i) => {
          const Icon = facilityIcons[i];
          return (
            <div
              key={f.id}
              className={selected.includes(f.id) ? "built" : "empty"}
            >
              <Icon size={34} />
              <span>{selected.includes(f.id) ? f.name : "قطعة متاحة"}</span>
            </div>
          );
        })}
      </div>
      <div className="play-facilities">
        {cityFacilities.map((f, i) => {
          const Icon = facilityIcons[i],
            active = selected.includes(f.id);
          return (
            <button
              key={f.id}
              aria-pressed={active}
              className={active ? "active" : ""}
              disabled={!active && total.cost + f.cost > 100}
              onClick={() => {
                setSelected((s) =>
                  active ? s.filter((x) => x !== f.id) : [...s, f.id],
                );
                setChecked(false);
              }}
            >
              <Icon size={26} />
              <strong>{f.name}</strong>
              <span>{f.cost} وحدة</span>
              <small>
                {f.learning > 0 ? `تعلّم +${f.learning} ` : ""}
                {f.green > 0 ? `بيئة +${f.green} ` : ""}
                {f.health > 0 ? `نشاط +${f.health}` : ""}
              </small>
              {active && <Check size={18} />}
            </button>
          );
        })}
      </div>
      <div className="actions">
        <button
          className="btn"
          disabled={selected.length === 0}
          onClick={() => setChecked(true)}
        >
          قيّم خطّتي
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setSelected([]);
            setChecked(false);
          }}
        >
          <RotateCcw size={16} />
          ابدأ من جديد
        </button>
      </div>
      {checked && (
        <div
          className={`play-feedback ${total.success ? "success" : ""}`}
          role="status"
        >
          <h3>
            {total.success
              ? "خطة متوازنة ضمن الميزانية!"
              : "ما المجال الذي يحتاج اهتمامًا؟"}
          </h3>
          <p>
            {total.success
              ? "وفّرت فرص تعلّم ومساحة خضراء ونشاطًا بدنيًا. جرّب لاحقًا تشكيلة أخرى وقارن اختياراتك."
              : "راجع المؤشرات وأضف أو بدّل مرافق حتى يصل كل مجال إلى 3 نقاط. يمكنك إزالة مرفق بالضغط عليه."}
          </p>
          {total.success && (
            <button className="btn" onClick={onFinish}>
              اعتمد مدينتي
            </button>
          )}
        </div>
      )}
    </div>
  );
}
