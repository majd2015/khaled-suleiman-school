import fs from "node:fs";
import path from "node:path";
import { illustrations, type IllustrationId } from "@/content/assets";
import { Icon } from "@/components/icons";

const variants = (file: string, width: number) => {
  const has = (w: number) => fs.existsSync(path.join(process.cwd(), "public", file.replace(/\.webp$/, `-${w}.webp`)));
  return [480, 800].filter(has).map((w) => `${file.replace(/\.webp$/, `-${w}.webp`)} ${w}w`).concat(`${file} ${width}w`).join(", ");
};

// يعرض الرسم إذا كان ملفه موجودًا، وإلا بديلًا مؤقتًا بنفس المقاس حتى لا تتحرك الصفحة عند تركيبه.
export default function Illustration({
  id,
  priority = false,
  color,
  className = "",
  sizes = "(max-width: 760px) 90vw, 560px",
}: {
  id: IllustrationId;
  priority?: boolean;
  color?: string;
  className?: string;
  sizes?: string;
}) {
  const ill = illustrations[id];
  const ratio = `${ill.width} / ${ill.height}`;
  const exists = fs.existsSync(path.join(process.cwd(), "public", ill.file));

  if (exists) {
    return (
      <img
        className={`illustration ${className}`}
        src={ill.file}
        // نسخ أصغر (480 و800) للهواتف والبطاقات؛ الأصل 1600 للشاشات الكبيرة
        srcSet={variants(ill.file, ill.width)}
        sizes={sizes}
        width={ill.width}
        height={ill.height}
        alt={"alt" in ill ? (ill.alt as string) : ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        style={{ aspectRatio: ratio }}
      />
    );
  }
  return (
    <div
      className={`illustration placeholder ${className}`}
      style={{ aspectRatio: ratio, ...(color ? { ["--ic" as string]: color } : {}) }}
      aria-hidden="true"
      data-pending={ill.file}
    >
      <Icon name={ill.fallback} size={72} />
    </div>
  );
}
