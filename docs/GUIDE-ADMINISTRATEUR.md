# Guide administrateur — Site de l'A.L.E. Rugby

Ce guide s'adresse à toute personne qui doit gérer les actualités du site,
maintenant ou dans plusieurs années. Aucune connaissance technique n'est
nécessaire pour les tâches du quotidien (section 1). Les sections
suivantes servent en cas de changement de bureau ou de problème.

---

## 1. Ajouter, modifier ou supprimer une actualité (usage courant)

1. Allez sur **[adresse-du-site]/admin** (par exemple `https://ale-rugby.netlify.app/admin`)
2. Connectez-vous avec votre email et votre mot de passe administrateur
3. Cliquez **"+ Nouvelle actualité"**
4. Remplissez le titre, le texte, ajoutez une image si vous voulez
5. Laissez la case "Publier immédiatement" cochée pour que ça apparaisse
   tout de suite sur le site — décochez-la si vous voulez d'abord
   l'enregistrer en brouillon et la publier plus tard
6. Cliquez **"Enregistrer"**

L'actualité apparaît automatiquement sur la page d'accueil du site, dans
la section "Actus", en quelques secondes.

Pour modifier ou supprimer une actualité existante, retournez sur
`/admin` : chaque actualité a un bouton "Modifier" et un bouton
"Supprimer" à côté d'elle.

---

## 1bis. Ajouter un album photo (ex. les photos d'un match)

1. Sur `/admin`, cliquez l'onglet **"Albums photos"** en haut du tableau
   de bord
2. Cliquez **"+ Nouvel album"**
3. Donnez un titre (ex. "Seniors vs RC Voiron — 12 octobre 2025"),
   une description si vous voulez, puis cliquez **"Enregistrer l'album"**
4. Une zone "Photos de l'album" apparaît en dessous : cliquez
   **"Choose Files"** (ou "Parcourir") et sélectionnez toutes les photos
   du match d'un coup (vous pouvez en sélectionner des dizaines à la
   fois)
5. Patientez pendant l'envoi (une barre de progression indique où ça en
   est) — les photos sont automatiquement redimensionnées pour ne pas
   prendre trop de place, sans perte visible à l'écran
6. Une fois terminé, les photos apparaissent en vignettes ; un clic sur
   la croix rouge d'une vignette la supprime individuellement

L'album apparaît automatiquement dans la section "Galerie" du site
public. Pour retirer un album entier, retournez sur la liste des
albums et cliquez **"Supprimer"**.

---

## 1ter. Modifier le contenu du site (organigramme, tarifs, horaires, partenaires, équipes, palmarès, textes)

Sur `/admin`, cliquez l'onglet **"Contenu du site"**. Une deuxième
rangée de boutons permet de choisir quoi modifier : Organigramme,
Tarifs, Horaires, Partenaires, Équipes, Palmarès, Valeurs du club,
ou Grands textes.

**Pour l'organigramme, les tarifs, les horaires, les partenaires,
les équipes ou le palmarès** (fonctionnement identique pour les six) :

1. Choisissez la catégorie en haut
2. La liste actuelle s'affiche — **"Modifier"** ou **"Supprimer"**
   à côté de chaque ligne, ou **"+ Ajouter"** pour une nouvelle ligne
3. Remplissez les champs (ils changent selon la catégorie choisie —
   par exemple Nom/Fonction/Email/Téléphone pour l'organigramme,
   Catégorie/Prix pour les tarifs)
4. Le champ **"Ordre d'affichage"** contrôle la position sur le site
   (1 = affiché en premier)
5. Décochez **"Visible sur le site"** pour masquer temporairement une
   ligne sans la supprimer (utile pour un coach qui part en cours de
   saison, par exemple)
6. **Enregistrer**

Pour l'organigramme spécifiquement, un champ **"Groupe / catégorie"**
permet de ranger chaque personne dans une rubrique (Bureau, Salariés,
École de Rugby, Seniors...). Tapez le nom exact d'un groupe existant
pour y ajouter quelqu'un, ou un nouveau nom pour créer une nouvelle
rubrique.

**Pour les grands textes** (accroche de la page d'accueil, histoire
du club, mot du président, etc.) :

1. Choisissez **"Grands textes"**
2. Chaque bloc de texte du site apparaît avec son propre champ et son
   propre bouton **"Enregistrer"** — modifiez le texte souhaité et
   cliquez juste le bouton à côté, pas besoin de tout enregistrer
   d'un coup

Tous ces changements apparaissent sur le site public en quelques
secondes, sans avoir besoin de toucher au code.

**Pages équipes** (une page détaillée par catégorie, accessible en
cliquant sur une carte dans la section "Équipes" du site) : mêmes
principes, avec en plus deux champs spéciaux :
- **Photo** : cliquez "Choisir un fichier" pour ajouter/remplacer la
  photo de la catégorie
- **Fiche d'inscription (PDF)** : idem pour ajouter le PDF téléchargeable

Le champ **"Identifiant technique"** (slug) doit être écrit exactement
pareil des deux côtés : dans l'onglet "Équipes" (pour la carte) et dans
l'onglet "Pages équipes" (pour la page détaillée), sinon le lien entre
les deux ne fonctionne pas. Utilisez uniquement des lettres minuscules
et des tirets, sans espace ni accent (ex : `seniors`, `cadets-juniors`).

**Documents** : fonctionne comme une actualité, mais pour ajouter un
fichier PDF téléchargeable (charte graphique, fiche d'inscription
générale, newsletter...). Chaque document ajouté apparaît automatiquement
sur la page `/documents.html` du site, accessible aussi via le bouton
"Demander une inscription".

**Partenaires** : chaque partenaire peut avoir un logo (facultatif).
Cliquez "Choisir un fichier" pour l'ajouter — peu importe le format ou
la couleur de fond du fichier d'origine (fond blanc, transparent, noir...),
il s'affiche automatiquement à une taille uniforme sur une petite tuile
foncée, pour que tous les logos aient le même rendu propre côte à côte.
Sans logo ajouté, le nom et la description du partenaire s'affichent en
texte à la place.

---

## 2. Donner l'accès à une nouvelle personne (ajouter un administrateur)

Cette étape se fait depuis **Supabase** (le service qui héberge les
données du site), pas depuis le site lui-même :

1. Allez sur [supabase.com](https://supabase.com) et connectez-vous avec
   le compte du club (demandez les identifiants à l'administrateur
   précédent, ou au bureau du club)
2. Ouvrez le projet du site
3. Dans le menu de gauche : **Authentication** → **Users**
4. Cliquez **"Add user"** → **"Create new user"**
5. Entrez l'email de la personne et un mot de passe temporaire
6. Cochez **"Auto Confirm User"** pour qu'elle puisse se connecter
   immédiatement
7. Communiquez-lui son email et son mot de passe temporaire — elle
   pourra se connecter sur `/admin` directement

Pour retirer un accès (une personne quitte le bureau), même endroit :
sélectionnez l'utilisateur et cliquez **"Delete user"**.

---

## 3. Activer le flux Instagram en direct

Le site est prêt à afficher les derniers posts Instagram automatiquement,
mais ça demande une configuration ponctuelle (5 minutes, à faire une
seule fois) :

1. Allez sur [lightwidget.com](https://lightwidget.com) et créez un
   compte gratuit
2. Connectez le compte Instagram du club
3. Créez un widget, personnalisez son apparence si besoin
4. LightWidget vous donne un petit bout de code à copier
   (une balise `<script>` avec une adresse en `.html`)
5. Ouvrez le fichier `index.html` du site, cherchez le commentaire
   `INSTAGRAM_WIDGET_ICI`, et remplacez le bloc `social-embed-placeholder`
   juste en dessous par le code fourni par LightWidget
6. Enregistrez et republiez le site (voir section 5)

Ce widget se met à jour tout seul à chaque nouveau post Instagram, sans
aucune autre action de votre part.

---

## 4. Où sont stockées les informations du site ?

Pour comprendre comment tout s'articule, sans avoir besoin de savoir
coder :

- **Le contenu qui change souvent** (actualités) est stocké dans une
  base de données **Supabase**, gratuite, et affiché automatiquement sur
  le site. L'espace de stockage gratuit permet plusieurs milliers de
  photos de match (elles sont compressées automatiquement à l'envoi).
  Si un jour ça ne suffit plus, Supabase propose des paliers payants
  très abordables (quelques euros par mois) — ça ne demande aucun
  changement sur le site, juste une mise à niveau du compte.
- **Le design et la structure du site** (couleurs, sections, textes fixes
  comme "Le Club" ou "Nos équipes") vivent dans le code du site, sur
  **GitHub** (`github.com/Romerol64/mon-premier-projet`). Modifier ce
  contenu demande de savoir toucher un peu au code, ou de faire appel à
  quelqu'un qui sait (un développeur, ou une IA comme Claude Code).
- **L'hébergement** (ce qui rend le site accessible sur Internet) est
  **Netlify**, gratuit, connecté automatiquement à GitHub : chaque
  modification du code republie le site tout seul en quelques secondes.

Trois services séparés, tous gratuits pour l'usage d'un club amateur,
tous accessibles avec un simple compte email/mot de passe. **Notez ces
identifiants dans un endroit sûr et partagé par le bureau** (pas
seulement dans la tête d'une seule personne) — c'est précisément ce qui
a posé problème sur les précédents sites du club.

---

## 5. Republier le site après une modification de code

Si quelqu'un modifie directement le code du site (nouvelle section,
nouveau texte fixe, correction), il suffit de pousser les changements sur
la branche du dépôt GitHub connectée à Netlify — la republication est
automatique, sans action manuelle supplémentaire.

---

## 6. En cas de problème

- **Je ne peux pas me connecter à `/admin`** → vérifiez l'email et le mot
  de passe. Si besoin, un administrateur existant peut réinitialiser le
  mot de passe depuis Supabase (Authentication → Users → sélectionner
  l'utilisateur → "Send password recovery").
- **Une actualité n'apparaît pas sur le site** → vérifiez que la case
  "Publier immédiatement" était bien cochée en l'enregistrant (sinon
  elle est en brouillon, invisible du public).
- **Le site est en panne / affiche une erreur** → vérifiez d'abord le
  tableau de bord Netlify (onglet "Deploys") pour voir si une
  publication a échoué. En dernier recours, contactez un développeur
  avec accès aux trois comptes (GitHub, Netlify, Supabase).
