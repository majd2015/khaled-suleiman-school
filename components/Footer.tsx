import Link from "next/link";
import { site } from "@/site.config";

export default function Footer() {
  const { contact, social } = site;
  return (
    <footer className="footer">
      <div className="container">
        <div className="cols">
          <div>
            <h4>{site.name}</h4>
            <p>{site.tagline}</p>
          </div>
          <div>
            <h4>تواصل معنا</h4>
            <ul>
              <li>العنوان: {contact.address}</li>
              <li>هاتف: {contact.phone}</li>
              <li>بريد: {contact.email}</li>
            </ul>
          </div>
          <div>
            <h4>روابط سريعة</h4>
            <ul>
              <li><Link href="/news">الأخبار</Link></li>
              <li><Link href="/announcements">الإعلانات</Link></li>
              <li><Link href="/calendar">الرزنامة</Link></li>
              <li><Link href="/privacy">الخصوصية</Link></li>
            </ul>
          </div>
          <div>
            <h4>تابعونا</h4>
            <ul>
              <li>{social.facebook ? <a href={social.facebook}>فيسبوك</a> : "فيسبوك (قريبًا)"}</li>
              <li>{social.instagram ? <a href={social.instagram}>إنستجرام</a> : "إنستجرام (قريبًا)"}</li>
            </ul>
          </div>
        </div>
        <p className="copy">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
