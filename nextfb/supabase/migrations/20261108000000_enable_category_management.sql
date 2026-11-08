begin;

lock table public.categories, public.products in share row exclusive mode;

create unique index categories_name_lower_idx on public.categories (lower(name));

-- Remove the old fixed category allowlist, if present. Other product checks stay in place.
do $$
declare
  old_check record;
begin
  for old_check in
    select c.conname
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attname = 'category'
    where c.conrelid = 'public.products'::regclass
      and c.contype = 'c'
      and c.conkey = array[a.attnum]
      and pg_get_constraintdef(c.oid) ~* 'any| in '
      and pg_get_constraintdef(c.oid) ~* 'cordset'
      and pg_get_constraintdef(c.oid) ~* 'kurties'
  loop
    execute format('alter table public.products drop constraint %I', old_check.conname);
  end loop;
end;
$$;

-- Catch products and drafts created since the first migration.
update public.products as product
set category_id = (
  select category.id
  from public.categories as category
  where lower(category.name) = lower(btrim(product.category))
     or category.slug = regexp_replace(lower(btrim(product.category)), '[[:space:]-]+', '-', 'g')
  order by (lower(category.name) = lower(btrim(product.category))) desc, category.slug
  limit 1
)
where product.category_id is null;

do $$
begin
  if exists (select 1 from public.products where category_id is null) then
    raise exception 'Assign a category to every existing product and draft before applying this migration.';
  end if;
end;
$$;

alter table public.products alter column category_id set not null;

-- Keep compatibility with existing product writers that still submit the category name.
create function public.sync_product_category()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  assigned public.categories%rowtype;
begin
  if new.category_id is not null then
    select * into assigned from public.categories where id = new.category_id;
  end if;

  if new.category_id is null
     or (tg_op = 'UPDATE' and new.category_id = old.category_id
         and new.category is distinct from old.category
         and new.category is distinct from assigned.name) then
    select * into assigned
    from public.categories
    where lower(name) = lower(btrim(new.category))
       or slug = regexp_replace(lower(btrim(new.category)), '[[:space:]-]+', '-', 'g')
    order by (lower(name) = lower(btrim(new.category))) desc, slug
    limit 1;
  end if;

  if assigned.id is null then
    raise exception 'Choose an existing category.' using errcode = '23503';
  end if;
  new.category_id := assigned.id;
  new.category := assigned.name;
  return new;
end;
$$;

create trigger sync_product_category
before insert or update of category, category_id on public.products
for each row execute function public.sync_product_category();

-- Rename the label used by existing product cards, search and related products.
create function public.sync_renamed_category()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.products set category_id = new.id, category = new.name
  where category_id = new.id and category is distinct from new.name;
  return new;
end;
$$;

create trigger sync_renamed_category
after update of name on public.categories
for each row when (old.name is distinct from new.name)
execute function public.sync_renamed_category();

commit;

