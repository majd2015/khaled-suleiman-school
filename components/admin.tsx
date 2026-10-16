import { formatDate } from "@/components/ui";

export function GradeChecks({ selected = [] }: { selected?: number[] }) {
  return (
    <fieldset className="checks">
      <legend>الصفوف (بدون اختيار = كل المدرسة)</legend>
      {[7, 8, 9].map((g) => (
        <label key={g}><input type="checkbox" name="grades" value={g} defaultChecked={selected.includes(g)} /> الصف {g}</label>
      ))}
    </fieldset>
  );
}

export function GradesLabel({ grades }: { grades: number[] }) {
  return <>{grades.length ? grades.map((g) => `الصف ${g}`).join("، ") : "كل المدرسة"}</>;
}

export function DateCell({ iso }: { iso: string | Date }) {
  const v = typeof iso === "string" ? iso : iso.toISOString();
  return <>{formatDate(v.slice(0, 10))}</>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="card">{children}</p>;
}
