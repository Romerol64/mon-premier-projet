// ============================================================
// Affiche les albums photos publiés sur la page d'accueil,
// avec une visionneuse (lightbox) au clic. Lecture seule.
// ============================================================

let albumsCache = [];

async function chargerGaleriePublique() {
  const conteneur = document.getElementById('galerie-liste');
  if (!conteneur) return;

  try {
    const { data: albums, error } = await supabaseClient
      .from('albums')
      .select('*, photos(id, image_url)')
      .eq('publie', true)
      .order('cree_le', { ascending: false });

    if (error || !albums || !albums.length) {
      conteneur.innerHTML = '<p class="actus-chargement">Aucun album publié pour le moment.</p>';
      return;
    }

    albumsCache = albums;
    conteneur.innerHTML = '';

    albums.forEach((album, index) => {
      const nbPhotos = album.photos ? album.photos.length : 0;
      const couverture = nbPhotos ? album.photos[0].image_url : '';
      const date = new Date(album.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

      const carte = document.createElement('button');
      carte.type = 'button';
      carte.className = 'album-card';
      carte.dataset.index = index;
      carte.innerHTML = `
        ${couverture ? `<img src="${couverture}" alt="" class="album-card-image" loading="lazy">` : '<div class="album-card-image album-card-image-vide"></div>'}
        <div class="album-card-overlay">
          <strong>${escapeHtmlGalerie(album.titre)}</strong>
          <span>${date} · ${nbPhotos} photo${nbPhotos > 1 ? 's' : ''}</span>
        </div>
      `;
      carte.addEventListener('click', () => ouvrirLightbox(index));
      conteneur.appendChild(carte);
    });
  } catch (e) {
    conteneur.innerHTML = '<p class="actus-chargement">Galerie indisponible pour le moment.</p>';
  }
}

function ouvrirLightbox(index) {
  const album = albumsCache[index];
  if (!album) return;

  document.getElementById('lightbox-titre').textContent = album.titre;
  const conteneurPhotos = document.getElementById('lightbox-photos');
  conteneurPhotos.innerHTML = (album.photos || [])
    .map((photo) => `<img src="${photo.image_url}" alt="" loading="lazy">`)
    .join('');

  const lightbox = document.getElementById('lightbox');
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function fermerLightbox() {
  document.getElementById('lightbox').hidden = true;
  document.body.style.overflow = '';
}

function escapeHtmlGalerie(texte) {
  const div = document.createElement('div');
  div.textContent = texte;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  chargerGaleriePublique();
  document.getElementById('lightbox-fermer')?.addEventListener('click', fermerLightbox);
  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') fermerLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fermerLightbox();
  });
});
