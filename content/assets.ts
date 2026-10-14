import type { IconName } from "@/components/icons";

// أماكن الرسومات حسب خطة الهوية البصرية (asset-manifest.json).
// لتركيب رسم: احفظ الملف في public بنفس المسار، ويظهر تلقائيًا بدل البديل المؤقت.
export type Illustration = {
  file: string;
  width: number;
  height: number;
  fallback: IconName; // أيقونة البديل المؤقت
  alt?: string; // فارغ لأن الرسوم زخرفية
};

export const illustrations = {
  "home-hero": { file: "/assets/illustrations/home-hero.webp", width: 1600, height: 1200, fallback: "reading" },
  "grade-7-discover": { file: "/assets/illustrations/grade-7-discover.webp", width: 1200, height: 900, fallback: "grade7" },
  "grade-8-experiment": { file: "/assets/illustrations/grade-8-experiment.webp", width: 1200, height: 900, fallback: "grade8" },
  "grade-9-launch": { file: "/assets/illustrations/grade-9-launch.webp", width: 1200, height: 900, fallback: "grade9" },
  "school-values": { file: "/assets/illustrations/school-values.webp", width: 1200, height: 900, fallback: "values" },
  "challenge-lab": { file: "/assets/illustrations/challenge-lab.webp", width: 1200, height: 900, fallback: "challenges" },
  "debate-dialogue": { file: "/assets/illustrations/debate-dialogue.webp", width: 1200, height: 900, fallback: "debate" },
  "vote-voice": { file: "/assets/illustrations/vote-voice.webp", width: 1200, height: 900, fallback: "vote" },
  "kindness-garden": { file: "/assets/illustrations/kindness-garden.webp", width: 1200, height: 900, fallback: "kindness" },
  "reading-corner": { file: "/assets/illustrations/reading-corner.webp", width: 1200, height: 900, fallback: "reading" },
} satisfies Record<string, Illustration>;

export type IllustrationId = keyof typeof illustrations;

export const gradeIllustration: Record<number, IllustrationId> = {
  7: "grade-7-discover",
  8: "grade-8-experiment",
  9: "grade-9-launch",
};
