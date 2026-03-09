-- Application documents — uploaded during membership application (Ghana card, Reg. Certificate, etc.)
create table public.application_documents (
  id uuid default gen_random_uuid() primary key,
  application_id uuid not null references public.applications(id) on delete cascade,
  document_type text not null check (document_type in ('ghana_card', 'reg_certificate', 'business_registration', 'other')),
  file_url text not null,
  file_name text,
  file_key text,
  created_at timestamptz default now()
);

alter table public.application_documents enable row level security;

create policy "Admins can manage application documents" on public.application_documents
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_application_documents_application_id on public.application_documents(application_id);
