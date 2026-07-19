-- Leads captured by free tools (/tools/*). Anon may insert, never read.
create table if not exists public.tool_leads (
  id uuid primary key default gen_random_uuid(),
  tool text not null,
  email text not null,
  name text,
  company text,
  context jsonb,
  created_at timestamptz not null default now()
);

alter table public.tool_leads enable row level security;

create policy "anon_insert_leads" on public.tool_leads
  for insert to anon with check (true);
