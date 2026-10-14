// النشر التلقائي على فيسبوك وإنستجرام عبر Meta Graph API.
// المتطلبات: صفحة فيسبوك، حساب إنستجرام أعمال مربوط بالصفحة، و Page Access Token طويل الأمد
// بصلاحيات pages_manage_posts و instagram_basic و instagram_content_publish.

export type SocialPost = {
  message: string; // نص المنشور
  link?: string; // رابط الخبر في الموقع
  imageUrl?: string; // رابط صورة عام (إنستجرام يشترط صورة)
};

export type PublishResult = { platform: "facebook" | "instagram"; ok: boolean; id?: string; error?: string };

const graph = (path: string) => `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v21.0"}/${path}`;

async function post(path: string, params: Record<string, string>) {
  const res = await fetch(graph(path), { method: "POST", body: new URLSearchParams(params) });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data as { id?: string; post_id?: string };
}

export async function publishToFacebook(p: SocialPost): Promise<PublishResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) return { platform: "facebook", ok: false, error: "فيسبوك غير مربوط بعد" };
  const message = p.link ? `${p.message}\n\n${p.link}` : p.message;
  try {
    const data = p.imageUrl
      ? await post(`${pageId}/photos`, { url: p.imageUrl, caption: message, access_token: token })
      : await post(`${pageId}/feed`, { message, ...(p.link ? { link: p.link } : {}), access_token: token });
    return { platform: "facebook", ok: true, id: data.post_id || data.id };
  } catch (e) {
    return { platform: "facebook", ok: false, error: (e as Error).message };
  }
}

export async function publishToInstagram(p: SocialPost): Promise<PublishResult> {
  const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!igId || !token) return { platform: "instagram", ok: false, error: "إنستجرام غير مربوط بعد" };
  if (!p.imageUrl) return { platform: "instagram", ok: false, error: "إنستجرام يحتاج صورة للخبر" };
  // إنستجرام لا يدعم الروابط القابلة للضغط في المنشور، لذلك نضيف الرابط كنص.
  const caption = p.link ? `${p.message}\n\nالتفاصيل في موقع المدرسة: ${p.link}` : p.message;
  try {
    const container = await post(`${igId}/media`, { image_url: p.imageUrl, caption, access_token: token });
    const published = await post(`${igId}/media_publish`, { creation_id: container.id!, access_token: token });
    return { platform: "instagram", ok: true, id: published.id };
  } catch (e) {
    return { platform: "instagram", ok: false, error: (e as Error).message };
  }
}

export async function publishEverywhere(p: SocialPost, targets: { facebook?: boolean; instagram?: boolean }) {
  const jobs: Promise<PublishResult>[] = [];
  if (targets.facebook) jobs.push(publishToFacebook(p));
  if (targets.instagram) jobs.push(publishToInstagram(p));
  return Promise.all(jobs);
}
