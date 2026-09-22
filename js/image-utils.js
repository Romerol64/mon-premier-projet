// ============================================================
// Compresse une image côté navigateur avant envoi vers Supabase.
// Objectif : des photos de smartphone (3-8 Mo) tiennent largement
// plus nombreuses dans l'espace de stockage gratuit, sans perte
// visible à l'écran, et sans action supplémentaire pour l'admin.
// ============================================================

// Rend transparent tout fond uni sombre collé aux bords d'une image
// (ex : logo "version fond noir" fourni par un partenaire). On part des
// quatre bords et on ne dépasse jamais dans une zone de couleur claire :
// seuls les pixels sombres reliés au bord deviennent transparents, ce qui
// laisse intact tout élément sombre au centre du logo (texte, contours...).
function supprimerFondSombreCanvas(ctx, largeur, hauteur, seuil = 30) {
  const image = ctx.getImageData(0, 0, largeur, hauteur);
  const pixels = image.data;
  const visites = new Uint8Array(largeur * hauteur);
  const pile = [];

  const estSombre = (i) => {
    const r = pixels[i * 4], v = pixels[i * 4 + 1], b = pixels[i * 4 + 2];
    return Math.max(r, v, b) < seuil;
  };

  for (let x = 0; x < largeur; x++) {
    pile.push(x, x + (hauteur - 1) * largeur);
  }
  for (let y = 0; y < hauteur; y++) {
    pile.push(y * largeur, y * largeur + (largeur - 1));
  }

  while (pile.length) {
    const i = pile.pop();
    if (i < 0 || i >= largeur * hauteur || visites[i] || !estSombre(i)) continue;
    visites[i] = 1;
    pixels[i * 4 + 3] = 0;

    const x = i % largeur;
    const y = Math.floor(i / largeur);
    if (x > 0) pile.push(i - 1);
    if (x < largeur - 1) pile.push(i + 1);
    if (y > 0) pile.push(i - largeur);
    if (y < hauteur - 1) pile.push(i + largeur);
  }

  ctx.putImageData(image, 0, 0);
}

function compresserImage(fichier, largeurMax = 1920, qualite = 0.82, supprimerFondNoir = false) {
  return new Promise((resolve, reject) => {
    if (!fichier.type.startsWith('image/') || fichier.type === 'image/gif') {
      resolve(fichier);
      return;
    }

    const image = new Image();
    const lecteur = new FileReader();

    lecteur.onload = () => { image.src = lecteur.result; };
    lecteur.onerror = () => reject(new Error('Lecture du fichier impossible'));

    image.onload = () => {
      let { width, height } = image;
      if (width > largeurMax) {
        height = Math.round((height * largeurMax) / width);
        width = largeurMax;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);

      if (supprimerFondNoir) {
        supprimerFondSombreCanvas(ctx, width, height);
      }

      // Le PNG (et le WebP) peuvent avoir un fond transparent : le JPEG ne
      // supporte pas la transparence et la remplace par du noir. On ne
      // convertit donc en JPEG que les photos qui n'ont pas de transparence
      // à préserver (déjà JPEG et sans fond à retirer) ; on garde le PNG sinon.
      const garderTransparence = supprimerFondNoir || fichier.type === 'image/png' || fichier.type === 'image/webp';
      const formatSortie = garderTransparence ? 'image/png' : 'image/jpeg';
      const extension = garderTransparence ? '.png' : '.jpg';

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(fichier); return; }
          const nomCompresse = fichier.name.replace(/\.[^.]+$/, '') + extension;
          resolve(new File([blob], nomCompresse, { type: formatSortie }));
        },
        formatSortie,
        garderTransparence ? undefined : qualite
      );
    };
    image.onerror = () => reject(new Error('Image illisible'));

    lecteur.readAsDataURL(fichier);
  });
}
