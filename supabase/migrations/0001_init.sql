-- قاعدة بيانات موقع المدرسة (المرحلة 1)
-- تُشغَّل مرة واحدة من Supabase: SQL Editor أو `supabase db push`.

-- ========== المستخدمون والأدوار ==========
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  -- admin: كل شيء | editor: المحتوى والرسائل | teacher: مراجعة مشاركات الطلاب | null: بلا صلاحيات
  role text check (role in ('admin', 'editor', 'teacher')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(roles text[]) returns boolean
language sql stable as $$ select coalesce(public.my_role() = any (roles), false) $$;

-- ========== الأخبار ==========
create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default 'تعليم' check (category in ('احتفالات', 'رحلات', 'مجتمع', 'تعليم')),
  grades int[] not null default '{}',
  image_url text,
  image_consent boolean not null default false, -- موافقة الأهل على نشر الصورة إن ظهر فيها طلاب
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at date not null default current_date,
  facebook_post_id text,
  instagram_media_id text,
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== الإعلانات ==========
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  urgent boolean not null default false,
  grades int[] not null default '{}',
  date date not null default current_date,
  expires_on date,
  created_at timestamptz not null default now()
);

-- ========== الرزنامة ==========
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  type text not null check (type in ('امتحان', 'نشاط', 'عطلة', 'عام')),
  confirmed boolean not null default true,
  grades int[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ========== مشاركات الطلاب (تُراجع قبل النشر) ==========
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('debate', 'kind_word', 'reading')),
  content jsonb not null,
  author_name text, -- يُعرض فقط إذا show_name = true
  show_name boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ========== رسائل اتصل بنا ==========
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ========== التصويت ==========
create table public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls (id) on delete cascade,
  label text not null,
  position int not null default 0
);

create table public.poll_votes (
  poll_id uuid not null references public.polls (id) on delete cascade,
  option_id uuid not null references public.poll_options (id) on delete cascade,
  voter_hash text not null, -- بصمة مجهولة للجهاز، لمنع التصويت المتكرر
  created_at timestamptz not null default now(),
  primary key (poll_id, voter_hash)
);

create or replace function public.poll_results(p_poll uuid)
returns table (option_id uuid, label text, votes bigint)
language sql stable security definer set search_path = public as $$
  select o.id, o.label, count(v.option_id)
  from public.poll_options o
  left join public.poll_votes v on v.option_id = o.id
  where o.poll_id = p_poll
  group by o.id, o.label, o.position
  order by o.position
$$;

-- ========== سجل النشر على فيسبوك وإنستجرام ==========
create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  news_id uuid references public.news (id) on delete set null,
  platform text not null check (platform in ('facebook', 'instagram')),
  ok boolean not null,
  external_id text,
  error text,
  created_at timestamptz not null default now()
);

-- ========== الصلاحيات (RLS) ==========
alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.submissions enable row level security;
alter table public.contact_messages enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.social_posts enable row level security;

create policy "own profile" on public.profiles for select using (id = auth.uid() or public.has_role(array['admin']));
create policy "admin manages profiles" on public.profiles for update using (public.has_role(array['admin']));

create policy "public reads published news" on public.news for select
  using (status = 'published' or public.has_role(array['admin', 'editor']));
create policy "editors write news" on public.news for all
  using (public.has_role(array['admin', 'editor'])) with check (public.has_role(array['admin', 'editor']));

create policy "public reads announcements" on public.announcements for select using (true);
create policy "editors write announcements" on public.announcements for all
  using (public.has_role(array['admin', 'editor'])) with check (public.has_role(array['admin', 'editor']));

create policy "public reads events" on public.events for select using (true);
create policy "editors write events" on public.events for all
  using (public.has_role(array['admin', 'editor'])) with check (public.has_role(array['admin', 'editor']));

create policy "anyone submits pending" on public.submissions for insert
  with check (status = 'pending' and reviewed_by is null);
create policy "public reads approved" on public.submissions for select
  using (status = 'approved' or public.has_role(array['admin', 'editor', 'teacher']));
create policy "staff reviews" on public.submissions for update
  using (public.has_role(array['admin', 'editor', 'teacher']));
create policy "admin deletes submissions" on public.submissions for delete using (public.has_role(array['admin']));

create policy "anyone sends message" on public.contact_messages for insert with check (handled = false);
create policy "staff reads messages" on public.contact_messages for select using (public.has_role(array['admin', 'editor']));
create policy "staff handles messages" on public.contact_messages for update using (public.has_role(array['admin', 'editor']));

create policy "public reads polls" on public.polls for select using (true);
create policy "editors write polls" on public.polls for all
  using (public.has_role(array['admin', 'editor'])) with check (public.has_role(array['admin', 'editor']));
create policy "public reads options" on public.poll_options for select using (true);
create policy "editors write options" on public.poll_options for all
  using (public.has_role(array['admin', 'editor'])) with check (public.has_role(array['admin', 'editor']));
create policy "anyone votes on active poll" on public.poll_votes for insert
  with check (exists (select 1 from public.polls p where p.id = poll_id and p.active)
              and exists (select 1 from public.poll_options o where o.id = option_id and o.poll_id = poll_votes.poll_id));

create policy "staff reads social log" on public.social_posts for select using (public.has_role(array['admin', 'editor']));
create policy "staff writes social log" on public.social_posts for insert with check (public.has_role(array['admin', 'editor']));

-- ========== الصور ==========
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
create policy "public reads media" on storage.objects for select using (bucket_id = 'media');
create policy "editors upload media" on storage.objects for insert
  with check (bucket_id = 'media' and public.has_role(array['admin', 'editor']));
create policy "editors delete media" on storage.objects for delete
  using (bucket_id = 'media' and public.has_role(array['admin', 'editor']));
