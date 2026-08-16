create table if not exists public.student_feedback (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  student_name text,
  student_email text not null,
  category text not null check (
    category in ('suggestion', 'payment', 'access', 'test', 'notes', 'technical', 'other')
  ),
  subject text not null,
  message text not null,
  rating smallint check (rating between 1 and 5),
  page_url text,
  user_agent text,
  status text not null default 'new' check (
    status in ('new', 'reviewing', 'resolved', 'closed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_feedback enable row level security;

create index if not exists student_feedback_created_at_idx
  on public.student_feedback (created_at desc);

create index if not exists student_feedback_status_idx
  on public.student_feedback (status);

comment on table public.student_feedback is
  'Feedback and support requests submitted from the MAPHY Help Centre.';
