-- Shop Dinhquan — chạy trong Supabase SQL Editor
-- Sau khi chạy: gọi POST /api/seed (một lần) hoặc import dữ liệu thủ công

-- Profiles (mở rộng auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  address text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Danh mục
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

-- Sản phẩm
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12, 2) not null,
  discount integer not null default 0,
  current_price numeric(12, 2) not null,
  quantity integer not null default 0,
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  images text[] not null default '{}',
  rating numeric(2, 1) not null default 4.5,
  created_at timestamptz not null default now()
);

-- Đơn hàng
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  order_code text not null unique,
  full_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text,
  country text not null default 'VN',
  total_amount numeric(14, 2) not null,
  payment_method text,
  shipping_method text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipping', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Chi tiết đơn hàng
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  price numeric(12, 2) not null,
  quantity integer not null check (quantity > 0),
  color text,
  size text
);

-- Tự tạo profile khi đăng ký
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Public read catalog
create policy "categories_select_all" on public.categories for select using (true);
create policy "products_select_all" on public.products for select using (true);

-- Orders: user owns
create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);

create policy "order_items_select_own" on public.order_items for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);
create policy "order_items_insert_own" on public.order_items for insert with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

-- Admin policies (role = admin)
create policy "profiles_admin_all" on public.profiles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "categories_admin_all" on public.categories for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "products_admin_all" on public.products for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "orders_admin_all" on public.orders for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "order_items_admin_all" on public.order_items for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
