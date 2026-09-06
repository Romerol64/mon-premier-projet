// ============================================================
// Charge le contenu éditable (textes + listes) depuis Supabase et
// remplace le contenu par défaut du HTML quand des données existent.
// Si Supabase n'est pas configuré ou vide, le contenu déjà présent
// dans le HTML reste affiché tel quel : le site ne casse jamais.
// ============================================================

const ICONES_VALEURS = [
  '<svg viewBox="0 0 48 48"><path d="M24 4 L44 12 V24 C44 34 36 42 24 44 C12 42 4 34 4 24 V12 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 16 L28 24 L24 32 L20 24 Z" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 48 48"><circle cx="16" cy="18" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="32" cy="18" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M4 42 C4 32 10 28 16 28 C22 28 28 32 28 42" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M22 42 C22 32 26 28 32 28 C38 28 44 32 44 42" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
  '<svg viewBox="0 0 48 48"><path d="M24 6 L28 20 L42 20 L31 29 L35 43 L24 34 L13 43 L17 29 L6 20 L20 20 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 48 48"><path d="M10 30 V16 H38 V30" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M6 30 H42 L38 40 H10 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><line x1="24" y1="16" x2="24" y2="8" stroke="currentColor" stroke-width="2.5"/></svg>',
];

function echapperHtml(texte) {
  const div = document.createElement('div');
  div.textContent = texte == null ? '' : String(texte);
  return div.innerHTML;
}

async function chargerTextes() {
  try {
    const { data, error } = await supabaseClient.from('contenu_textes').select('cle, valeur');
    if (error || !data) return;
    const valeurs = Object.fromEntries(data.map((t) => [t.cle, t.valeur]));
    document.querySelectorAll('[data-contenu]').forEach((el) => {
      const cle = el.dataset.contenu;
      if (valeurs[cle] != null && valeurs[cle] !== '') {
        el.textContent = valeurs[cle];
      }
    });
  } catch (e) { /* on garde le contenu par défaut du HTML */ }
}

async function chargerItems(section) {
  try {
    const { data, error } = await supabaseClient
      .from('contenu_items')
      .select('*')
      .eq('section', section)
      .eq('publie', true)
      .order('ordre', { ascending: true });
    if (error || !data || !data.length) return null;
    return data;
  } catch (e) {
    return null;
  }
}

async function chargerValeurs() {
  const items = await chargerItems('valeurs');
  const conteneur = document.getElementById('values-grid');
  if (!items || !conteneur) return;
  conteneur.innerHTML = items.map((item, i) => `
    <article class="value-card">
      <div class="value-icon" aria-hidden="true">${ICONES_VALEURS[i % ICONES_VALEURS.length]}</div>
      <h3>${echapperHtml(item.champs.titre)}</h3>
      <p>${echapperHtml(item.champs.description)}</p>
    </article>
  `).join('');
}

async function chargerOrganigramme() {
  const items = await chargerItems('organigramme');
  const conteneur = document.getElementById('organigramme-groupes');
  if (!items || !conteneur) return;

  const groupes = {};
  items.forEach((item) => {
    const g = item.groupe || 'Autres';
    if (!groupes[g]) groupes[g] = [];
    groupes[g].push(item);
  });

  conteneur.innerHTML = Object.entries(groupes).map(([groupe, membres]) => `
    <div class="organigramme-groupe">
      <h3>${echapperHtml(groupe)}</h3>
      <ul class="organigramme-liste">
        ${membres.map((m) => `
          <li>
            <strong>${echapperHtml(m.champs.nom)}</strong>
            <span>${echapperHtml(m.champs.fonction)}</span>
            ${m.champs.email ? `<a href="mailto:${echapperHtml(m.champs.email)}">${echapperHtml(m.champs.email)}</a>` : ''}
            ${m.champs.telephone ? `<a href="tel:${echapperHtml((m.champs.telephone || '').replace(/\s/g, ''))}">${echapperHtml(m.champs.telephone)}</a>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

async function chargerEquipes() {
  const items = await chargerItems('equipes');
  const conteneur = document.getElementById('teams-grid');
  if (!items || !conteneur) return;
  conteneur.innerHTML = items.map((item) => {
    const lien = item.champs.slug ? `equipe.html?cat=${encodeURIComponent(item.champs.slug)}` : null;
    return `
    <a class="team-card${item.champs.mis_en_avant ? ' featured' : ''}"${lien ? ` href="${lien}"` : ' style="cursor:default"'}>
      <span class="team-number">${echapperHtml(item.champs.badge)}</span>
      <h3>${echapperHtml(item.champs.titre)}</h3>
      <p>${echapperHtml(item.champs.description)}</p>
      ${lien ? '<span class="team-card-cta">Voir la fiche complète →</span>' : ''}
    </a>
  `;
  }).join('');
}

async function chargerTarifs() {
  const items = await chargerItems('tarifs');
  const conteneur = document.getElementById('tarifs-tbody');
  if (!items || !conteneur) return;
  conteneur.innerHTML = items.map((item) => `
    <tr><td>${echapperHtml(item.champs.categorie)}</td><td>${echapperHtml(item.champs.prix)}</td></tr>
  `).join('');
}

async function chargerHoraires() {
  const items = await chargerItems('horaires');
  const conteneur = document.getElementById('horaires-tbody');
  if (!items || !conteneur) return;
  conteneur.innerHTML = items.map((item) => `
    <tr>
      <td>${echapperHtml(item.champs.categorie)}</td>
      <td>${echapperHtml(item.champs.jour)}</td>
      <td>${echapperHtml(item.champs.horaire)}</td>
      <td>${echapperHtml(item.champs.lieu)}</td>
    </tr>
  `).join('');
}

async function chargerPartenaires() {
  const items = await chargerItems('partenaires');
  const conteneur = document.getElementById('sponsors-grid');
  if (!items || !conteneur) return;
  conteneur.innerHTML = items.map((item) => {
    if (item.champs.logo_url) {
      return `
        <div class="sponsor-card sponsor-card-logo" title="${echapperHtml(item.champs.nom)}${item.champs.description ? ' — ' + item.champs.description : ''}">
          <img src="${item.champs.logo_url}" alt="${echapperHtml(item.champs.nom)}" loading="lazy">
        </div>
      `;
    }
    return `
      <div class="sponsor-card">
        <strong>${echapperHtml(item.champs.nom)}</strong>
        ${item.champs.description ? `<span>${echapperHtml(item.champs.description)}</span>` : ''}
      </div>
    `;
  }).join('');
}

async function chargerPalmares() {
  const items = await chargerItems('palmares');
  const conteneur = document.getElementById('palmares-liste');
  if (!items || !conteneur) return;
  conteneur.innerHTML = items.map((item) => `
    <li><span class="palmares-annee">${echapperHtml(item.champs.annee)}</span>${echapperHtml(item.champs.titre)}</li>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  chargerTextes();
  chargerValeurs();
  chargerOrganigramme();
  chargerEquipes();
  chargerTarifs();
  chargerHoraires();
  chargerPartenaires();
  chargerPalmares();
});
