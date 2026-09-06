-- ============================================================
-- Amicale Laique Echirolles Rugby -- mises a jour diverses (saison 2026)
-- A executer UNE SEULE FOIS : SQL Editor -> New query -> coller -> Run
-- Utilisez le bouton "Raw" sur GitHub pour copier ce fichier proprement.
-- ============================================================

-- ---- Organigramme : retirer Alexis Vout (U19) ----
delete from contenu_items
where section = 'organigramme' and champs->>'nom' = 'Alexis Vout';

-- ---- Organigramme : retirer David Schoonheere (U16) ----
delete from contenu_items
where section = 'organigramme' and champs->>'nom' = 'David Schoonheere';

-- ---- Organigramme : ajouter Laurie Joffre au Bureau ----
insert into contenu_items (section, groupe, champs, ordre) values
('organigramme', 'Bureau', '{"nom":"Laurie Joffre","fonction":"Responsable communication et photographe","email":"lauriejoffre@orange.fr","telephone":"06 89 23 97 12"}', 5);

-- ---- Organigramme : ajouter Jerome Vernay en Seniors (entraineur) ----
insert into contenu_items (section, groupe, champs, ordre) values
('organigramme', 'Seniors', '{"nom":"Jérôme Vernay","fonction":"Entraîneur","email":"","telephone":""}', 5);

-- ---- Tarifs : nouveaux prix 2026 ----
update contenu_items set champs = '{"categorie":"Baby''s","prix":"80 €"}'
  where section = 'tarifs' and champs->>'categorie' = 'Baby''s';
update contenu_items set champs = '{"categorie":"U6","prix":"110 €"}'
  where section = 'tarifs' and champs->>'categorie' = 'U6';
update contenu_items set champs = '{"categorie":"U8 / U10","prix":"170 €"}'
  where section = 'tarifs' and champs->>'categorie' = 'U8 / U10';
update contenu_items set champs = '{"categorie":"Senior","prix":"230 €"}'
  where section = 'tarifs' and champs->>'categorie' = 'Senior';
update contenu_items set champs = '{"categorie":"Échigaulois","prix":"110 €"}'
  where section = 'tarifs' and champs->>'categorie' = 'Échigaulois';

-- L'ancienne ligne "U12 / U14-F15 / U16 / U19" devient 2 lignes distinctes
update contenu_items set champs = '{"categorie":"U12 / U14 / F15","prix":"180 €"}', ordre = 4
  where section = 'tarifs' and champs->>'categorie' = 'U12 / U14-F15 / U16 / U19';
insert into contenu_items (section, champs, ordre) values
('tarifs', '{"categorie":"U16-U19","prix":"200 €"}', 5);

-- ---- Horaires : nouveaux creneaux U19 ----
update contenu_items set champs = '{"categorie":"U19","jour":"Mardi","horaire":"18h30–20h30","lieu":"Stade Jean Beauvallet, Seyssins"}'
  where section = 'horaires' and champs->>'categorie' = 'U19' and champs->>'jour' = 'Mercredi';
update contenu_items set champs = '{"categorie":"U19","jour":"Vendredi","horaire":"18h30–20h30","lieu":"Stade Pablo Picasso"}'
  where section = 'horaires' and champs->>'categorie' = 'U19' and champs->>'jour' = 'Vendredi';

-- ---- Horaires : nouveaux creneaux U16 ----
update contenu_items set champs = '{"categorie":"U16","jour":"Lundi","horaire":"18h30–20h00","lieu":"Stade Jean Beauvallet, Seyssins"}'
  where section = 'horaires' and champs->>'categorie' = 'U16' and champs->>'jour' = 'Mercredi';
update contenu_items set champs = '{"categorie":"U16","jour":"Vendredi","horaire":"18h30–20h00","lieu":"Stade Pablo Picasso ou Stade Municipal (Saint-Égrève)"}'
  where section = 'horaires' and champs->>'categorie' = 'U16' and champs->>'jour' = 'Vendredi';

-- ---- Palmares : ajouter le titre 2026 ----
insert into contenu_items (section, champs, ordre) values
('palmares', '{"annee":"2026","titre":"Champion des Alpes Régionale 2 U19"}', 0);

-- ---- Equipes : fusionner "Rugby Loisir" dans "Les Echigaulois" ----
delete from contenu_items
where section = 'equipes' and champs->>'titre' = 'Rugby Loisir';

update contenu_items
  set champs = '{"badge":"LOISIR","titre":"Les Échigaulois","description":"Rugby loisir avec plaquage, sans la pression du résultat, tous les lundis de 19h à 21h — les anciens et les amateurs de troisième mi-temps gardent la flamme sous ce nom bien trouvé.","mis_en_avant":false}'
  where section = 'equipes' and champs->>'titre' = 'Les Échigaulois';
