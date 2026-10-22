-- Run this in Supabase Dashboard > SQL Editor.
create table if not exists public.workshop_feedback (
  id uuid primary key default gen_random_uuid(),
  participant_name text,
  college_name text not null,
  department text not null,
  year_of_study text,
  participant_role text,
  email text,
  session1_rating smallint not null check (session1_rating between 1 and 5),
  session1_comment text,
  session2_rating smallint not null check (session2_rating between 1 and 5),
  session2_comment text,
  session3_rating smallint not null check (session3_rating between 1 and 5),
  session3_comment text,
  overall_rating smallint not null check (overall_rating between 1 and 5),
  overall_comment text not null,
  recommend text check (recommend in ('yes','maybe','no') or recommend is null),
  created_at timestamptz not null default now()
);

alter table public.workshop_feedback enable row level security;

-- Public visitors can submit feedback, but cannot read or change saved feedback.
drop policy if exists "Anyone can submit workshop feedback" on public.workshop_feedback;
create policy "Anyone can submit workshop feedback"
on public.workshop_feedback for insert
to anon, authenticated
with check (
  session1_rating between 1 and 5 and
  session2_rating between 1 and 5 and
  session3_rating between 1 and 5 and
  overall_rating between 1 and 5 and
  length(trim(overall_comment)) > 0
);

-- Intentionally do NOT create a public SELECT policy.
-- View responses in Supabase Dashboard > Table Editor.
-- Export from Table Editor to CSV; open CSV in Excel.
-- For a public-facing admin dashboard, implement Supabase Auth and a server-side
-- role/authorization strategy before granting any read access.
