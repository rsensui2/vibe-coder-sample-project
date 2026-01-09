-- ============================================
-- Migration: Initial Schema for DORONUMA
-- Purpose: Create users and posts tables with RLS
-- ============================================

-- 1. Users Table (Synced from Clerk)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  display_name text not null,
  avatar_url text,
  level integer default 1 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.users is 'ユーザー情報を管理するテーブル（Clerkと同期）';

-- Enable RLS
alter table public.users enable row level security;

-- RLS Policies for Users
create policy "Users can view their own data" on public.users
  for select to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "Users can update their own data" on public.users
  for update to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'))
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

-- 2. Posts Table (DORONUMA Post)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text not null, -- 金銭, 紛失, 体調, 人間関係, その他
  despair_level integer check (despair_level >= 1 and despair_level <= 100) not null,
  image_url text,
  location_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.posts is '絶望投稿（ドロヌマ・ポスト）を管理するテーブル';

-- Enable RLS
alter table public.posts enable row level security;

-- RLS Policies for Posts
create policy "Anyone can view posts" on public.posts
  for select using (true);

create policy "Authenticated users can create posts" on public.posts
  for insert to authenticated
  with check (
    user_id in (
      select id from public.users where clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Users can update their own posts" on public.posts
  for update to authenticated
  using (
    user_id in (
      select id from public.users where clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Users can delete their own posts" on public.posts
  for delete to authenticated
  using (
    user_id in (
      select id from public.users where clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- 3. Indexes
create index idx_users_clerk_id on public.users(clerk_user_id);
create index idx_posts_user_id on public.posts(user_id);
create index idx_posts_created_at on public.posts(created_at desc);
