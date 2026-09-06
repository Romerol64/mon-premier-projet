-- ============================================================
-- Amicale Laique Echirolles Rugby -- pages categories + documents
-- Reutilise les tables contenu_items existantes (sections
-- "pages_equipe" et "documents"), pas de nouvelle table necessaire.
-- Ajoute juste un bucket de stockage pour les fichiers PDF.
-- A executer UNE SEULE FOIS : SQL Editor -> New query -> coller -> Run
-- ============================================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "Lecture publique des documents"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'documents');
create policy "Les administrateurs uploadent des documents"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documents');
create policy "Les administrateurs suppriment des documents"
  on storage.objects for delete to authenticated
  using (bucket_id = 'documents');

-- ---- Ajoute un identifiant (slug) a chaque categorie d'equipe existante ----
-- Necessaire pour faire le lien avec sa page detaillee.
update contenu_items set champs = champs || '{"slug":"ecole-de-rugby"}'::jsonb
  where section = 'equipes' and champs->>'titre' = 'École de Rugby';
update contenu_items set champs = champs || '{"slug":"cadets-juniors"}'::jsonb
  where section = 'equipes' and champs->>'titre' = 'Cadets & Juniors';
update contenu_items set champs = champs || '{"slug":"seniors"}'::jsonb
  where section = 'equipes' and champs->>'titre' = 'Seniors';
update contenu_items set champs = champs || '{"slug":"feminines"}'::jsonb
  where section = 'equipes' and champs->>'titre' = 'Féminines';
update contenu_items set champs = champs || '{"slug":"echigaulois"}'::jsonb
  where section = 'equipes' and champs->>'titre' = 'Les Échigaulois';

-- ---- Pages détaillées par catégorie : une ligne de départ par catégorie ----
-- Modifiable ensuite entièrement depuis /admin -> Contenu du site -> Pages équipes
insert into contenu_items (section, champs, ordre) values
('pages_equipe', '{"slug": "ecole-de-rugby", "titre": "École de Rugby", "licence_prix": "Voir la grille tarifaire (Baby''s à U14)", "horaires": "Voir la grille des créneaux d''entraînement sur la page d''accueil.", "lieu": "2 Rue Paul Cézanne / Stade Edmond Racca, Échirolles", "educateurs": "Michel Pellerin et Thierry Cepeda (responsables EDR)", "effectif": "", "numeros_importants": "", "photo_url": "", "fiche_inscription_url": ""}', 1),
('pages_equipe', '{"slug": "cadets-juniors", "titre": "Cadets & Juniors (U16-U19)", "licence_prix": "200 €", "horaires": "U16 : Lundi 18h30-20h00 (Stade Jean Beauvallet, Seyssins) et Vendredi 18h30-20h00 (Stade Pablo Picasso ou Stade Municipal Saint-Égrève). U19 : Mardi 18h30-20h30 (Stade Jean Beauvallet, Seyssins) et Vendredi 18h30-20h30 (Stade Pablo Picasso).", "lieu": "Stade Jean Beauvallet (Seyssins) et Stade Pablo Picasso", "educateurs": "Mehdi Aziz (U16), Lucas Romero et Giuseppe Geronimo (U19)", "effectif": "", "numeros_importants": "", "photo_url": "", "fiche_inscription_url": ""}', 2),
('pages_equipe', '{"slug": "seniors", "titre": "Seniors", "licence_prix": "230 €", "horaires": "Mardi et jeudi, 19h00-21h00", "lieu": "2 Rue Paul Cézanne, Échirolles", "educateurs": "Jean-Yves Morel, Quentin Vigne, Fabien Meynaud, Romain Paquet, Jérôme Vernay", "effectif": "", "numeros_importants": "", "photo_url": "", "fiche_inscription_url": ""}', 3),
('pages_equipe', '{"slug": "feminines", "titre": "Féminines", "licence_prix": "Voir la grille tarifaire selon l''âge (jusqu''à F15)", "horaires": "Voir la grille des créneaux d''entraînement sur la page d''accueil.", "lieu": "2 Rue Paul Cézanne, Échirolles", "educateurs": "", "effectif": "", "numeros_importants": "", "photo_url": "", "fiche_inscription_url": ""}', 4),
('pages_equipe', '{"slug": "echigaulois", "titre": "Les Échigaulois (Loisir)", "licence_prix": "110 €", "horaires": "Lundi, 19h00-21h00", "lieu": "2 Rue Paul Cézanne, Échirolles", "educateurs": "", "effectif": "", "numeros_importants": "", "photo_url": "", "fiche_inscription_url": ""}', 5);

-- ---- Documents du club (page dédiée) ----
insert into contenu_items (section, champs, ordre) values
('documents', '{"titre": "Charte graphique de l''ALE Rugby", "description": "Identité visuelle du club : logos, couleurs, typographies.", "fichier_url": "https://api.club.ffr.fr/alerugbyechirolles/wp-content/uploads/sites/2017/2025/08/presentation-de-charte-graphique-de-marque-elegance-aspirationnelle-en-noir-et-blanc-vert-emeraude-et-menthe.pdf"}', 1),
('documents', '{"titre": "L''Écureuil Déchaîné n°1 (Sept/Oct)", "description": "La newsletter du club.", "fichier_url": "https://api.club.ffr.fr/alerugbyechirolles/wp-content/uploads/sites/2017/2024/10/ecureuil-dechaine-n1.pdf"}', 2),
('documents', '{"titre": "L''Écureuil Déchaîné n°2 (Nov/Déc)", "description": "La newsletter du club.", "fichier_url": "https://api.club.ffr.fr/alerugbyechirolles/wp-content/uploads/sites/2017/2025/01/ecureuil-dechaine-n2.pdf"}', 3);
