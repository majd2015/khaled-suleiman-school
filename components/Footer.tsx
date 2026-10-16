import Link from "next/link";
import { BookOpen, ArrowUpLeft } from "lucide-react";
import { site, PENDING } from "@/site.config";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <span className="eyebrow">مدرسة خالد سليمان الإعدادية</span>
            <h2>كل سؤال، بداية أفق جديد.</h2>
            <p>نتعلّم أن نفكّر، نجرّب، ونترك أثرًا طيبًا.</p>
          </div>
          <Link className="btn" href="/articles">
            افتح آفاقك <ArrowUpLeft size={18} />
          </Link>
        </div>
        <div className="cols">
          <div>
            <Link className="brand" href="/">
              <span className="brand-symbol" aria-hidden="true">
                <BookOpen />
              </span>
              <span>
                {site.shortName}
                <small>{site.grades}</small>
              </span>
            </Link>
          </div>
          <div>
            <h3>مدرستنا</h3>
            <Link href="/school">عن المدرسة</Link>
            <Link href="/school/vision">الرؤية والرسالة</Link>
            <Link href="/school/staff">الطاقم</Link>
            <Link href="/school/contact">تواصل معنا</Link>
          </div>
          <div>
            <h3>اكتشف وشارك</h3>
            <Link href="/articles">مجلة آفاق</Link>
            <Link href="/discover">المختبر التفاعلي</Link>
            <Link href="/challenges">تحدَّ نفسك</Link>
            <Link href="/participate">مساحة المشاركة</Link>
          </div>
          <div>
            <h3>ابقَ قريبًا</h3>
            <Link href="/calendar">الرزنامة</Link>
            <Link href="/news">الأخبار</Link>
            <Link href="/newsletter">النشرة الشهرية</Link>
            {site.contact.email !== PENDING ? (
              <a href={"mailto:" + site.contact.email}>{site.contact.email}</a>
            ) : (
              <p className="muted">
                تُضاف وسائل التواصل الرسمية بعد اعتماد المدرسة.
              </p>
            )}
          </div>
        </div>
        <div className="copy">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <Link href="/privacy">الخصوصية</Link>
          <span>نتعلّم • نشارك • ننطلق</span>
        </div>
      </div>
    </footer>
  );
}
