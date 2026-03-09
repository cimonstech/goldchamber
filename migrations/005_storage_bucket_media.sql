-- Create media bucket for image uploads (fallback when R2 not configured)
-- Run this in Supabase SQL editor if the bucket doesn't exist

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow admins to upload (uses is_admin() to avoid RLS recursion)
drop policy if exists "media_admins_upload" on storage.objects;
create policy "media_admins_upload"
on storage.objects for insert
with check (
  bucket_id = 'media' and public.is_admin()
);

-- Allow public read for media bucket
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
on storage.objects for select
using (bucket_id = 'media');
