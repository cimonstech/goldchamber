-- CLGB Portal — Supabase Schema
-- Run this in the Supabase SQL editor

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'member' check (role in ('admin', 'member')),
  membership_tier text check (membership_tier in ('Associate', 'Full Member', 'Corporate')),
  membership_status text not null default 'pending' check (membership_status in ('pending', 'active', 'suspended', 'rejected')),
  membership_number text unique,
  business_name text,
  business_registration text,
  business_address text,
  gold_activity text,
  nationality text,
  date_of_birth date,
  residential_address text,
  years_in_operation text,
  how_heard text,
  additional_info text,
  applied_at timestamptz default now(),
  approved_at timestamptz,
  expires_at timestamptz,
  avatar_url text,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- APPLICATIONS TABLE
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  date_of_birth date,
  nationality text,
  residential_address text,
  business_name text,
  business_registration text,
  business_address text,
  years_in_operation text,
  gold_activity text,
  membership_tier text not null,
  how_heard text,
  additional_info text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id),
  review_notes text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz
);

-- ARTICLES TABLE
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  body text[] not null default '{}',
  category text not null,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DOCUMENTS TABLE
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_url text not null,
  file_size text,
  category text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ANNOUNCEMENTS TABLE
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  tier_visibility text[] default '{"Associate","Full Member","Corporate"}',
  author_id uuid references public.profiles(id),
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- SUPPORT TICKETS TABLE
create table public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references public.profiles(id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TICKET MESSAGES TABLE
create table public.ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  message text not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- BROADCASTS TABLE
create table public.broadcasts (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  body text not null,
  tier_target text[] default '{"Associate","Full Member","Corporate"}',
  sent_by uuid references public.profiles(id),
  recipient_count integer default 0,
  sent_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.articles enable row level security;
alter table public.documents enable row level security;
alter table public.announcements enable row level security;
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.broadcasts enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- APPLICATIONS POLICIES
create policy "Members can view own application" on public.applications
  for select using (auth.uid() = profile_id);
create policy "Members can insert own application" on public.applications
  for insert with check (auth.uid() = profile_id);
create policy "Admins can manage all applications" on public.applications
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ARTICLES POLICIES
create policy "Anyone can view published articles" on public.articles
  for select using (status = 'published');
create policy "Admins can manage all articles" on public.articles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- DOCUMENTS POLICIES
create policy "Active members can view documents" on public.documents
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and membership_status = 'active')
  );
create policy "Admins can manage documents" on public.documents
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- SUPPORT TICKETS POLICIES
create policy "Members can manage own tickets" on public.support_tickets
  for all using (auth.uid() = member_id);
create policy "Admins can manage all tickets" on public.support_tickets
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- TICKET MESSAGES POLICIES (members see own ticket messages, admins see all)
create policy "Members can view own ticket messages" on public.ticket_messages
  for select using (
    exists (select 1 from public.support_tickets where id = ticket_id and member_id = auth.uid())
  );
create policy "Members can insert messages on own tickets" on public.ticket_messages
  for insert with check (
    exists (select 1 from public.support_tickets where id = ticket_id and member_id = auth.uid())
  );
create policy "Admins can manage all ticket messages" on public.ticket_messages
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ANNOUNCEMENTS POLICIES
create policy "Active members can view announcements" on public.announcements
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and membership_status = 'active')
  );
create policy "Admins can manage announcements" on public.announcements
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- BROADCASTS POLICIES
create policy "Admins can view broadcasts" on public.broadcasts
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admins can manage broadcasts" on public.broadcasts
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- AUTO CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- MEMBERSHIP NUMBER GENERATOR
create or replace function generate_membership_number()
returns text as $$
declare
  new_number text;
  exists_check boolean;
begin
  loop
    new_number := 'CLGB-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 90000 + 10000)::text, 5, '0');
    select exists(select 1 from public.profiles where membership_number = new_number) into exists_check;
    exit when not exists_check;
  end loop;
  return new_number;
end;
$$ language plpgsql;
