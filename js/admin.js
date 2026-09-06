// ============================================================
// Logique de la page d'administration (/admin)
// Connexion, liste des actualités, création / édition / suppression.
// ============================================================

const vueConnexion = document.getElementById('vue-connexion');
const vueTableauDeBord = document.getElementById('vue-tableau-de-bord');
const vueFormulaireActu = document.getElementById('vue-formulaire-actu');
const btnLogout = document.getElementById('btn-logout');

function afficherErreur(el, message) {
  el.textContent = message;
  el.hidden = false;
}
function cacherErreur(el) {
  el.hidden = true;
  el.textContent = '';
}

// ---------- Connexion ----------
async function verifierSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    afficherTableauDeBord();
  } else {
    afficherConnexion();
  }
}

function afficherConnexion() {
  vueConnexion.hidden = false;
  vueTableauDeBord.hidden = true;
  vueFormulaireActu.hidden = true;
  btnLogout.hidden = true;
}

function afficherTableauDeBord() {
  vueConnexion.hidden = true;
  vueTableauDeBord.hidden = false;
  vueFormulaireActu.hidden = true;
  btnLogout.hidden = false;
  chargerActualites();
}

document.getElementById('form-connexion').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const motDePasse = document.getElementById('mot-de-passe').value;
  const erreurEl = document.getElementById('erreur-connexion');
  cacherErreur(erreurEl);

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password: motDePasse });
  if (error) {
    afficherErreur(erreurEl, "Connexion impossible : email ou mot de passe incorrect.");
    return;
  }
  afficherTableauDeBord();
});

btnLogout.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  afficherConnexion();
});

// ---------- Liste des actualités ----------
async function chargerActualites() {
  const conteneur = document.getElementById('liste-actualites');
  conteneur.innerHTML = '<p class="admin-hint">Chargement…</p>';

  const { data, error } = await supabaseClient
    .from('actualites')
    .select('*')
    .order('cree_le', { ascending: false });

  if (error) {
    conteneur.innerHTML = '<p class="admin-erreur">Impossible de charger les actualités.</p>';
    return;
  }

  if (!data.length) {
    conteneur.innerHTML = '<p class="admin-hint">Aucune actualité pour l\'instant.</p>';
    return;
  }

  conteneur.innerHTML = '';
  data.forEach((actu) => {
    const carte = document.createElement('div');
    carte.className = 'admin-liste-item';
    carte.innerHTML = `
      ${actu.image_url ? `<img src="${actu.image_url}" alt="" class="admin-liste-thumb">` : '<div class="admin-liste-thumb admin-liste-thumb-vide"></div>'}
      <div class="admin-liste-info">
        <strong>${escapeHtml(actu.titre)}</strong>
        <span class="admin-liste-meta">${new Date(actu.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${actu.publie ? 'Publié' : 'Brouillon'}</span>
      </div>
      <div class="admin-liste-actions">
        <button class="btn btn-outline-dark btn-sm" data-action="editer" data-id="${actu.id}">Modifier</button>
        <button class="btn btn-danger btn-sm" data-action="supprimer" data-id="${actu.id}">Supprimer</button>
      </div>
    `;
    conteneur.appendChild(carte);
  });
}

function escapeHtml(texte) {
  const div = document.createElement('div');
  div.textContent = texte;
  return div.innerHTML;
}

document.getElementById('liste-actualites').addEventListener('click', async (e) => {
  const bouton = e.target.closest('button[data-action]');
  if (!bouton) return;
  const id = bouton.dataset.id;

  if (bouton.dataset.action === 'editer') {
    ouvrirFormulaireEdition(id);
  } else if (bouton.dataset.action === 'supprimer') {
    if (confirm('Supprimer définitivement cette actualité ?')) {
      await supabaseClient.from('actualites').delete().eq('id', id);
      chargerActualites();
    }
  }
});

// ---------- Formulaire création / édition ----------
const formActu = document.getElementById('form-actu');
const inputImage = document.getElementById('actu-image');
const apercuImage = document.getElementById('actu-image-apercu');
let imageUrlExistante = '';

document.getElementById('btn-nouvelle-actu').addEventListener('click', () => {
  ouvrirFormulaireCreation();
});
document.getElementById('btn-annuler-actu').addEventListener('click', () => {
  vueFormulaireActu.hidden = true;
  vueTableauDeBord.hidden = false;
});

function ouvrirFormulaireCreation() {
  document.getElementById('titre-formulaire-actu').textContent = 'Nouvelle actualité';
  formActu.reset();
  document.getElementById('actu-id').value = '';
  apercuImage.hidden = true;
  imageUrlExistante = '';
  cacherErreur(document.getElementById('erreur-actu'));
  vueTableauDeBord.hidden = true;
  vueFormulaireActu.hidden = false;
}

async function ouvrirFormulaireEdition(id) {
  const { data, error } = await supabaseClient.from('actualites').select('*').eq('id', id).single();
  if (error) return;

  document.getElementById('titre-formulaire-actu').textContent = 'Modifier l\'actualité';
  document.getElementById('actu-id').value = data.id;
  document.getElementById('actu-titre').value = data.titre;
  document.getElementById('actu-contenu').value = data.contenu;
  document.getElementById('actu-publie').checked = data.publie;
  imageUrlExistante = data.image_url || '';
  if (imageUrlExistante) {
    apercuImage.src = imageUrlExistante;
    apercuImage.hidden = false;
  } else {
    apercuImage.hidden = true;
  }
  cacherErreur(document.getElementById('erreur-actu'));
  vueTableauDeBord.hidden = true;
  vueFormulaireActu.hidden = false;
}

inputImage.addEventListener('change', () => {
  const fichier = inputImage.files[0];
  if (!fichier) return;
  apercuImage.src = URL.createObjectURL(fichier);
  apercuImage.hidden = false;
});

formActu.addEventListener('submit', async (e) => {
  e.preventDefault();
  const erreurEl = document.getElementById('erreur-actu');
  cacherErreur(erreurEl);

  const id = document.getElementById('actu-id').value;
  const titre = document.getElementById('actu-titre').value.trim();
  const contenu = document.getElementById('actu-contenu').value.trim();
  const publie = document.getElementById('actu-publie').checked;
  const fichierImage = inputImage.files[0];

  let imageUrl = imageUrlExistante;

  if (fichierImage) {
    const nomFichier = `${Date.now()}-${fichierImage.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const { error: erreurUpload } = await supabaseClient.storage
      .from('actualites-images')
      .upload(nomFichier, fichierImage);

    if (erreurUpload) {
      afficherErreur(erreurEl, "L'envoi de l'image a échoué. Réessayez ou continuez sans image.");
      return;
    }
    const { data: urlPublique } = supabaseClient.storage
      .from('actualites-images')
      .getPublicUrl(nomFichier);
    imageUrl = urlPublique.publicUrl;
  }

  const { data: session } = await supabaseClient.auth.getSession();
  const enregistrement = {
    titre,
    contenu,
    image_url: imageUrl || null,
    publie,
    auteur_email: session.session?.user?.email || null,
  };

  const requete = id
    ? supabaseClient.from('actualites').update(enregistrement).eq('id', id)
    : supabaseClient.from('actualites').insert(enregistrement);

  const { error } = await requete;
  if (error) {
    afficherErreur(erreurEl, "Impossible d'enregistrer l'actualité. Réessayez.");
    return;
  }

  vueFormulaireActu.hidden = true;
  vueTableauDeBord.hidden = false;
  chargerActualites();
});

verifierSession();
