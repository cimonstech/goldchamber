-- Force set admin role for the admin user
-- Run this in Supabase SQL Editor if admin still sees member dashboard
update public.profiles
set role = 'admin', membership_status = 'active', full_name = coalesce(full_name, 'CLGB Admin')
where email = 'admin@chamberofgoldbuyers.com';
