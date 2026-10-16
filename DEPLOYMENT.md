# النشر على Coolify

نفس طريقة بوابة البجروت: تطبيق من المستودع بالـ Dockerfile، وقاعدة Postgres من Coolify.

## 1. قاعدة البيانات
1. Coolify → Project → **+ New** → **Database** → **PostgreSQL** (17 أو 18).
2. بعد التشغيل انسخ **Postgres URL (internal)**. هذا هو `DATABASE_URL`.
3. فعّل **Scheduled Backups** للقاعدة.

## 2. التطبيق
1. **+ New** → **Application** → المستودع `majd2015/khaled-suleiman-school`، الفرع `main`.
2. Build Pack: **Dockerfile**. Port: **3200**.
3. **Persistent Storage** → Volume مربوط بـ `/app/uploads` (هنا تُحفظ صور الأخبار، وبدونه تضيع عند كل نشر).
4. **Environment Variables** (انظر `.env.example`):

| المتغير | القيمة |
|---|---|
| `DATABASE_URL` | الرابط الداخلي من الخطوة 1 |
| `SESSION_SECRET` | `openssl rand -base64 48` |
| `VOTE_SALT` | `openssl rand -base64 32` |
| `SITE_URL` | `https://<الدومين>` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | أول حساب مدير (يمكن حذفهما بعد أول تشغيل) |
| `SEED_DEMO` | `1` إذا أردت المحتوى التجريبي في البداية، وإلا `0` |
| `UPLOAD_DIR` | `/app/uploads` |
| `META_*`, `FACEBOOK_*`, `INSTAGRAM_*` | عند ربط فيسبوك وإنستجرام |

5. **Health Check**: المسار `/api/health`، المنفذ 3200.
6. **Domains**: `https://<الدومين>` (Coolify يصدر شهادة SSL تلقائيًا).

عند كل تشغيل تنفّذ الحاوية: `prisma db push` (تحديث الجداول) ثم `db:seed` (أول مدير والمحتوى التجريبي إن طُلب) ثم تشغيل الموقع.

## 3. الدومين
عند مزوّد الدومين أضف سجل **A** للدومين (و`www` إن أردت) يشير إلى IP السيرفر، ثم Deploy من Coolify.

## 4. بعد أول تشغيل
1. افتح `https://<الدومين>/api/health` وتأكد أنها `{"ok":true,"database":"ok"}`.
2. ادخل `https://<الدومين>/login` بحساب المدير.
3. من **المستخدمون** أضف المحررين والمعلمين، ثم احذف `ADMIN_PASSWORD` من متغيرات Coolify.

## تجربة محلية بدون Coolify
```bash
cp .env.example .env   # واملأ SESSION_SECRET و ADMIN_*
docker compose up --build
# http://127.0.0.1:3200
```
