-- ============================================================
-- Amicale Laïque Echirolles Rugby — albums photos
-- À exécuter UNE SEULE FOIS, après schema.sql :
-- SQL Editor → New query → coller ce fichier en entier → Run
-- ============================================================

-- Table des albums
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  publie boolean not null default true,
  cree_le timestamptz not null default now()
);

-- Table des photos (chaque photo appartient à un album)
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  image_url text not null,
  cree_le timestamptz not null default now()
);

alter table albums enable row level security;
alter table photos enable row level security;

-- Lecture publique des albums publiés uniquement
create policy "Lecture publique des albums publiés"
  on albums for select
  to anon, authenticated
  using (publie = true);

-- Lecture publique des photos, seulement si leur album est publié
create policy "Lecture publique des photos d'albums publiés"
  on photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from albums
      where albums.id = photos.album_id
      and albums.publie = true
    )
  );

-- Les administrateurs connectés voient et gèrent tout
create policy "Les administrateurs voient tous les albums"
  on albums for select to authenticated using (true);
create policy "Les administrateurs créent des albums"
  on albums for insert to authenticated with check (true);
create policy "Les administrateurs modifient des albums"
  on albums for update to authenticated using (true);
create policy "Les administrateurs suppriment des albums"
  on albums for delete to authenticated using (true);

create policy "Les administrateurs voient toutes les photos"
  on photos for select to authenticated using (true);
create policy "Les administrateurs ajoutent des photos"
  on photos for insert to authenticated with check (true);
create policy "Les administrateurs suppriment des photos"
  on photos for delete to authenticated using (true);

create index if not exists albums_cree_le_idx on albums (cree_le desc);
create index if not exists photos_album_id_idx on photos (album_id);

-- ============================================================
-- Stockage des photos d'albums
-- ============================================================
insert into storage.buckets (id, name, public)
values ('albums-images', 'albums-images', true)
on conflict (id) do nothing;

create policy "Lecture publique des photos d'albums (fichiers)"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'albums-images');

create policy "Les administrateurs uploadent des photos d'albums"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'albums-images');

create policy "Les administrateurs suppriment des photos d'albums"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'albums-images');
