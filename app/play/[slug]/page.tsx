import { notFound } from "next/navigation";
import { games } from "@/content/games";
import GamePlayer from "@/components/play/GamePlayer";
import { articles } from "@/lib/articles";
export const dynamicParams = false;
export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  return { title: game?.title, description: game?.subtitle };
}
export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  if (!game) notFound();
  return (
    <GamePlayer
      game={game}
      reading={
        game.kind === "article"
          ? articles.map((a) => ({
              slug: a.slug,
              title: a.title,
              categoryLabel: a.categoryLabel,
              question: a.question,
              activity: a.activity,
              excerpt: a.excerpt,
            }))
          : undefined
      }
    />
  );
}
