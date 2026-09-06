// ============================================================
// Page "Documents" : liste tous les documents publiés
// (fiches d'inscription, charte graphique, newsletters...)
// ============================================================

function echapperHtmlDoc(texte) {
  const div = document.createElement('div');
  div.textContent = texte == null ? '' : String(texte);
  return div.innerHTML;
}

async function chargerDocuments() {
  const conteneur = document.getElementById('documents-liste');

  try {
    const { data, error } = await supabaseClient
      .from('contenu_items')
      .select('champs')
      .eq('section', 'documents')
      .eq('publie', true)
      .order('ordre', { ascending: true });

    if (error || !data || !data.length) {
      conteneur.innerHTML = '<p class="categorie-chargement">Aucun document disponible pour le moment. Contactez le bureau du club.</p>';
      return;
    }

    conteneur.innerHTML = data.map(({ champs }) => `
      <a class="document-card" href="${escapeAttrDoc(champs.fichier_url)}" target="_blank" rel="noopener">
        <span class="document-icone" aria-hidden="true">📄</span>
        <div>
          <strong>${echapperHtmlDoc(champs.titre)}</strong>
          ${champs.description ? `<span>${echapperHtmlDoc(champs.description)}</span>` : ''}
        </div>
      </a>
    `).join('');
  } catch (e) {
    conteneur.innerHTML = '<p class="categorie-chargement">Documents indisponibles pour le moment.</p>';
  }
}

function escapeAttrDoc(val) {
  return echapperHtmlDoc(String(val || '#')).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  chargerDocuments();
});
