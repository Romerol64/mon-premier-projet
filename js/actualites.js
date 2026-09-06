// ============================================================
// Affiche les actualités publiées sur la page d'accueil.
// Lecture seule : aucune connexion requise, aucune donnée sensible.
// ============================================================

async function chargerActualitesPubliques() {
  const conteneur = document.getElementById('actus-liste');
  if (!conteneur) return;

  try {
    const { data, error } = await supabaseClient
      .from('actualites')
      .select('*')
      .eq('publie', true)
      .order('cree_le', { ascending: false })
      .limit(6);

    if (error || !data || !data.length) {
      conteneur.innerHTML = '<p class="actus-chargement">Aucune actualité publiée pour le moment.</p>';
      return;
    }

    conteneur.innerHTML = '';
    data.forEach((actu) => {
      const carte = document.createElement('article');
      carte.className = 'actu-card';

      const date = new Date(actu.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      const texteComplet = actu.contenu || '';
      const estLong = texteComplet.length > 220;
      const texteCourt = estLong ? texteComplet.slice(0, 220).trim() + '…' : texteComplet;

      carte.innerHTML = `
        ${actu.image_url ? `<img src="${actu.image_url}" alt="" class="actu-card-image" loading="lazy">` : ''}
        <div class="actu-card-body">
          <span class="actu-card-date">${date}</span>
          <h3>${escapeHtmlActu(actu.titre)}</h3>
          <p class="actu-card-texte">${escapeHtmlActu(texteCourt)}</p>
          ${estLong ? `<button class="actu-card-lire-plus" type="button">Lire la suite</button>` : ''}
        </div>
      `;

      if (estLong) {
        const bouton = carte.querySelector('.actu-card-lire-plus');
        const paragraphe = carte.querySelector('.actu-card-texte');
        bouton.addEventListener('click', () => {
          paragraphe.textContent = texteComplet;
          bouton.remove();
        });
      }

      conteneur.appendChild(carte);
    });
  } catch (e) {
    conteneur.innerHTML = '<p class="actus-chargement">Actualités indisponibles pour le moment.</p>';
  }
}

function escapeHtmlActu(texte) {
  const div = document.createElement('div');
  div.textContent = texte;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', chargerActualitesPubliques);
