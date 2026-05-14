
-- ============ ROLES ============
create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- profiles policies
create policy "Users view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- user_roles policies
create policy "Users view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- profile auto-create trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ VISA SERVICES ============
create table public.visa_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  number text not null default '',
  title text not null,
  short_title text not null default '',
  tagline text not null default '',
  summary text not null default '',
  icon text not null default 'Globe2',
  intro text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  who_is_it_for jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.visa_services enable row level security;

create policy "Anyone reads published services" on public.visa_services
  for select to anon, authenticated using (published = true);
create policy "Admins read all services" on public.visa_services
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins manage services" on public.visa_services
  for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger visa_services_updated_at before update on public.visa_services
  for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
