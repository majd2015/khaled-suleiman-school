import fs from "node:fs";
import path from "node:path";
import { illustrations, type IllustrationId } from "@/content/assets";
import { Icon } from "@/components/icons";

// يعرض الرسم إذا كان ملفه موجودًا، وإلا بديلًا مؤقتًا بنفس المقاس حتى لا تتحرك الصفحة عند تركيبه.
export default function Illustration({
  id,
  priority = false,
  color,
  className = "",
}: {
  id: IllustrationId;
  priority?: boolean;
  color?: string;
  className?: string;
}) {
  const ill = illustrations[id];
  const ratio = `${ill.width} / ${ill.height}`;
  const exists = fs.existsSync(path.join(process.cwd(), "public", ill.file));

  if (exists) {
    return (
      <img
        className={`illustration ${className}`}
        src={ill.file}
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
