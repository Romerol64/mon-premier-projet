// ============================================================
// Gestion générique du "Contenu du site" (/admin) : organigramme,
// tarifs, horaires, partenaires, équipes, palmarès, valeurs, et les
// grands textes du site. Un seul moteur générique pour les listes,
// piloté par SECTIONS_CONFIG ci-dessous.
// ============================================================

const SECTIONS_CONFIG = {
  organigramme: {
    label: 'un membre',
    avecGroupe: true,
    groupePlaceholder: 'Ex : Bureau, Salariés, École de Rugby, Seniors...',
    champs: [
      { cle: 'nom', label: 'Nom', type: 'text', requis: true },
      { cle: 'fonction', label: 'Fonction', type: 'text', requis: true },
      { cle: 'email', label: 'Email (facultatif)', type: 'email' },
      { cle: 'telephone', label: 'Téléphone (facultatif)', type: 'text' },
    ],
    resume: (c) => `${c.nom || '(sans nom)'} — ${c.fonction || ''}`,
  },
  tarifs: {
    label: 'un tarif',
    avecGroupe: false,
    champs: [
      { cle: 'categorie', label: 'Catégorie', type: 'text', requis: true },
      { cle: 'prix', label: 'Prix', type: 'text', requis: true, placeholder: 'Ex : 170 €' },
    ],
    resume: (c) => `${c.categorie || ''} — ${c.prix || ''}`,
  },
  horaires: {
    label: 'un créneau',
    avecGroupe: false,
    champs: [
      { cle: 'categorie', label: 'Catégorie', type: 'text', requis: true },
      { cle: 'jour', label: 'Jour', type: 'text', requis: true, placeholder: 'Ex : Mardi' },
      { cle: 'horaire', label: 'Horaire', type: 'text', requis: true, placeholder: 'Ex : 19h00–21h00' },
      { cle: 'lieu', label: 'Lieu', type: 'text', requis: true },
    ],
    resume: (c) => `${c.categorie || ''} — ${c.jour || ''} ${c.horaire || ''}`,
  },
  partenaires: {
    label: 'un partenaire',
    avecGroupe: false,
    champs: [
      { cle: 'nom', label: 'Nom du partenaire', type: 'text', requis: true },
      { cle: 'description', label: 'Description (facultatif)', type: 'text' },
    ],
    resume: (c) => c.nom || '(sans nom)',
  },
  equipes: {
    label: 'une catégorie d\'équipe',
    avecGroupe: false,
    champs: [
      { cle: 'badge', label: 'Badge (ex : U16–U19)', type: 'text', requis: true },
      { cle: 'titre', label: 'Titre', type: 'text', requis: true },
      { cle: 'description', label: 'Description', type: 'textarea', requis: true },
      { cle: 'mis_en_avant', label: 'Mettre en avant (style doré)', type: 'checkbox' },
      { cle: 'slug', label: 'Identifiant technique de la page catégorie (sans espace ni accent, ex : seniors)', type: 'text' },
    ],
    resume: (c) => `${c.badge || ''} — ${c.titre || ''}`,
  },
  palmares: {
    label: 'un titre',
    avecGroupe: false,
    champs: [
      { cle: 'annee', label: 'Année', type: 'text', requis: true },
      { cle: 'titre', label: 'Titre', type: 'text', requis: true },
    ],
    resume: (c) => `${c.annee || ''} — ${c.titre || ''}`,
  },
  valeurs: {
    label: 'une valeur',
    avecGroupe: false,
    champs: [
      { cle: 'titre', label: 'Titre', type: 'text', requis: true },
      { cle: 'description', label: 'Description', type: 'textarea', requis: true },
    ],
    resume: (c) => c.titre || '(sans titre)',
  },
  pages_equipe: {
    label: 'une page catégorie',
    avecGroupe: false,
    champs: [
      { cle: 'slug', label: 'Identifiant technique (doit correspondre exactement au champ "slug" de la catégorie dans l\'onglet Équipes)', type: 'text', requis: true },
      { cle: 'titre', label: 'Titre de la page', type: 'text', requis: true },
      { cle: 'photo', label: 'Photo de la catégorie', type: 'image', cleUrl: 'photo_url' },
      { cle: 'licence_prix', label: 'Prix de la licence', type: 'text' },
      { cle: 'horaires', label: 'Horaires d\'entraînement', type: 'textarea' },
      { cle: 'lieu', label: 'Lieu(x) d\'entraînement', type: 'text' },
      { cle: 'educateurs', label: 'Éducateurs / coachs', type: 'textarea' },
      { cle: 'effectif', label: 'Effectif (facultatif)', type: 'text' },
      { cle: 'numeros_importants', label: 'Numéros importants (facultatif)', type: 'textarea' },
      { cle: 'fiche_inscription', label: 'Fiche d\'inscription (PDF)', type: 'pdf', cleUrl: 'fiche_inscription_url' },
    ],
    resume: (c) => c.titre || c.slug || '(sans titre)',
  },
  documents: {
    label: 'un document',
    avecGroupe: false,
    champs: [
      { cle: 'titre', label: 'Titre du document', type: 'text', requis: true },
      { cle: 'description', label: 'Description (facultatif)', type: 'text' },
      { cle: 'fichier', label: 'Fichier (PDF)', type: 'pdf', cleUrl: 'fichier_url' },
    ],
    resume: (c) => c.titre || '(sans titre)',
  },
};

const TEXTES_CONFIG = [
  { cle: 'hero_eyebrow', label: "Page d'accueil — petite accroche au-dessus du grand titre" },
  { cle: 'hero_titre_1', label: "Page d'accueil — titre principal (ligne 1)" },
  { cle: 'hero_titre_2', label: "Page d'accueil — titre principal (ligne 2, en couleur or)" },
  { cle: 'hero_sous_titre', label: "Page d'accueil — sous-titre" },
  { cle: 'club_titre', label: 'Section "Le Club" — titre' },
  { cle: 'club_texte', label: 'Section "Le Club" — texte d\'introduction' },
  { cle: 'pub_quote', label: 'Section "Le Club" — citation' },
  { cle: 'president_nom', label: 'Mot du président — nom' },
  { cle: 'president_texte', label: 'Mot du président — texte' },
  { cle: 'histoire_titre', label: 'Histoire — titre' },
  { cle: 'histoire_para1', label: 'Histoire — paragraphe 1' },
  { cle: 'histoire_para2', label: 'Histoire — paragraphe 2' },
  { cle: 'histoire_para3', label: 'Histoire — paragraphe 3' },
  { cle: 'rejoindre_texte', label: '"Rejoindre le club" — texte d\'introduction' },
  { cle: 'rejoindre_signature', label: '"Rejoindre le club" — signature finale' },
];

let sectionContenuActive = 'organigramme';
let contenuTabsInitialises = false;

function initialiserContenu() {
  if (!contenuTabsInitialises) {
    document.querySelectorAll('.admin-tab-contenu').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-contenu').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        sectionContenuActive = tab.dataset.section;
        afficherVueSectionContenu();
      });
    });
    document.getElementById('btn-nouvel-item-contenu').addEventListener('click', () => {
      ouvrirFormulaireCreationContenu();
    });
    document.getElementById('btn-annuler-contenu').addEventListener('click', () => {
      document.getElementById('vue-formulaire-contenu').hidden = true;
      vueTableauDeBord.hidden = false;
    });
    document.getElementById('form-contenu').addEventListener('submit', soumettreFormulaireContenu);
    contenuTabsInitialises = true;
  }
  afficherVueSectionContenu();
}

function afficherVueSectionContenu() {
  const estTextes = sectionContenuActive === 'textes';
  document.getElementById('contenu-liste-wrapper').hidden = estTextes;
  document.getElementById('contenu-textes-wrapper').hidden = !estTextes;
  if (estTextes) {
    chargerTextesAdmin();
  } else {
    chargerListeContenu(sectionContenuActive);
  }
}

// ---------- Liste (sections structurées) ----------
async function chargerListeContenu(section) {
  const conteneur = document.getElementById('liste-contenu');
  conteneur.innerHTML = '<p class="admin-hint">Chargement…</p>';

  const { data, error } = await supabaseClient
    .from('contenu_items')
    .select('*')
    .eq('section', section)
    .order('ordre', { ascending: true });

  if (error) {
    conteneur.innerHTML = '<p class="admin-erreur">Impossible de charger ce contenu.</p>';
    return;
  }
  if (!data.length) {
    conteneur.innerHTML = '<p class="admin-hint">Rien pour l\'instant. Cliquez "+ Ajouter" pour commencer.</p>';
    return;
  }

  const config = SECTIONS_CONFIG[section];
  conteneur.innerHTML = '';
  data.forEach((item) => {
    const carte = document.createElement('div');
    carte.className = 'admin-liste-item';
    const groupeTexte = config.avecGroupe && item.groupe ? `${escapeHtml(item.groupe)} · ` : '';
    carte.innerHTML = `
      <div class="admin-liste-info">
        <strong>${escapeHtml(config.resume(item.champs || {}))}</strong>
        <span class="admin-liste-meta">${groupeTexte}Ordre ${item.ordre} · ${item.publie ? 'Visible' : 'Masqué'}</span>
      </div>
      <div class="admin-liste-actions">
        <button class="btn btn-outline-dark btn-sm" data-action="editer" data-id="${item.id}">Modifier</button>
        <button class="btn btn-danger btn-sm" data-action="supprimer" data-id="${item.id}">Supprimer</button>
      </div>
    `;
    conteneur.appendChild(carte);
  });
}

document.getElementById('liste-contenu').addEventListener('click', async (e) => {
  const bouton = e.target.closest('button[data-action]');
  if (!bouton) return;
  const id = bouton.dataset.id;

  if (bouton.dataset.action === 'editer') {
    ouvrirFormulaireEditionContenu(id);
  } else if (bouton.dataset.action === 'supprimer') {
    if (confirm('Supprimer définitivement cet élément ?')) {
      await supabaseClient.from('contenu_items').delete().eq('id', id);
      chargerListeContenu(sectionContenuActive);
    }
  }
});

// ---------- Formulaire (création / édition) ----------
let valeursActuellesFormulaire = {};
const BUCKET_CONTENU_IMAGES = 'contenu-images';
const BUCKET_DOCUMENTS = 'documents';

function construireChampsFormulaire(config, valeurs) {
  valeursActuellesFormulaire = valeurs;
  const conteneur = document.getElementById('contenu-form-champs');
  let html = '';

  if (config.avecGroupe) {
    html += `
      <label for="contenu-champ-groupe">Groupe / catégorie</label>
      <input type="text" id="contenu-champ-groupe" placeholder="${config.groupePlaceholder || ''}" value="${escapeAttr(valeurs.__groupe || '')}">
    `;
  }

  config.champs.forEach((champ) => {
    const idChamp = `contenu-champ-${champ.cle}`;

    if (champ.type === 'image') {
      const urlActuelle = valeurs[champ.cleUrl] || '';
      html += `
        <label for="${idChamp}">${champ.label}</label>
        <input type="file" id="${idChamp}" accept="image/*">
        ${urlActuelle ? `<img src="${escapeAttr(urlActuelle)}" alt="" class="admin-image-apercu">` : ''}
      `;
      return;
    }
    if (champ.type === 'pdf') {
      const urlActuelle = valeurs[champ.cleUrl] || '';
      html += `
        <label for="${idChamp}">${champ.label}</label>
        <input type="file" id="${idChamp}" accept="application/pdf">
        ${urlActuelle ? `<p class="admin-hint">Fichier actuel : <a href="${escapeAttr(urlActuelle)}" target="_blank" rel="noopener">le consulter</a> (laissez le champ vide pour le garder)</p>` : ''}
      `;
      return;
    }

    const val = valeurs[champ.cle] != null ? valeurs[champ.cle] : '';
    if (champ.type === 'textarea') {
      html += `
        <label for="${idChamp}">${champ.label}</label>
        <textarea id="${idChamp}" rows="4" ${champ.requis ? 'required' : ''}>${escapeHtml(val)}</textarea>
      `;
    } else if (champ.type === 'checkbox') {
      html += `
        <label class="admin-checkbox">
          <input type="checkbox" id="${idChamp}" ${val ? 'checked' : ''}>
          ${champ.label}
        </label>
      `;
    } else {
      html += `
        <label for="${idChamp}">${champ.label}</label>
        <input type="${champ.type}" id="${idChamp}" ${champ.placeholder ? `placeholder="${escapeAttr(champ.placeholder)}"` : ''} ${champ.requis ? 'required' : ''} value="${escapeAttr(val)}">
      `;
    }
  });

  conteneur.innerHTML = html;
}

function escapeAttr(val) {
  return escapeHtml(String(val)).replace(/"/g, '&quot;');
}

function ouvrirFormulaireCreationContenu() {
  const config = SECTIONS_CONFIG[sectionContenuActive];
  document.getElementById('titre-formulaire-contenu').textContent = `Ajouter ${config.label}`;
  document.getElementById('contenu-id').value = '';
  document.getElementById('contenu-ordre').value = 1;
  document.getElementById('contenu-publie').checked = true;
  construireChampsFormulaire(config, {});
  cacherErreur(document.getElementById('erreur-contenu'));
  vueTableauDeBord.hidden = true;
  document.getElementById('vue-formulaire-contenu').hidden = false;
}

async function ouvrirFormulaireEditionContenu(id) {
  const { data, error } = await supabaseClient.from('contenu_items').select('*').eq('id', id).single();
  if (error) return;

  const config = SECTIONS_CONFIG[data.section];
  document.getElementById('titre-formulaire-contenu').textContent = `Modifier ${config.label}`;
  document.getElementById('contenu-id').value = data.id;
  document.getElementById('contenu-ordre').value = data.ordre;
  document.getElementById('contenu-publie').checked = data.publie;
  construireChampsFormulaire(config, { ...data.champs, __groupe: data.groupe });
  cacherErreur(document.getElementById('erreur-contenu'));
  vueTableauDeBord.hidden = true;
  document.getElementById('vue-formulaire-contenu').hidden = false;
}

async function soumettreFormulaireContenu(e) {
  e.preventDefault();
  const erreurEl = document.getElementById('erreur-contenu');
  cacherErreur(erreurEl);

  const config = SECTIONS_CONFIG[sectionContenuActive];
  const id = document.getElementById('contenu-id').value;
  const champs = {};

  for (const champ of config.champs) {
    const el = document.getElementById(`contenu-champ-${champ.cle}`);

    if (champ.type === 'image' || champ.type === 'pdf') {
      const fichier = el.files[0];
      if (fichier) {
        const bucket = champ.type === 'image' ? BUCKET_CONTENU_IMAGES : BUCKET_DOCUMENTS;
        const fichierAEnvoyer = champ.type === 'image' ? await compresserImage(fichier) : fichier;
        const nomFichier = `${Date.now()}-${fichierAEnvoyer.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const { error: erreurUpload } = await supabaseClient.storage.from(bucket).upload(nomFichier, fichierAEnvoyer);
        if (erreurUpload) {
          afficherErreur(erreurEl, `Échec de l'envoi du fichier pour "${champ.label}". Réessayez.`);
          return;
        }
        const { data: urlPublique } = supabaseClient.storage.from(bucket).getPublicUrl(nomFichier);
        champs[champ.cleUrl] = urlPublique.publicUrl;
      } else {
        champs[champ.cleUrl] = valeursActuellesFormulaire[champ.cleUrl] || '';
      }
      continue;
    }

    champs[champ.cle] = champ.type === 'checkbox' ? el.checked : el.value.trim();
  }

  const enregistrement = {
    section: sectionContenuActive,
    champs,
    ordre: parseInt(document.getElementById('contenu-ordre').value, 10) || 1,
    publie: document.getElementById('contenu-publie').checked,
  };
  if (config.avecGroupe) {
    enregistrement.groupe = document.getElementById('contenu-champ-groupe').value.trim();
  }

  const requete = id
    ? supabaseClient.from('contenu_items').update(enregistrement).eq('id', id)
    : supabaseClient.from('contenu_items').insert(enregistrement);

  const { error } = await requete;
  if (error) {
    afficherErreur(erreurEl, "Impossible d'enregistrer. Réessayez.");
    return;
  }

  document.getElementById('vue-formulaire-contenu').hidden = true;
  vueTableauDeBord.hidden = false;
  chargerListeContenu(sectionContenuActive);
}

// ---------- Grands textes ----------
async function chargerTextesAdmin() {
  const conteneur = document.getElementById('contenu-textes-wrapper');
  conteneur.innerHTML = '<p class="admin-hint">Chargement…</p>';

  const { data, error } = await supabaseClient.from('contenu_textes').select('cle, valeur');
  if (error) {
    conteneur.innerHTML = '<p class="admin-erreur">Impossible de charger les textes.</p>';
    return;
  }
  const valeurs = Object.fromEntries((data || []).map((t) => [t.cle, t.valeur]));

  conteneur.innerHTML = TEXTES_CONFIG.map((champ) => `
    <div class="admin-card admin-texte-item">
      <label for="texte-${champ.cle}">${champ.label}</label>
      <textarea id="texte-${champ.cle}" rows="3">${escapeHtml(valeurs[champ.cle] || '')}</textarea>
      <div class="admin-form-actions">
        <button type="button" class="btn btn-blue btn-sm" data-cle="${champ.cle}">Enregistrer</button>
        <span class="admin-texte-statut" id="statut-${champ.cle}"></span>
      </div>
    </div>
  `).join('');

  conteneur.querySelectorAll('button[data-cle]').forEach((bouton) => {
    bouton.addEventListener('click', async () => {
      const cle = bouton.dataset.cle;
      const valeur = document.getElementById(`texte-${cle}`).value;
      const statut = document.getElementById(`statut-${cle}`);
      const { error } = await supabaseClient.from('contenu_textes').upsert({ cle, valeur });
      statut.textContent = error ? 'Échec de l\'enregistrement' : '✓ Enregistré';
      statut.style.color = error ? '#c0392b' : '#1e7e42';
      setTimeout(() => { statut.textContent = ''; }, 3000);
    });
  });
}
