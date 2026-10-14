-- محتوى تجريبي اختياري لتجربة الموقع بعد ربط قاعدة البيانات. احذفه قبل الإطلاق.
insert into public.news (slug, title, excerpt, body, category, grades, status, published_at) values
  ('demo-opening', 'افتتاح السنة الدراسية (تجريبي)', 'خبر تجريبي لتجربة الموقع.', 'هذا خبر تجريبي.' || chr(10) || 'احذفه من لوحة الإدارة قبل الإطلاق.', 'احتفالات', '{7}', 'published', current_date);
insert into public.announcements (title, body, urgent) values
  ('إعلان تجريبي', 'هذا إعلان لتجربة الموقع.', false);
insert into public.events (title, date, type, confirmed) values
  ('موعد تجريبي', current_date + 7, 'نشاط', false);
with p as (insert into public.polls (question) values ('سؤال تجريبي: أي يوم تفضّل للرحلة؟') returning id)
insert into public.poll_options (poll_id, label, position)
select id, label, pos from p, (values ('الأحد', 0), ('الثلاثاء', 1), ('الخميس', 2)) as o(label, pos);
