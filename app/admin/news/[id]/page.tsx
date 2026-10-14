import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { GradeChecks } from "@/components/admin";
import { deleteNews, saveNews } from "../../actions";

const errors: Record<string, string> = {
  title: "العنوان مطلوب.",
  image: "الصورة يجب أن تكون ملف صورة بحجم أقل من 5MB.",
  upload: "تعذّر رفع الصورة.",
  save: "تعذّر حفظ الخبر.",
};

const categories = ["تعليم", "احتفالات", "رحلات", "مجتمع"];

export default async function EditNews({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ e?: string; saved?: string; social?: string }>;
}) {
  const { id } = await params;
  const { e, saved, social } = await searchParams;
  const { supabase } = await requireRole(["admin", "editor"]);

  const isNew = id === "new";
  let item = null;
  if (!isNew) {
    const { data } = await supabase.from("news").select("*").eq("id", id).single();
    if (!data) notFound();
    item = data;
  }
  const { data: log } = isNew
    ? { data: [] }
    : await supabase.from("social_posts").select("platform,ok,error,created_at").eq("news_id", id).order("created_at", { ascending: false });

  return (
    <>
      <div className="section-title">
        <h2>{isNew ? "خبر جديد" : "تعديل خبر"}</h2>
        <Link href="/admin/news">→ كل الأخبار</Link>
      </div>
      {e && errors[e] && <p className="notice bad">{errors[e]}</p>}
      {saved && <p className="notice">تم الحفظ.{item?.status === "published" && <> <Link href={`/news/${item.slug}`}>عرض الخبر في الموقع</Link></>}</p>}
      {social && (
        <p className="notice">
          {social.split(",").map((s) => {
            const [p, r] = s.split(":");
            return `${p === "facebook" ? "فيسبوك" : "إنستجرام"}: ${r === "ok" ? "نُشر" : "فشل النشر"}`;
          }).join(" · ")}
        </p>
      )}

      <form className="stack card" action={saveNews} style={{ maxWidth: 760 }}>
        {item && <input type="hidden" name="id" value={item.id} />}
        <label>العنوان<input name="title" required maxLength={200} defaultValue={item?.title} /></label>
        <label>ملخص قصير (يظهر في البطاقة وفي منشور فيسبوك)<textarea name="excerpt" rows={2} maxLength={300} defaultValue={item?.excerpt} /></label>
        <label>نص الخبر (كل فقرة في سطر)<textarea name="body" rows={10} defaultValue={item?.body} /></label>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <label>التصنيف
            <select name="category" defaultValue={item?.category ?? "تعليم"}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label>التاريخ<input type="date" name="published_at" defaultValue={item?.published_at ?? new Date().toISOString().slice(0, 10)} /></label>
        </div>
        <GradeChecks selected={item?.grades ?? []} />

        <label>الصورة {item?.image_url ? "(اختر صورة جديدة لاستبدالها)" : ""}
          <input type="file" name="image" accept="image/*" />
        </label>
        {item?.image_url && (
          <div>
            <img src={item.image_url} alt="" style={{ maxWidth: 260, borderRadius: 10 }} />
            <label style={{ fontWeight: 400 }}><input type="checkbox" name="remove_image" /> إزالة الصورة</label>
          </div>
        )}
        <label style={{ fontWeight: 400 }}>
          <input type="checkbox" name="image_consent" defaultChecked={item?.image_consent} /> إذا ظهر طلاب في الصورة: لدينا موافقة الأهل على النشر
        </label>

        <fieldset className="checks">
          <legend>النشر</legend>
          <label><input type="checkbox" name="publish" defaultChecked={item?.status === "published"} /> منشور في الموقع</label>
          <label>
            <input type="checkbox" name="to_facebook" disabled={!!item?.facebook_post_id} defaultChecked={isNew} />
            {item?.facebook_post_id ? " نُشر على فيسبوك" : " انشر على فيسبوك"}
          </label>
          <label>
            <input type="checkbox" name="to_instagram" disabled={!!item?.instagram_media_id} defaultChecked={isNew} />
            {item?.instagram_media_id ? " نُشر على إنستجرام" : " انشر على إنستجرام (يحتاج صورة)"}
          </label>
        </fieldset>
        <p className="meta">النشر على فيسبوك وإنستجرام يتم مرة واحدة عند حفظ خبر منشور.</p>
        <button className="btn" type="submit">حفظ</button>
      </form>

      {item && (
        <form action={deleteNews} style={{ marginTop: 16 }}>
          <input type="hidden" name="id" value={item.id} />
          <button className="btn danger small">حذف الخبر</button>
        </form>
      )}

      {!!log?.length && (
        <>
          <h3 style={{ marginTop: 24 }}>سجل النشر</h3>
          <ul>
            {log.map((l, i) => (
              <li key={i}>{l.platform}: {l.ok ? "نجح" : `فشل (${l.error})`} · {new Date(l.created_at).toLocaleString("ar")}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
