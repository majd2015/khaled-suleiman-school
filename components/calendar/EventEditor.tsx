"use client";
import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { eventTypes, statusLabels, type SchoolEvent } from "@/lib/calendar";
export default function EventEditor({
  event,
  date,
  onSaved,
}: {
  event: SchoolEvent | null;
  date: string;
  onSaved: (event: SchoolEvent) => void;
}) {
  const [value, setValue] = useState({
    title: "",
    description: "",
    date,
    endDate: date,
    allDay: true,
    startTime: "08:00",
    endTime: "09:00",
    type: "نشاط",
    status: "draft",
    sample: false,
    grades: [] as number[],
    location: "",
    attachmentUrl: "",
    attachmentLabel: "",
    repeat: "none",
    repeatUntil: "",
    ...event,
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const patch = (fields: Partial<typeof value>) =>
    setValue((v) => ({ ...v, ...fields }));
  return (
    <form
      className="cal-editor"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const form = new FormData(e.currentTarget);
        const payload = { ...value };
        for (const key of [
          "date",
          "endDate",
          "startTime",
          "endTime",
          "repeatUntil",
        ] as const) {
          if (form.has(key)) payload[key] = String(form.get(key));
        }
        try {
          const r = await fetch("/api/calendar", {
            method: event ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = await r.json();
          if (!r.ok) throw new Error(result.error);
          onSaved(result.event);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "تعذّر الاتصال بالخادم.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="cal-form-help">
        {event
          ? "عدّل التفاصيل ثم احفظ. التعديل على موعد متكرر يشمل السلسلة كاملة."
          : "ابدأ بمسودة، وانشر الموعد عندما تصبح التفاصيل جاهزة."}
      </p>
      <label>
        عنوان الموعد
        <input
          autoFocus
          required
          maxLength={160}
          value={value.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="مثال: يوم التجارب العلمية"
        />
      </label>
      <div className="cal-form-grid">
        <label>
          نوع الموعد
          <select
            value={value.type}
            onChange={(e) => patch({ type: e.target.value })}
          >
            {eventTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          حالة الموعد
          <select
            value={value.status}
            onChange={(e) => patch({ status: e.target.value })}
          >
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="cal-form-grid">
        <label>
          تاريخ البداية
          <input
            type="date"
            name="date"
            required
            min="2000-01-01"
            max="2099-12-31"
            value={value.date}
            onChange={(e) =>
              patch({
                date: e.target.value,
                endDate:
                  value.endDate < e.target.value
                    ? e.target.value
                    : value.endDate,
              })
            }
          />
        </label>
        <label>
          تاريخ النهاية
          <input
            type="date"
            name="endDate"
            required
            min={value.date}
            max="2099-12-31"
            value={value.endDate}
            onChange={(e) => patch({ endDate: e.target.value })}
          />
        </label>
      </div>
      <label className="cal-check">
        <input
          type="checkbox"
          checked={value.allDay}
          onChange={(e) =>
            patch({
              allDay: e.target.checked,
              startTime: value.startTime || "08:00",
              endTime: value.endTime || "09:00",
            })
          }
        />{" "}
        طوال اليوم
      </label>
      {!value.allDay && (
        <div className="cal-form-grid">
          <label>
            وقت البداية
            <input
              type="time"
              name="startTime"
              required
              value={value.startTime}
              onChange={(e) => patch({ startTime: e.target.value })}
            />
          </label>
          <label>
            وقت النهاية
            <input
              type="time"
              name="endTime"
              required
              value={value.endTime}
              onChange={(e) => patch({ endTime: e.target.value })}
            />
          </label>
        </div>
      )}
      <fieldset>
        <legend>
          الصفوف المعنية <small>تركها فارغة يعني جميع الصفوف</small>
        </legend>
        <div className="cal-grade-checks">
          {[7, 8, 9].map((g) => (
            <label className="cal-check" key={g}>
              <input
                type="checkbox"
                checked={value.grades.includes(g)}
                onChange={(e) =>
                  patch({
                    grades: e.target.checked
                      ? [...value.grades, g]
                      : value.grades.filter((x) => x !== g),
                  })
                }
              />{" "}
              الصف {g}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        المكان
        <input
          maxLength={200}
          value={value.location}
          onChange={(e) => patch({ location: e.target.value })}
          placeholder="مثال: مختبر العلوم"
        />
      </label>
      <label>
        التفاصيل والتعليمات
        <textarea
          rows={4}
          maxLength={4000}
          value={value.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="ماذا يحتاج الطالب أن يعرف أو يحضّر؟"
        />
      </label>
      <div className="cal-form-grid">
        <label>
          التكرار
          <select
            value={value.repeat}
            onChange={(e) => patch({ repeat: e.target.value })}
          >
            <option value="none">لا يتكرر</option>
            <option value="weekly">كل أسبوع</option>
          </select>
        </label>
        {value.repeat === "weekly" && (
          <label>
            يتكرر حتى
            <input
              type="date"
              name="repeatUntil"
              required
              min={value.date}
              value={value.repeatUntil}
              onChange={(e) => patch({ repeatUntil: e.target.value })}
            />
          </label>
        )}
      </div>
      <details>
        <summary>رابط مرفق اختياري</summary>
        <label>
          رابط الملف أو التعليمات
          <input
            type="url"
            dir="ltr"
            placeholder="https://"
            maxLength={1000}
            value={value.attachmentUrl}
            onChange={(e) => patch({ attachmentUrl: e.target.value })}
          />
        </label>
        <label>
          اسم المرفق
          <input
            maxLength={100}
            value={value.attachmentLabel}
            onChange={(e) => patch({ attachmentLabel: e.target.value })}
            placeholder="تعليمات النشاط"
          />
        </label>
      </details>
      <label className="cal-check cal-sample-check">
        <input
          type="checkbox"
          checked={value.sample}
          onChange={(e) => patch({ sample: e.target.checked })}
        />{" "}
        موعد تجريبي للمعاينة، غير معتمد
      </label>
      <p className="cal-form-help">
        المسودة تظهر للإدارة فقط. المواعيد المؤكدة وغير التجريبية وحدها تُصدّر
        إلى تقويم الهاتف. جميع الأوقات حسب توقيت المدرسة.
      </p>
      {error && (
        <p className="cal-error" role="alert">
          {error}
        </p>
      )}
      <button className="cal-btn primary cal-save" disabled={busy}>
        {busy ? (
          <LoaderCircle size={18} className="cal-spin" />
        ) : (
          <Check size={18} />
        )}{" "}
        {busy ? "جارٍ الحفظ…" : event ? "حفظ التعديلات" : "حفظ الموعد"}
      </button>
    </form>
  );
}
