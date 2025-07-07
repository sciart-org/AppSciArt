ALTER TABLE profiles.user_profiles ENABLE ROW LEVEL SECURITY;

create or replace function profiles.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into profiles.user_profiles (id, email)
    values (new.id, new.email);

    if (new.raw_app_meta_data ->> 'provider') is distinct from 'email' then
        insert into profiles.early_signups (email, "createdAt", "isProvider")
        values (new.email, now(), TRUE);
    end if;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure profiles.handle_new_user();
