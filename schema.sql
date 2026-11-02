-- Run this file in Supabase SQL Editor. RLS is required for all user-owned data.
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  level text not null default 'A2' check (level in ('A1','A2','B1','B2','C1','C2')),
  goals text not null default 'Speak English naturally in daily conversations',
  preferences text not null default 'Reply in English; explain important mistakes briefly in Chinese',
  avatar_url text,
  chat_background_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.billing_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_cents integer not null default 0 check (balance_cents >= 0),
  used_tokens bigint not null default 0 check (used_tokens >= 0),
  used_audio_seconds bigint not null default 0 check (used_audio_seconds >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New conversation',
  mode text not null default 'text' check (mode in ('text','voice')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index if not exists conversations_user_updated_idx on public.conversations(user_id, updated_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  client_turn_id text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint messages_user_client_turn_unique unique (user_id, client_turn_id)
);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at asc);
create index if not exists messages_user_created_idx on public.messages(user_id, created_at desc);

create table if not exists public.corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  original_text text not null,
  corrected_text text not null,
  explanation_zh text not null default '',
  error_types text[] not null default '{}',
  severity text not null default 'medium' check (severity in ('none','low','medium','high')),
  mastered boolean not null default false,
  review_count integer not null default 0 check (review_count >= 0),
  next_review_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists corrections_user_created_idx on public.corrections(user_id, created_at desc);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  meaning text not null default '',
  example text not null default '',
  mastery_level integer not null default 0 check (mastery_level between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  next_review_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, word)
);
create index if not exists vocabulary_user_review_idx on public.vocabulary(user_id, next_review_at);

create table if not exists public.review_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('vocabulary','correction')),
  item_id uuid not null,
  quality integer not null check (quality between 0 and 5),
  reviewed_at timestamptz not null default timezone('utc', now()),
  next_review_at timestamptz
);
create index if not exists review_records_user_date_idx on public.review_records(user_id, reviewed_at desc);

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  topics text[] not null default '{}',
  summary text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists learning_sessions_user_created_idx on public.learning_sessions(user_id, created_at desc);

create table if not exists public.user_memory_refs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'bailian',
  provider_memory_id text not null,
  memory_type text not null default 'observation',
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, provider_memory_id)
);

-- Idempotent upgrades for databases created by earlier versions of this scaffold.
alter table public.messages add column if not exists client_turn_id text;
alter table public.corrections add column if not exists review_count integer not null default 0 check (review_count >= 0);
alter table public.corrections add column if not exists next_review_at timestamptz;
alter table public.corrections add column if not exists last_reviewed_at timestamptz;
alter table public.vocabulary add column if not exists review_count integer not null default 0 check (review_count >= 0);
alter table public.vocabulary add column if not exists last_reviewed_at timestamptz;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists chat_background_url text;

insert into public.billing_accounts(user_id)
select id from auth.users
on conflict (user_id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'messages_user_client_turn_unique'
  ) then
    alter table public.messages add constraint messages_user_client_turn_unique unique (user_id, client_turn_id);
  end if;
end;
$$;

create index if not exists corrections_user_review_idx on public.corrections(user_id, next_review_at) where mastered = false;
create index if not exists vocabulary_user_review_idx on public.vocabulary(user_id, next_review_at);

-- Create/update profile for new users.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;
  insert into public.billing_accounts(user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace function public.record_usage(p_tokens integer, p_audio_seconds integer default 0)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.billing_accounts(user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;
  update public.billing_accounts
    set used_tokens = used_tokens + greatest(coalesce(p_tokens, 0), 0),
        used_audio_seconds = used_audio_seconds + greatest(coalesce(p_audio_seconds, 0), 0),
        updated_at = timezone('utc', now())
    where user_id = auth.uid();
end;
$$;
grant execute on function public.record_usage(integer, integer) to authenticated;

insert into storage.buckets (id, name, public)
values ('user-assets', 'user-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "user assets read" on storage.objects;
create policy "user assets read" on storage.objects
for select using (bucket_id = 'user-assets');

drop policy if exists "user assets insert" on storage.objects;
create policy "user assets insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "user assets update" on storage.objects;
create policy "user assets update" on storage.objects
for update to authenticated
using (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "user assets delete" on storage.objects;
create policy "user assets delete" on storage.objects
for delete to authenticated
using (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at before update on public.conversations for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.corrections enable row level security;
alter table public.vocabulary enable row level security;
alter table public.review_records enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.user_memory_refs enable row level security;
alter table public.billing_accounts enable row level security;

drop trigger if exists billing_accounts_set_updated_at on public.billing_accounts;
create trigger billing_accounts_set_updated_at before update on public.billing_accounts for each row execute procedure public.set_updated_at();

drop policy if exists "profile owner all" on public.profiles;
create policy "profile owner all" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "conversation owner all" on public.conversations;
create policy "conversation owner all" on public.conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "message owner all" on public.messages;
create policy "message owner all" on public.messages for all
using (auth.uid() = user_id and exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()))
with check (auth.uid() = user_id and exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()));
drop policy if exists "correction owner all" on public.corrections;
create policy "correction owner all" on public.corrections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "vocabulary owner all" on public.vocabulary;
create policy "vocabulary owner all" on public.vocabulary for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "review owner all" on public.review_records;
create policy "review owner all" on public.review_records for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "learning session owner all" on public.learning_sessions;
create policy "learning session owner all" on public.learning_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "memory refs owner all" on public.user_memory_refs;
create policy "memory refs owner all" on public.user_memory_refs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "billing owner read" on public.billing_accounts;
create policy "billing owner read" on public.billing_accounts for select using (auth.uid() = user_id);
