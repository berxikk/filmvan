-- ====================================================================
-- FÎLÎMVAN SUPABASE DATABASE SCHEMAS, INDEXES, RLS POLICIES & SEED
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Movies Table
create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  original_title text,
  slug text unique not null,
  description text,
  release_year integer,
  duration_minutes integer,
  country text,
  language text,
  director text,
  cast_members text[],
  poster_url text,
  backdrop_url text,
  trailer_url text,
  video_provider text,
  embed_url text,
  rating numeric(3,1),
  view_count bigint default 0,
  is_featured boolean default false,
  is_published boolean default false,
  has_turkish_subtitle boolean default false,
  rights_status text default 'public_domain' check (rights_status in ('public_domain', 'licensed', 'owned')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Genres Table
create table if not exists public.genres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Movie Genres Junction Table
create table if not exists public.movie_genres (
  movie_id uuid references public.movies(id) on delete cascade,
  genre_id uuid references public.genres(id) on delete cascade,
  primary key(movie_id, genre_id)
);

-- Subtitles Table
create table if not exists public.subtitles (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references public.movies(id) on delete cascade,
  language text not null,
  label text,
  subtitle_url text,
  created_at timestamptz default now()
);

-- Favorites Table
create table if not exists public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  movie_id uuid references public.movies(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(user_id, movie_id)
);

-- Watchlist Table
create table if not exists public.watchlist (
  user_id uuid references auth.users(id) on delete cascade,
  movie_id uuid references public.movies(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(user_id, movie_id)
);

-- Watch History Table
create table if not exists public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  movie_id uuid references public.movies(id) on delete cascade,
  progress_seconds integer default 0,
  completed boolean default false,
  last_watched_at timestamptz default now(),
  constraint unique_user_movie_history unique (user_id, movie_id)
);

-- 3. INDEXES
create index if not exists idx_movies_slug on public.movies(slug);
create index if not exists idx_movies_release_year on public.movies(release_year);
create index if not exists idx_movies_rating on public.movies(rating);
create index if not exists idx_movies_view_count on public.movies(view_count);
create index if not exists idx_movies_is_published on public.movies(is_published);
create index if not exists idx_movies_is_featured on public.movies(is_featured);
create index if not exists idx_genres_slug on public.genres(slug);

-- 4. HELPER SECURITY DEFINER FUNCTION FOR ADMIN CHECK
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
end;
$$;

-- 5. AUTOMATIC PROFILE TRIGGER FUNCTION (READS CUSTOM USERNAME & DISPLAY NAME FROM METADATA)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    'user'
  )
  on conflict (id) do update set
    username = coalesce(nullif(excluded.username, ''), profiles.username),
    display_name = coalesce(nullif(excluded.display_name, ''), profiles.display_name),
    email = coalesce(excluded.email, profiles.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.movies enable row level security;
alter table public.genres enable row level security;
alter table public.movie_genres enable row level security;
alter table public.subtitles enable row level security;
alter table public.favorites enable row level security;
alter table public.watchlist enable row level security;
alter table public.watch_history enable row level security;

create policy "Public profiles read policy" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "Admin manage profiles" on public.profiles for all using (public.is_admin());

create policy "Public view published movies" on public.movies for select using (is_published = true or public.is_admin());
create policy "Admin insert movies" on public.movies for insert with check (public.is_admin());
create policy "Admin update movies" on public.movies for update using (public.is_admin());
create policy "Admin delete movies" on public.movies for delete using (public.is_admin());

create policy "Public view genres" on public.genres for select using (true);
create policy "Admin insert genres" on public.genres for insert with check (public.is_admin());
create policy "Admin update genres" on public.genres for update using (public.is_admin());
create policy "Admin delete genres" on public.genres for delete using (public.is_admin());

create policy "Public view movie_genres" on public.movie_genres for select using (true);
create policy "Admin manage movie_genres" on public.movie_genres for all using (public.is_admin());

create policy "Public view subtitles for published movies" on public.subtitles for select using (
  exists (
    select 1 from public.movies
    where movies.id = subtitles.movie_id
      and (movies.is_published = true or public.is_admin())
  )
);
create policy "Admin manage subtitles" on public.subtitles for all using (public.is_admin());

create policy "Users manage own favorites" on public.favorites for all using (auth.uid() = user_id or public.is_admin());
create policy "Users manage own watchlist" on public.watchlist for all using (auth.uid() = user_id or public.is_admin());
create policy "Users manage own watch_history" on public.watch_history for all using (auth.uid() = user_id or public.is_admin());

-- 7. INITIAL GENRES SEED DATA
insert into public.genres (name, slug, description) values
  ('Aksiyon & Macera', 'aksiyon-macera', 'Nefes kesen kovalamacalar ve cesur maceralar.'),
  ('Dram', 'dram', 'Derin insan hikayeleri ve duygusal yolculuklar.'),
  ('Klasikler', 'klasikler', 'Sinema tarihine damga vurmuş zamansız başyapıtlar.'),
  ('Korku & Gerilim', 'korku-gerilim', 'Karanlık atmosferler ve gerilim dolu anlar.'),
  ('Komedi', 'komedi', 'Sessiz sinemanın dehalarından kahkaha dolu komediler.'),
  ('Bilim Kurgu', 'bilim-kurgu', 'Geleceğin vizyonları ve distopyalar.')
on conflict (slug) do nothing;
