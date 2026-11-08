begin;

do $$
begin
  if not exists (select 1 from storage.buckets where id = 'Categories' and public) then
    raise exception 'Expected a public Storage bucket with ID Categories.';
  end if;
end;
$$;

drop policy if exists "Admins read category image objects" on storage.objects;
drop policy if exists "Admins upload category image objects" on storage.objects;
drop policy if exists "Admins delete category image objects" on storage.objects;

create policy "Admins read category image objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'Categories'
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

create policy "Admins upload category image objects"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'Categories'
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

create policy "Admins delete category image objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'Categories'
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

commit;
