-- ============================================================
-- Amicale Laique Echirolles Rugby -- fiches d'inscription par categorie
-- A executer UNE SEULE FOIS : SQL Editor -> New query -> coller -> Run
-- ============================================================

update contenu_items
  set champs = champs || '{"fiche_inscription_url":"assets/documents/fiche-inscription-ecole-de-rugby.pdf"}'::jsonb
  where section = 'pages_equipe' and champs->>'slug' = 'ecole-de-rugby';

update contenu_items
  set champs = champs || '{"fiche_inscription_url":"assets/documents/fiche-inscription-u16-u19.pdf"}'::jsonb
  where section = 'pages_equipe' and champs->>'slug' = 'cadets-juniors';

update contenu_items
  set champs = champs || '{"fiche_inscription_url":"assets/documents/fiche-inscription-seniors.pdf"}'::jsonb
  where section = 'pages_equipe' and champs->>'slug' = 'seniors';

update contenu_items
  set champs = champs || '{"fiche_inscription_url":"assets/documents/fiche-inscription-echigaulois.pdf"}'::jsonb
  where section = 'pages_equipe' and champs->>'slug' = 'echigaulois';

-- ---- Ajoute aussi ces fiches à la page Documents pour un accès centralisé ----
insert into contenu_items (section, champs, ordre) values
('documents', '{"titre":"Fiche d''inscription — École de Rugby","description":"Saison 2026-2027","fichier_url":"assets/documents/fiche-inscription-ecole-de-rugby.pdf"}', 4),
('documents', '{"titre":"Fiche d''inscription — Cadets & Juniors (U16-U19)","description":"Saison 2026-2027","fichier_url":"assets/documents/fiche-inscription-u16-u19.pdf"}', 5),
('documents', '{"titre":"Fiche d''inscription — Seniors","description":"Saison 2026-2027","fichier_url":"assets/documents/fiche-inscription-seniors.pdf"}', 6),
('documents', '{"titre":"Fiche d''inscription — Les Échigaulois","description":"Saison 2026-2027","fichier_url":"assets/documents/fiche-inscription-echigaulois.pdf"}', 7);
