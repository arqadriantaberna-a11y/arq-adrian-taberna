create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('architecture', 'furniture', 'article')),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

create policy "Public items" on public.portfolio_items
  for select to anon, authenticated using (published);

create policy "Owner reads" on public.portfolio_items
  for select to authenticated
  using ((auth.jwt() ->> 'email') = 'cronos.el.harcore@gmail.com');

create policy "Owner inserts" on public.portfolio_items
  for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'cronos.el.harcore@gmail.com');

create policy "Owner updates" on public.portfolio_items
  for update to authenticated
  using ((auth.jwt() ->> 'email') = 'cronos.el.harcore@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'cronos.el.harcore@gmail.com');

create policy "Owner deletes" on public.portfolio_items
  for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'cronos.el.harcore@gmail.com');
