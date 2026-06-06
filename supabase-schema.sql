-- Supabase SQL Editor-де орындаңыз

create table if not exists reflections (
  id uuid default gen_random_uuid() primary key,
  student_name text not null unique,
  answer_1 text default '',
  answer_2 text default '',
  answer_3 text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table reflections enable row level security;

create policy "reflections_select" on reflections for select using (true);
create policy "reflections_insert" on reflections for insert with check (true);
create policy "reflections_update" on reflections for update using (true);
