-- ============================================================
-- Amicale Laïque Echirolles Rugby — schéma de la base de données
-- À exécuter une seule fois dans Supabase : SQL Editor → New query
-- → coller ce fichier en entier → Run
-- ============================================================

-- Table des actualités du club
create table if not exists actualites (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  contenu text not null,
  image_url text,
  publie boolean not null default true,
  cree_le timestamptz not null default now(),
  auteur_email text
);

-- Active la sécurité au niveau des lignes (obligatoire sur Supabase)
alter table actualites enable row level security;

-- Tout le monde (visiteurs du site, y compris non connectés)
-- peut LIRE uniquement les actualités marquées "publié"
create policy "Lecture publique des actualités publiées"
  on actualites for select
  to anon, authenticated
  using (publie = true);

-- Seuls les administrateurs connectés (via Supabase Auth)
-- peuvent créer / modifier / supprimer des actualités,
-- y compris les relire même non publiées (mode brouillon)
create policy "Les administrateurs voient tout"
  on actualites for select
  to authenticated
  using (true);

create policy "Les administrateurs peuvent créer"
  on actualites for insert
  to authenticated
  with check (true);

create policy "Les administrateurs peuvent modifier"
  on actualites for update
  to authenticated
  using (true);

create policy "Les administrateurs peuvent supprimer"
  on actualites for delete
  to authenticated
  using (true);

-- Index pour trier rapidement les actualités par date
create index if not exists actualites_cree_le_idx on actualites (cree_le desc);

-- ============================================================
-- Stockage des images d'actualités
-- ============================================================
insert into storage.buckets (id, name, public)
values ('actualites-images', 'actualites-images', true)
on conflict (id) do nothing;

create policy "Lecture publique des images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'actualites-images');

create policy "Les administrateurs peuvent uploader des images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'actualites-images');

create policy "Les administrateurs peuvent supprimer des images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'actualites-images');
