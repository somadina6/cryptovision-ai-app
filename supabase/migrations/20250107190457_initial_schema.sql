create type "public"."user_role" as enum ('user', 'admin');

-- Create required extensions
create extension if not exists "uuid-ossp";

-- Users table (extends default auth.users)
create table "public"."profiles" (
    id uuid references auth.users on delete cascade not null primary key,
    name varchar,
    image varchar,
    preferred_currency varchar default 'USD',
    last_sign_in timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Tokens table
create table "public"."tokens" (
    id uuid default uuid_generate_v4() primary key,
    token_id varchar not null unique,
    symbol varchar not null,
    name varchar not null,
    image varchar not null,
    current_price decimal not null,
    price_change_24h decimal not null,
    price_change_percentage_24h decimal not null,
    market_cap decimal not null default 0,
    market_cap_rank integer,
    circulating_supply decimal not null,
    total_supply decimal not null,
    max_supply decimal,
    ath decimal not null,
    ath_date timestamptz not null,
    atl decimal not null,
    atl_date timestamptz not null,
    last_updated timestamptz not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- User Portfolios table
create table "public"."user_portfolios" (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    token_id uuid not null references tokens(id) on delete cascade,
    amount decimal not null check (amount >= 0),
    last_updated timestamptz default now(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, token_id)
);

-- Indexes
create index tokens_symbol_idx on tokens(symbol);
create index tokens_name_idx on tokens(name);
create index tokens_market_cap_rank_idx on tokens(market_cap_rank);
create index user_portfolios_user_id_idx on user_portfolios(user_id);
create index user_portfolios_token_id_idx on user_portfolios(token_id);
create index user_portfolios_last_updated_idx on user_portfolios(last_updated);

-- Updated at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger set_profiles_updated_at
    before update on profiles
    for each row execute function handle_updated_at();

create trigger set_tokens_updated_at
    before update on tokens
    for each row execute function handle_updated_at();

create trigger set_user_portfolios_updated_at
    before update on user_portfolios
    for each row execute function handle_updated_at();

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table tokens enable row level security;
alter table user_portfolios enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Tokens policies
create policy "Tokens are viewable by all authenticated users"
    on tokens for select
    to authenticated
    using (true);

-- User Portfolios policies
create policy "Users can view their own portfolio"
    on user_portfolios for select
    using (auth.uid() = user_id);

create policy "Users can insert into their own portfolio"
    on user_portfolios for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own portfolio"
    on user_portfolios for update
    using (auth.uid() = user_id);

create policy "Users can delete from their own portfolio"
    on user_portfolios for delete
    using (auth.uid() = user_id);

-- Add comment
comment on table profiles is 'Profile data for each user';
comment on table tokens is 'Cryptocurrency token information';
comment on table user_portfolios is 'User portfolio holdings';