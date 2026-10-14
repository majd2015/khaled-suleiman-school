import { announcements } from "@/content/data";
import { AnnouncementCard, PageHead } from "@/components/ui";

export const metadata = { title: "الإعلانات" };

export default function Announcements() {
  const sorted = [...announcements].sort((a, b) => Number(!!b.urgent) - Number(!!a.urgent) || b.date.localeCompare(a.date));
  return (
    <>
      <PageHead title="الإعلانات" subtitle="إعلانات للطلاب والأهالي" />
      <section className="section">
        <div className="container">
          <ul className="ann-list">{sorted.map((a) => <AnnouncementCard key={a.id} a={a} />)}</ul>
        </div>
      </section>
    </>
  );
}
