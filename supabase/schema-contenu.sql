-- ============================================================
-- Amicale Laïque Echirolles Rugby — contenu éditable du site
-- À exécuter UNE SEULE FOIS, après schema.sql et schema-albums.sql :
-- SQL Editor → New query → coller ce fichier en entier → Run
-- ============================================================

-- Éléments de contenu structurés en listes : organigramme, tarifs,
-- horaires, partenaires, équipes, palmarès, valeurs du club.
-- "section" indique le type de contenu, "groupe" une sous-catégorie
-- libre (ex. "Bureau" pour l'organigramme), "champs" contient les
-- données propres à chaque type (nom, prix, horaire, etc.).
create table if not exists contenu_items (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  groupe text,
  champs jsonb not null default '{}',
  photo_url text,
  ordre integer not null default 0,
  publie boolean not null default true,
  cree_le timestamptz not null default now()
);

-- Textes libres réutilisés sur le site (accroches, paragraphes...),
-- identifiés par une clé unique.
create table if not exists contenu_textes (
  cle text primary key,
  valeur text not null default '',
  maj_le timestamptz not null default now()
);

alter table contenu_items enable row level security;
alter table contenu_textes enable row level security;

create policy "Lecture publique des contenus publiés"
  on contenu_items for select
  to anon, authenticated
  using (publie = true);

create policy "Les administrateurs voient tout le contenu"
  on contenu_items for select to authenticated using (true);
create policy "Les administrateurs créent du contenu"
  on contenu_items for insert to authenticated with check (true);
create policy "Les administrateurs modifient le contenu"
  on contenu_items for update to authenticated using (true);
create policy "Les administrateurs suppriment le contenu"
  on contenu_items for delete to authenticated using (true);

create policy "Lecture publique des textes"
  on contenu_textes for select
  to anon, authenticated
  using (true);
create policy "Les administrateurs modifient les textes"
  on contenu_textes for update to authenticated using (true);
create policy "Les administrateurs créent des textes"
  on contenu_textes for insert to authenticated with check (true);

create index if not exists contenu_items_section_idx on contenu_items (section, ordre);

insert into storage.buckets (id, name, public)
values ('contenu-images', 'contenu-images', true)
on conflict (id) do nothing;

create policy "Lecture publique des images de contenu"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'contenu-images');
create policy "Les administrateurs uploadent des images de contenu"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'contenu-images');
create policy "Les administrateurs suppriment des images de contenu"
  on storage.objects for delete to authenticated
  using (bucket_id = 'contenu-images');

-- ============================================================
-- Données initiales : reprend tel quel le contenu déjà présent
-- sur le site, pour que rien ne disparaisse après la migration.
-- ============================================================

-- ---- Organigramme ----
insert into contenu_items (section, groupe, champs, ordre) values
('organigramme', 'Bureau', '{"nom":"Philippe Chorier","fonction":"Président","email":"philippe.chorier26@gmail.com","telephone":"06 32 45 90 83"}', 1),
('organigramme', 'Bureau', '{"nom":"Linda Decock","fonction":"Vice-présidente / Vice-trésorière","email":"lindadecock@hotmail.com","telephone":"06 62 28 22 73"}', 2),
('organigramme', 'Bureau', '{"nom":"Mathilde Boisserenq","fonction":"Trésorière","email":"mathildeb1610@gmail.com","telephone":"06 29 62 42 63"}', 3),
('organigramme', 'Bureau', '{"nom":"Isabelle Bréan Lopez","fonction":"Secrétaire générale","email":"isa.breanlopez0675@gmail.com","telephone":"06 61 49 90 13"}', 4),
('organigramme', 'Salariés', '{"nom":"Baptiste Cepeda","fonction":"Service civique","email":"","telephone":"07 69 62 43 81"}', 1),
('organigramme', 'Salariés', '{"nom":"Léticia Lopez","fonction":"Alternante NTC (marketing & événementiel sportif)","email":"leticia.bl3108@gmail.com","telephone":"06 98 93 93 40"}', 2),
('organigramme', 'Salariés', '{"nom":"Quentin Vigne","fonction":"Alternant BPJEPS","email":"quentin.vigne38@gmail.com","telephone":"07 83 86 16 70"}', 3),
('organigramme', 'École de Rugby', '{"nom":"Michel Pellerin","fonction":"Responsable EDR","email":"pellerin.michel@neuf.fr","telephone":"06 80 02 59 07"}', 1),
('organigramme', 'École de Rugby', '{"nom":"Thierry Cepeda","fonction":"Responsable EDR","email":"thierry.cepeda@gmail.com","telephone":"06 98 78 52 59"}', 2),
('organigramme', 'École de Rugby', '{"nom":"Mickael Brun","fonction":"Référent Baby / U6","email":"mbrun6211@gmail.com","telephone":"06 16 63 78 88"}', 3),
('organigramme', 'École de Rugby', '{"nom":"Johan Decock","fonction":"Référent U8","email":"","telephone":"06 51 83 33 54"}', 4),
('organigramme', 'École de Rugby', '{"nom":"Farid Bensalem","fonction":"Référent U12","email":"","telephone":"06 84 10 12 56"}', 5),
('organigramme', 'École de Rugby', '{"nom":"Sébastien Lardenois","fonction":"Référent U14","email":"seb.lard1@gmail.com","telephone":"06 75 20 03 76"}', 6),
('organigramme', 'Catégorie jeunes U16', '{"nom":"David Schoonheere","fonction":"Référent U16","email":"zz.top38@yahoo.fr","telephone":"06 78 40 04 62"}', 1),
('organigramme', 'Catégorie jeunes U16', '{"nom":"Mehdi Aziz","fonction":"Entraîneur avant","email":"","telephone":"06 33 82 77 73"}', 2),
('organigramme', 'Catégorie jeunes U19', '{"nom":"Lucas Romero","fonction":"Référent U19","email":"11romerolucas@gmail.com","telephone":"06 17 53 51 43"}', 1),
('organigramme', 'Catégorie jeunes U19', '{"nom":"Alexis Vout","fonction":"Entraîneur arrière","email":"alexis.vout@hotmail.fr","telephone":"06 88 77 22 26"}', 2),
('organigramme', 'Catégorie jeunes U19', '{"nom":"Giuseppe « Jo » Geronimo","fonction":"Entraîneur avant","email":"jojo_geronimo@msn.com","telephone":"06 83 44 00 06"}', 3),
('organigramme', 'Seniors', '{"nom":"Jean-Yves Morel","fonction":"Référent seniors","email":"jean-yves.morel@eaudegrenoble.fr","telephone":"06 12 32 06 37"}', 1),
('organigramme', 'Seniors', '{"nom":"Quentin Vigne","fonction":"Référent seniors — entraîneur arrière","email":"quentin.vigne38@gmail.com","telephone":"07 83 86 16 70"}', 2),
('organigramme', 'Seniors', '{"nom":"Fabien Meynaud","fonction":"Entraîneur réserve","email":"fabienmeynaud@hotmail.com","telephone":"06 76 75 59 22"}', 3),
('organigramme', 'Seniors', '{"nom":"Romain Paquet","fonction":"Entraîneur avant réserve","email":"romainpaquet38@gmail.com","telephone":"06 65 60 43 92"}', 4);

-- ---- Tarifs ----
insert into contenu_items (section, champs, ordre) values
('tarifs', '{"categorie":"Baby''s","prix":"50 €"}', 1),
('tarifs', '{"categorie":"U6","prix":"100 €"}', 2),
('tarifs', '{"categorie":"U8 / U10","prix":"160 €"}', 3),
('tarifs', '{"categorie":"U12 / U14-F15 / U16 / U19","prix":"170 €"}', 4),
('tarifs', '{"categorie":"Senior","prix":"200 €"}', 5),
('tarifs', '{"categorie":"Échigaulois","prix":"80 €"}', 6);

-- ---- Horaires d'entraînement ----
insert into contenu_items (section, champs, ordre) values
('horaires', '{"categorie":"Seniors +18 ans","jour":"Mardi","horaire":"19h00–21h00","lieu":"2 Rue Paul Cézanne"}', 1),
('horaires', '{"categorie":"Seniors +18 ans","jour":"Jeudi","horaire":"19h00–21h00","lieu":"2 Rue Paul Cézanne"}', 2),
('horaires', '{"categorie":"U19","jour":"Mercredi","horaire":"18h30–20h30","lieu":"108 Av. de la Galochère"}', 3),
('horaires', '{"categorie":"U19","jour":"Vendredi","horaire":"18h30–20h30","lieu":"2 Rue Paul Cézanne"}', 4),
('horaires', '{"categorie":"U16","jour":"Mercredi","horaire":"18h30–20h00","lieu":"2 Rue Paul Cézanne"}', 5),
('horaires', '{"categorie":"U16","jour":"Vendredi","horaire":"18h30–20h00","lieu":"108 Av. de la Galochère"}', 6),
('horaires', '{"categorie":"École de rugby U14/F15","jour":"Mercredi","horaire":"18h00–19h30","lieu":"2 Rue Paul Cézanne"}', 7),
('horaires', '{"categorie":"École de rugby U14/F15","jour":"Samedi","horaire":"10h30–12h30","lieu":"2 Rue Paul Cézanne"}', 8),
('horaires', '{"categorie":"École de rugby U12","jour":"Mardi","horaire":"17h30–19h00","lieu":"2 Rue Paul Cézanne"}', 9),
('horaires', '{"categorie":"École de rugby U12","jour":"Samedi","horaire":"10h00–12h00","lieu":"2 Rue Paul Cézanne"}', 10),
('horaires', '{"categorie":"École de rugby U10","jour":"Mardi","horaire":"17h30–19h00","lieu":"2 Rue Paul Cézanne"}', 11),
('horaires', '{"categorie":"École de rugby U10","jour":"Samedi","horaire":"10h00–12h00","lieu":"2 Rue Paul Cézanne"}', 12),
('horaires', '{"categorie":"École de rugby U8","jour":"Mardi","horaire":"17h30–19h00","lieu":"2 Rue Paul Cézanne"}', 13),
('horaires', '{"categorie":"École de rugby U8","jour":"Samedi","horaire":"10h00–11h30","lieu":"2 Rue Paul Cézanne"}', 14),
('horaires', '{"categorie":"École de rugby U6","jour":"Samedi","horaire":"11h00–12h00","lieu":"2 Rue Paul Cézanne"}', 15),
('horaires', '{"categorie":"Rugby Loisir (plaquage)","jour":"Lundi","horaire":"19h00–21h00","lieu":"2 Rue Paul Cézanne"}', 16),
('horaires', '{"categorie":"Baby Rugby","jour":"Samedi","horaire":"10h00–10h45","lieu":"Stade Edmond Racca"}', 17);

-- ---- Partenaires ----
insert into contenu_items (section, champs, ordre) values
('partenaires', '{"nom":"Intermarché","description":""}', 1),
('partenaires', '{"nom":"TDMI","description":"Démolition"}', 2),
('partenaires', '{"nom":"PI Group","description":"Accompagnement d''entreprises"}', 3),
('partenaires', '{"nom":"Auto Dauphiné","description":""}', 4),
('partenaires', '{"nom":"Rex-Rotary","description":"Impression & sécurité informatique"}', 5),
('partenaires', '{"nom":"La Furieuse","description":"Brasserie iséroise"}', 6),
('partenaires', '{"nom":"Immoprêt","description":"Courtier en prêt immobilier"}', 7),
('partenaires', '{"nom":"D.E.N.M.S","description":"Entreprise de nettoyage"}', 8),
('partenaires', '{"nom":"Riondet","description":"Marquage & sérigraphie"}', 9),
('partenaires', '{"nom":"Azur Adhésifs","description":"Imprimerie"}', 10),
('partenaires', '{"nom":"La Table des Pirates","description":"Parc de jeux"}', 11),
('partenaires', '{"nom":"Défis Pirates","description":"Jeu d''aventure"}', 12),
('partenaires', '{"nom":"Faure Transport","description":"Cars Faure — déplacements scolaires & sportifs"}', 13),
('partenaires', '{"nom":"Loiodice","description":"Vitrier-miroitier, 3 générations"}', 14),
('partenaires', '{"nom":"Le Pétrin de Papi","description":"Boulangerie"}', 15),
('partenaires', '{"nom":"Macron Sports","description":"Équipementier officiel"}', 16),
('partenaires', '{"nom":"Vinay Matériel","description":"Groupe COFAQ"}', 17),
('partenaires', '{"nom":"DTE Ingénierie","description":"Études thermiques & génie climatique"}', 18),
('partenaires', '{"nom":"Crédit Mutuel","description":""}', 19),
('partenaires', '{"nom":"McDonald''s","description":"Échirolles Centre-ville"}', 20),
('partenaires', '{"nom":"PIC Maintenance","description":"Maintenance industrielle"}', 21),
('partenaires', '{"nom":"POMO Hotels","description":"Hôtel-restaurant 4 étoiles"}', 22),
('partenaires', '{"nom":"EFOR Group","description":"Grenoble"}', 23),
('partenaires', '{"nom":"Les 3 Brasseurs","description":"Échirolles"}', 24);

-- ---- Équipes / catégories ----
insert into contenu_items (section, champs, ordre) values
('equipes', '{"badge":"Baby–U14","titre":"École de Rugby","description":"De Baby (dès 3 ans) à U14/F15, l''apprentissage du jeu et du plaisir dans la bonne humeur, encadré par des éducateurs diplômés. École labellisée 2 étoiles FFR.","mis_en_avant":false}', 1),
('equipes', '{"badge":"U16–U19","titre":"Cadets & Juniors","description":"La montée en puissance : intensité, technique et esprit d''équipe pour préparer la relève, en entente avec le XV du Drac.","mis_en_avant":false}', 2),
('equipes', '{"badge":"SEN","titre":"Seniors","description":"Le fer de lance du club le week-end en Régionale 2, portant fièrement les couleurs bleu et or d''Echirolles — équipe 1 et équipe Réserve.","mis_en_avant":true}', 3),
('equipes', '{"badge":"F15","titre":"Féminines","description":"Un rugby en plein essor à l''ALE, avec un nombre croissant de filles qui pratiquent, de l''école de rugby jusqu''en catégorie F15.","mis_en_avant":false}', 4),
('equipes', '{"badge":"LOI","titre":"Rugby Loisir","description":"Rugby avec plaquage, sans la pression du résultat — tous les lundis de 19h à 21h, pour le plaisir de courir, plaquer et partager un verre après.","mis_en_avant":false}', 5),
('equipes', '{"badge":"+35","titre":"Les Échigaulois","description":"Les anciens gardent la flamme sous ce nom bien trouvé, entre bons souvenirs et nouvelles histoires de club.","mis_en_avant":false}', 6);

-- ---- Palmarès ----
insert into contenu_items (section, champs, ordre) values
('palmares', '{"annee":"2025","titre":"Champion des Cagoulins"}', 1),
('palmares', '{"annee":"2018","titre":"Champion des Alpes Juniors « Balandrade »"}', 2),
('palmares', '{"annee":"2012","titre":"L''équipe Réserve devient Championne des Alpes Réserve Honneur"}', 3),
('palmares', '{"annee":"2010","titre":"Vice-champion des Alpes — qualification pour le championnat de France de Fédérale 3"}', 4),
('palmares', '{"annee":"2008","titre":"Champion des Alpes et demi-finaliste du championnat de France de Promotion d''Honneur"}', 5),
('palmares', '{"annee":"2001","titre":"Champion des Alpes « Honneur » (déjà en 1982)"}', 6),
('palmares', '{"annee":"2000","titre":"Champion des Alpes « Promotion d''Honneur » (à nouveau en 2008)"}', 7),
('palmares', '{"annee":"1999","titre":"Champion des Alpes « Première Série »"}', 8);

-- ---- Valeurs du club ----
insert into contenu_items (section, champs, ordre) values
('valeurs', '{"titre":"Combativité","description":"On ne lâche rien sur le terrain, jusqu''à la dernière minute et au dernier mètre."}', 1),
('valeurs', '{"titre":"Fraternité","description":"Une amicale laïque avant tout : la porte du club reste ouverte à toutes et tous."}', 2),
('valeurs', '{"titre":"Respect","description":"De l''arbitre, de l''adversaire, du maillot : les fondations du rugby depuis toujours."}', 3),
('valeurs', '{"titre":"Convivialité","description":"La troisième mi-temps n''est pas une option : c''est une institution au club-house."}', 4);

-- ---- Textes libres ----
insert into contenu_textes (cle, valeur) values
('hero_eyebrow', 'Amicale Laïque Echirolles Rugby — Depuis 1970 au cœur d''Echirolles'),
('hero_titre_1', 'La mêlée est'),
('hero_titre_2', 'une famille.'),
('hero_sous_titre', 'École de rugby, seniors, féminines & loisirs : un club, un maillot, une ambiance de troisième mi-temps qui ne s''arrête jamais.'),
('club_titre', 'L''esprit pub, les valeurs du rugby'),
('club_texte', 'Chez l''A.L.E. Rugby, on aime le jeu franc, les longues tables de troisième mi-temps et le maillot qu''on ne quitte jamais vraiment. Une amicale laïque avant tout : ouverte à tous, du premier pas sur le pré à la retraite sportive.'),
('pub_quote', 'Ici, on ne recrute pas des joueurs. On accueille des personnes qui repartent avec une deuxième famille.'),
('president_nom', 'Philippe Chorier'),
('president_texte', 'Prêt à lancer cette nouvelle saison de l''Amicale Laïque Echirolles Rugby, notre Président Philippe Chorier, qui vient d''être reconduit pour un nouveau mandat avec son bureau directeur, présente ses ambitions pour le club.'),
('histoire_titre', 'Un club du Bassin Grenoblois, fondé en 1970'),
('histoire_para1', 'Le club de l''Amicale Laïque Echirolles Rugby a été fondé en 1970 par trois personnes, dont Edmond Racca, emblématique personnalité du monde du rugby et de la ville d''Echirolles. Basé dans le quartier de la Commanderie, l''actuel stade de l''ALE Rugby porte d''ailleurs son nom.'),
('histoire_para2', 'Situé tout proche du club de rugby phare de Grenoble, l''ALE Rugby évolue en Ligue Auvergne Rhône-Alpes au niveau régional et a connu des montées en Fédérale 3 à plusieurs reprises dans son histoire — la dernière en date lors de la saison 2013-2014.'),
('histoire_para3', 'C''est aussi un club formateur, avec une école de rugby labellisée 2 étoiles par la FFR, pourvoyeuse de joueuses, joueurs et arbitres de haut niveau : Julien Puricelli (LOU Rugby), Romain Taofifenua (Équipe de France et Racing 92), Sébastien Taofifenua (LOU Rugby), Lucas Dupont (FC Grenoble), Hugo Dupont (USBPA), Laetitia Bobo (Équipe de France, Toulouse et Melbourne Rebels), Benoit Rousselet (arbitre Top 14), Lilian Rossi (FC Grenoble) et Yanis Gimenez (Niort Rugby), entre autres.'),
('rejoindre_texte', 'Porté par une équipe de bénévoles toujours disponibles, l''A.L.E. Rugby s''engage à vous faire vivre des souvenirs inoubliables durant vos années de rugby. Inscriptions ouvertes toute l''année, pour toutes les catégories.'),
('rejoindre_signature', 'Alors rejoignez les Écureuils d''Echirolles ! Allez''Chirolles 🏉');
