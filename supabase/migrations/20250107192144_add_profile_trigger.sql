-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (
        id,
        name,
        image,
        preferred_currency,
        last_sign_in,
        created_at,
        updated_at
    ) values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.email),
        coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
        'USD',
        new.created_at,
        new.created_at,
        new.created_at
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Update trigger for last_sign_in
create or replace function public.handle_user_sign_in()
returns trigger as $$
begin
    update public.profiles
    set last_sign_in = now()
    where id = new.id;
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for sign in updates
drop trigger if exists on_auth_user_signed_in on auth.users;
create trigger on_auth_user_signed_in
    after update of last_sign_in_at on auth.users
    for each row execute procedure public.handle_user_sign_in(); 