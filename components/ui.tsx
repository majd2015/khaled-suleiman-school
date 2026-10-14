import Link from "next/link";
import type { Announcement, NewsItem } from "@/content/data";

export function PageHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="page-head">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.slug}`} className="card link" style={{ color: "inherit" }}>
      <div className="thumb">{item.image ? <img src={item.image} alt="" /> : "📰"}</div>
      <div className="meta">
        <span className="badge">{item.category}</span>
        <span>{formatDate(item.date)}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.excerpt}</p>
    </Link>
  );
}

export function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <li className="card">
      <div className="meta">
        {a.urgent && <span className="badge urgent">عاجل</span>}
        <span>{formatDate(a.date)}</span>
        {a.grades?.map((g) => (
          <span key={g} className="badge">الصف {g}</span>
        ))}
      </div>
      <h3>{a.title}</h3>
      <p>{a.text}</p>
    </li>
  );
}

export function Pending({ children }: { children: React.ReactNode }) {
  return <span className="pending">{children}</span>;
}
