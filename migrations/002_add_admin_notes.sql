-- Add admin_notes column to profiles for internal admin notes
alter table public.profiles add column if not exists admin_notes text;
