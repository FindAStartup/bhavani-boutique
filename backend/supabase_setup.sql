-- 1. Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  first_name text,
  last_name text,
  role text default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- 2. Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- 3. Create Policy (Users can view their own profile)
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- 4. Create Trigger Function (Auto-create profile on signup)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger (Runs automatically when a new user signs up)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 2. Products Table
-- ==========================================

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text check (category in ('Cordset', 'Saree', 'Kurties', 'Set Mund', 'Bottoms')),
  images text[], -- Array of image URLs (4-5 images)
  material_care text, -- Care instructions
  sustainability_impact text, -- Sustainability information
  delivery_days int default 7, -- Estimated delivery days
  is_draft boolean default false, -- Draft status
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Products
alter table public.products enable row level security;

-- Everyone can read products
create policy "Public can view products" on products
  for select using (true);

-- Only admins can insert/update/delete products
create policy "Admins can manage products" on products
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ==========================================
-- 2.1. Product Stock Table (Size-specific inventory)
-- ==========================================

create table if not exists public.product_stock (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  size text not null, -- e.g., 'S', 'M', 'L', 'XL', 'XXL'
  stock_quantity int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(product_id, size) -- One entry per product-size combination
);

-- RLS for Product Stock
alter table public.product_stock enable row level security;

-- Everyone can read stock
create policy "Public can view stock" on product_stock
  for select using (true);

-- Only admins can manage stock
create policy "Admins can manage stock" on product_stock
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ==========================================
-- 3. Orders Table
-- ==========================================

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  customer_name text, -- Snapshot of name
  total_amount numeric(10, 2) not null,
  status text default 'Processing', -- 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Orders
alter table public.orders enable row level security;

-- Users can view their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders" on orders
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ==========================================
-- 4. Order Items Table
-- ==========================================

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int default 1,
  price_at_purchase numeric(10, 2) not null
);

-- RLS for Order Items
alter table public.order_items enable row level security;

-- Policies inherit from orders (simplified for now, usually requires join check)
create policy "Users can view own order items" on order_items
  for select using (
     exists (
       select 1 from orders
       where orders.id = order_items.order_id
       and orders.user_id = auth.uid()
     )
  );

create policy "Admins can view all order items" on order_items
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ==========================================
-- 5. Dummy Data (For Testing)
-- ==========================================

-- Note: You might need to run these inserts manually in the Supabase SQL Editor

-- Insert Products
insert into public.products (name, category, price, stock_quantity, sizes)
values 
  ('Silk Evening Gown', 'Dresses', 12500, 5, ARRAY['S', 'M']),
  ('Casual Cotton Top', 'Tops', 2400, 20, ARRAY['M', 'L', 'XL']),
  ('Embroidered Lehenga', 'Dresses', 45000, 2, ARRAY['M']);

-- Insert Orders (Attaching to a NULL user_id for generic testing diff dates)
-- In production, you would need real user UUIDs.
insert into public.orders (customer_name, total_amount, status, created_at)
values
  ('Priya Singh', 4200, 'Shipped', now() - interval '2 days'),
  ('Anjali Sharma', 12500, 'Processing', now() - interval '5 hours'),
  ('Meera Kapoor', 7800, 'Cancelled', now() - interval '1 day'),
  ('Radha Das', 5400, 'Delivered', now() - interval '5 days');

