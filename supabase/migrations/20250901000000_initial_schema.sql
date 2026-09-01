-- Trendify Cart Quest — Supabase backend schema

create extension if not exists "pgcrypto";

create type public.order_status as enum ('pending', 'shipped', 'delivered', 'cancelled');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  username text not null unique,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Products catalog
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2) check (original_price is null or original_price >= 0),
  description text not null default '',
  images text[] not null default '{}',
  category text not null,
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  in_stock boolean not null default true,
  trending boolean not null default false,
  recommended boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index products_trending_idx on public.products (trending) where trending = true;
create index products_recommended_idx on public.products (recommended) where recommended = true;
create index products_category_idx on public.products (category);

-- Shopping cart
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.order_status not null default 'pending',
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0),
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Checkout: create order from cart atomically
create or replace function public.checkout_cart(tax_rate numeric default 0.08)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_subtotal numeric(10, 2);
  v_total numeric(10, 2);
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(sum(p.price * ci.quantity), 0)
  into v_subtotal
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  if v_subtotal = 0 then
    raise exception 'Cart is empty';
  end if;

  v_total := round(v_subtotal * (1 + tax_rate), 2);

  insert into public.orders (user_id, status, total)
  values (v_user_id, 'pending', v_total)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, quantity, price)
  select v_order_id, ci.product_id, ci.quantity, p.price
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  delete from public.cart_items where user_id = v_user_id;

  return v_order_id;
end;
$$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Products are publicly readable"
  on public.products for select using (true);

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users manage own cart"
  on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users create own orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Users read own order items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  ));

-- Seed catalog (matches former mock data)
insert into public.products (name, slug, price, original_price, description, images, category, rating, review_count, in_stock, trending, recommended, tags)
values
  (
    'Wireless Bluetooth Headphones',
    'wireless-bluetooth-headphones',
    199.99, 249.99,
    'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.',
    array['/placeholder.svg'],
    'Electronics', 4.8, 1284, true, true, true,
    array['wireless', 'bluetooth', 'noise-cancellation', 'premium']
  ),
  (
    'Smart Fitness Watch',
    'smart-fitness-watch',
    299.99, 399.99,
    'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your workouts and stay connected.',
    array['/placeholder.svg'],
    'Wearables', 4.6, 892, true, true, false,
    array['fitness', 'smartwatch', 'health', 'gps']
  ),
  (
    'Portable Laptop Stand',
    'portable-laptop-stand',
    79.99, null,
    'Ergonomic aluminum laptop stand with adjustable height and angle. Improve your posture and productivity.',
    array['/placeholder.svg'],
    'Accessories', 4.4, 567, true, true, true,
    array['laptop', 'ergonomic', 'portable', 'aluminum']
  ),
  (
    'Wireless Charging Pad',
    'wireless-charging-pad',
    49.99, 69.99,
    'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicators.',
    array['/placeholder.svg'],
    'Electronics', 4.3, 324, true, true, false,
    array['wireless', 'charging', 'qi', 'fast-charge']
  ),
  (
    'Gaming Mechanical Keyboard',
    'gaming-mechanical-keyboard',
    159.99, null,
    'RGB backlit mechanical keyboard with customizable keys, perfect for gaming and productivity.',
    array['/placeholder.svg'],
    'Gaming', 4.7, 756, false, false, true,
    array['gaming', 'mechanical', 'rgb', 'keyboard']
  ),
  (
    'Ultra HD Webcam',
    'ultra-hd-webcam',
    129.99, null,
    '4K webcam with auto-focus and built-in microphone. Perfect for video calls and streaming.',
    array['/placeholder.svg'],
    'Electronics', 4.5, 433, true, false, true,
    array['webcam', '4k', 'streaming', 'video-calls']
  );
