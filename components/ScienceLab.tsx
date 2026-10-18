"use client";
import { useEffect, useRef, useState } from "react";
import {
  Atom,
  ChartNoAxesCombined,
  Code2,
  Cpu,
  Sprout,
  Box,
  RotateCcw,
} from "lucide-react";
const subjects = [
  {
    id: "math",
    title: "الرياضيات",
    icon: ChartNoAxesCombined,
    text: "كيف يتغيّر المنحنى؟",
    description:
      "منحنى رمزي متكرر، ونقطة تتحرّك عليه. تأمّل كيف تختلف حركة النقطة عن شكل المسار.",
    fallback: "home-hero",
  },
  {
    id: "physics",
    title: "الفيزياء",
    icon: Atom,
    text: "فكرة لها أكثر من بُعد.",
    description:
      "مجسّم رمزي للذرّة؛ الحلقات وسيلة بصرية للتعبير عن الفيزياء، وليست مسارات حقيقية للإلكترونات.",
    fallback: "home-hero",
  },
  {
    id: "computing",
    title: "الحاسوب",
    icon: Code2,
    text: "كل خطوة تصنع فرقًا.",
    description:
      "نافذة رمزية للبرمجة: خطوات متتابعة تتحول إلى نتيجة. جرّب النظر إلى المجسّم من زوايا مختلفة.",
    fallback: "home-hero",
  },
  {
    id: "electronics",
    title: "الإلكترونيات",
    icon: Cpu,
    text: "فكرة تبدأ باتصال.",
    description:
      "شريحة ووصلات في نموذج تعبيري. هذه ليست دائرة كهربائية قابلة للتركيب أو مخططًا للتوصيل.",
    fallback: "home-hero",
  },
  {
    id: "biology",
    title: "الأحياء",
    icon: Sprout,
    text: "الحياة مليئة بالأنماط.",
    description:
      "لولب رمزي مستوحى من بنية الحمض النووي، مبسّط للاستكشاف البصري ولا يصف مقياسه الحقيقي.",
    fallback: "grade-8-experiment",
  },
];
export default function ScienceLab({
  initialSubject,
}: {
  initialSubject: string;
}) {
  const [selected, setSelected] = useState(
      subjects.some((s) => s.id === initialSubject)
        ? initialSubject
        : "physics",
    ),
    [enabled, setEnabled] = useState(false),
    [status, setStatus] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const subject = subjects.find((s) => s.id === selected)!;
  useEffect(() => {
    if (!enabled || !container.current) return;
    let disposed = false,
      viewer: { dispose(): void } | undefined;
    setStatus("جارٍ تجهيز المجسّم…");
    Promise.all([import("three"), import("@/lib/models/index.mjs")])
      .then(([THREE, models]) => {
        if (disposed || !container.current) return;
        const factories = {
          math: models.createMathModel,
          physics: models.createPhysicsModel,
          computing: models.createComputingModel,
          electronics: models.createElectronicsModel,
          biology: models.createBiologyModel,
        };
        viewer = models.mountModelViewer({
          THREE,
          container: container.current,
          createModel: factories[selected as keyof typeof factories],
          fallbackUrl: "/assets/illustrations/" + subject.fallback + ".webp",
          label: subject.title,
        });
        setStatus("");
      })
      .catch(() => {
        if (!disposed)
          setStatus(
            "تعذّر تحميل المجسّم. يمكنك إعادة المحاولة أو متابعة الصورة التوضيحية.",
          );
      });
    return () => {
      disposed = true;
      viewer?.dispose();
    };
  }, [enabled, selected, subject.fallback, subject.title]);
  return (
    <div className="science-lab">
      <div className="lab-subjects" aria-label="اختر مجال المجسّم">
        {subjects.map((s) => (
          <button
            className="filter-button"
            type="button"
            key={s.id}
            aria-pressed={selected === s.id}
            onClick={() => setSelected(s.id)}
          >
            <s.icon size={19} />
            {s.title}
          </button>
        ))}
      </div>
      <div className="lab-grid">
        <div className="lab-stage-panel">
          {!enabled && (
            <div className="lab-poster">
              <img
                src={"/assets/illustrations/" + subject.fallback + ".webp"}
                width={1600}
                height={1200}
                alt="تكوين تعليمي مستوحى من مجالات المعرفة"
              />
              <button className="btn" onClick={() => setEnabled(true)}>
                <Box size={19} /> افتح المجسّم التفاعلي
              </button>
              <p>التدوير بالأزرار أو بالسحب؛ الحركة باختيارك.</p>
            </div>
          )}
          <div ref={container} />
          <p className="lab-load-status" role="status">
            {status}
          </p>
          {enabled && status.startsWith("تعذّر") && (
            <button className="btn ghost" onClick={() => setEnabled(false)}>
              <RotateCcw size={17} /> العودة إلى الصورة
            </button>
          )}
        </div>
        <div className="lab-copy">
          <span className="eyebrow">
            اكتشف من زاوية جديدة / {subject.title}
          </span>
          <h2>{subject.text}</h2>
          <p>{subject.description}</p>
          <div className="card">
            <h3>جرّب أن تسأل</h3>
            <p>
              ما الذي ظهر حين غيّرت زاوية النظر؟ وما الذي لا يخبرك به هذا
              النموذج عن الشيء الحقيقي؟
            </p>
          </div>
          <p className="field-note">
            مجسّمات تعبّر عن المجالات، وليست محاكاة علمية دقيقة.
          </p>
        </div>
      </div>
    </div>
  );
}
