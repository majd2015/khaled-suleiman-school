import { db, isDbConfigured } from "@/lib/prisma";
import type { SubmissionKind } from "@/generated/prisma/client";

export type Approved = { id: string; content: Record<string, string>; name: string | null };

// المشاركات التي وافق عليها معلّم. الاسم يظهر فقط إذا اختار الطالب ذلك.
export async function getApproved(kind: SubmissionKind, limit = 30): Promise<Approved[]> {
  if (!isDbConfigured()) return [];
  const rows = await db().submission.findMany({
    where: { kind, status: "approved" },
    orderBy: { reviewedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id,
    content: r.content as Record<string, string>,
    name: r.showName ? r.authorName : null,
  }));
}

export async function getPollsWithResults(onlyActive: boolean) {
  const polls = await db().poll.findMany({
    where: onlyActive ? { active: true } : {},
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { options: { orderBy: { position: "asc" }, include: { _count: { select: { votes: true } } } } },
  });
  return polls.map((p) => ({
    id: p.id,
    question: p.question,
    active: p.active,
    results: p.options.map((o) => ({ option_id: o.id, label: o.label, votes: o._count.votes })),
  }));
}
