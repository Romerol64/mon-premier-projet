// ============================================================
// Gestion des albums photos (/admin) : liste, création, édition,
// ajout / suppression de photos, suppression d'album.
// ============================================================

const vueFormulaireAlbum = document.getElementById('vue-formulaire-album');
const formAlbum = document.getElementById('form-album');
const sectionPhotosAlbum = document.getElementById('section-photos-album');
const inputPhotosAlbum = document.getElementById('album-photos-input');
const grillePhotosAlbum = document.getElementById('grille-photos-album');
const progressionPhotos = document.getElementById('album-photos-progression');

const BUCKET_ALBUMS = 'albums-images';

function cheminDepuisUrlPublique(url, bucket) {
  const marqueur = `/${bucket}/`;
  const index = url.indexOf(marqueur);
  return index === -1 ? null : url.slice(index + marqueur.length);
}

// ---------- Liste des albums ----------
async function chargerAlbums() {
  const conteneur = document.getElementById('liste-albums');
  conteneur.innerHTML = '<p class="admin-hint">Chargement…</p>';

  const { data, error } = await supabaseClient
    .from('albums')
    .select('*, photos(id)')
    .order('cree_le', { ascending: false });

  if (error) {
    conteneur.innerHTML = '<p class="admin-erreur">Impossible de charger les albums.</p>';
    return;
  }

  if (!data.length) {
    conteneur.innerHTML = '<p class="admin-hint">Aucun album pour l\'instant.</p>';
    return;
  }

  conteneur.innerHTML = '';
  data.forEach((album) => {
    const nbPhotos = album.photos ? album.photos.length : 0;
    const carte = document.createElement('div');
    carte.className = 'admin-liste-item';
    carte.innerHTML = `
      <div class="admin-liste-thumb admin-liste-thumb-vide admin-liste-thumb-album">${nbPhotos}</div>
      <div class="admin-liste-info">
        <strong>${escapeHtml(album.titre)}</strong>
        <span class="admin-liste-meta">${new Date(album.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${nbPhotos} photo${nbPhotos > 1 ? 's' : ''} · ${album.publie ? 'Publié' : 'Brouillon'}</span>
      </div>
      <div class="admin-liste-actions">
        <button class="btn btn-outline-dark btn-sm" data-action="editer-album" data-id="${album.id}">Gérer</button>
        <button class="btn btn-danger btn-sm" data-action="supprimer-album" data-id="${album.id}">Supprimer</button>
      </div>
    `;
    conteneur.appendChild(carte);
  });
}

document.getElementById('liste-albums').addEventListener('click', async (e) => {
  const bouton = e.target.closest('button[data-action]');
  if (!bouton) return;
  const id = bouton.dataset.id;

  if (bouton.dataset.action === 'editer-album') {
    ouvrirFormulaireEditionAlbum(id);
  } else if (bouton.dataset.action === 'supprimer-album') {
    if (confirm('Supprimer définitivement cet album et toutes ses photos ?')) {
      await supprimerAlbumComplet(id);
      chargerAlbums();
    }
  }
});

async function supprimerAlbumComplet(id) {
  const { data: photos } = await supabaseClient.from('photos').select('image_url').eq('album_id', id);
  if (photos && photos.length) {
    const chemins = photos
      .map((p) => cheminDepuisUrlPublique(p.image_url, BUCKET_ALBUMS))
      .filter(Boolean);
    if (chemins.length) {
      await supabaseClient.storage.from(BUCKET_ALBUMS).remove(chemins);
    }
  }
  // La suppression de l'album entraîne automatiquement celle de ses photos (ON DELETE CASCADE)
  await supabaseClient.from('albums').delete().eq('id', id);
}

// ---------- Formulaire album ----------
document.getElementById('btn-nouvel-album').addEventListener('click', () => {
  ouvrirFormulaireCreationAlbum();
});
document.getElementById('btn-annuler-album').addEventListener('click', () => {
  vueFormulaireAlbum.hidden = true;
  vueTableauDeBord.hidden = false;
  chargerAlbums();
});

function ouvrirFormulaireCreationAlbum() {
  document.getElementById('titre-formulaire-album').textContent = 'Nouvel album';
  formAlbum.reset();
  document.getElementById('album-id').value = '';
  document.getElementById('btn-annuler-album').textContent = 'Annuler';
  cacherErreur(document.getElementById('erreur-album'));
  document.getElementById('succes-album').hidden = true;
  sectionPhotosAlbum.hidden = true;
  grillePhotosAlbum.innerHTML = '';
  vueTableauDeBord.hidden = true;
  vueFormulaireAlbum.hidden = false;
}

async function ouvrirFormulaireEditionAlbum(id) {
  const { data, error } = await supabaseClient
    .from('albums')
    .select('*, photos(id, image_url)')
    .eq('id', id)
    .single();
  if (error) return;

  document.getElementById('titre-formulaire-album').textContent = 'Gérer l\'album';
  document.getElementById('album-id').value = data.id;
  document.getElementById('album-titre').value = data.titre;
  document.getElementById('album-description').value = data.description || '';
  document.getElementById('album-publie').checked = data.publie;
  document.getElementById('btn-annuler-album').textContent = 'Retour à la liste';
  cacherErreur(document.getElementById('erreur-album'));
  document.getElementById('succes-album').hidden = true;

  sectionPhotosAlbum.hidden = false;
  afficherGrillePhotos(data.photos || []);

  vueTableauDeBord.hidden = true;
  vueFormulaireAlbum.hidden = false;
}

formAlbum.addEventListener('submit', async (e) => {
  e.preventDefault();
  const erreurEl = document.getElementById('erreur-album');
  const succesEl = document.getElementById('succes-album');
  cacherErreur(erreurEl);
  succesEl.hidden = true;

  const id = document.getElementById('album-id').value;
  const enregistrement = {
    titre: document.getElementById('album-titre').value.trim(),
    description: document.getElementById('album-description').value.trim() || null,
    publie: document.getElementById('album-publie').checked,
  };

  if (id) {
    const { error } = await supabaseClient.from('albums').update(enregistrement).eq('id', id);
    if (error) {
      afficherErreur(erreurEl, "Impossible d'enregistrer l'album. Réessayez.");
      return;
    }
    succesEl.textContent = '✓ Modifications enregistrées.';
    succesEl.hidden = false;
    chargerAlbums();
  } else {
    const { data, error } = await supabaseClient.from('albums').insert(enregistrement).select().single();
    if (error) {
      afficherErreur(erreurEl, "Impossible de créer l'album. Réessayez.");
      return;
    }
    document.getElementById('album-id').value = data.id;
    document.getElementById('titre-formulaire-album').textContent = 'Gérer l\'album';
    document.getElementById('btn-annuler-album').textContent = 'Retour à la liste';
    succesEl.textContent = '✓ Album enregistré — ajoutez des photos ci-dessous, ou cliquez "Retour à la liste".';
    succesEl.hidden = false;
    sectionPhotosAlbum.hidden = false;
  }
});

// ---------- Photos de l'album ----------
function afficherGrillePhotos(photos) {
  if (!photos.length) {
    grillePhotosAlbum.innerHTML = '<p class="admin-hint">Aucune photo pour l\'instant.</p>';
    return;
  }
  grillePhotosAlbum.innerHTML = '';
  photos.forEach((photo) => {
    const vignette = document.createElement('div');
    vignette.className = 'admin-photo-vignette';
    vignette.innerHTML = `
      <img src="${photo.image_url}" alt="">
      <button type="button" class="admin-photo-supprimer" data-id="${photo.id}" data-url="${photo.image_url}" aria-label="Supprimer cette photo">✕</button>
    `;
    grillePhotosAlbum.appendChild(vignette);
  });
}

grillePhotosAlbum.addEventListener('click', async (e) => {
  const bouton = e.target.closest('.admin-photo-supprimer');
  if (!bouton) return;
  if (!confirm('Supprimer cette photo ?')) return;

  const chemin = cheminDepuisUrlPublique(bouton.dataset.url, BUCKET_ALBUMS);
  if (chemin) await supabaseClient.storage.from(BUCKET_ALBUMS).remove([chemin]);
  await supabaseClient.from('photos').delete().eq('id', bouton.dataset.id);

  const albumId = document.getElementById('album-id').value;
  const { data } = await supabaseClient.from('photos').select('id, image_url').eq('album_id', albumId);
  afficherGrillePhotos(data || []);
});

inputPhotosAlbum.addEventListener('change', async () => {
  const fichiers = Array.from(inputPhotosAlbum.files);
  if (!fichiers.length) return;

  const albumId = document.getElementById('album-id').value;
  progressionPhotos.hidden = false;

  for (let i = 0; i < fichiers.length; i++) {
    progressionPhotos.textContent = `Envoi de la photo ${i + 1} sur ${fichiers.length}…`;
    try {
      const fichierCompresse = await compresserImage(fichiers[i]);
      const nomFichier = `${albumId}/${Date.now()}-${i}-${fichierCompresse.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const { error: erreurUpload } = await supabaseClient.storage
        .from(BUCKET_ALBUMS)
        .upload(nomFichier, fichierCompresse);
      if (erreurUpload) continue;

      const { data: urlPublique } = supabaseClient.storage.from(BUCKET_ALBUMS).getPublicUrl(nomFichier);
      await supabaseClient.from('photos').insert({ album_id: albumId, image_url: urlPublique.publicUrl });
    } catch (e) {
      // On continue avec les photos suivantes même si l'une d'elles échoue
    }
  }

  progressionPhotos.hidden = true;
  inputPhotosAlbum.value = '';
  const { data } = await supabaseClient.from('photos').select('id, image_url').eq('album_id', albumId);
  afficherGrillePhotos(data || []);
});
