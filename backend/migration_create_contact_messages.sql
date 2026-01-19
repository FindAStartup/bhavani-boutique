-- Create a table for contact form messages
create table public.contact_messages (
  id uuid not null default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone not null default now(),
  status text not null default 'new', -- new, read, replied
  constraint contact_messages_pkey primary key (id)
);

-- Turn on Row Level Security
alter table public.contact_messages enable row level security;

-- Create policies
-- Allow anyone to insert messages (public contact form)
create policy "Allow public inserts"
    on public.contact_messages
    for insert
    to public
    with check (true);

-- Allow admins to read all messages (assuming admin role exists or checking service_role)
-- For now, we will allow service_role to read/write, and authenticated users to insert.
-- Since this is a public form, anon users should be able to insert.

-- Allow read access only to authenticated admins (Refining this later based on exact auth setup)
-- For development/demo, we might restrict read to service role or specific admin users
