create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('airline','hotel','authority')),
  country text not null default '',
  cc text not null default 'UN',
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.partners enable row level security;

create policy "Anyone reads published partners" on public.partners
  for select to anon, authenticated using (published = true);

create policy "Admins read all partners" on public.partners
  for select to authenticated using (has_role(auth.uid(), 'admin'::app_role));

create policy "Admins manage partners" on public.partners
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

insert into public.partners (name, kind, country, cc, display_order) values
  ('Emirates','airline','UAE','AE',10),
  ('Qatar Airways','airline','Qatar','QA',20),
  ('Singapore Airlines','airline','Singapore','SG',30),
  ('Turkish Airlines','airline','Türkiye','TR',40),
  ('Etihad','airline','UAE','AE',50),
  ('Biman Bangladesh','airline','Bangladesh','BD',60),
  ('Saudia','airline','Saudi Arabia','SA',70),
  ('Cathay Pacific','airline','Hong Kong','HK',80),
  ('Thai Airways','airline','Thailand','TH',90),
  ('Malaysia Airlines','airline','Malaysia','MY',100),
  ('Marriott Hotels','hotel','USA','US',110),
  ('Hilton Worldwide','hotel','USA','US',120),
  ('Accor Group','hotel','France','FR',130),
  ('IATA','authority','Global','UN',140),
  ('ATAB','authority','Bangladesh','BD',150),
  ('TOAB','authority','Bangladesh','BD',160),
  ('CAAB','authority','Bangladesh','BD',170),
  ('Bangladesh Tourism Board','authority','Bangladesh','BD',180);