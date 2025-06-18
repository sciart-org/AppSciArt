ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.user_profile (id)
    values (new.id);

    if (new.raw_app_meta_data ->> 'provider') is distinct from 'email' then
        insert into public.early_signups (email, "createdAt")
        values (new.email, now());
    end if;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
