// ============================================================
// Page de détail d'une catégorie (equipe.html?cat=<slug>)
// ============================================================

function echapperHtmlEquipe(texte) {
  const div = document.createElement('div');
  div.textContent = texte == null ? '' : String(texte);
  return div.innerHTML;
}

function texteMultiligne(texte) {
  return echapperHtmlEquipe(texte).replace(/\n/g, '<br>');
}

async function chargerPageCategorie() {
  const parametres = new URLSearchParams(window.location.search);
  const slug = parametres.get('cat');
  const chargement = document.getElementById('categorie-chargement');
  const introuvable = document.getElementById('categorie-introuvable');
  const contenu = document.getElementById('categorie-contenu');

  if (!slug) {
    chargement.hidden = true;
    introuvable.hidden = false;
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('contenu_items')
      .select('champs')
      .eq('section', 'pages_equipe')
      .eq('publie', true)
      .eq('champs->>slug', slug)
      .maybeSingle();

    if (error || !data) {
      chargement.hidden = true;
      introuvable.hidden = false;
      return;
    }

    const c = data.champs || {};
    document.title = `${c.titre || 'Catégorie'} — Amicale Laïque Echirolles Rugby`;
    document.getElementById('cat-titre').textContent = c.titre || '';
    document.getElementById('cat-licence').textContent = c.licence_prix || 'Voir la grille tarifaire du club.';
    document.getElementById('cat-lieu').textContent = c.lieu || 'À confirmer avec le bureau.';
    document.getElementById('cat-horaires').innerHTML = texteMultiligne(c.horaires || 'À confirmer avec le bureau.');
    document.getElementById('cat-educateurs').innerHTML = texteMultiligne(c.educateurs || 'À confirmer avec le bureau.');

    if (c.effectif) {
      document.getElementById('bloc-effectif').hidden = false;
      document.getElementById('cat-effectif').textContent = c.effectif;
    }
    if (c.numeros_importants) {
      document.getElementById('bloc-numeros').hidden = false;
      document.getElementById('cat-numeros').innerHTML = texteMultiligne(c.numeros_importants);
    }
    if (c.photo_url) {
      const img = document.getElementById('cat-photo');
      img.src = c.photo_url;
      img.hidden = false;
    }
    if (c.fiche_inscription_url) {
      document.getElementById('cat-fiche-bloc').hidden = false;
      document.getElementById('cat-fiche-lien').href = c.fiche_inscription_url;
    }

    chargement.hidden = true;
    contenu.hidden = false;
  } catch (e) {
    chargement.hidden = true;
    introuvable.hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  chargerPageCategorie();
});
