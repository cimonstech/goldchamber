-- Fix infinite recursion: policies on profiles table must not query profiles.
-- Use a SECURITY DEFINER function so the admin check bypasses RLS.

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer set search_path = public;

-- Drop the recursive policy and recreate using is_admin()
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for all using (public.is_admin());
