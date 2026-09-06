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
  le site.
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
