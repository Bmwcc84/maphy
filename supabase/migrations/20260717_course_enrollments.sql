create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  course_id text not null,
  razorpay_order_id text not null unique,
  razorpay_payment_id text not null unique,
  amount integer not null check (amount >= 0),
  currency text not null default 'INR',
  payment_status text not null check (payment_status in ('authorized', 'captured')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.course_enrollments enable row level security;

do $$
begin
  create policy "Users can view their own enrollments"
    on public.course_enrollments
    for select
    to authenticated
    using ((select auth.uid()) = user_id);
exception
  when duplicate_object then null;
end $$;
